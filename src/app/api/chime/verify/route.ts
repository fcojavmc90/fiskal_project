import { NextResponse } from "next/server";
import { getChimeConfig } from "../../../lib/chimeConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getChimeConfig();
  const accessKey = config.accessKeyId || "";
  const secretKey = config.secretAccessKey || "";
  const region = config.region || "";
  const lambdaUrl = config.lambdaUrl || "";

  return NextResponse.json({
    ok: true,
    hasAccessKey: Boolean(accessKey),
    hasSecretKey: Boolean(secretKey),
    hasRegion: Boolean(region),
    hasLambdaUrl: Boolean(lambdaUrl),
    lambdaUrlPrefix: lambdaUrl ? lambdaUrl.slice(0, 30) : "",
    usingSsm: config.fromSsm,
  });
}
