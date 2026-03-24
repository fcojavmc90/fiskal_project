import { NextResponse } from 'next/server';
import { getPayPalAccessToken, getPayPalBaseUrl } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Falta orderId' }, { status: 400 });
    }

    const token = await getPayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Status code: ${res.status}\nBody: ${JSON.stringify(body, null, 2)}` }, { status: 500 });
    }

    const captureId = body?.purchase_units?.[0]?.payments?.captures?.[0]?.id || '';
    return NextResponse.json({ captureId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
