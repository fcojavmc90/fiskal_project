"use client";
import React, { useEffect, useState } from 'react';
import { fetchUserAttributes, getCurrentUser, signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    firstName: '',
    lastName: '',
    email: '', 
    password: '', 
    confirm: '', 
    role: 'CLIENT', 
    country: 'US', 
    state: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    const guard = async () => {
      try {
        const user = await getCurrentUser();
        const attr = await fetchUserAttributes();
        const roleRaw = attr['custom:role'];
        const role = roleRaw === 'PRO' ? 'PRO' : 'CLIENT';
        if (user) {
          router.replace(role === 'PRO' ? '/expert-dashboard' : '/dashboard-client');
        }
      } catch {
        // No autenticado, se queda en registro
      }
    };
    guard();
  }, [router]);

  const countryOptions = [
    { value: 'US', label: 'Estados Unidos (US)' },
    { value: 'MX', label: 'México (MX)' },
    { value: 'CA', label: 'Canadá (CA)' },
    { value: 'CO', label: 'Colombia (CO)' },
    { value: 'AR', label: 'Argentina (AR)' },
    { value: 'CL', label: 'Chile (CL)' },
    { value: 'PE', label: 'Perú (PE)' },
    { value: 'ES', label: 'España (ES)' },
  ];

  const usStateOptions = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Las contraseñas no coinciden");

    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            given_name: form.firstName,
            family_name: form.lastName,
            phone_number: form.phone,
            'custom:role': form.role,
            'custom:country': form.country,
            'custom:phone': form.phone,
            'custom:description': form.description
          }
        }
      });
      localStorage.setItem('pendingEmail', form.email);
      alert("Registro exitoso. Revisa tu correo para confirmar.");
      router.push(`/confirm-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="fk-page">
      <form onSubmit={handleSignUp} className="fk-card" style={{ maxWidth: '460px' }}>
        <h2 className="fk-title">Registro FISKAL</h2>

        <label className="fk-label">Correo Electrónico</label>
        <input className="fk-input" type="email" placeholder="ejemplo@correo.com" onChange={e => setForm({...form, email: e.target.value})} required />

        <label className="fk-label">Nombre</label>
        <input className="fk-input" type="text" placeholder="Nombre" onChange={e => setForm({...form, firstName: e.target.value})} required />

        <label className="fk-label">Apellido</label>
        <input className="fk-input" type="text" placeholder="Apellido" onChange={e => setForm({...form, lastName: e.target.value})} required />

        <label className="fk-label">Contraseña</label>
        <input className="fk-input" type="password" placeholder="********" onChange={e => setForm({...form, password: e.target.value})} required />

        <label className="fk-label">Confirmar Contraseña</label>
        <input className="fk-input" type="password" placeholder="********" onChange={e => setForm({...form, confirm: e.target.value})} required />

        <label className="fk-label">Tipo de Perfil</label>
        <select className="fk-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="CLIENT">Cliente (Busco defensa fiscal)</option>
          <option value="PRO">Profesional (Soy experto/CPA)</option>
        </select>

        {form.role === 'PRO' && (
          <>
            <label className="fk-label">Descripción Profesional</label>
            <textarea className="fk-textarea" placeholder="Cuéntanos tu experiencia y servicios" onChange={e => setForm({...form, description: e.target.value})} rows={3} />
          </>
        )}

        <label className="fk-label">País</label>
        <select
          className="fk-select"
          value={form.country}
          onChange={e => {
            const nextCountry = e.target.value;
            setForm({ ...form, country: nextCountry, state: nextCountry === 'US' ? form.state : '' });
          }}
        >
          {countryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label className="fk-label">Estado (si aplica)</label>
        <select
          className="fk-select"
          value={form.state}
          onChange={e => setForm({ ...form, state: e.target.value })}
          disabled={form.country !== 'US'}
        >
          <option value="">Selecciona un estado</option>
          {usStateOptions.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <label className="fk-label">Teléfono</label>
        <input className="fk-input" type="text" placeholder="+1..." onChange={e => setForm({...form, phone: e.target.value})} required />

        <button type="submit" className="fk-btn">Crear Cuenta Ahora</button>
        <div className="fk-link-row">
          <Link className="fk-link" href="/">Ya tengo cuenta</Link>
        </div>
      </form>
    </div>
  );
}
