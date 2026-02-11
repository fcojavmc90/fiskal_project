import { NextResponse } from 'next/server';
import { getOAuthStartUrl } from '../../../../lib/googleMeet';

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const loginHint = urlObj.searchParams.get('email') || undefined;
    const url = getOAuthStartUrl(loginHint);
    return NextResponse.redirect(url);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
