import { NextResponse } from 'next/server';
import { createMeetEvent } from '../../../../lib/googleMeet';

export async function POST(req: Request) {
  try {
    const { summary, description, start, end, attendeeEmails } = await req.json();
    if (!start || !end) return NextResponse.json({ error: 'Missing start/end' }, { status: 400 });
    const result = await createMeetEvent({ summary, description, start, end, attendeeEmails });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Meet error' }, { status: 500 });
  }
}
