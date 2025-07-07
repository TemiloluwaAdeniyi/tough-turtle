import { NextRequest, NextResponse } from 'next/server';
import { stravaAPI } from '@/lib/strava';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    const tokens = await stravaAPI.refreshAccessToken(refreshToken);
    
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}