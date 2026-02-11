"use client";
import React from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';

type SquarePaymentProps = {
  amountCents: number;
  description: string;
  onSuccess: (paymentId: string) => void;
};

export default function SquarePayment({ amountCents, description, onSuccess }: SquarePaymentProps) {
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '';

  if (!applicationId || !locationId) {
    return (
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', marginTop: '20px' }}>
        <h3 style={{ color: '#001a2c' }}>{description}</h3>
        <p style={{ color: '#001a2c' }}>
          Configura las variables de entorno de Square para habilitar el pago.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', marginTop: '20px' }}>
      <h3 style={{ color: '#001a2c' }}>{description}</h3>
      <PaymentForm
        applicationId={applicationId}
        locationId={locationId}
        cardTokenizeResponseReceived={async (token) => {
          if (token.status !== 'OK') {
            const errorMessage =
              token.status === 'Error' || token.status === 'Invalid'
                ? (token.errors?.[0] as { message?: string } | undefined)?.message
                : undefined;
            alert(errorMessage || 'No se pudo tokenizar el pago');
            return;
          }
          const res = await fetch('/api/square/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId: token.token, amountCents }),
          });
          const data = await res.json();
          if (!res.ok) {
            alert(data.error || 'Error procesando el pago');
            return;
          }
          onSuccess(data.paymentId);
        }}
      >
        <CreditCard buttonProps={{ css: { backgroundColor: '#00e5ff', color: '#001a2c', fontWeight: 'bold' } }} />
      </PaymentForm>
    </div>
  );
}
