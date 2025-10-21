import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { getServiceSupabase } from './supabase';

const SESSION_COOKIE_NAME = 'notice_session';
const SESSION_DURATION_DAYS = 30;

export async function createSession(noticeId: string): Promise<string> {
  const supabase = getServiceSupabase();
  const sessionToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const { error } = await supabase.from('owner_sessions').insert({
    notice_id: noticeId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error('Failed to create session');
  }

  return sessionToken;
}

export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function validateSession(
  sessionToken: string
): Promise<{ valid: boolean; noticeId?: string }> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('owner_sessions')
    .select('notice_id, expires_at')
    .eq('session_token', sessionToken)
    .single();

  if (error || !data) {
    return { valid: false };
  }

  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) {
    // Session expired, delete it
    await supabase
      .from('owner_sessions')
      .delete()
      .eq('session_token', sessionToken);
    return { valid: false };
  }

  return { valid: true, noticeId: data.notice_id };
}

export async function getSessionNoticeId(): Promise<string | null> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  const { valid, noticeId } = await validateSession(sessionToken);
  return valid && noticeId ? noticeId : null;
}
