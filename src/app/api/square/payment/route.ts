import { NextResponse } from 'next/server';
const SANDBOX_BASE = 'https://connect.squareupsandbox.com';
const PROD_BASE = 'https://connect.squareup.com';

export async function POST(req: Request) {
  try {
    const { sourceId, amountCents } = await req.json();
    if (!sourceId || !amountCents) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const isProd = (process.env.SQUARE_ENV || 'sandbox') === 'production';
    const baseUrl = isProd ? PROD_BASE : SANDBOX_BASE;
    const token = process.env.SQUARE_ACCESS_TOKEN || '';
    const tokenPresent = Boolean(token);
    console.log('[square.payment] env:', process.env.SQUARE_ENV || 'sandbox', 'tokenPresent:', tokenPresent);

    const idempotencyKey = crypto.randomUUID();
    const res = await fetch(`${baseUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: { amount: amountCents, currency: 'USD' },
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Status code: ${res.status}\nBody: ${JSON.stringify(body, null, 2)}` }, { status: 500 });
    }
    const paymentId = body?.payment?.id ?? '';
    return NextResponse.json({ paymentId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
