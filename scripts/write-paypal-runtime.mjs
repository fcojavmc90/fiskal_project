import fs from 'node:fs';
import path from 'node:path';

const clientId = process.env.FISKAL_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.FISKAL_PAYPAL_CLIENT_SECRET || process.env.PAYPAL_CLIENT_SECRET || '';
const env = process.env.FISKAL_PAYPAL_ENV || process.env.PAYPAL_ENV || 'sandbox';

const payload = { clientId, clientSecret, env };

const outDir = path.join(process.cwd(), '.next');
const outFile = path.join(outDir, 'paypal-runtime.json');

try {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload), 'utf8');
  console.log(`Wrote ${outFile}`);
} catch (err) {
  console.error('Failed to write paypal runtime config', err);
  process.exitCode = 1;
}
