import { NextResponse } from "next/server";
import { ChimeSDKMeetingsClient, CreateAttendeeCommand, CreateMeetingCommand } from "@aws-sdk/client-chime-sdk-meetings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function shortId(id: string, max: number) {
  if (!id) return id;
  return id.length <= max ? id : id.slice(0, max);
}

export async function POST(req: Request) {
  try {
    const REGION = process.env.CHIME_AWS_REGION || process.env.AWS_REGION || "us-east-1";
    const ACCESS_KEY_ID = process.env.CHIME_AWS_ACCESS_KEY_ID || "";
    const SECRET_ACCESS_KEY = process.env.CHIME_AWS_SECRET_ACCESS_KEY || "";
    const DEFAULT_LAMBDA_URL = "https://qxi6j7zrocm4zeu34a3awjjn5q0garmg.lambda-url.us-east-1.on.aws/";
    const CHIME_LAMBDA_URL =
      process.env.CHIME_LAMBDA_URL ||
      process.env.NEXT_PUBLIC_CHIME_LAMBDA_URL ||
      DEFAULT_LAMBDA_URL;
    const { appointmentId, clientOwner, proOwner } = await req.json();
    if (!appointmentId || !clientOwner || !proOwner) {
      return NextResponse.json({ error: "Missing appointment data" }, { status: 400 });
    }

    if (CHIME_LAMBDA_URL) {
      const lambdaRes = await fetch(CHIME_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, clientOwner, proOwner }),
      });
      const lambdaJson = await lambdaRes.json().catch(() => ({}));
      if (!lambdaRes.ok) {
        return NextResponse.json(
          { error: lambdaJson?.error || "Chime lambda error", usingLambda: true, hasLambdaUrl: true },
          { status: lambdaRes.status }
        );
      }
      return NextResponse.json(lambdaJson, { status: lambdaRes.status });
    }

    if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      return NextResponse.json(
        {
          error: "Missing Chime credentials",
          usingLambda: false,
          hasLambdaUrl: Boolean(CHIME_LAMBDA_URL),
          hasAccessKey: Boolean(ACCESS_KEY_ID),
          hasSecretKey: Boolean(SECRET_ACCESS_KEY),
          hasRegion: Boolean(REGION),
        },
        { status: 500 }
      );
    }

    const client = new ChimeSDKMeetingsClient({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
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
    return NextResponse.json({ error: err?.message || "Chime error" }, { status: 500 });
  }
}
