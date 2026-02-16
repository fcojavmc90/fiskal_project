"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { uploadData } from '@aws-amplify/storage';
import { createSurveyResponse } from '../../lib/graphqlClient';
import { isAuthBypassed } from '../../lib/authBypass';

type AnswerMap = Record<string, string>;

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [files, setFiles] = useState<File[]>([]);
  const [sub, setSub] = useState<string>('');
  const [identityId, setIdentityId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const questions = useMemo(() => ([
    { id: 'q1', label: '¿Cuál es el número de la carta o aviso? (Ej: CP2000, CP14, Letter 3219, LTR 504)', type: 'text' },
    { id: 'q2', label: '¿Qué agencia envía la notificación?', type: 'select', options: ['IRS', 'Estado (especificar)', 'No estoy seguro'] },
    { id: 'q3', label: '¿Cuál es la Fecha del Aviso?', type: 'date' },
    { id: 'q4', label: '¿Cuál es la Fecha Límite de Respuesta?', type: 'date' },
    { id: 'q5', label: '¿A qué año fiscal (Tax Year) se refiere la notificación?', type: 'number' },
    { id: 'q6', label: '¿El aviso indica una deficiencia, error de cálculo o solicitud de información?', type: 'select', options: ['Deficiencia (impuestos no pagados)', 'Error de cálculo', 'Solicitud de información', 'No estoy seguro'] },
    { id: 'q7', label: '¿El monto total reclamado coincide con sus registros?', type: 'select', options: ['Coincide', 'No coincide', 'No estoy seguro'] },
    { id: 'q8', label: '¿La carta menciona ingresos no reportados por terceros (W-2, 1099)?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q9', label: '¿Se le está negando un crédito o deducción específica?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q10', label: '¿Es la primera notificación o es una carta de seguimiento?', type: 'select', options: ['Primera', 'Seguimiento', 'No estoy seguro'] },
    { id: 'q11', label: '¿Contiene la carta un "Notice of Deficiency" con 90 días para ir a la Corte?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q12', label: '¿Presentó usted la declaración o el IRS hizo una Declaración Sustituta (SFR)?', type: 'select', options: ['La presenté', 'SFR', 'No estoy seguro'] },
    { id: 'q13', label: '¿Tiene documentación de respaldo para refutar los cambios propuestos?', type: 'select', options: ['Sí', 'No', 'Parcial'] },
    { id: 'q14', label: '¿Ha tenido problemas similares en los últimos 3 años fiscales?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q15', label: '¿Su estado civil y dirección actual coinciden con lo que el IRS tiene en sus archivos?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q16', label: '¿Está de acuerdo con el monto total que la agencia dice que debe?', type: 'select', options: ['Acuerdo total', 'Parcial', 'Desacuerdo'] },
    { id: 'q17', label: 'Si debe el dinero, ¿puede pagar el monto total de inmediato?', type: 'select', options: ['Sí', 'No', 'Parcial'] },
    { id: 'q18', label: '¿Está atravesando una dificultad económica comprobable (Hardship)?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q19', label: '¿Tiene otras deudas tributarias pendientes de años anteriores?', type: 'select', options: ['Sí', 'No', 'No estoy seguro'] },
    { id: 'q20', label: '¿Desea que un profesional lo represente legalmente mediante Power of Attorney (Forma 2848)?', type: 'select', options: ['Sí', 'No'] },
  ]), []);

  useEffect(() => {
    const guard = async () => {
      try {
        if (isAuthBypassed()) {
          setSub('demo-user');
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const role = attr['custom:role'];
        if (role === 'PRO') {
          router.replace('/expert-dashboard');
          return;
        }
        setSub(attr.sub ?? user.userId ?? '');
        const session = await fetchAuthSession();
        setIdentityId(session.identityId ?? '');
      } catch {
        router.replace('/');
      }
    };
    guard();
  }, [router]);

  const totalSteps = questions.length + 1;
  const currentQuestion = questions[step];

  const next = async () => {
    if (step < questions.length) {
      const q = questions[step];
      const answer = (answers[q.id] ?? '').trim();
      if (!answer) {
        return;
      }
      setStep(step + 1);
      return;
    }
    if (!sub) return;
    setLoading(true);
    try {
      if (isAuthBypassed()) {
        const payload = { answers, files: [], submittedAt: new Date().toISOString() };
        localStorage.setItem('fiskal_survey_completed', 'true');
        localStorage.setItem('fiskal_survey_data', JSON.stringify(payload));
        document.cookie = 'fk_has_survey=1; path=/';
        router.push('/professionals/recommended');
        return;
      }
      const uploadedKeys: { key: string; name: string; type: string; identityId?: string }[] = [];
      const ownerIdentityId = identityId || (await fetchAuthSession()).identityId || '';
      for (const file of files) {
        const keyRoot = ownerIdentityId || sub || 'unknown';
        const key = `survey/${keyRoot}/${Date.now()}-${file.name}`;
        try {
          const result = await uploadData({
            key,
            data: file,
            options: { contentType: file.type, accessLevel: 'protected' }
          }).result;
          uploadedKeys.push({
            key: result.key,
            name: file.name,
            type: file.type,
            identityId: ownerIdentityId || undefined,
          });
        } catch (err: any) {
          throw new Error(`Fallo subiendo archivo "${file.name}": ${formatError(err)}`);
        }
      }
      const payload = { answers, files: uploadedKeys, submittedAt: new Date().toISOString() };
      try {
        const res: any = await createSurveyResponse({ owner: sub, answersJson: JSON.stringify(payload) });
        const created = res?.data?.createSurveyResponse;
        if (created?.id) {
          localStorage.setItem('fiskal_survey_last_id', created.id);
          if (created?.createdAt) {
            localStorage.setItem('fiskal_survey_last_created_at', created.createdAt);
          }
        }
      } catch (err: any) {
        throw new Error(`Fallo guardando en DynamoDB: ${formatError(err)}`);
      }
      localStorage.setItem('fiskal_survey_completed', 'true');
      localStorage.setItem('fiskal_survey_data', JSON.stringify(payload));
      document.cookie = 'fk_has_survey=1; path=/';
      router.push('/professionals/recommended');
    } catch (err: any) {
      console.error('Survey submit error', err);
      alert('Error guardando la encuesta: ' + formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const prev = () => setStep(Math.max(0, step - 1));

  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? '').trim() : '';
  const canContinue = step >= questions.length || currentAnswer.length > 0;
  const showAnswerAlert = step < questions.length && !canContinue;

  const onFileChange = (incoming: FileList | null) => {
    if (!incoming) return;
    const nextFiles = Array.from(incoming).filter(f => ['image/jpeg', 'application/pdf'].includes(f.type));
    const merged = [...files, ...nextFiles].slice(0, 3);
    setFiles(merged);
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '50px', color: 'white' }}>
      <div style={{ maxWidth: '700px', margin: 'auto', background: '#003a57', padding: '30px', borderRadius: '15px', border: '1px solid #00e5ff' }}>
        <h2>Diagnóstico Fiscal</h2>
        <p>Paso {step + 1} de {totalSteps}</p>
        {step < questions.length && currentQuestion && (
          <>
            <label style={{ display: 'block', marginTop: '16px' }}>{currentQuestion.label}</label>
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                placeholder="Escribe tu respuesta"
                style={inputStyle}
                value={answers[currentQuestion.id] ?? ''}
                onChange={e => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              />
            )}
            {currentQuestion.type === 'date' && (
              <input
                type="date"
                style={inputStyle}
                value={answers[currentQuestion.id] ?? ''}
                onChange={e => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              />
            )}
            {currentQuestion.type === 'number' && (
              <input
                type="number"
                inputMode="numeric"
                step={1}
                placeholder="Ej: 2023"
                style={inputStyle}
                value={answers[currentQuestion.id] ?? ''}
                onChange={e => setAnswers({ ...answers, [currentQuestion.id]: e.target.value.replace(/[^0-9]/g, '') })}
              />
            )}
            {currentQuestion.type === 'select' && (
              <select
                style={inputStyle}
                value={answers[currentQuestion.id] ?? ''}
                onChange={e => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              >
                <option value="">Selecciona</option>
                {currentQuestion.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {showAnswerAlert && (
              <div style={{ marginTop: '10px', background: '#8b1e1e', padding: '8px 10px', borderRadius: '8px' }}>
                Debes responder esta pregunta para continuar.
              </div>
            )}
          </>
        )}
        {step === questions.length && (
          <>
            <p>Adjunta hasta 3 archivos (JPG o PDF)</p>
            <input type="file" accept=".jpg,.jpeg,.pdf" multiple onChange={e => onFileChange(e.target.files)} />
            <ul>
              {files.map((f, idx) => (
                <li key={`${f.name}-${idx}`}>{f.name}</li>
              ))}
            </ul>
          </>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={prev} disabled={step === 0 || loading} style={secondaryBtn}>Atrás</button>
          <button onClick={next} disabled={loading || !canContinue} style={primaryBtn}>
            {step === questions.length ? (loading ? 'Guardando...' : 'Finalizar') : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', background: '#001a2c', border: '1px solid #00e5ff', color: 'white', marginTop: '12px' } as const;
const primaryBtn = { background: '#00e5ff', color: '#001a2c', padding: '15px', width: '100%', fontWeight: 'bold', borderRadius: '5px', border: 'none', cursor: 'pointer' } as const;
const secondaryBtn = { background: '#002a3f', color: 'white', padding: '15px', width: '100%', fontWeight: 'bold', borderRadius: '5px', border: '1px solid #00e5ff', cursor: 'pointer' } as const;

function formatError(err: any) {
  if (!err) return 'sin detalles';
  if (typeof err === 'string') return err;
  if (err?.message) return err.message;
  if (err?.name) return err.name;
  try {
    return JSON.stringify(err);
  } catch {
    return 'sin detalles';
  }
}
