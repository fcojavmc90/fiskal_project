"use client";
import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

type PayPalPaymentProps = {
  amountCents: number;
  description: string;
  onSuccess: (captureId: string, orderId?: string) => void;
  paymentId?: string;
  authToken?: string;
  plan?: 'UNLOCK_150';
};

export default function PayPalPayment({ amountCents, description, onSuccess, paymentId, authToken, plan }: PayPalPaymentProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
  const requiresAuth = Boolean(paymentId);
  const isReady = !requiresAuth || Boolean(authToken);
  const effectivePaymentId =
    paymentId ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('payment') || ''
      : '');

  if (!clientId) {
    return (
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', marginTop: '20px' }}>
        <h3 style={{ color: '#001a2c' }}>{description}</h3>
        <p style={{ color: '#001a2c' }}>
          Configura las variables de entorno de PayPal para habilitar el pago.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', marginTop: '20px' }}>
      <h3 style={{ color: '#001a2c' }}>{description}</h3>
      {!isReady && (
        <p style={{ color: '#001a2c', marginTop: '10px' }}>
          Cargando sesión de pago...
        </p>
      )}
      <PayPalScriptProvider
        options={{
          clientId,
          currency: 'USD',
          intent: 'capture',
          components: 'buttons',
        }}
      >
        <PayPalButtons
          disabled={!isReady}
          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
          createOrder={async () => {
            if (!isReady) {
              throw new Error('Autenticación pendiente');
            }
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (authToken) headers.Authorization = `Bearer ${authToken}`;
            const res = await fetch('/api/paypal/order', {
              method: 'POST',
              headers,
              body: JSON.stringify({ amountCents, description, paymentId: effectivePaymentId, plan }),
            });
            const data = await res.json();
            if (!res.ok) {
              alert(data.error || 'Error creando orden de PayPal');
              throw new Error(data.error || 'Error creando orden de PayPal');
            }
            return data.orderId as string;
          }}
          onApprove={async (data) => {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (authToken) headers.Authorization = `Bearer ${authToken}`;
            const res = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers,
              body: JSON.stringify({ orderId: data.orderID, paymentId: effectivePaymentId, plan }),
            });
            const payload = await res.json();
            if (!res.ok) {
              alert(payload.error || 'Error capturando pago de PayPal');
              return;
            }
            onSuccess(payload.captureId, data.orderID || '');
          }}
          onError={(err) => {
            console.error('PayPal error:', err);
            alert('Error procesando pago con PayPal');
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
