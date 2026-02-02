'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ClientDashboard() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleFinalPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay-milestone-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: 'user@example.com', 
          caseId: 'FIS-99', 
          amount: 150, // Ejemplo: 50% restante
          lang 
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Error processing payment link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <h1 style={{ color: '#00e5ff' }}>{lang === 'es' ? 'Mi Panel de Control' : 'My Dashboard'}</h1>
        
        <div style={{ background: '#003a57', padding: '30px', borderRadius: '15px', border: '1px solid #00ff88' }}>
          <h3>{lang === 'es' ? 'Estado del Caso: En Revisión' : 'Case Status: Under Review'}</h3>
          <p style={{ color: '#b0bec5' }}>
            {lang === 'es' 
              ? 'Tu experto ha subido el borrador final. Realiza el pago del 50% restante para descargar los documentos oficiales.' 
              : 'Your expert has uploaded the final draft. Make the remaining 50% payment to download official documents.'}
          </p>
          
          <button 
            onClick={handleFinalPayment}
            disabled={loading}
            style={{ background: '#00ff88', color: '#00283d', border: 'none', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            {loading ? '...' : (lang === 'es' ? 'PAGAR LIQUIDACIÓN FINAL' : 'PAY FINAL SETTLEMENT')}
          </button>
        </div>
      </div>
    </div>
  );
}
