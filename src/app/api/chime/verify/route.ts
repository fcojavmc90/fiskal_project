import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const accessKey = process.env.CHIME_AWS_ACCESS_KEY_ID || "";
  const secretKey = process.env.CHIME_AWS_SECRET_ACCESS_KEY || "";
  const region = process.env.CHIME_AWS_REGION || process.env.AWS_REGION || "";
  const lambdaUrl = process.env.CHIME_LAMBDA_URL || process.env.NEXT_PUBLIC_CHIME_LAMBDA_URL || "";

  return NextResponse.json({
    ok: true,
    hasAccessKey: Boolean(accessKey),
    hasSecretKey: Boolean(secretKey),
    hasRegion: Boolean(region),
    hasLambdaUrl: Boolean(lambdaUrl),
    lambdaUrlPrefix: lambdaUrl ? lambdaUrl.slice(0, 30) : "",
  });
}
