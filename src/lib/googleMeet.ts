import fs from 'fs';
import path from 'path';

const TOKEN_PATH = process.env.GOOGLE_TOKEN_FILE || path.join(process.cwd(), '.google_tokens.json');

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export function getOAuthStartUrl(loginHint?: string) {
  const clientId = getEnv('GOOGLE_CLIENT_ID');
  const redirectUri = getEnv('GOOGLE_REDIRECT_URI');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar',
    access_type: 'offline',
    prompt: 'consent select_account',
  });
  if (loginHint) {
    params.set('login_hint', loginHint);
  }
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function saveTokensFromCode(code: string) {
  const clientId = getEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');
  const redirectUri = getEnv('GOOGLE_REDIRECT_URI');

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OAuth token error');

  const toSave = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
    scope: data.scope,
    token_type: data.token_type,
  };

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(toSave, null, 2), { encoding: 'utf-8' });
  return toSave;
}

function readTokens() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const raw = fs.readFileSync(TOKEN_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function refreshAccessToken(refreshToken: string) {
  const clientId = getEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Refresh token error');

  const tokens = readTokens() || {};
  const updated = {
    ...tokens,
    access_token: data.access_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2), { encoding: 'utf-8' });
  return updated;
}

export async function getValidAccessToken() {
  const tokens = readTokens();
  if (!tokens?.refresh_token) throw new Error('OAuth not connected');
  if (tokens.access_token && tokens.expiry_date && tokens.expiry_date > Date.now() + 60000) {
    return tokens.access_token as string;
  }
  const refreshed = await refreshAccessToken(tokens.refresh_token);
  return refreshed.access_token as string;
}

export async function createMeetEvent(params: {
  summary: string;
  description?: string;
  start: string;
  end: string;
  attendeeEmails?: string[];
}) {
  const accessToken = await getValidAccessToken();
  const body = {
    summary: params.summary,
    description: params.description,
    start: { dateTime: params.start },
    end: { dateTime: params.end },
    attendees: (params.attendeeEmails || []).map(email => ({ email })),
    conferenceData: {
      createRequest: { requestId: crypto.randomUUID() },
    },
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Calendar create error');
  return {
    meetLink: data.hangoutLink || data.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri || '',
    eventId: data.id,
  };
}
