import { NextResponse } from 'next/server';
import { formatAmount, getPayPalAccessToken, getPayPalBaseUrl } from '../../../../lib/paypal';
import { getPaymentById, getPaymentByIdWithToken, updatePaymentWithToken } from '../../../../lib/graphqlClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const authToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const { amountCents, description, paymentId, plan } = await req.json();

    let resolvedAmountCents: number | null = null;
    let resolvedCurrency = 'USD';
    let resolvedDescription = description || 'Servicio FISKAL';

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
        if (payment.status === 'PAID') {
          return NextResponse.json({ error: 'Pago ya completado' }, { status: 400 });
        }
        resolvedAmountCents = Number(payment.amountCents || 0);
        resolvedCurrency = payment.currency || 'USD';
        resolvedDescription = description || 'Pago de servicio';
      } else if (amountCents && amountCents > 0) {
        // Fallback for client-side payments when auth isn't available.
        resolvedAmountCents = amountCents;
        resolvedCurrency = 'USD';
        resolvedDescription = description || 'Pago de servicio';
      } else {
        return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
      }
    }
    if (!resolvedAmountCents && plan === 'UNLOCK_150') {
      resolvedAmountCents = 15000;
      resolvedCurrency = 'USD';
      resolvedDescription = description || 'Pago inicial para abrir agenda';
    } else if (!resolvedAmountCents && amountCents && amountCents > 0) {
      resolvedAmountCents = amountCents;
      resolvedCurrency = 'USD';
      resolvedDescription = description || 'Pago de servicio';
    }

    if (!resolvedAmountCents || resolvedAmountCents <= 0) {
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
            description: resolvedDescription,
            amount: {
              currency_code: resolvedCurrency,
              value: formatAmount(Number(resolvedAmountCents)),
            },
          },
        ],
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Status code: ${res.status}\nBody: ${JSON.stringify(body, null, 2)}` }, { status: 500 });
    }

    const orderId = body?.id || '';
    if (paymentId && orderId && authToken) {
      try {
        await updatePaymentWithToken({ id: paymentId, paypalOrderId: orderId }, authToken);
      } catch {}
    }
    return NextResponse.json({ orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
