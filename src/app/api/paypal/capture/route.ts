import { NextResponse } from 'next/server';
import { getPayPalAccessToken, getPayPalBaseUrl } from '../../../../lib/paypal';
import { getPaymentById, getPaymentByIdWithToken } from '../../../../lib/graphqlClient';
import { formatAmount } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const authToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const { orderId, paymentId, plan } = await req.json();
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

    const capture = body?.purchase_units?.[0]?.payments?.captures?.[0];
    const captureId = capture?.id || '';
    const capturedAmount = capture?.amount?.value || '';
    const capturedCurrency = capture?.amount?.currency_code || '';

    let expectedAmount = '';
    let expectedCurrency = 'USD';
    if (paymentId) {
      let payment: any = null;
      if (authToken) {
        try {
          payment = await getPaymentByIdWithToken(paymentId, authToken);
        } catch {}
      }
      if (!payment) {
        try {
          payment = await getPaymentById(paymentId);
        } catch {}
      }
      if (payment) {
        expectedAmount = formatAmount(Number(payment.amountCents || 0));
        expectedCurrency = payment.currency || 'USD';
      }
    }
    if (!expectedAmount && plan === 'UNLOCK_150') {
      expectedAmount = formatAmount(15000);
      expectedCurrency = 'USD';
    }

    if (expectedAmount && (capturedAmount !== expectedAmount || capturedCurrency !== expectedCurrency)) {
      return NextResponse.json({ error: 'Monto/currency no coincide con lo esperado' }, { status: 400 });
    }

    return NextResponse.json({ captureId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
