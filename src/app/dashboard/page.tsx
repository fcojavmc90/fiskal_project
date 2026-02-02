'use client';
import { useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function DashboardBridge() {
  const router = useRouter();

  useEffect(() => {
    async function routeUser() {
      try {
        const attr = await fetchUserAttributes();
        const role = attr['custom:role']; // PRO o CLIENT

        if (role === 'PRO') {
          router.push('/expert-dashboard');
        } else {
          // Si es cliente, verificamos si tiene encuesta guardada o si va directo al panel
          const hasSurvey = localStorage.getItem('fiskal_survey_data');
          router.push(hasSurvey ? '/match-results' : '/dashboard-client');
        }
      } catch (e) {
        router.push('/');
      }
    }
    routeUser();
  }, [router]);

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <p>Cargando tu perfil FISKAL...</p>
    </div>
  );
}
