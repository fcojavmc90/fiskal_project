"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { createAppointment, createCase, createCaseDocument, listAgendaByProfessional, listSurveyResponsesByOwner, updateProfessionalAgenda, updateSurveyResponse } from '../../lib/graphqlClient';
import { AppointmentStatus, CaseStatus, DocStatus, ProfessionalAgendaStatus } from '../../API';
import { isAuthBypassed } from '../../lib/authBypass';

export default function AgendaPage() {
  const router = useRouter();
  const [pro, setPro] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [clientSub, setClientSub] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fiskal_selected_pro');
    if (stored) setPro(JSON.parse(stored));
    const load = async () => {
      try {
        if (isAuthBypassed()) {
          setClientSub('demo-user');
          setClientEmail('demo@fiskal.local');
          setLoading(false);
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const sub = attr.sub ?? user.userId ?? '';
        setClientSub(sub);
        setClientEmail(attr.email ?? '');
        const first = attr.given_name ?? attr['custom:firstName'] ?? '';
        const last = attr.family_name ?? attr['custom:lastName'] ?? '';
        setClientName(`${first} ${last}`.trim());
      } catch {
        router.push('/');
      }
    };
    load();
  }, [router]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!pro?.owner) {
        setLoading(false);
        return;
      }
      if (isAuthBypassed()) {
        setSlots([]);
        setLoading(false);
        return;
      }
      try {
        const data = await listAgendaByProfessional(pro.owner);
        const available = data.filter((s: any) => s.status === ProfessionalAgendaStatus.AVAILABLE);
        setSlots(available);
      } catch (err: any) {
        console.error('Error cargando agenda', err);
        alert('Error cargando agenda: ' + formatError(err));
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [pro]);

  const reserve = async (slot: any) => {
    if (isAuthBypassed()) {
      alert('Modo demo: reserva deshabilitada sin login.');
      return;
    }
    if (!clientSub || !pro?.owner) return;
    try {
      const start = `${slot.date}T${slot.time}:00Z`;
      const endTime = slot.endTime || slot.time;
      const end = `${slot.date}T${endTime}:00Z`;
      await updateProfessionalAgenda({
        id: slot.id,
        status: ProfessionalAgendaStatus.PENDING,
        clientId: clientSub,
      });
      const apptRes: any = await createAppointment({
        clientOwner: clientSub,
        clientName: clientName || undefined,
        clientEmail: clientEmail || undefined,
        proOwner: pro.owner,
        professionalId: pro.id,
        requestedStart: start,
        requestedEnd: end,
        status: AppointmentStatus.REQUESTED,
        notes: `Solicitud de cita desde agenda | slotId:${slot.id}`,
      });
      const appointmentId = apptRes?.data?.createAppointment?.id ?? '';
      if (appointmentId) {
        const caseNumber = `FISK-${Date.now()}`;
        const caseRes: any = await createCase({
          caseNumber,
          clientOwner: clientSub,
          proOwner: pro.owner,
          professionalId: pro.id,
          appointmentId,
          status: CaseStatus.OPEN,
          currency: 'USD',
        });
        const caseId = caseRes?.data?.createCase?.id ?? '';
        if (caseId) {
          const surveys = await listSurveyResponsesByOwner(clientSub);
          const latest = surveys.sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || '')).pop();
          if (latest?.id && pro?.owner) {
            try {
              await updateSurveyResponse({
                id: latest.id,
                proOwner: pro.owner,
                professionalId: pro.id ?? null,
              });
            } catch {}
          }
          let payload = latest?.answersJson ? JSON.parse(latest.answersJson) : null;
          let files = payload?.files ?? [];
          if (!files.length) {
            try {
              const cached = localStorage.getItem('fiskal_survey_data');
              const cachedPayload = cached ? JSON.parse(cached) : null;
              if (cachedPayload?.files?.length) {
                payload = cachedPayload;
                files = cachedPayload.files;
              }
            } catch {}
          }
          for (const f of files) {
            await createCaseDocument({
              caseId,
              caseNumber,
              clientOwner: clientSub,
              proOwner: pro.owner,
              professionalId: pro.id,
              title: f.name || 'Documento',
              status: DocStatus.UPLOADED,
              fileName: f.name,
              fileType: f.type,
              s3Key: f.key,
              uploadedAt: new Date().toISOString(),
            });
          }
        }
      }
      alert('Cita solicitada. El profesional confirmará por correo.');
      router.push('/dashboard-client');
    } catch (err: any) {
      console.error('Error reservando cita', err);
      alert('Error al reservar: ' + formatError(err));
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#003a57', padding: '30px', borderRadius: '15px', border: '1px solid #00e5ff' }}>
        <h1 style={{ color: '#00e5ff' }}>Agenda de {pro?.displayName ?? 'Profesional'}</h1>
        {loading && <p>Cargando horarios...</p>}
        {!loading && !pro?.owner && <p>No se encontró profesional seleccionado. Vuelve al listado y selecciona uno.</p>}
        {!loading && slots.length === 0 && <p>No hay horarios disponibles aún.</p>}
        <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
          {slots.map(slot => (
            <div key={slot.id} style={{ background: '#001a2c', padding: '14px', borderRadius: '10px', border: '1px solid #00e5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{slot.date}</strong> - {slot.time} a {slot.endTime || slot.time}
              </div>
              <button onClick={() => reserve(slot)} style={{ background: '#00ff88', border: 'none', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>Reservar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatError(err: any) {
  if (!err) return 'sin detalles';
  if (typeof err === 'string') return err;
  if (err?.message) return err.message;
  if (Array.isArray(err?.errors) && err.errors[0]?.message) return err.errors[0].message;
  try {
    return JSON.stringify(err);
  } catch {
    return 'sin detalles';
  }
}
