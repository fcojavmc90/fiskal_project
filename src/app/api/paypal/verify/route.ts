import { NextResponse } from 'next/server';
import { getPayPalAccessToken, getPayPalBaseUrl } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const token = await getPayPalAccessToken();
    return NextResponse.json({
      ok: true,
      env: process.env.PAYPAL_ENV || 'sandbox',
      tokenPresent: Boolean(token),
      tokenPrefix: token.slice(0, 6),
      baseUrl: getPayPalBaseUrl(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        env: process.env.PAYPAL_ENV || 'sandbox',
        tokenPresent: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
        tokenPrefix: '',
        error: error?.message || 'Error',
      },
      { status: 500 }
    );
  }
}
