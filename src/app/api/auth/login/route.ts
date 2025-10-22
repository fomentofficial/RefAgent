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
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: '전화번호와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Normalize phone number
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhoneNumber(phone);
    } catch (error) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Find credentials by phone number
    const { data: credentials, error: credError } = await supabase
      .from('notice_credentials')
      .select('*')
      .eq('phone_e164', normalizedPhone)
      .maybeSingle();

    if (credError || !credentials) {
      return NextResponse.json(
        { error: '등록된 부고장을 찾을 수 없습니다.' },
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
        { error: '계정이 잠금되었습니다. 잠시 후 다시 시도해주세요.' },
        { status: 403 }
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
        .eq('notice_id', credentials.notice_id);

      return NextResponse.json(
        {
          error: '비밀번호가 일치하지 않습니다.',
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
      .eq('notice_id', credentials.notice_id);

    // Create session
    const sessionToken = await createSession(credentials.notice_id);
    await setSessionCookie(sessionToken);

    return NextResponse.json(
      {
        message: 'Login successful',
        noticeId: credentials.notice_id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
