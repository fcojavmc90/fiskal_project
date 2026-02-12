"use client";
import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { getUrl } from '@aws-amplify/storage';
import { useRouter } from 'next/navigation';
import ChimeCall from '../../components/ChimeCall';
import Sidebar from '../../components/Sidebar';
import { AppointmentStatus, CaseStatus, PaymentStatus, PaymentType, ProfessionalAgendaStatus } from '../../API';
import { createMessage, createPayment, createProfessionalAgenda, deleteProfessionalAgenda, getUserProfileByOwner, listAgendaByProfessional, listAppointmentsByPro, listCaseDocumentsByCase, listCasesByProOwner, listMessagesByCase, listPaymentsByProOwner, listSurveyResponsesByOwnerAndPro, listSurveyResponsesByProOwner, updateAppointment, updateCase, updateProfessionalAgenda } from '../../lib/graphqlClient';
import { isAuthBypassed } from '../../lib/authBypass';

const SURVEY_QUESTIONS: Array<{ id: string; label: string }> = [
  { id: 'q1', label: '¿Cuál es el número de la carta o aviso? (Ej: CP2000, CP14, Letter 3219, LTR 504)' },
  { id: 'q2', label: '¿Qué agencia envía la notificación?' },
  { id: 'q3', label: '¿Cuál es la Fecha del Aviso?' },
  { id: 'q4', label: '¿Cuál es la Fecha Límite de Respuesta?' },
  { id: 'q5', label: '¿A qué año fiscal (Tax Year) se refiere la notificación?' },
  { id: 'q6', label: '¿El aviso indica una deficiencia, error de cálculo o solicitud de información?' },
  { id: 'q7', label: '¿El monto total reclamado coincide con sus registros?' },
  { id: 'q8', label: '¿La carta menciona ingresos no reportados por terceros (W-2, 1099)?' },
  { id: 'q9', label: '¿Se le está negando un crédito o deducción específica?' },
  { id: 'q10', label: '¿Es la primera notificación o es una carta de seguimiento?' },
  { id: 'q11', label: '¿Contiene la carta un "Notice of Deficiency" con 90 días para ir a la Corte?' },
  { id: 'q12', label: '¿Presentó usted la declaración o el IRS hizo una Declaración Sustituta (SFR)?' },
  { id: 'q13', label: '¿Tiene documentación de respaldo para refutar los cambios propuestos?' },
  { id: 'q14', label: '¿Ha tenido problemas similares en los últimos 3 años fiscales?' },
  { id: 'q15', label: '¿Su estado civil y dirección actual coinciden con lo que el IRS tiene en sus archivos?' },
  { id: 'q16', label: '¿Está de acuerdo con el monto total que la agencia dice que debe?' },
  { id: 'q17', label: 'Si debe el dinero, ¿puede pagar el monto total de inmediato?' },
  { id: 'q18', label: '¿Está atravesando una dificultad económica comprobable (Hardship)?' },
  { id: 'q19', label: '¿Tiene otras deudas tributarias pendientes de años anteriores?' },
  { id: 'q20', label: '¿Desea que un profesional lo represente legalmente mediante Power of Attorney (Forma 2848)?' },
];

export default function ExpertDashboard() {
  const router = useRouter();
  const [proSub, setProSub] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [meetingLink, setMeetingLink] = useState('');
  const [proEmail, setProEmail] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [servicePriceByAppt, setServicePriceByAppt] = useState<Record<string, string>>({});
  const [docsByCase, setDocsByCase] = useState<Record<string, any[]>>({});
  const [docsLoading, setDocsLoading] = useState<Record<string, boolean>>({});
  const [surveyByClient, setSurveyByClient] = useState<Record<string, any | null>>({});
  const [surveyLoading, setSurveyLoading] = useState<Record<string, boolean>>({});
  const [surveyError, setSurveyError] = useState<Record<string, string>>({});
  const [surveyProInfo, setSurveyProInfo] = useState<{ count: number; latestId?: string; latestCreatedAt?: string } | null>(null);
  const [surveyProLoading, setSurveyProLoading] = useState(false);
  const [surveyProError, setSurveyProError] = useState('');
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [surveyModalClient, setSurveyModalClient] = useState<string | null>(null);
  const [callModalAppt, setCallModalAppt] = useState<any | null>(null);
  const [callFullscreen, setCallFullscreen] = useState(false);
  const callModalRef = useRef<HTMLDivElement | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [messagesByCase, setMessagesByCase] = useState<Record<string, any[]>>({});
  const [messagesLoading, setMessagesLoading] = useState<Record<string, boolean>>({});
  const [messageDraftByCase, setMessageDraftByCase] = useState<Record<string, string>>({});
  const [chatOpenByCase, setChatOpenByCase] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    const load = async () => {
      try {
        if (isAuthBypassed()) {
          setProSub('demo-pro');
          setProEmail('demo@fiskal.local');
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const sub = attr.sub ?? user.userId ?? '';
        setProSub(sub);
        setProEmail(attr.email ?? '');
      } catch {
        router.push('/');
      }
    };
    load();
  }, [router]);

  const refresh = async (sub: string) => {
    if (isAuthBypassed()) {
      setAppointments([]);
      setSlots([]);
      setCases([]);
      return;
    }
    const appts = await listAppointmentsByPro(sub);
    setAppointments(appts.filter((a: any) => a.status !== AppointmentStatus.CANCELLED));
    await hydrateClientNames(appts);
    const agenda = await listAgendaByProfessional(sub);
    const sortedAgenda = [...agenda].sort((a: any, b: any) => {
      const aKey = `${a.date}T${a.time}`;
      const bKey = `${b.date}T${b.time}`;
      return aKey.localeCompare(bKey);
    });
    setSlots(sortedAgenda);
    const proCases = await listCasesByProOwner(sub);
    setCases(proCases);
    const proPayments = await listPaymentsByProOwner(sub);
    setPayments(proPayments || []);
    const priceMap: Record<string, string> = {};
    for (const c of proCases) {
      if (c?.appointmentId && typeof c?.servicePriceCents === 'number') {
        priceMap[c.appointmentId] = (c.servicePriceCents / 100).toString();
      }
    }
    if (Object.keys(priceMap).length) {
      setServicePriceByAppt(prev => ({ ...prev, ...priceMap }));
    }
  };

  const hydrateClientNames = async (appts: any[]) => {
    try {
      const owners = Array.from(new Set(appts.map((a: any) => a?.clientOwner).filter(Boolean)));
      if (!owners.length) return;
      const missing = owners.filter(o => !clientNames[o]);
      if (!missing.length) return;
      const entries = await Promise.all(
        missing.map(async (owner) => {
          try {
            const profile = await getUserProfileByOwner(owner);
            const first = profile?.firstName ?? '';
            const last = profile?.lastName ?? '';
            const name = (first || last) ? `${first} ${last}`.trim() : (profile?.email ?? owner);
            return [owner, name] as const;
          } catch {
            return [owner, owner] as const;
          }
        })
      );
      setClientNames(prev => {
        const next = { ...prev };
        for (const [owner, name] of entries) next[owner] = name;
        return next;
      });
    } catch {}
  };

  useEffect(() => {
    if (!proSub) return;
    refresh(proSub);
  }, [proSub]);

  const parseStorageKey = (rawKey: string) => {
    if (!rawKey) return { key: rawKey, accessLevel: 'protected', targetIdentityId: null };
    const parts = rawKey.split('/');
    if (parts[0] === 'protected' || parts[0] === 'private' || parts[0] === 'public') {
      const accessLevel = parts[0] as 'protected' | 'private' | 'public';
      if (accessLevel === 'public') {
        return { key: parts.slice(1).join('/'), accessLevel, targetIdentityId: null };
      }
      const targetIdentityId = parts[1] || null;
      const key = parts.slice(2).join('/');
      return { key, accessLevel, targetIdentityId };
    }
    if (parts.length >= 2 && parts[0] === 'survey') {
      return { key: rawKey, accessLevel: 'protected', targetIdentityId: parts[1] || null };
    }
    return { key: rawKey, accessLevel: 'protected', targetIdentityId: null };
  };

  const loadCaseDocs = async (caseId: string) => {
    if (!caseId || docsLoading[caseId]) return;
    setDocsLoading(prev => ({ ...prev, [caseId]: true }));
    try {
      const docs = await listCaseDocumentsByCase(caseId);
      const normalized = docs.map((doc: any) => {
        if (!doc?.s3Key) return { ...doc, url: null, urlError: 'Sin archivo' };
        const parsed = parseStorageKey(doc.s3Key);
        return { ...doc, url: null, urlError: null, parsedKey: parsed };
      });
      setDocsByCase(prev => ({ ...prev, [caseId]: normalized }));
    } finally {
      setDocsLoading(prev => ({ ...prev, [caseId]: false }));
    }
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

  const sendMessageForCase = async (caseItem: any) => {
    const caseId = caseItem?.id;
    if (!caseId) return;
    const body = (messageDraftByCase[caseId] || '').trim();
    if (!body) return;
    await createMessage({
      caseId,
      clientOwner: caseItem.clientOwner,
      proOwner: caseItem.proOwner,
      senderRole: 'PRO',
      body,
    });
    setMessageDraftByCase(prev => ({ ...prev, [caseId]: '' }));
    await loadMessagesForCase(caseId);
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

  const loadSurveyForClient = async (clientOwner: string) => {
    if (!clientOwner || surveyLoading[clientOwner]) return;
    setSurveyLoading(prev => ({ ...prev, [clientOwner]: true }));
    setSurveyError(prev => ({ ...prev, [clientOwner]: '' }));
    setSurveyModalClient(clientOwner);
    try {
      if (isAuthBypassed()) {
        const cached = localStorage.getItem('fiskal_survey_data');
        const payload = cached ? JSON.parse(cached) : null;
        setSurveyByClient(prev => ({ ...prev, [clientOwner]: payload }));
        return;
      }
      const responses = await listSurveyResponsesByOwnerAndPro(clientOwner, proSub);
      if (!responses.length) {
        setSurveyByClient(prev => ({ ...prev, [clientOwner]: null }));
        return;
      }
      const latest = [...responses].sort((a: any, b: any) => {
        const aKey = a?.createdAt || '';
        const bKey = b?.createdAt || '';
        return aKey.localeCompare(bKey);
      }).pop();
      const payload = latest?.answersJson ? JSON.parse(latest.answersJson) : null;
      setSurveyByClient(prev => ({ ...prev, [clientOwner]: payload }));
    } catch (err: any) {
      setSurveyError(prev => ({ ...prev, [clientOwner]: err?.message || 'No se pudo cargar la encuesta' }));
    } finally {
      setSurveyLoading(prev => ({ ...prev, [clientOwner]: false }));
    }
  };

  const verifySurveysForPro = async () => {
    if (!proSub) return;
    setSurveyProError('');
    setSurveyProLoading(true);
    try {
      const items = await listSurveyResponsesByProOwner(proSub);
      const sorted = [...items].sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      const latest = sorted.pop();
      setSurveyProInfo({
        count: items.length,
        latestId: latest?.id,
        latestCreatedAt: latest?.createdAt,
      });
    } catch (err: any) {
      setSurveyProError(err?.message || 'No se pudo verificar encuestas.');
    } finally {
      setSurveyProLoading(false);
    }
  };

  const openDoc = async (doc: any) => {
    if (!doc?.parsedKey) return;
    try {
      const result = await getUrl({
        key: doc.parsedKey.key,
        options: {
          accessLevel: doc.parsedKey.accessLevel,
          ...(doc.parsedKey.targetIdentityId ? { targetIdentityId: doc.parsedKey.targetIdentityId } : {}),
          expiresIn: 3600,
        },
      });
      const url = result.url?.toString?.() ?? String(result.url);
      if (!url) throw new Error('URL inválida');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(err?.message || 'No se pudo generar el enlace');
    }
  };

  const addSlot = async () => {
    if (!newDate || !newTime || !newEndTime || !proSub) return;
    await createProfessionalAgenda({
      professionalId: proSub,
      date: newDate,
      time: newTime,
      endTime: newEndTime,
      status: ProfessionalAgendaStatus.AVAILABLE,
    });
    setNewDate('');
    setNewTime('');
    setNewEndTime('');
    refresh(proSub);
  };

  const acceptAppointment = async (appt: any) => {
    let meetingId = (appt as any)?.meetingId;
    let meetingRegion = (appt as any)?.meetingRegion;
    let clientJoinToken = (appt as any)?.clientJoinToken;
    let proJoinToken = (appt as any)?.proJoinToken;

    if (!meetingId || !clientJoinToken || !proJoinToken) {
      const res = await fetch('/api/chime/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appt.id,
          clientOwner: appt.clientOwner,
          proOwner: appt.proOwner,
        }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Error creando reunión');
      meetingId = data.meetingId;
      meetingRegion = data.meetingRegion;
      clientJoinToken = data.clientJoinToken;
      proJoinToken = data.proJoinToken;
      await updateAppointment({
        id: appt.id,
        meetingId,
        meetingRegion,
        meetingData: data.meetingData ? JSON.stringify(data.meetingData) : null,
        clientAttendeeId: data.clientAttendeeId,
        proAttendeeId: data.proAttendeeId,
        clientJoinToken,
        proJoinToken,
      } as any);
    }

    await updateAppointment({ id: appt.id, status: AppointmentStatus.ACCEPTED } as any);
    const slotId = (appt.notes || '').split('slotId:')[1]?.trim();
    const related = slots.find(s => s.id === slotId);
    if (related) {
      const baseLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}`;
      await updateProfessionalAgenda({ id: related.id, status: ProfessionalAgendaStatus.ACCEPTED, meetingLink: baseLink });
    }
    let clientEmail = appt.clientEmail || '';
    if (!clientEmail) {
      try {
        const clientProfile = await getUserProfileByOwner(appt.clientOwner);
        clientEmail = clientProfile?.email || '';
      } catch {}
    }
    const timeRange = `${appt.requestedStart} a ${appt.requestedEnd}`;
    const clientLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}&meeting=${encodeURIComponent(meetingId)}&region=${encodeURIComponent(meetingRegion)}&role=client&token=${encodeURIComponent(clientJoinToken)}`;
    const proLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}&meeting=${encodeURIComponent(meetingId)}&region=${encodeURIComponent(meetingRegion)}&role=pro&token=${encodeURIComponent(proJoinToken)}`;
    if (clientEmail) {
      const res = await fetch('/api/send-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientEmail, professionalEmail: '', meetingLink: clientLink, date: appt.requestedStart, time: timeRange })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Error enviando correo al cliente');
      }
    }
    if (proEmail) {
      const res = await fetch('/api/send-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientEmail: '', professionalEmail: proEmail, meetingLink: proLink, date: appt.requestedStart, time: timeRange })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Error enviando correo al profesional');
      }
    }
    alert('Cita aceptada y correo enviado.');
    refresh(proSub);
  };

  const proposeMove = async (appt: any) => {
    if (!rescheduleDate || !rescheduleTime || !rescheduleEndTime) {
      return alert('Indica fecha y hora propuesta');
    }
    if (rescheduleEndTime <= rescheduleTime) {
      return alert('La hora fin debe ser mayor que la hora inicio');
    }
    try {
      const proposedStart = `${rescheduleDate}T${rescheduleTime}:00Z`;
      const proposedEnd = `${rescheduleDate}T${rescheduleEndTime}:00Z`;
      await updateAppointment({ id: appt.id, status: AppointmentStatus.ACCEPTED, proposedStart, proposedEnd } as any);
      const slotId = (appt.notes || '').split('slotId:')[1]?.trim();
      const related = slots.find(s => s.id === slotId);
      const baseLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}`;
      if (related) {
        await updateProfessionalAgenda({
          id: related.id,
          status: ProfessionalAgendaStatus.MOVED,
          date: rescheduleDate,
          time: rescheduleTime,
          endTime: rescheduleEndTime,
          meetingLink: baseLink,
        });
      }
      let clientEmail = appt.clientEmail || '';
      if (!clientEmail) {
        try {
          const clientProfile = await getUserProfileByOwner(appt.clientOwner);
          clientEmail = clientProfile?.email || '';
        } catch {}
      }
      let meetingId = (appt as any)?.meetingId;
      let meetingRegion = (appt as any)?.meetingRegion;
      let clientJoinToken = (appt as any)?.clientJoinToken;
      let proJoinToken = (appt as any)?.proJoinToken;
      if (!clientJoinToken || !proJoinToken) {
        const res = await fetch('/api/chime/meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: appt.id,
            clientOwner: appt.clientOwner,
            proOwner: appt.proOwner,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error creando reunión');
        meetingId = data.meetingId;
        meetingRegion = data.meetingRegion;
        clientJoinToken = data.clientJoinToken;
        proJoinToken = data.proJoinToken;
        await updateAppointment({
          id: appt.id,
          meetingId: data.meetingId,
          meetingRegion: data.meetingRegion,
          meetingData: data.meetingData ? JSON.stringify(data.meetingData) : null,
          clientAttendeeId: data.clientAttendeeId,
          proAttendeeId: data.proAttendeeId,
          clientJoinToken,
          proJoinToken,
        } as any);
      }
      const timeRange = `${proposedStart} a ${proposedEnd}`;
      if (clientEmail && clientJoinToken) {
        const clientLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}&meeting=${encodeURIComponent(meetingId || '')}&region=${encodeURIComponent(meetingRegion || '')}&role=client&token=${encodeURIComponent(clientJoinToken)}`;
        const res = await fetch('/api/send-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientEmail, professionalEmail: '', meetingLink: clientLink, date: proposedStart, time: timeRange }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Error enviando correo al cliente');
        }
      }
      if (proEmail && proJoinToken) {
        const proLink = `${window.location.origin}/call?appt=${encodeURIComponent(appt.id)}&meeting=${encodeURIComponent(meetingId || '')}&region=${encodeURIComponent(meetingRegion || '')}&role=pro&token=${encodeURIComponent(proJoinToken)}`;
        const res = await fetch('/api/send-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientEmail: '', professionalEmail: proEmail, meetingLink: proLink, date: proposedStart, time: timeRange }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Error enviando correo al profesional');
        }
      }
      alert('Reprogramación propuesta.');
      setRescheduleOpen(false);
      setRescheduleTarget(null);
      setRescheduleDate('');
      setRescheduleTime('');
      setRescheduleEndTime('');
      refresh(proSub);
    } catch (err: any) {
      console.error('Error reprogramando cita', err);
      alert(err?.message || 'No se pudo reprogramar');
    }
  };

  const sendPaymentLink = async (appt: any, type: PaymentType) => {
    const caseForAppt = cases.find(c => c.appointmentId === appt.id);
    const total = caseForAppt?.servicePriceCents ?? 0;
    if (!total) return alert('Define el precio del servicio primero.');
    const half = Math.round(total / 2);
    const res = await fetch('/api/square/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountCents: half, note: type === PaymentType.SERVICE_50_FIRST ? 'Pago 50% inicial' : 'Pago 50% final' })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Error creando link');
    await createPayment({
      clientOwner: appt.clientOwner,
      proOwner: proSub,
      professionalId: appt.professionalId,
      appointmentId: appt.id,
      caseId: caseForAppt?.id,
      type,
      amountCents: half,
      currency: 'USD',
      status: PaymentStatus.PENDING,
      squareCheckoutId: data.id,
    });
    let clientEmail = appt.clientEmail || '';
    if (!clientEmail) {
      try {
        const clientProfile = await getUserProfileByOwner(appt.clientOwner);
        clientEmail = clientProfile?.email || '';
      } catch {}
    }
    if (clientEmail || proEmail) {
      const res = await fetch('/api/send-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientEmail, professionalEmail: proEmail, meetingLink: data.url, date: '', time: '' })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        alert(payload.error || 'Error enviando correo');
      }
    }
    alert('Link de pago enviado.');
  };

  const closeAppointment = async (appt: any) => {
    if (!confirm('¿Cerrar esta solicitud de cita?')) return;
    try {
      await updateAppointment({ id: appt.id, status: AppointmentStatus.CANCELLED });
      const slotId = (appt.notes || '').split('slotId:')[1]?.trim();
      const related = slots.find(s => s.id === slotId);
      if (related) {
        await updateProfessionalAgenda({
          id: related.id,
          status: ProfessionalAgendaStatus.AVAILABLE,
          clientId: null,
          meetingLink: null,
        });
      }
      alert('Solicitud cerrada.');
      setRescheduleOpen(false);
      setRescheduleTarget(null);
      setRescheduleDate('');
      setRescheduleTime('');
      setRescheduleEndTime('');
      refresh(proSub);
    } catch (err: any) {
      console.error('Error cerrando solicitud', err);
      alert('No se pudo cerrar: ' + (err?.message || 'error'));
    }
  };

  return (
    <div style={{ display: 'flex', background: '#001a2c', minHeight: '100vh', color: 'white' }}>
      <Sidebar dashboardHref="/expert-dashboard" />
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ color: '#00e5ff' }}>Dashboard Profesional</h1>
      <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', marginTop: '20px' }}>
        <h3>Crear horarios disponibles</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
          <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
          <input type="time" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} />
          <button onClick={addSlot} style={{ background: '#00ff88', border: 'none', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Agregar</button>
        </div>
        <div style={{ marginTop: '12px' }}>
          <button onClick={verifySurveysForPro} style={{ background: '#00e5ff', border: 'none', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>
            Verificar encuestas asignadas
          </button>
          {surveyProLoading && <p style={{ marginTop: '8px' }}>Verificando encuestas...</p>}
          {surveyProError && <p style={{ marginTop: '8px', color: '#ffb4b4' }}>{surveyProError}</p>}
          {surveyProInfo && !surveyProLoading && !surveyProError && (
            <div style={{ marginTop: '8px' }}>
              <p><strong>Encuestas asignadas:</strong> {surveyProInfo.count}</p>
              {surveyProInfo.latestId && (
                <p><strong>Última:</strong> {surveyProInfo.latestCreatedAt || 'sin fecha'} (ID: {surveyProInfo.latestId})</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', marginTop: '20px' }}>
        <h3>Calendario</h3>
        {appointments.length === 0 && <p>No hay citas en el calendario.</p>}
        {appointments.length > 0 && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {appointments.map(appt => (
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

      <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', marginTop: '20px' }}>
        <h3>Horarios creados</h3>
        {slots.length === 0 && <p>No hay horarios aún.</p>}
        {slots.length > 0 && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {slots.map(slot => (
              <div key={slot.id} style={{ background: '#001a2c', padding: '12px', borderRadius: '8px', border: '1px solid #00e5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{slot.date}</strong> - {slot.time} a {slot.endTime || slot.time}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#7dd3fc' }}>{slot.status}</span>
                  <button
                    onClick={async () => {
                      if (!confirm('¿Eliminar este horario?')) return;
                      await deleteProfessionalAgenda(slot.id);
                      refresh(proSub);
                    }}
                    style={{ background: '#ff6b6b', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Solicitudes de Cita</h3>
        {appointments.length === 0 && <p>No hay citas.</p>}
        <div style={{ display: 'grid', gap: '14px' }}>
          {appointments.map(appt => (
            <div key={appt.id} style={{ background: '#003a57', padding: '16px', borderRadius: '10px', border: '1px solid #00e5ff', position: 'relative' }}>
              <button
                onClick={() => closeAppointment(appt)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff6b6b', border: 'none', padding: '4px 8px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}
              >
                X
              </button>
              <p><strong>Cliente:</strong> {appt.clientName || clientNames[appt.clientOwner] || appt.clientEmail || appt.clientOwner}</p>
              <p><strong>Estado:</strong> {appt.status}</p>
              <p><strong>Fecha/Hora:</strong> {appt.requestedStart}</p>
              <div style={{ marginBottom: '10px' }}>
                <label>Precio del servicio (USD)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej: 1000"
                  value={servicePriceByAppt[appt.id] || ''}
                  onChange={e => setServicePriceByAppt(prev => ({ ...prev, [appt.id]: e.target.value }))}
                  style={{ marginLeft: '10px' }}
                />
                <button
                  onClick={async () => {
                    const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                    if (!caseForAppt) return alert('No hay caso asociado.');
                    const rawValue = servicePriceByAppt[appt.id] || '';
                    const cents = Math.round(Number(rawValue || '0') * 100);
                    if (!cents) return alert('Monto inválido');
                    await updateCase({ id: caseForAppt.id, servicePriceCents: cents, currency: 'USD', status: CaseStatus.IN_PROGRESS });
                    alert('Precio guardado.');
                    setServicePriceByAppt(prev => ({ ...prev, [appt.id]: (cents / 100).toString() }));
                    refresh(proSub);
                  }}
                  style={{ marginLeft: '10px', background: '#00ff88', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Guardar Precio
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => acceptAppointment(appt)} style={{ background: '#00ff88', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Aceptar</button>
                {appt.status !== 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setRescheduleTarget(appt);
                      const start = (appt.requestedStart || '').split('T');
                      const end = (appt.requestedEnd || '').split('T');
                      setRescheduleDate(start[0] || '');
                      setRescheduleTime((start[1] || '').slice(0, 5));
                      setRescheduleEndTime((end[1] || '').slice(0, 5));
                      setRescheduleOpen(true);
                    }}
                    style={{ background: '#ffaa00', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Proponer Cambio
                  </button>
                )}
                <button onClick={() => sendPaymentLink(appt, PaymentType.SERVICE_50_FIRST)} style={{ background: '#00e5ff', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar 50% Inicial</button>
                <button onClick={() => sendPaymentLink(appt, PaymentType.SERVICE_50_FINAL)} style={{ background: '#00c2ff', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar 50% Final</button>
                <button
                  onClick={async () => {
                    const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                    if (!caseForAppt) return alert('No hay caso asociado.');
                    await updateCase({ id: caseForAppt.id, status: CaseStatus.COMPLETED });
                    await updateAppointment({ id: appt.id, status: AppointmentStatus.COMPLETED });
                    alert('Caso finalizado.');
                    refresh(proSub);
                  }}
                  style={{ background: '#7dd3fc', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Marcar Finalizado
                </button>
                <button
                  onClick={() => {
                    const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                    if (!caseForAppt) return alert('No hay caso asociado.');
                    loadCaseDocs(caseForAppt.id);
                  }}
                  style={{ background: '#ffe08a', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Ver Documentos
                </button>
                <button
                  onClick={() => loadSurveyForClient(appt.clientOwner)}
                  style={{ background: '#b3ecff', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Ver Encuesta
                </button>
                <button
                  onClick={() => {
                    const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                    if (!caseForAppt) return;
                    setChatOpenByCase(prev => ({ ...prev, [caseForAppt.id]: !prev[caseForAppt.id] }));
                    loadMessagesForCase(caseForAppt.id);
                  }}
                  style={{ background: '#7dd3fc', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Mensajes
                </button>
              </div>
              {(() => {
                const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                if (!caseForAppt) return null;
                const docs = docsByCase[caseForAppt.id];
                if (docsLoading[caseForAppt.id]) {
                  return <p style={{ marginTop: '10px' }}>Cargando documentos...</p>;
                }
                if (!docs) return null;
                if (docs.length === 0) {
                  return <p style={{ marginTop: '10px' }}>No hay documentos adjuntos.</p>;
                }
                return (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Documentos:</strong>
                    <ul style={{ marginTop: '6px' }}>
                      {docs.map((doc: any) => (
                        <li key={doc.id}>
                          <button
                            onClick={() => openDoc(doc)}
                            style={{ background: 'transparent', border: 'none', color: '#7dd3fc', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                          >
                            {doc.fileName || doc.title || 'Documento'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
              {(() => {
                const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                if (!caseForAppt) return null;
                const apptPayments = payments.filter(p => p.caseId === caseForAppt.id);
                const events = buildTimeline(caseForAppt, appt, apptPayments);
                return (
                  <div style={{ marginTop: '12px', background: '#001a2c', border: '1px solid #00e5ff', padding: '12px', borderRadius: '8px' }}>
                    <strong>Línea de tiempo:</strong>
                    <div style={{ marginTop: '6px', display: 'grid', gap: '6px' }}>
                      {events.map((e, idx) => (
                        <div key={`${caseForAppt.id}-evt-${idx}`} style={{ color: '#9adfff' }}>
                          • {e.label}{e.date ? ` — ${e.date}` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {(() => {
                const caseForAppt = cases.find(c => c.appointmentId === appt.id);
                if (!caseForAppt || !chatOpenByCase[caseForAppt.id]) return null;
                const msgs = messagesByCase[caseForAppt.id] || [];
                return (
                  <div style={{ marginTop: '12px', background: '#001a2c', border: '1px solid #00e5ff', padding: '12px', borderRadius: '8px' }}>
                    <strong>Chat del caso</strong>
                    {messagesLoading[caseForAppt.id] && <p>Cargando mensajes...</p>}
                    {!messagesLoading[caseForAppt.id] && (
                      <div style={{ marginTop: '8px', display: 'grid', gap: '6px' }}>
                        {msgs.length === 0 && <p>No hay mensajes aún.</p>}
                        {msgs.map((m: any) => (
                          <div key={m.id} style={{ background: '#003a57', padding: '8px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#9adfff' }}>
                              {m.senderRole === 'CLIENT' ? shortName(clientNames[caseForAppt.clientOwner]) : 'Tú'}
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
                        value={messageDraftByCase[caseForAppt.id] || ''}
                        onChange={e => setMessageDraftByCase(prev => ({ ...prev, [caseForAppt.id]: e.target.value }))}
                        style={{ flex: 1 }}
                      />
                      <button
                        onClick={() => sendMessageForCase(caseForAppt)}
                        style={{ background: '#00e5ff', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
      {rescheduleOpen && rescheduleTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', minWidth: '320px' }}>
            <h3 style={{ marginTop: 0 }}>Reprogramar cita</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
              <input type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
              <input type="time" value={rescheduleEndTime} onChange={e => setRescheduleEndTime(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRescheduleOpen(false)} style={{ background: '#7dd3fc', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={() => proposeMove(rescheduleTarget)} style={{ background: '#ffaa00', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
      {surveyModalClient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', maxWidth: '720px', width: '100%', position: 'relative', maxHeight: '85vh', overflow: 'hidden' }}>
            <button
              onClick={() => setSurveyModalClient(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff6b6b', border: 'none', padding: '4px 8px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}
            >
              X
            </button>
            <div style={{ maxHeight: 'calc(85vh - 60px)', overflowY: 'auto', paddingRight: '6px' }}>
              <h3 style={{ marginTop: 0 }}>Encuesta del cliente</h3>
              {(() => {
                const loading = surveyLoading[surveyModalClient];
                const error = surveyError[surveyModalClient];
                const payload = surveyByClient[surveyModalClient];
                if (loading) return <p>Cargando encuesta...</p>;
                if (error) return <p style={{ color: '#ffb4b4' }}>{error}</p>;
                if (payload === undefined) return <p>No se ha cargado la encuesta.</p>;
                if (!payload) return <p>No hay encuesta disponible.</p>;
                const answers = payload?.answers || {};
                const submittedAt = payload?.submittedAt || '';
                return (
                  <div style={{ marginTop: '10px', background: '#001a2c', border: '1px solid #00e5ff', padding: '12px', borderRadius: '8px' }}>
                    {submittedAt && <div style={{ color: '#9bb3c7', fontSize: '0.9rem' }}>Enviada: {submittedAt}</div>}
                    <div style={{ marginTop: '8px', display: 'grid', gap: '8px' }}>
                      {SURVEY_QUESTIONS.map(q => (
                        <div key={q.id}>
                          <div style={{ color: '#00e5ff', fontSize: '0.9rem' }}>{q.label}</div>
                          <div>{answers[q.id] || 'Sin respuesta'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
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
            <ChimeCall appointmentId={callModalAppt.id} role="pro" embedded fullHeight={callFullscreen} onLeave={() => setCallModalAppt(null)} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
