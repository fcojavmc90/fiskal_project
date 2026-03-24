import { NextResponse } from 'next/server';
import { listPaymentsByPayPalId, updatePayment } from '../../../../lib/graphqlClient';
import { PaymentStatus } from '../../../../API';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body?.event_type || '';

    // Captura completada (sandbox/live)
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const captureId = body?.resource?.id || '';
      const orderId = body?.resource?.supplementary_data?.related_ids?.order_id || '';
      const candidates = captureId ? await listPaymentsByPayPalId(captureId) : [];
      const byOrder = orderId ? await listPaymentsByPayPalId(orderId) : [];
      const targets = [...candidates, ...byOrder];
      for (const p of targets) {
        await updatePayment({ id: p.id, status: PaymentStatus.PAID, paypalCaptureId: captureId || orderId });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 400 });
  }
}
