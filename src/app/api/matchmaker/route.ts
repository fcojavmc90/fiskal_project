import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { surveyData, experts } = await req.json();
    
    // Filtro 1: Jurisdicción (Miami/USA es prioridad)
    let matches = experts.filter(e => e.country === surveyData.targetCountry);

    // Filtro 2: Gravedad (Si hay Notice of Deficiency o Court 90 days)
    if (surveyData.isUrgent || surveyData.noticeType === 'CP3219') {
      // Priorizar profesionales con especialidad TAX y licencia verificada
      matches = matches.sort((a, b) => (a.specialty === 'TAX' ? -1 : 1));
    }

    return NextResponse.json({ success: true, matches: matches.slice(0, 3) });
  } catch (error) {
    return NextResponse.json({ error: 'Match failed' }, { status: 500 });
  }
}
