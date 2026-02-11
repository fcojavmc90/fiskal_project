import { NextResponse } from 'next/server';
import { listPaymentsBySquareId, updatePayment } from '../../../../lib/graphqlClient';
import { PaymentStatus } from '../../../../API';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.type === 'payment.updated' && body.data.object.payment.status === 'COMPLETED') {
      const paymentId = body.data.object.payment.id;
      const orderId = body.data.object.payment.order_id;
      const candidates = await listPaymentsBySquareId(paymentId);
      const byOrder = orderId ? await listPaymentsBySquareId(orderId) : [];
      const targets = [...candidates, ...byOrder];
      for (const p of targets) {
        await updatePayment({ id: p.id, status: PaymentStatus.PAID, squarePaymentId: paymentId });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 400 });
  }
}
