import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { v4 as uuidv4 } from 'uuid';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export async function POST(req: Request) {
  try {
    const { userEmail, expertName } = await req.json();

    const { result } = await client.checkoutApi.createPaymentLink({
      idempotencyKey: uuidv4(),
      checkoutOptions: {
        redirectUrl: window?.location?.origin + '/dashboard-client', // Redirección tras pago
      },
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            name: `Apertura de Agenda - ${expertName}`,
            quantity: '1',
            basePriceMoney: { amount: BigInt(15000), currency: 'USD' }, // 150.00 USD
          },
        ],
        // Metadatos críticos para el Webhook
        referenceId: `SURVEY-${Date.now()}`,
        metadata: { userEmail }
      },
    });

    return NextResponse.json({ url: result.paymentLink?.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
