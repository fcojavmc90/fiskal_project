type ChimeConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  lambdaUrl: string;
  fromEnv: boolean;
};

const CACHE_MS = 5 * 60 * 1000;
let cached: { value: ChimeConfig; ts: number } | null = null;

const readEnv = () => {
  const region = process.env.CHIME_AWS_REGION || process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.CHIME_AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.CHIME_AWS_SECRET_ACCESS_KEY || "";
  const lambdaUrl = process.env.CHIME_LAMBDA_URL || process.env.NEXT_PUBLIC_CHIME_LAMBDA_URL || "";
  return { region, accessKeyId, secretAccessKey, lambdaUrl };
};

export async function getChimeConfig(): Promise<ChimeConfig> {
  if (cached && Date.now() - cached.ts < CACHE_MS) return cached.value;

  const env = readEnv();
  let region = env.region;
  let accessKeyId = env.accessKeyId;
  let secretAccessKey = env.secretAccessKey;
  let lambdaUrl = env.lambdaUrl;
  let fromEnv = Boolean(accessKeyId || secretAccessKey || lambdaUrl);

  const value = { region, accessKeyId, secretAccessKey, lambdaUrl, fromEnv };
  cached = { value, ts: Date.now() };
  return value;
}
