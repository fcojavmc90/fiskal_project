import { NextResponse } from 'next/server';
import { saveTokensFromCode } from '../../../../../lib/googleMeet';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    await saveTokensFromCode(code);
    return NextResponse.redirect(new URL('/expert-dashboard?oauth=ok', url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'OAuth error' }, { status: 500 });
  }
}
