import { Client, Environment } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN, // Configúralo en la consola de AWS
  environment: Environment.Sandbox,
});

export const handler = async (event) => {
  const { sourceId } = JSON.parse(event.body);

  try {
    const { result } = await client.paymentsApi.createPayment({
      sourceId: sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: 15000, // 150.00 USD en centavos
        currency: 'USD',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, payment: result.payment }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
