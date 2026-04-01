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

export async function verifyPayPalWebhook(headers: Headers, webhookEvent: unknown) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';
  if (!webhookId) {
    throw new Error('Falta PAYPAL_WEBHOOK_ID');
  }

  const transmissionId = headers.get('paypal-transmission-id') || '';
  const transmissionTime = headers.get('paypal-transmission-time') || '';
  const transmissionSig = headers.get('paypal-transmission-sig') || '';
  const certUrl = headers.get('paypal-cert-url') || '';
  const authAlgo = headers.get('paypal-auth-algo') || '';

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    return false;
  }

  const token = await getPayPalAccessToken();
  const baseUrl = getPayPalBaseUrl();

  const res = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Webhook verify error: ${res.status} ${JSON.stringify(body)}`);
  }
  return body?.verification_status === 'SUCCESS';
}
