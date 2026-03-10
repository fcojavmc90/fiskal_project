import { GetParametersCommand, SSMClient } from "@aws-sdk/client-ssm";

type ChimeConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  lambdaUrl: string;
  fromEnv: boolean;
  fromSsm: boolean;
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

const ssmNames = () => {
  const prefix = process.env.CHIME_SSM_PREFIX || "/fiskal/chime/";
  return {
    accessKeyId: process.env.CHIME_SSM_PARAM_ACCESS_KEY_ID || `${prefix}access_key_id`,
    secretAccessKey: process.env.CHIME_SSM_PARAM_SECRET_ACCESS_KEY || `${prefix}secret_access_key`,
    region: process.env.CHIME_SSM_PARAM_REGION || `${prefix}region`,
    lambdaUrl: process.env.CHIME_SSM_PARAM_LAMBDA_URL || `${prefix}lambda_url`,
  };
};

export async function getChimeConfig(): Promise<ChimeConfig> {
  if (cached && Date.now() - cached.ts < CACHE_MS) return cached.value;

  const env = readEnv();
  let region = env.region;
  let accessKeyId = env.accessKeyId;
  let secretAccessKey = env.secretAccessKey;
  let lambdaUrl = env.lambdaUrl;
  let fromEnv = Boolean(accessKeyId || secretAccessKey || lambdaUrl);
  let fromSsm = false;

  const needSsm =
    !accessKeyId ||
    !secretAccessKey ||
    !lambdaUrl ||
    (!env.region && Boolean(process.env.AWS_REGION) === false);

  if (needSsm) {
    try {
      const names = ssmNames();
      const toFetch: string[] = [];
      if (!accessKeyId) toFetch.push(names.accessKeyId);
      if (!secretAccessKey) toFetch.push(names.secretAccessKey);
      if (!lambdaUrl) toFetch.push(names.lambdaUrl);
      if (!env.region) toFetch.push(names.region);

      if (toFetch.length > 0) {
        const ssm = new SSMClient({ region });
        const resp = await ssm.send(new GetParametersCommand({ Names: toFetch, WithDecryption: true }));
        const map = new Map((resp.Parameters || []).map(p => [p.Name || "", p.Value || ""]));
        if (!accessKeyId) accessKeyId = map.get(names.accessKeyId) || "";
        if (!secretAccessKey) secretAccessKey = map.get(names.secretAccessKey) || "";
        if (!lambdaUrl) lambdaUrl = map.get(names.lambdaUrl) || "";
        if (!env.region) region = map.get(names.region) || region;
        fromSsm = Boolean(accessKeyId || secretAccessKey || lambdaUrl || map.get(names.region));
      }
    } catch {
      // Swallow SSM errors to allow env-only usage.
    }
  }

  const value = { region, accessKeyId, secretAccessKey, lambdaUrl, fromEnv, fromSsm };
  cached = { value, ts: Date.now() };
  return value;
}
