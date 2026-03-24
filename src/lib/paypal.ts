const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';
const PROD_BASE = 'https://api-m.paypal.com';

export function getPayPalBaseUrl() {
  const isProd = (process.env.PAYPAL_ENV || 'sandbox') === 'production';
  return isProd ? PROD_BASE : SANDBOX_BASE;
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) {
    throw new Error('Faltan credenciales de PayPal');
  }
  const baseUrl = getPayPalBaseUrl();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Token error: ${res.status} ${JSON.stringify(body)}`);
  }
  return body.access_token as string;
}

export function formatAmount(amountCents: number) {
  const dollars = Math.max(0, amountCents) / 100;
  return dollars.toFixed(2);
}
