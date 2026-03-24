import { NextResponse } from 'next/server';
import { formatAmount, getPayPalAccessToken, getPayPalBaseUrl } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { amountCents, description } = await req.json();
    if (!amountCents || amountCents <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const token = await getPayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: description || 'Servicio FISKAL',
            amount: {
              currency_code: 'USD',
              value: formatAmount(Number(amountCents)),
            },
          },
        ],
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Status code: ${res.status}\nBody: ${JSON.stringify(body, null, 2)}` }, { status: 500 });
    }

    return NextResponse.json({ orderId: body.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
