"use client";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ensureAmplifyConfigured } from '../lib/amplifyClient';

ensureAmplifyConfigured();

export default function AuthForm({ onBack }: any) {
  return (
    <div style={{ minHeight: '100vh', background: '#001a2c', padding: '20px' }}>
      <button onClick={onBack} style={{ color: '#00e5ff', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>← Volver</button>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px' }}>
        <Authenticator>
          {({ signOut, user }) => (
            <main>
              <h1 style={{ color: '#001a2c' }}>Bienvenido, {user?.username}</h1>
              <p style={{ color: '#666' }}>ID de Pool: us-east-1_yEsaEcYp9</p>
              <button onClick={signOut} style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px' }}>
                Cerrar Sesión
              </button>
            </main>
          )}
        </Authenticator>
      </div>
    </div>
  );
}
