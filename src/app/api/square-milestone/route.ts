import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox, // Cambiar a Production al lanzar
});

export async function POST(req: Request) {
  try {
    const { amount, milestoneType, clientEmail, caseId } = await req.json();

    const response = await client.checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [{
          name: `FISKAL Milestone: ${milestoneType}`,
          quantity: '1',
          basePriceMoney: { amount: BigInt(amount), currency: 'USD' }
        }],
        metadata: { caseId, milestoneType, clientEmail }
      },
      checkoutOptions: { redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` }
    });

    return NextResponse.json({ url: response.result.paymentLink?.url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
