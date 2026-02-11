import { NextResponse } from 'next/server';
const SANDBOX_BASE = 'https://connect.squareupsandbox.com';
const PROD_BASE = 'https://connect.squareup.com';

export async function POST(req: Request) {
  try {
    const { amountCents, note } = await req.json();
    if (!amountCents) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const isProd = (process.env.SQUARE_ENV || 'sandbox') === 'production';
    const baseUrl = isProd ? PROD_BASE : SANDBOX_BASE;
    const token = process.env.SQUARE_ACCESS_TOKEN || '';
    const tokenPresent = Boolean(token);
    const locationId = process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
    const locationPresent = Boolean(locationId);
    console.log('[square.checkout] env:', process.env.SQUARE_ENV || 'sandbox', 'tokenPresent:', tokenPresent, 'locationPresent:', locationPresent);

    const res = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: locationId,
          line_items: [
            {
              name: note || 'Servicio FISKAL',
              quantity: '1',
              base_price_money: { amount: amountCents, currency: 'USD' },
            },
          ],
        },
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Status code: ${res.status}\nBody: ${JSON.stringify(body, null, 2)}` }, { status: 500 });
    }
    const url = body?.payment_link?.url ?? '';
    const id = body?.payment_link?.id ?? '';
    return NextResponse.json({ url, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
