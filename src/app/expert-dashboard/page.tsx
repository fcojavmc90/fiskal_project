'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { translations } from '@/lib/translations';

export default function ExpertDashboard() {
  const [lang] = useState<'en' | 'es'>('es');
  const t = translations[lang];
  const [appointments, setAppointments] = useState([
    { id: '1', client: 'John Doe', email: 'john@example.com', country: 'USA', phone: '+1 555-0199', status: 'PAID_HITO_1', date: '2026-02-15' }
  ]);

  const handleAccept = async (apt: any) => {
    try {
      const res = await fetch('/api/accept-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appointmentId: apt.id, 
          clientEmail: apt.email, 
          clientName: apt.client,
          lang 
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Actualizar UI localmente
        setAppointments(appointments.map(a => a.id === apt.id ? { ...a, status: 'CONFIRMED' } : a));
      }
    } catch (error) {
      alert("Error al aceptar cita");
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
        <h1 style={{ color: '#00e5ff', marginBottom: '30px' }}>
          {lang === 'es' ? 'Gestión de Citas' : 'Appointment Management'}
        </h1>
        
        {appointments.map((apt) => (
          <div key={apt.id} style={{ background: '#003a57', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #00e5ff33', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#00ff88' }}>{apt.client}</h3>
              <p style={{ fontSize: '14px', color: '#b0bec5' }}>{apt.country} | {apt.phone}</p>
              <p style={{ fontSize: '12px' }}>Estado: <strong>{apt.status}</strong></p>
            </div>
            
            {apt.status === 'PAID_HITO_1' && (
              <button 
                onClick={() => handleAccept(apt)}
                style={{ background: '#00ff88', color: '#00283d', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {lang === 'es' ? 'Aceptar y Generar Link' : 'Accept & Generate Link'}
              </button>
            )}
            {apt.status === 'CONFIRMED' && (
              <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>✓ {lang === 'es' ? 'Confirmada' : 'Confirmed'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
