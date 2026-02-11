"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { listAgendaByProfessional, listAppointmentsByClient, listCasesByClientOwner, listProfessionalProfiles, listSurveyResponsesByOwner, updateAppointment, updateProfessionalAgenda, updateProfessionalProfile, updateSurveyResponse } from '../../lib/graphqlClient';
import { AppointmentStatus, ProfessionalAgendaStatus } from '../../API';
import { useRouter } from 'next/navigation';
import { isAuthBypassed } from '../../lib/authBypass';
import { ensureAmplifyConfigured } from '../../lib/amplifyClient';
import Link from 'next/link';

export default function ClientDashboard() {
  ensureAmplifyConfigured();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string>('');
  const [surveyInfo, setSurveyInfo] = useState<any>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyError, setSurveyError] = useState('');

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a: any, b: any) => (a.requestedStart || '').localeCompare(b.requestedStart || ''));
  }, [appointments]);

  useEffect(() => {
    const load = async () => {
      try {
        if (isAuthBypassed()) {
          setLoading(false);
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const sub = attr.sub ?? user.userId ?? '';
        try {
          const items = await listAppointmentsByClient(sub);
          const active = items.filter((a: any) => a.status !== AppointmentStatus.CANCELLED);
          setAppointments(active);
          const caseItems = await listCasesByClientOwner(sub);
          setCases(caseItems);
          await backfillSurveyAssignments(sub, active);
        } catch (err) {
          console.warn('Dashboard data load failed:', err);
        }
      } catch {
        document.cookie = "fk_role=; Max-Age=0; path=/";
        document.cookie = "fk_has_survey=; Max-Age=0; path=/";
        document.cookie = "fk_paid_initial=; Max-Age=0; path=/";
        setAuthError('Sesión no disponible. Inicia sesión nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const backfillSurveyAssignments = async (owner: string, appts: any[]) => {
    try {
      if (!owner || !appts.length) return;
      const surveys = await listSurveyResponsesByOwner(owner);
      if (!surveys.length) return;
      const sortedSurveys = [...surveys].sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      const pending = appts
        .filter(a => a?.proOwner)
        .sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || ''));

      for (const appt of pending) {
        const apptCreatedAt = appt.createdAt || '';
        const candidate = [...sortedSurveys]
          .filter((s: any) => !s?.proOwner && (s.createdAt || '') <= apptCreatedAt)
          .pop();
        if (!candidate?.id) continue;
        await updateSurveyResponse({
          id: candidate.id,
          proOwner: appt.proOwner,
          professionalId: appt.professionalId ?? null,
        });
        candidate.proOwner = appt.proOwner;
      }
    } catch (err) {
      console.warn('Survey backfill failed:', err);
    }
  };

  const verifySurvey = async () => {
    setSurveyError('');
    setSurveyLoading(true);
    try {
      if (isAuthBypassed()) {
        const cached = localStorage.getItem('fiskal_survey_data');
        const payload = cached ? JSON.parse(cached) : null;
        setSurveyInfo({
          count: payload ? 1 : 0,
          latest: payload ? { createdAt: payload?.submittedAt || '', proOwner: null, id: null } : null,
        });
        return;
      }
      const user = await getCurrentUser();
      const attr = await fetchUserAttributes();
      const sub = attr.sub ?? user.userId ?? '';
      if (!sub) {
        setSurveyError('No se pudo identificar al cliente.');
        return;
      }
      const surveys = await listSurveyResponsesByOwner(sub);
      const sorted = [...surveys].sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      const latest = sorted.pop() ?? null;
      setSurveyInfo({
        count: surveys.length,
        latest: latest
          ? { id: latest.id, createdAt: latest.createdAt, proOwner: latest.proOwner || null }
          : null,
      });
    } catch (err: any) {
      setSurveyError(err?.message || 'No se pudo verificar la encuesta.');
    } finally {
      setSurveyLoading(false);
    }
  };

  const submitRating = async (professionalId: string) => {
    const pros = await listProfessionalProfiles();
    const pro = pros.find((p: any) => p.id === professionalId);
    if (!pro) return;
    const currentAvg = pro.ratingAvg ?? 0;
    const currentCount = pro.ratingCount ?? 0;
    const newCount = currentCount + 1;
    const newAvg = ((currentAvg * currentCount) + rating) / newCount;
    await updateProfessionalProfile({ id: pro.id, ratingAvg: newAvg, ratingCount: newCount });
    alert('Gracias por tu calificación.');
  };

  const acceptReschedule = async (appt: any) => {
    await updateAppointment({ id: appt.id, status: AppointmentStatus.ACCEPTED });
    const slotId = (appt.notes || '').split('slotId:')[1]?.trim();
    if (slotId && appt.proOwner) {
      const slots = await listAgendaByProfessional(appt.proOwner);
      const related = slots.find((s: any) => s.id === slotId);
      if (related) {
        await updateProfessionalAgenda({ id: related.id, status: ProfessionalAgendaStatus.ACCEPTED });
      }
    }
    alert('Cambio aceptado.');
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <h1 style={{ color: '#00e5ff' }}>Dashboard Cliente</h1>
      {loading && <p>Cargando...</p>}
      {!loading && authError && (
        <div style={{ marginTop: '12px', background: '#8b1e1e', padding: '10px 12px', borderRadius: '8px' }}>
          <p>{authError}</p>
          <button
            onClick={() => router.push('/')}
            style={{ marginTop: '8px', background: '#00e5ff', border: 'none', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}
          >
            Ir a login
          </button>
        </div>
      )}
      {!loading && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => router.push('/survey')}
            style={{ background: '#00ff88', border: 'none', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' }}
          >
            Nueva solicitud
          </button>
          <button
            onClick={verifySurvey}
            style={{ marginLeft: '10px', background: '#00e5ff', border: 'none', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' }}
          >
            Verificar encuesta
          </button>
        </div>
      )}
      {!loading && (
        <div style={{ marginTop: '20px', background: '#003a57', padding: '16px', borderRadius: '10px', border: '1px solid #00e5ff' }}>
          <h3 style={{ marginTop: 0 }}>Calendario</h3>
          {sortedAppointments.length === 0 && <p>No hay citas en el calendario.</p>}
          {sortedAppointments.length > 0 && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {sortedAppointments.map(appt => (
                <div key={appt.id} style={{ background: '#001a2c', padding: '12px', borderRadius: '8px', border: '1px solid #00e5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div><strong>{appt.requestedStart}</strong></div>
                    <div style={{ color: '#9adfff' }}>Estado: {appt.status}</div>
                  </div>
                  {appt.status === AppointmentStatus.ACCEPTED ? (
                    <Link href={`/call?appt=${appt.id}&role=client`} style={{ background: '#00ff88', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', color: '#001a2c', textDecoration: 'none' }}>
                      Entrar a llamada
                    </Link>
                  ) : (
                    <span style={{ color: '#7fbfdd' }}>Disponible al aceptar</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!loading && (surveyLoading || surveyInfo || surveyError) && (
        <div style={{ marginTop: '12px', background: '#003a57', padding: '12px', borderRadius: '10px', border: '1px solid #00e5ff' }}>
          {surveyLoading && <p>Verificando encuesta...</p>}
          {!surveyLoading && surveyError && <p style={{ color: '#ffb4b4' }}>{surveyError}</p>}
          {!surveyLoading && surveyInfo && (
            <>
              <p><strong>Encuestas encontradas:</strong> {surveyInfo.count}</p>
              {surveyInfo.latest ? (
                <>
                  <p><strong>Última encuesta:</strong> {surveyInfo.latest.createdAt || 'sin fecha'}</p>
                  <p><strong>Asignada a profesional:</strong> {surveyInfo.latest.proOwner || 'no'}</p>
                  <p><strong>ID:</strong> {surveyInfo.latest.id || 'sin id'}</p>
                </>
              ) : (
                <p>No hay encuestas guardadas.</p>
              )}
            </>
          )}
        </div>
      )}
      {!loading && appointments.length === 0 && <p>Aún no tienes citas.</p>}
      <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
        {appointments.map(appt => (
          <div key={appt.id} style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff' }}>
            <p><strong>Estado:</strong> {appt.status}</p>
            <p><strong>Inicio:</strong> {appt.requestedStart}</p>
            <p><strong>Profesional:</strong> {appt.professionalId}</p>
            {appt.status === 'RESCHEDULE_PROPOSED' && (
              <div style={{ marginTop: '10px' }}>
                <p>Nuevo horario propuesto: {appt.proposedStart}</p>
                <button onClick={() => acceptReschedule(appt)} style={{ background: '#00ff88', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Aceptar cambio</button>
              </div>
            )}
            {appt.status === 'COMPLETED' && (
              <div style={{ marginTop: '10px' }}>
                <label>Califica al profesional (1-5)</label>
                <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginLeft: '10px' }}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button onClick={() => submitRating(appt.professionalId)} style={{ marginLeft: '10px', background: '#00ff88', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {cases.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Casos</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {cases.map(c => (
              <div key={c.id} style={{ background: '#003a57', padding: '14px', borderRadius: '10px', border: '1px solid #00e5ff' }}>
                <p><strong>Caso:</strong> {c.caseNumber}</p>
                <p><strong>Estado:</strong> {c.status}</p>
                <p><strong>Precio:</strong> {c.servicePriceCents ? `$${(c.servicePriceCents / 100).toFixed(2)}` : 'Por definir'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
