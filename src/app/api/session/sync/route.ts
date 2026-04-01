import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role = body?.role === 'professional' ? 'professional' : 'client';
    const hasSurvey = Boolean(body?.hasSurvey);
    const paidInitial = Boolean(body?.paidInitial);

    const res = NextResponse.json({ ok: true });
    res.cookies.set('fk_role', role, { path: '/', sameSite: 'lax' });
    res.cookies.set('fk_has_survey', hasSurvey ? '1' : '0', { path: '/', sameSite: 'lax' });
    res.cookies.set('fk_paid_initial', paidInitial ? '1' : '0', { path: '/', sameSite: 'lax' });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
