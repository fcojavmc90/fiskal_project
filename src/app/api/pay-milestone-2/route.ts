import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { v4 as uuidv4 } from 'uuid';

// Detectamos el entorno desde .env
const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production' 
  ? Environment.Production 
  : Environment.Sandbox;

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: squareEnv,
});

export async function POST(req: Request) {
  try {
    const { userEmail, caseId, amount, lang } = await req.json();
    
    const { result } = await client.checkoutApi.createPaymentLink({
      idempotencyKey: uuidv4(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [{
          name: lang === 'es' ? `FISKAL: Liquidación Caso ${caseId}` : `FISKAL: Case Settlement ${caseId}`,
          quantity: '1',
          basePriceMoney: { 
            amount: BigInt(Math.round(amount * 100)), 
            currency: 'USD' 
          }
        }],
        metadata: { userEmail, caseId, milestone: 'HITO_2' }
      }
    });

    return NextResponse.json({ url: result.paymentLink?.url });
  } catch (error: any) {
    console.error("Square Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
