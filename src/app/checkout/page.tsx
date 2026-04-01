"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';

const PayPalPayment = dynamicImport(() => import('../../components/PayPalPayment'), { ssr: false });
import { createPayment, getPaymentById, listSurveyResponsesByOwner, updatePayment, updateSurveyResponse } from '../../lib/graphqlClient';
import { PaymentStatus, PaymentType } from '../../API';
import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import { isAuthBypassed } from '../../lib/authBypass';

export default function CheckoutPage() {
  const router = useRouter();
  const [pro, setPro] = useState<any>(null);
  const [clientSub, setClientSub] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [paymentId, setPaymentId] = useState('');

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
        const session = await fetchAuthSession();
        setAuthToken(session.tokens?.idToken?.toString() ?? '');
      } catch {
        router.push('/');
      }
    };
    load();
  }, [router]);

  useEffect(() => {
    if (isAuthBypassed()) return;
    if (!clientSub || !pro?.id) return;
    let cancelled = false;
    const loadOrCreate = async () => {
      const cached = localStorage.getItem('fiskal_pending_unlock_payment') || '';
      if (cached) {
        try {
          const existing = await getPaymentById(cached);
          if (existing && existing.status !== PaymentStatus.PAID) {
            if (!cancelled) setPaymentId(existing.id);
            return;
          }
        } catch {}
      }
      const res = await createPayment({
        clientOwner: clientSub,
        proOwner: pro?.owner || undefined,
        professionalId: pro?.id,
        type: PaymentType.UNLOCK_150,
        amountCents: 15000,
        currency: 'USD',
        status: PaymentStatus.PENDING,
      });
      const newId = res?.data?.createPayment?.id || '';
      if (!cancelled && newId) {
        setPaymentId(newId);
        localStorage.setItem('fiskal_pending_unlock_payment', newId);
      }
    };
    loadOrCreate();
    return () => {
      cancelled = true;
    };
  }, [clientSub, pro?.id, pro?.owner]);

  const onSuccess = async (captureId: string, orderId?: string) => {
    if (isAuthBypassed()) {
      localStorage.setItem('fiskal_paid_initial', 'true');
      document.cookie = 'fk_paid_initial=1; path=/';
      router.push('/agenda');
      return;
    }
    if (!clientSub) return;
    const proOwner = pro?.owner || null;
    if (paymentId) {
      await updatePayment({
        id: paymentId,
        status: PaymentStatus.PAID,
        paypalCaptureId: captureId,
        paypalOrderId: orderId || undefined,
      });
    } else {
      await createPayment({
        clientOwner: clientSub,
        proOwner: proOwner || undefined,
        professionalId: pro?.id,
        type: PaymentType.UNLOCK_150,
        amountCents: 15000,
        currency: 'USD',
        status: PaymentStatus.PAID,
        paypalCaptureId: captureId,
        paypalOrderId: orderId || undefined,
      });
    }
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
        <PayPalPayment
          amountCents={15000}
          description="Pago inicial para abrir agenda"
          onSuccess={onSuccess}
          plan="UNLOCK_150"
          authToken={authToken}
          paymentId={paymentId}
        />
      </div>
    </div>
  );
}
