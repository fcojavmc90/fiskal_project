import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Ensure server-set cookie so middleware sees it reliably.
  res.cookies.set('fk_has_survey', '1', {
    path: '/',
    sameSite: 'lax',
  });
  return res;
}
