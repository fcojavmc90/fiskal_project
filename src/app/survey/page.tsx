'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function SurveyPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    targetCountry: '', // Miami/USA, México, etc.
    noticeNumber: '',  // CP2000, CP14... [cite: 253]
    agency: '',        // IRS, Florida... [cite: 254]
    deadline: '',      // Fecha límite 
    taxYear: '',       // Año fiscal [cite: 256]
    agreement: '',     // Acuerdo con monto [cite: 270]
    representation: '' // Deseo de CPA/EA 
  });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem('fiskal_survey_data', JSON.stringify(data));
      router.push('/match-results');
    }
  };

  return (
    <div style={{ background: '#001a2c', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: 'auto', background: '#003a57', padding: '30px', borderRadius: '15px' }}>
        {step === 0 && (
          <div>
            <h2>{lang === 'es' ? 'Paso 1: Jurisdicción y Urgencia' : 'Step 1: Jurisdiction & Urgency'}</h2>
            <label>¿En qué país necesitas la asesoría?</label>
            <select onChange={e => setData({...data, targetCountry: e.target.value})} style={{width:'100%', padding:'10px', marginBottom:'20px', color:'black'}}>
              <option value="">Selecciona...</option>
              <option value="USA">Estados Unidos (Miami/Global)</option>
              <option value="MEX">México</option>
              <option value="COL">Colombia</option>
              <option value="CHL">Chile</option>
            </select>
            <input placeholder="Número de carta (Ej: CP2000)" onChange={e => setData({...data, noticeNumber: e.target.value})} style={{width:'100%', padding:'10px', marginBottom:'10px', color:'black'}} />
          </div>
        )}
        
        {/* Aquí se añadirían el resto de fases: Análisis, Validación y Estrategia [cite: 258, 264, 274] */}

        <button onClick={next} style={{ width: '100%', padding: '15px', background: '#00ff88', color: '#00283d', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px' }}>
          {step === 3 ? t.nextBtn : (lang === 'es' ? 'Siguiente' : 'Next')}
        </button>
      </div>
    </div>
  );
}
