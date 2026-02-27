"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listProfessionalProfiles, listSurveyResponsesByOwner } from '../../lib/graphqlClient';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { isAuthBypassed } from '../../lib/authBypass';

type ProCard = {
  id: string;
  owner: string;
  displayName: string;
  bio?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  isActive?: boolean | null;
};

function maskName(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]?.toUpperCase() ?? ''}.`;
}

export default function ProfessionalsPage() {
  const router = useRouter();
  const [pros, setPros] = useState<ProCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const loadOwner = async () => {
      try {
        if (isAuthBypassed()) {
          setOwner('demo-user');
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        setOwner(attr.sub ?? user.userId ?? '');
      } catch {
        setOwner('');
      }
    };
    loadOwner();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        if (isAuthBypassed()) {
          setPros([]);
          return;
        }
        console.log('[professionals] loading profiles for owner:', owner);
        const items = await listProfessionalProfiles();
        console.log('[professionals] listProfessionalProfiles result:', items);
        let scored = items as ProCard[];
        if (owner) {
          try {
            const surveys = await listSurveyResponsesByOwner(owner);
            console.log('[professionals] listSurveyResponsesByOwner result:', surveys);
            const latest = surveys.sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || '')).pop();
            const payload = latest?.answersJson ? JSON.parse(latest.answersJson) : null;
            const answersText = payload ? JSON.stringify(payload.answers ?? payload) : '';
            const scoreFor = (bio?: string | null) => {
              const t = `${answersText}`.toLowerCase();
              let score = 0;
              if (t.includes('cp2000')) score += 2;
              if (t.includes('deficiency')) score += 2;
              if (t.includes('audit')) score += 1;
              if (t.includes('embargo')) score += 1;
              if (bio && t && bio.toLowerCase().includes('irs')) score += 1;
              return score;
            };
            scored = scored
              .map(p => ({ ...p, _score: scoreFor(p.bio) } as any))
              .sort((a: any, b: any) => (b._score ?? 0) - (a._score ?? 0));
          } catch (err: any) {
            console.error('No se pudo leer encuesta para ranking:', err);
            // Si falla el ranking, mostramos igual el listado base.
          }
        }
        const active = scored.filter(p => p.isActive !== false);
        setPros(active);
      } catch (err: any) {
        alert('Error cargando profesionales: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [owner]);

  const selectPro = (pro: ProCard) => {
    localStorage.setItem('fiskal_selected_pro', JSON.stringify(pro));
    router.push('/checkout');
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <h1 style={{ textAlign: 'center', color: '#00e5ff' }}>Profesionales Recomendados</h1>
      {loading && <p style={{ textAlign: 'center' }}>Cargando...</p>}
      {!loading && pros.length === 0 && (
        <p style={{ textAlign: 'center' }}>No hay profesionales activos disponibles todavía.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '22px', maxWidth: '1200px', margin: '30px auto' }}>
        {pros.map(p => (
          <div key={p.id} style={{ background: '#082a3f', padding: '20px', borderRadius: '16px', border: '1px solid #00e5ff33', textAlign: 'left', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '0.2px' }}>
                {maskName(p.displayName || 'Profesional')}
              </h3>
              <span style={{ fontSize: '14px', color: '#9adfff' }}>
                ⭐ {p.ratingAvg?.toFixed(1) ?? '0.0'}
              </span>
            </div>
            <p style={{ margin: '10px 0 12px', color: '#c5e9ff', lineHeight: 1.4 }}>
              {p.bio || 'Servicios fiscales y defensa ante IRS.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#7fbfdd' }}>
                {p.ratingCount ?? 0} reseñas
              </span>
              <button onClick={() => selectPro(p)} style={{ background: '#00ff88', border: 'none', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' }}>
                Seleccionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
