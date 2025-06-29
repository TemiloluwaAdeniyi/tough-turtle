import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { distance, userId } = await request.json();
    if (!userId || !distance) {
      return NextResponse.json({ error: 'Missing userId or distance' }, { status: 400 });
    }
    const { data: user } = await supabase
      .from('users')
      .select('xp, stage')
      .eq('id', userId)
      .single();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const newXp = user.xp + distance;
    const newStage = newXp >= 51 ? 'Spry Snapper' : 'Tiny Hatchling';
    await supabase
      .from('users')
      .update({ xp: newXp, stage: newStage })
      .eq('id', userId);
    const { data: challenge } = await supabase
      .from('challenges')
      .select('progress, completed')
      .eq('user_id', userId)
      .eq('name', 'Sprint to Spry Snapper')
      .single();
    if (challenge) {
      const newProgress = challenge.progress + distance;
      const completed = newProgress >= 5;
      await supabase
        .from('challenges')
        .update({ progress: newProgress, completed })
        .eq('user_id', userId)
        .eq('name', 'Sprint to Spry Snapper');
    }
    return NextResponse.json({ xp: newXp, stage: newStage });
  } catch (error) {
    console.error('Error in activities:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}