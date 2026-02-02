'use client';
import { useState, useEffect } from 'react';
import { signIn, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BridgePage() {
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const { t, lang } = useLanguage();
  const [f, setF] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función de Redirección según el State Machine del Masterprompt
  const handleRouting = async () => {
    try {
      const attributes = await fetchUserAttributes();
      const role = attributes['custom:role'];

      if (role === 'PRO') {
        router.push('/expert-dashboard');
      } else {
        // Lógica de estados para CLIENT
        const surveyData = localStorage.getItem('fiskal_survey_data');
        const isPaid = localStorage.getItem('fiskal_hito_1_paid'); // Se activa vía Webhook

        if (!surveyData) {
          router.push('/survey');
        } else if (!isPaid) {
          router.push('/match-results');
        } else {
          router.push('/dashboard-client');
        }
      }
    } catch (error) {
      console.error("Routing error:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ username: f.email, password: f.password });
      await handleRouting();
    } catch (error: any) {
      alert(lang === 'es' ? "Error de acceso: Credenciales inválidas" : "Login error: Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '20px' }}>
      <button 
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')} 
        style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {lang.toUpperCase()}
      </button>

      <div style={{ background: '#003a57', padding: '45px', borderRadius: '20px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <h1 style={{ color: '#00e5ff', fontSize: '36px', marginBottom: '10px', letterSpacing: '4px', fontWeight: '900' }}>FISKAL</h1>
        <p style={{ color: '#b0bec5', marginBottom: '30px', fontSize: '14px' }}>{t.loginTitle}</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder={t.email} 
            onChange={e => setF({...f, email: e.target.value})} 
            style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: 'none', background: '#001a2c', color: 'white', outline: '1px solid #003a57' }} 
            required 
          />
          <input 
            type="password" 
            placeholder={t.password} 
            onChange={e => setF({...f, password: e.target.value})} 
            style={{ width: '100%', padding: '14px', marginBottom: '30px', borderRadius: '10px', border: 'none', background: '#001a2c', color: 'white', outline: '1px solid #003a57' }} 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '16px', background: '#00ff88', color: '#00283d', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}
          >
            {loading ? '...' : t.loginBtn}
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '1px solid #00283d', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#b0bec5' }}>
            {lang === 'es' ? '¿No tienes cuenta?' : 'New here?'} 
            <Link href="/register" style={{ color: '#00e5ff', textDecoration: 'none', marginLeft: '8px', fontWeight: 'bold' }}>
              {lang === 'es' ? 'Regístrate' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
