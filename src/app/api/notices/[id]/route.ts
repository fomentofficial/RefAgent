import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { getSessionToken, validateSession } from '@/lib/session';

// GET - 부고장 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/notices/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - 부고장 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate session
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { valid, noticeId } = await validateSession(sessionToken);
    if (!valid || noticeId !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
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
    } = body;

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('notices')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notice:', error);
      return NextResponse.json(
        { error: 'Failed to update notice' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Notice updated successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/notices/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 부고장 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate session
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { valid, noticeId } = await validateSession(sessionToken);
    if (!valid || noticeId !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getServiceSupabase();

    // Soft delete - set is_active to false
    const { error } = await supabase
      .from('notices')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting notice:', error);
      return NextResponse.json(
        { error: 'Failed to delete notice' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Notice deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/notices/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
