"use client";
import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

type PayPalPaymentProps = {
  amountCents: number;
  description: string;
  onSuccess: (captureId: string, orderId?: string) => void;
};

export default function PayPalPayment({ amountCents, description, onSuccess }: PayPalPaymentProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';

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
      <PayPalScriptProvider
        options={{
          clientId,
          currency: 'USD',
          intent: 'capture',
          components: 'buttons',
        }}
      >
        <PayPalButtons
          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
          createOrder={async () => {
            const res = await fetch('/api/paypal/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amountCents, description }),
            });
            const data = await res.json();
            if (!res.ok) {
              alert(data.error || 'Error creando orden de PayPal');
              throw new Error(data.error || 'Error creando orden de PayPal');
            }
            return data.orderId as string;
          }}
          onApprove={async (data) => {
            const res = await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID }),
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
