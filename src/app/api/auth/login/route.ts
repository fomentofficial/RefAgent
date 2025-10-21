import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import {
  verifyPassword,
  normalizePhoneNumber,
  isAccountLocked,
  getLockoutEndTime,
} from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noticeId, phone, password } = body;

    if (!noticeId || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Normalize phone number
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhoneNumber(phone);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Get credentials
    const { data: credentials, error: credError } = await supabase
      .from('notice_credentials')
      .select('*')
      .eq('notice_id', noticeId)
      .single();

    if (credError || !credentials) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (
      isAccountLocked(
        credentials.login_attempts || 0,
        credentials.locked_until
      )
    ) {
      return NextResponse.json(
        { error: 'Account is locked. Please try again later.' },
        { status: 403 }
      );
    }

    // Verify phone number
    if (credentials.phone_e164 !== normalizedPhone) {
      // Increment login attempts
      await supabase
        .from('notice_credentials')
        .update({
          login_attempts: (credentials.login_attempts || 0) + 1,
        })
        .eq('notice_id', noticeId);

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      credentials.password_hash
    );

    if (!isPasswordValid) {
      const newAttempts = (credentials.login_attempts || 0) + 1;
      const updateData: any = { login_attempts: newAttempts };

      // Lock account if too many attempts
      if (newAttempts >= 5) {
        updateData.locked_until = getLockoutEndTime().toISOString();
      }

      await supabase
        .from('notice_credentials')
        .update(updateData)
        .eq('notice_id', noticeId);

      return NextResponse.json(
        {
          error: 'Invalid credentials',
          attemptsRemaining: Math.max(0, 5 - newAttempts),
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    await supabase
      .from('notice_credentials')
      .update({
        login_attempts: 0,
        locked_until: null,
      })
      .eq('notice_id', noticeId);

    // Create session
    const sessionToken = await createSession(noticeId);
    await setSessionCookie(sessionToken);

    return NextResponse.json(
      { message: 'Login successful', noticeId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
