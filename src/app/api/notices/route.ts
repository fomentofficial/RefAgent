import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { hashPassword, normalizePhoneNumber, validatePassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      template_id,
      deceased_name,
      age,
      death_date,
      funeral_hall,
      room_number,
      burial_date,
      resting_place,
      host_name,
      contact,
      show_contact,
      account_bank,
      account_number,
      account_holder,
      show_account,
      message,
      phone,
      password,
    } = body;

    // Validate required fields
    if (!deceased_name || !death_date || !funeral_hall || !burial_date || !host_name || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
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
    const noticeId = uuidv4();

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert notice
    const { error: noticeError } = await supabase
      .from('notices')
      .insert({
        id: noticeId,
        template_id: template_id || 'classic',
        deceased_name,
        age: age ? parseInt(age) : null,
        death_date,
        funeral_hall,
        room_number,
        burial_date,
        resting_place,
        host_name,
        contact,
        show_contact: show_contact || false,
        account_bank,
        account_number,
        account_holder,
        show_account: show_account || false,
        message,
        is_active: true,
      });

    if (noticeError) {
      console.error('Error creating notice:', noticeError);
      return NextResponse.json(
        { error: 'Failed to create notice' },
        { status: 500 }
      );
    }

    // Insert credentials
    const { error: credError } = await supabase
      .from('notice_credentials')
      .insert({
        notice_id: noticeId,
        phone_e164: normalizedPhone,
        password_hash: passwordHash,
      });

    if (credError) {
      console.error('Error creating credentials:', credError);
      // Rollback notice creation
      await supabase.from('notices').delete().eq('id', noticeId);
      return NextResponse.json(
        { error: 'Failed to create credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { noticeId, message: 'Notice created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/notices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
