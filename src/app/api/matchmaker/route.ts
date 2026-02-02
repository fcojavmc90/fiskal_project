import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { surveyData, experts } = await req.json();
  
  // Filtrado por Jurisdicción y Urgencia (Fase 1 y 2 de la encuesta)
  let filtered = experts.filter(e => e.country === surveyData.targetCountry);
  
  // Si el cliente marcó "Notice of Deficiency" (Pregunta 14 de la encuesta)
  if (surveyData.hasDeficiency || surveyData.noticeType === '3219') {
    filtered = filtered.sort((a, b) => (a.specialty === 'TAX' ? -1 : 1));
  }

  return NextResponse.json(filtered);
}
