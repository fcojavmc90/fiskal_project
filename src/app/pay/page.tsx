"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPaymentById, updatePayment } from '../../lib/graphqlClient';
import { PaymentStatus, PaymentType } from '../../API';
import { ensureAmplifyConfigured } from '../../lib/amplifyClient';

const PayPalPayment = dynamic(() => import('../../components/PayPalPayment'), { ssr: false });

function PayPageInner() {
  ensureAmplifyConfigured();
  const router = useRouter();
  const params = useSearchParams();
  const paymentId = params.get('payment') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!paymentId) {
        setError('Pago no encontrado.');
        setLoading(false);
        return;
      }
      try {
        const data = await getPaymentById(paymentId);
        if (!data) {
          setError('Pago no encontrado.');
          return;
        }
        setPayment(data);
      } catch (err: any) {
        setError(err?.message || 'No se pudo cargar el pago.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [paymentId]);

  const onSuccess = async (captureId: string, orderId?: string) => {
    if (!payment?.id) return;
    await updatePayment({ id: payment.id, status: PaymentStatus.PAID, paypalCaptureId: captureId, paypalOrderId: orderId || undefined });
    alert('Pago realizado con éxito.');
    router.push('/dashboard-client');
  };

  const label = payment?.type === PaymentType.SERVICE_50_FIRST ? 'Pago 50% inicial' : 'Pago 50% final';
  const amountDollars = payment?.amountCents ? (payment.amountCents / 100).toFixed(2) : '0.00';

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', background: '#003a57', padding: '30px', borderRadius: '15px', border: '1px solid #00e5ff' }}>
        <h1 style={{ color: '#00e5ff' }}>Pago de Servicio</h1>
        {loading && <p>Cargando pago...</p>}
        {!loading && error && <p style={{ color: '#ffb4b4' }}>{error}</p>}
        {!loading && !error && payment && (
          <>
            <p><strong>{label}</strong></p>
            <p>Monto: <strong>USD {amountDollars}</strong></p>
            {payment.status === PaymentStatus.PAID ? (
              <p style={{ color: '#4ade80' }}>Este pago ya fue realizado.</p>
            ) : (
              <PayPalPayment
                amountCents={payment.amountCents}
                description={label}
                onSuccess={onSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div style={{ background: '#001a2c', minHeight: '100vh', padding: '40px', color: 'white' }}>Cargando...</div>}>
      <PayPageInner />
    </Suspense>
  );
}
