import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sleep_hours, mood, userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    await supabase
      .from('wellness')
      .insert({ user_id: userId, sleep_hours, mood });
    if (sleep_hours >= 8) {
      const { data: user } = await supabase
        .from('users')
        .select('xp, stage')
        .eq('id', userId)
        .single();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const newXp = user.xp + 5;
      const newStage = newXp >= 51 ? 'Spry Snapper' : 'Tiny Hatchling';
      await supabase
        .from('users')
        .update({ xp: newXp, stage: newStage })
        .eq('id', userId);
      return NextResponse.json({ xp: newXp, stage: newStage });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in wellness:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}