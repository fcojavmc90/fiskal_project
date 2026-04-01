const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';
const PROD_BASE = 'https://api-m.paypal.com';
const RUNTIME_CONFIG_PATHS = (() => {
  try {
    const path = require('node:path');
    const cwd = process.cwd();
    return [
      path.join(cwd, 'paypal-runtime.json'),
      path.join(cwd, '.next', 'paypal-runtime.json'),
    ];
  } catch {
    return [] as string[];
  }
})();

function readRuntimeConfig(): { clientId?: string; clientSecret?: string; env?: string } | null {
  try {
    if (!RUNTIME_CONFIG_PATHS.length) return null;
    const fs = require('node:fs');
    for (const p of RUNTIME_CONFIG_PATHS) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        return JSON.parse(raw);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function getPayPalBaseUrl() {
  const runtime = readRuntimeConfig();
  const env = runtime?.env || process.env.FISKAL_PAYPAL_ENV || process.env.PAYPAL_ENV || 'sandbox';
  const isProd = env === 'production';
  return isProd ? PROD_BASE : SANDBOX_BASE;
}

export async function getPayPalAccessToken() {
  const runtime = readRuntimeConfig();
  const clientId = runtime?.clientId || process.env.FISKAL_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = runtime?.clientSecret || process.env.FISKAL_PAYPAL_CLIENT_SECRET || process.env.PAYPAL_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) {
    const env = runtime?.env || process.env.FISKAL_PAYPAL_ENV || process.env.PAYPAL_ENV || 'unset';
    const flags = `clientId=${clientId ? '1' : '0'} clientSecret=${clientSecret ? '1' : '0'} env=${env}`;
    throw new Error(`Faltan credenciales de PayPal (${flags})`);
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
