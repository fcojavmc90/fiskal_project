"use client";
import React, { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession, fetchUserAttributes, signIn, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { createProfessionalProfile, createUserProfile, getProfessionalProfileByOwner, getUserProfileByOwner } from '../lib/graphqlClient';
import { ProType, UserRole } from '../API';
import Link from 'next/link';
import { isAuthBypassed } from '../lib/authBypass';
import { ensureAmplifyConfigured } from '../lib/amplifyClient';
import { clearPendingProfile, loadPendingProfile, normalizeRole, roleFromUserProfile } from '../lib/profileBootstrap';

export default function HomePage() {
  ensureAmplifyConfigured();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    if (isAuthBypassed()) {
      setLoading(false);
      return;
    }
    try {
      const user = await getCurrentUser();
      const attr = await fetchUserAttributes();
      const sub = attr.sub ?? user.userId;
      const pending = loadPendingProfile();
      const roleFromAttr = normalizeRole(attr['custom:role']);
      const firstName = attr.given_name ?? attr['custom:firstName'] ?? pending?.firstName ?? '';
      const lastName = attr.family_name ?? attr['custom:lastName'] ?? pending?.lastName ?? '';
      const email = attr.email ?? pending?.email ?? '';
      let resolvedRole: 'PRO' | 'CLIENT' = roleFromAttr ?? pending?.role ?? 'CLIENT';

      if (sub) {
        try {
          const existing = await getUserProfileByOwner(sub);
          const roleFromProfile = roleFromUserProfile(existing);
          const role = roleFromProfile ?? roleFromAttr ?? pending?.role ?? 'CLIENT';
          resolvedRole = role;
          if (!existing) {
            await createUserProfile({
              owner: sub,
              role: role === 'PRO' ? UserRole.PRO : UserRole.CLIENT,
              email,
              firstName,
              lastName,
            });
          }
          if (pending) {
            clearPendingProfile();
          }
        } catch (err) {
          console.warn('UserProfile create skipped:', err);
        }

        if (resolvedRole === 'PRO') {
          try {
            const displayName = lastName ? `${firstName} ${lastName[0].toUpperCase()}.` : firstName;
            const existingPro = await getProfessionalProfileByOwner(sub);
            if (!existingPro) {
              await createProfessionalProfile({
                owner: sub,
                proType: ProType.TAX,
                displayName: displayName || 'Profesional',
                bio: attr['custom:description'] ?? pending?.description ?? 'Especialista fiscal.',
                ratingAvg: 0,
                ratingCount: 0,
                isActive: true,
              });
            }
          } catch (err) {
            console.warn('ProfessionalProfile create skipped:', err);
          }
        }
      }

      const roleCookie = resolvedRole === 'PRO' ? 'professional' : 'client';
      document.cookie = `fk_role=${roleCookie}; path=/`;
      const surveyDone = localStorage.getItem('fiskal_survey_completed') === 'true';
      const paidInitial = localStorage.getItem('fiskal_paid_initial') === 'true';
      document.cookie = `fk_has_survey=${surveyDone ? '1' : '0'}; path=/`;
      document.cookie = `fk_paid_initial=${paidInitial ? '1' : '0'}; path=/`;

      if (typeof window !== 'undefined') {
        const target = resolvedRole === 'PRO' ? '/expert-dashboard' : '/dashboard-client';
        window.location.assign(target);
      } else {
        if (resolvedRole === 'PRO') router.push('/expert-dashboard');
        else router.push('/dashboard-client');
      }
    } catch (err: any) {
      const msg = err?.message || err?.toString?.() || 'Error desconocido en sesión.';
      console.warn('checkAuthState failed:', err);
      if (!msg.includes('User needs to be authenticated to call this API.')) {
        setError(msg);
      }
      setLoading(false);
    }
  }

  async function waitForAuthReady(retries = 6, delayMs = 250) {
    for (let attempt = 0; attempt < retries; attempt += 1) {
      try {
        await fetchAuthSession({ forceRefresh: true });
        await getCurrentUser();
        return;
      } catch (err) {
        if (attempt === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);
    try {
      if (typeof window !== 'undefined') {
        document.cookie = 'fk_has_survey=0; path=/; SameSite=Lax';
      }
      // Clear any stale session that triggers "already a signed in user"
      try {
        await signOut();
      } catch {
        // ignore if there is no active session
      }
      const signInResult = await signIn({ username: email.trim(), password });
      if (signInResult?.isSignedIn) {
        await waitForAuthReady();
        await checkAuthState();
      } else {
        const step = signInResult?.nextStep?.signInStep;
        setError(step ? `Se requiere paso adicional: ${step}` : 'No se pudo completar el inicio de sesión.');
      }
    } catch (err: any) {
      setError(err?.message || 'No se pudo iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return <div style={{background:'#001a2c', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#00e5ff'}}>Iniciando FISKAL Core v3.0...</div>;
  return (
    <main className="fk-page">
      <div className="fk-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img
            src="/fiskal-logo.png"
            alt="Fiskal Solutions"
            width={180}
            height={54}
            style={{
              width: '180px',
              height: 'auto',
              objectFit: 'contain',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: '12px',
              padding: '8px 10px',
              boxShadow: '0 0 12px rgba(255,255,255,0.15)',
            }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset.fallback) return;
              target.dataset.fallback = '1';
              target.src = '/brand/fiskal-logo.png';
            }}
          />
        </div>
        <h1 className="fk-title">Iniciar Sesión</h1>
        {error && <div className="fk-error">{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label className="fk-label">Correo</label>
          <input className="fk-input" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="fk-label">Contraseña</label>
          <input className="fk-input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="fk-btn" type="submit" disabled={authLoading}>{authLoading ? 'Ingresando...' : 'Entrar'}</button>
        </form>
        <div className="fk-link-row">
          <Link className="fk-link" href="/register">Crear cuenta</Link>
        </div>
      </div>
    </main>
  );
}
