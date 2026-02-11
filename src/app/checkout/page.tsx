"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SquarePayment from '../../components/SquarePayment';
import { createPayment, listSurveyResponsesByOwner, updateSurveyResponse } from '../../lib/graphqlClient';
import { PaymentStatus, PaymentType } from '../../API';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { isAuthBypassed } from '../../lib/authBypass';

export default function CheckoutPage() {
  const router = useRouter();
  const [pro, setPro] = useState<any>(null);
  const [clientSub, setClientSub] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('fiskal_selected_pro');
    if (stored) setPro(JSON.parse(stored));
    const load = async () => {
      try {
        if (isAuthBypassed()) {
          setClientSub('demo-user');
          return;
        }
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        setClientSub(attr.sub ?? user.userId ?? '');
      } catch {
        router.push('/');
      }
    };
    load();
  }, [router]);

  const onSuccess = async (paymentId: string) => {
    if (isAuthBypassed()) {
      localStorage.setItem('fiskal_paid_initial', 'true');
      document.cookie = 'fk_paid_initial=1; path=/';
      router.push('/agenda');
      return;
    }
    if (!clientSub) return;
    const proOwner = pro?.owner || null;
    await createPayment({
      clientOwner: clientSub,
      proOwner: proOwner || undefined,
      professionalId: pro?.id,
      type: PaymentType.UNLOCK_150,
      amountCents: 15000,
      currency: 'USD',
      status: PaymentStatus.PAID,
      squarePaymentId: paymentId,
    });
    if (proOwner) {
      try {
        const surveys = await listSurveyResponsesByOwner(clientSub);
        const latest = surveys.sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || '')).pop();
        if (latest?.id) {
          await updateSurveyResponse({ id: latest.id, proOwner, professionalId: pro?.id ?? null });
        }
      } catch {}
    }
    localStorage.setItem('fiskal_paid_initial', 'true');
    document.cookie = 'fk_paid_initial=1; path=/';
    router.push('/agenda');
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#003a57', padding: '30px', borderRadius: '15px', border: '1px solid #00e5ff' }}>
        <h1 style={{ color: '#00e5ff' }}>Pago de Desbloqueo de Agenda</h1>
        <p>Seleccionaste a: <strong>{pro?.displayName ?? 'Profesional'}</strong></p>
        <p>Monto: <strong>USD 150</strong></p>
        <SquarePayment amountCents={15000} description="Pago inicial para abrir agenda" onSuccess={onSuccess} />
      </div>
    </div>
  );
}
