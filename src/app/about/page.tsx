"use client";

import React from 'react';
import Sidebar from '../../components/Sidebar';

export default function AboutPage() {
  return (
    <div style={{ display: 'flex', background: '#001a2c', minHeight: '100vh', color: 'white' }}>
      <Sidebar dashboardHref="/dashboard-client" />
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ color: '#00e5ff' }}>Quiénes somos</h1>
        <div style={{ background: '#003a57', padding: '20px', borderRadius: '12px', border: '1px solid #00e5ff', marginTop: '16px' }}>
          <p>
            En FISKAL Solutions acompañamos a clientes y profesionales con herramientas claras para gestionar casos,
            pagos y comunicación en un solo lugar. Este contenido puede ajustarse con tu descripción oficial.
          </p>
        </div>
      </div>
    </div>
  );
}
