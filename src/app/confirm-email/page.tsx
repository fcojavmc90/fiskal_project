'use client';
import { useState, Suspense } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';

function ConfirmContent() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || '';

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      alert("Verification successful! Role assigned.");
      window.location.href = '/'; 
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <div style={{ background: '#003a57', padding: '40px', borderRadius: '15px', textAlign: 'center', width: '380px' }}>
        <h2 style={{ color: '#00e5ff' }}>Verify Your Account</h2>
        <input type="text" placeholder="Enter 6-digit code" onChange={e => setCode(e.target.value)} style={{ width: '100%', padding: '15px', margin: '20px 0', borderRadius: '8px', textAlign: 'center', fontSize: '20px', color: 'black' }} />
        <button onClick={handleVerify} disabled={loading} style={{ width: '100%', padding: '15px', background: '#00ff88', color: '#00283d', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'CONFIRMING...' : 'CONFIRM & LOGIN'}
        </button>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return <Suspense fallback={null}><ConfirmContent /></Suspense>;
}
