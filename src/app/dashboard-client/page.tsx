"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { createMessage, getUserProfileByOwner, listAgendaByProfessional, listAppointmentsByClient, listCasesByClientOwner, listMessagesByCase, listPaymentsByClientOwner, listProfessionalProfiles, listSurveyResponsesByOwner, updateAppointment, updateProfessionalAgenda, updateProfessionalProfile, updateSurveyResponse } from '../../lib/graphqlClient';
import { AppointmentStatus, PaymentStatus, PaymentType, ProfessionalAgendaStatus } from '../../API';
import { useRouter } from 'next/navigation';
import { isAuthBypassed } from '../../lib/authBypass';
import { ensureAmplifyConfigured } from '../../lib/amplifyClient';
import ChimeCall from '../../components/ChimeCall';
import Sidebar from '../../components/Sidebar';

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
  const [callModalAppt, setCallModalAppt] = useState<any | null>(null);
  const [callFullscreen, setCallFullscreen] = useState(false);
  const callModalRef = useRef<HTMLDivElement | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [messagesByCase, setMessagesByCase] = useState<Record<string, any[]>>({});
  const [messagesLoading, setMessagesLoading] = useState<Record<string, boolean>>({});
  const [messageDraftByCase, setMessageDraftByCase] = useState<Record<string, string>>({});
  const [chatOpenByCase, setChatOpenByCase] = useState<Record<string, boolean>>({});
  const [clientDisplayName, setClientDisplayName] = useState('Cliente');
  const [proNamesByOwner, setProNamesByOwner] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!callModalAppt) return;
    const handler = () => {
      const isFs = document.fullscreenElement === callModalRef.current;
      setCallFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      setCallFullscreen(false);
    };
  }, [callModalAppt]);

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
        const profile = await getUserProfileByOwner(sub);
        const first = profile?.firstName ?? '';
        const last = profile?.lastName ?? '';
        const rawName = (first || last) ? `${first} ${last}`.trim() : (profile?.email ?? attr.email ?? 'Cliente');
        setClientDisplayName(rawName);
        try {
          const items = await listAppointmentsByClient(sub);
          const active = items.filter((a: any) => a.status !== AppointmentStatus.CANCELLED);
          setAppointments(active);
          const caseItems = await listCasesByClientOwner(sub);
          setCases(caseItems);
          const pros = await listProfessionalProfiles();
          const map: Record<string, string> = {};
          for (const p of pros) {
            if (p?.owner) map[p.owner] = p.displayName || p.owner;
          }
          setProNamesByOwner(map);
          setPaymentsLoading(true);
          const paymentItems = await listPaymentsByClientOwner(sub);
          setPayments(paymentItems || []);
          setPaymentsLoading(false);
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

  const loadMessagesForCase = async (caseId: string) => {
    if (!caseId || messagesLoading[caseId]) return;
    setMessagesLoading(prev => ({ ...prev, [caseId]: true }));
    try {
      const items = await listMessagesByCase(caseId);
      setMessagesByCase(prev => ({ ...prev, [caseId]: items }));
    } finally {
      setMessagesLoading(prev => ({ ...prev, [caseId]: false }));
    }
  };

  const sendMessageForCase = async (caseItem: any) => {
    const caseId = caseItem?.id;
    if (!caseId) return;
    const body = (messageDraftByCase[caseId] || '').trim();
    if (!body) return;
    await createMessage({
      caseId,
      clientOwner: caseItem.clientOwner,
      proOwner: caseItem.proOwner,
      senderRole: 'CLIENT',
      body,
    });
    setMessageDraftByCase(prev => ({ ...prev, [caseId]: '' }));
    await loadMessagesForCase(caseId);
  };

  const shortName = (full?: string) => {
    const raw = (full || '').trim();
    if (!raw) return 'Cliente';
    const parts = raw.split(/\s+/).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const buildTimeline = (caseItem: any, appt: any, casePayments: any[]) => {
    const events: Array<{ label: string; date?: string }> = [];
    if (caseItem?.createdAt) events.push({ label: 'Caso creado', date: caseItem.createdAt });
    if (appt?.requestedStart) events.push({ label: 'Solicitud de cita', date: appt.requestedStart });
    if (appt?.status === AppointmentStatus.ACCEPTED) events.push({ label: 'Cita aceptada', date: appt?.requestedStart });
    if (appt?.meetingId || appt?.meetingData) events.push({ label: 'Videollamada habilitada' });
    for (const p of casePayments) {
      const label = p.type === PaymentType.SERVICE_50_FIRST ? 'Pago 50% inicial' : 'Pago 50% final';
      const suffix = p.status === PaymentStatus.PAID ? ' (pagado)' : ' (pendiente)';
      events.push({ label: `${label}${suffix}` });
    }
    return events;
  };

  const openPaymentLink = async (payment: any) => {
    if (!payment?.id) {
      alert('Pago inválido.');
      return;
    }
    router.push(`/pay?payment=${encodeURIComponent(payment.id)}`);
  };

  return (
    <div style={{ display: 'flex', background: '#001a2c', minHeight: '100vh', color: 'white' }}>
      <Sidebar dashboardHref="/dashboard-client" />
      <div style={{ flex: 1, padding: '40px' }}>
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
                    <button
                      onClick={() => setCallModalAppt(appt)}
                      style={{ background: '#00ff88', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', color: '#001a2c', border: 'none', cursor: 'pointer' }}
                    >
                      Entrar a llamada
                    </button>
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
                <div style={{ marginTop: '10px' }}>
                  <strong>Línea de tiempo:</strong>
                  <div style={{ marginTop: '6px', display: 'grid', gap: '6px' }}>
                    {buildTimeline(c, appointments.find(a => a.id === c.appointmentId), payments.filter(p => p.caseId === c.id)).map((e, idx) => (
                      <div key={`${c.id}-evt-${idx}`} style={{ color: '#9adfff' }}>
                        • {e.label}{e.date ? ` — ${e.date}` : ''}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <strong>Pagos:</strong>
                  {paymentsLoading && <p>Cargando pagos...</p>}
                  {!paymentsLoading && (() => {
                    const casePayments = payments.filter(p => p.caseId === c.id);
                    if (!casePayments.length) return <p>No hay pagos solicitados aún.</p>;
                    return (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {casePayments.map(p => {
                          const label = p.type === PaymentType.SERVICE_50_FIRST ? 'Pagar 50% inicial' : 'Pagar 50% final';
                          const isPaid = p.status === PaymentStatus.PAID;
                          return (
                            <button
                              key={p.id}
                              onClick={() => openPaymentLink(p)}
                              disabled={isPaid}
                              style={{
                                background: isPaid ? '#4ade80' : '#00e5ff',
                                border: 'none',
                                padding: '6px 10px',
                                fontWeight: 'bold',
                                cursor: isPaid ? 'default' : 'pointer',
                                color: '#001a2c',
                              }}
                            >
                              {isPaid ? `${label} (pagado)` : label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => {
                      setChatOpenByCase(prev => ({ ...prev, [c.id]: !prev[c.id] }));
                      loadMessagesForCase(c.id);
                    }}
                    style={{ background: '#7dd3fc', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Mensajes
                  </button>
                  {chatOpenByCase[c.id] && (
                    <div style={{ marginTop: '8px', background: '#001a2c', border: '1px solid #00e5ff', padding: '12px', borderRadius: '8px' }}>
                      <strong>Chat del caso</strong>
                      {messagesLoading[c.id] && <p>Cargando mensajes...</p>}
                      {!messagesLoading[c.id] && (
                        <div style={{ marginTop: '8px', display: 'grid', gap: '6px' }}>
                          {messagesByCase[c.id]?.length === 0 && <p>No hay mensajes aún.</p>}
                          {(messagesByCase[c.id] || []).map((m: any) => (
                            <div key={m.id} style={{ background: '#003a57', padding: '8px', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.85rem', color: '#9adfff' }}>
                                {m.senderRole === 'CLIENT'
                                  ? shortName(clientDisplayName)
                                  : shortName(proNamesByOwner[c.proOwner] || 'Profesional')}
                                {m.createdAt ? ` — ${formatDateTime(m.createdAt)}` : ''}
                              </div>
                              <div>{m.body}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Escribe un mensaje"
                          value={messageDraftByCase[c.id] || ''}
                          onChange={e => setMessageDraftByCase(prev => ({ ...prev, [c.id]: e.target.value }))}
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => sendMessageForCase(c)}
                          style={{ background: '#00e5ff', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {callModalAppt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
          <div
            ref={callModalRef}
            style={{
              background: '#003a57',
              padding: callFullscreen ? '16px' : '20px',
              borderRadius: callFullscreen ? '0' : '12px',
              border: '1px solid #00e5ff',
              maxWidth: callFullscreen ? '100%' : '1000px',
              width: '100%',
              height: callFullscreen ? '100%' : 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => {
                const el = callModalRef.current;
                if (!el) return;
                if (document.fullscreenElement) {
                  document.exitFullscreen?.();
                } else {
                  el.requestFullscreen?.();
                }
              }}
              style={{ position: 'absolute', top: '10px', left: '10px', background: '#00e5ff', border: 'none', padding: '4px 8px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', color: '#001a2c' }}
            >
              Pantalla completa
            </button>
            <button
              onClick={() => setCallModalAppt(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff6b6b', border: 'none', padding: '4px 8px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}
            >
              X
            </button>
            <ChimeCall appointmentId={callModalAppt.id} role="client" embedded fullHeight={callFullscreen} onLeave={() => setCallModalAppt(null)} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
