import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { ChimeSDKMeetingsClient, CreateAttendeeCommand, CreateMeetingCommand } from "@aws-sdk/client-chime-sdk-meetings";
import { getChimeConfig } from "../../../lib/chimeConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function shortId(id: string, max: number) {
  if (!id) return id;
  return id.length <= max ? id : id.slice(0, max);
}

export async function POST(req: Request) {
  let lambdaStatus: number | undefined;
  let lambdaBody: string | undefined;
  try {
    const config = await getChimeConfig();
    const REGION = config.region || "us-east-1";
    const ACCESS_KEY_ID = config.accessKeyId || "";
    const SECRET_ACCESS_KEY = config.secretAccessKey || "";
    const FORCE_SDK = process.env.CHIME_FORCE_SDK === "true";
    const USE_LAMBDA = process.env.CHIME_USE_LAMBDA === "true";
    const DEFAULT_LAMBDA_URL = "https://qxi6j7zrocm4zeu34a3awjjn5q0garmg.lambda-url.us-east-1.on.aws/";
    const CHIME_LAMBDA_URL = config.lambdaUrl || DEFAULT_LAMBDA_URL;
    const { appointmentId, clientOwner, proOwner } = await req.json();
    if (!appointmentId || !clientOwner || !proOwner) {
      return NextResponse.json({ error: "Missing appointment data" }, { status: 400 });
    }

    const hasExplicitCreds = Boolean(ACCESS_KEY_ID && SECRET_ACCESS_KEY);
    // track Lambda failure details for diagnostics if SDK fallback fails

    if (USE_LAMBDA && CHIME_LAMBDA_URL && !FORCE_SDK) {
      const lambdaRes = await fetch(CHIME_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, clientOwner, proOwner }),
      });
      const lambdaText = await lambdaRes.text();
      lambdaStatus = lambdaRes.status;
      lambdaBody = lambdaText?.slice(0, 500) || "";
      const lambdaJson = (() => {
        try {
          return JSON.parse(lambdaText);
        } catch {
          return null;
        }
      })();
      if (lambdaRes.ok) {
        return NextResponse.json(lambdaJson ?? { ok: true }, { status: lambdaRes.status });
      }
    }

    const client = new ChimeSDKMeetingsClient({
      region: REGION,
      ...(hasExplicitCreds
        ? {
            credentials: {
              accessKeyId: ACCESS_KEY_ID,
              secretAccessKey: SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });

    const meetingRes = await client.send(
      new CreateMeetingCommand({
        ClientRequestToken: crypto.randomUUID(),
        ExternalMeetingId: shortId(appointmentId, 64),
        MediaRegion: REGION,
      })
    );

    const meetingId = meetingRes.Meeting?.MeetingId;
    const meetingRegion = meetingRes.Meeting?.MediaRegion || REGION;
    if (!meetingId) {
      return NextResponse.json({ error: "No meeting id returned" }, { status: 500 });
    }

    const clientAttendee = await client.send(
      new CreateAttendeeCommand({
        MeetingId: meetingId,
        ExternalUserId: shortId(`client-${clientOwner}`, 64),
      })
    );
    const proAttendee = await client.send(
      new CreateAttendeeCommand({
        MeetingId: meetingId,
        ExternalUserId: shortId(`pro-${proOwner}`, 64),
      })
    );

    return NextResponse.json({
      meetingId,
      meetingRegion,
      meetingData: meetingRes.Meeting || null,
      clientAttendeeId: clientAttendee.Attendee?.AttendeeId || "",
      proAttendeeId: proAttendee.Attendee?.AttendeeId || "",
      clientJoinToken: clientAttendee.Attendee?.JoinToken || "",
      proJoinToken: proAttendee.Attendee?.JoinToken || "",
    });
  } catch (err: any) {
    const config = await getChimeConfig();
    return NextResponse.json(
      {
        error: err?.message || "Chime error",
        hasAccessKey: Boolean(config.accessKeyId),
        hasSecretKey: Boolean(config.secretAccessKey),
        hasRegion: Boolean(config.region),
        lambdaStatus,
        lambdaBody,
      },
      { status: 500 }
    );
  }
}
