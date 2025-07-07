import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: 'production',
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    supabaseKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
      : 'undefined',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'undefined',
    vercelUrl: process.env.VERCEL_URL || 'undefined',
  });
}