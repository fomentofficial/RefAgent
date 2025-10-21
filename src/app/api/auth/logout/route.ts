import { NextResponse } from 'next/server';
import { getSessionToken, clearSession } from '@/lib/session';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST() {
  try {
    const sessionToken = await getSessionToken();

    if (sessionToken) {
      // Delete session from database
      const supabase = getServiceSupabase();
      await supabase
        .from('owner_sessions')
        .delete()
        .eq('session_token', sessionToken);
    }

    // Clear session cookie
    await clearSession();

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
