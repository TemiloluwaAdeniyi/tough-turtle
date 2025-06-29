import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();
    if (!userId || !message) {
      return NextResponse.json({ error: 'Missing userId or message' }, { status: 400 });
    }
    await supabase
      .from('feed')
      .insert({ user_id: userId, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in feed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}