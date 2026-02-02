'use client';
import { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function MatchResultsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserAttributes().then(attr => setEmail(attr.email || '')).catch(() => router.push('/'));
  }, [router]);

  const handleUnlockAgenda = async (expertName: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertName, userEmail: email }),
      });

      const data = await res.json();
      if (data.url) {
        // Redirigir a la pasarela de Square
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No se pudo generar el link de pago');
      }
    } catch (error: any) {
      alert("Error con Square: " + error.message + ". Verifica tus variables de entorno.");
    } finally {
      setLoading(false);
    }
  };

  const experts = [
    { name: 'Dr. Arnaldo Silva', specialty: 'Corporate Tax', rating: 4.9 },
    { name: 'Dra. Lucia Méndez', specialty: 'International Wealth', rating: 4.8 }
  ];

  return (
    <div style={{ backgroundColor: '#001a2c', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <h1 style={{ color: '#00e5ff', textAlign: 'center' }}>Expertos Recomendados</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px' }}>Selecciona un profesional para desbloquear su agenda (Costo: 150 USD)</p>
      
      <div style={{ display: 'grid', gap: '20px', maxWidth: '800px', margin: 'auto' }}>
        {experts.map((exp, i) => (
          <div key={i} style={{ background: '#003a57', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #00e5ff' }}>
            <div>
              <h3 style={{ margin: 0 }}>{exp.name}</h3>
              <p style={{ color: '#00ff88', margin: '5px 0' }}>{exp.specialty} • ⭐ {exp.rating}</p>
            </div>
            <button 
              onClick={() => handleUnlockAgenda(exp.name)}
              disabled={loading}
              style={{ background: '#00ff88', color: '#00283d', padding: '12px 25px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'CARGANDO...' : 'RESERVAR POR 50'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
