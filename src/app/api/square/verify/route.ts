import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const isProd = (process.env.SQUARE_ENV || 'sandbox') === 'production';
    const baseUrl = isProd ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com';
    const token = process.env.SQUARE_ACCESS_TOKEN || '';
    const res = await fetch(`${baseUrl}/v2/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const body = await res.json();
    const ids = Array.isArray(body?.locations) ? body.locations.map((l: any) => l.id) : [];

    return NextResponse.json({
      ok: true,
      env: process.env.SQUARE_ENV || 'sandbox',
      tokenPresent: Boolean(token),
      tokenPrefix: token.slice(0, 6),
      locationIds: ids,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        env: process.env.SQUARE_ENV || 'sandbox',
        tokenPresent: Boolean(process.env.SQUARE_ACCESS_TOKEN),
        tokenPrefix: (process.env.SQUARE_ACCESS_TOKEN || '').slice(0, 6),
        error: error?.message || 'Error',
      },
      { status: 500 }
    );
  }
}
