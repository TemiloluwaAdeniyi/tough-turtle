import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    console.log('API: Attempting signup with:', { email, username });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    console.log('API: Supabase signup response:', { data, error });

    if (error) {
      console.error('API: Supabase auth error:', error);
      return NextResponse.json(
        { error: `Authentication failed: ${error.message}` },
        { status: 400 }
      );
    }

    if (data.user) {
      console.log('API: Creating user profile...');
      const { error: profileError } = await supabaseAdmin.from('users').insert({
        id: data.user.id,
        username,
        xp: 0,
        stage: 'Batchling Hatchling',
        skin: 'default',
      });

      if (profileError) {
        console.error('API: Profile creation error:', profileError);
        return NextResponse.json(
          { error: `Profile creation failed: ${profileError.message}` },
          { status: 400 }
        );
      }
      
      console.log('API: User profile created successfully');
    }

    // Small delay to ensure profile is fully created
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API: Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}