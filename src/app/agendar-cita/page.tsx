'use client';
import { useEffect, useState } from 'react';

export default function Appointment() {
  const [status, setStatus] = useState('Loading secure payment...');
  
  useEffect(() => {
    const sc = document.createElement('script');
    sc.src = "https://sandbox.web.squarecdn.com/v1/payments.js";
    sc.onload = async () => {
      const p = window.Square.payments('sandbox-sq0idb-0vpxO9DI4fovGop38KLDgQ', 'LRP7MT91QBTDP');
      const c = await p.card();
      await c.attach('#card-container');
      setStatus('Ready to pay 50.00 USD');
    };
    document.body.appendChild(sc);
  }, []);

  return (
    <div style={{ backgroundColor: '#001a2c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ background: '#003a57', padding: '40px', borderRadius: '25px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ color: '#00e5ff', marginBottom: '30px' }}>Book Your Consultation</h2>
        <div id="card-container" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}></div>
        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>{status}</p>
        <button style={{ width: '100%', padding: '18px', background: '#00e5ff', color: '#00283d', fontWeight: 'bold', border: 'none', borderRadius: '8px', marginTop: '20px', fontSize: '16px' }}>
          CONFIRM & PAY 50
        </button>
      </div>
    </div>
  );
}
