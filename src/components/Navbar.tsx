'use client';
import { useState, useEffect } from 'react';
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserAttributes()
      .then(attr => setEmail(attr.email || ''))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    window.location.reload();
  };

  return (
    <nav style={{ background: '#001a2c', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #003a57' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: '#00e5ff', margin: 0, letterSpacing: '2px' }}>FISKAL</h2>
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          style={{ background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {lang.toUpperCase()}
        </button>
        
        {email ? (
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <Link href="/" style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}
