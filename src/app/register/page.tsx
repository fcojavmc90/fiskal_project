'use client';
import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const [f, setF] = useState({ email: '', password: '', role: 'CLIENT', country: '', phone: '' });
  const [specs, setSpecs] = useState<string[]>([]); // Array para múltiples especialidades
  
  const toggleSpec = (s: string) => {
    setSpecs(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username: f.email,
        password: f.password,
        options: { 
          userAttributes: { 
            email: f.email,
            'custom:role': f.role,
            'custom:specialty': f.role === 'PRO' ? specs.join(',') : 'NONE',
            'custom:country': f.country
          } 
        }
      });
      window.location.href = '/confirm-email';
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <form onSubmit={handleRegister} style={{ background: '#003a57', padding: '30px', borderRadius: '15px', width: '350px' }}>
        <h2>{t.registerTitle}</h2>
        <select onChange={e => setF({...f, role: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          <option value="CLIENT">CLIENTE</option>
          <option value="PRO">PROFESIONAL</option>
        </select>

        {f.role === 'PRO' && (
          <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            {['TAX', 'LEGAL', 'ACCOUNT', 'AUDIT'].map(s => (
              <label key={s} style={{ fontSize: '12px' }}>
                <input type="checkbox" onChange={() => toggleSpec(s)} /> {s}
              </label>
            ))}
          </div>
        )}
        
        <input type="email" placeholder="Email" onChange={e => setF({...f, email: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} required />
        <input type="password" placeholder="Password" onChange={e => setF({...f, password: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '20px' }} required />
        <button style={{ width: '100%', padding: '10px', background: '#00ff88', border: 'none', fontWeight: 'bold' }}>{t.registerBtn}</button>
      </form>
    </div>
  );
}
