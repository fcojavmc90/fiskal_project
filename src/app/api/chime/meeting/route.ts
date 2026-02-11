import { NextResponse } from "next/server";
import { ChimeSDKMeetingsClient, CreateAttendeeCommand, CreateMeetingCommand } from "@aws-sdk/client-chime-sdk-meetings";

const REGION = process.env.AWS_REGION || "us-east-1";

function shortId(id: string, max: number) {
  if (!id) return id;
  return id.length <= max ? id : id.slice(0, max);
}

export async function POST(req: Request) {
  try {
    const { appointmentId, clientOwner, proOwner } = await req.json();
    if (!appointmentId || !clientOwner || !proOwner) {
      return NextResponse.json({ error: "Missing appointment data" }, { status: 400 });
    }

    const client = new ChimeSDKMeetingsClient({ region: REGION });

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
