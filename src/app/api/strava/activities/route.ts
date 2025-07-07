import { NextRequest, NextResponse } from 'next/server';
import { stravaAPI } from '@/lib/strava';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('access_token');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '30';
  const after = searchParams.get('after');
  const before = searchParams.get('before');

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token required' }, { status: 401 });
  }

  try {
    const activities = await stravaAPI.getActivities(
      accessToken,
      parseInt(page),
      parseInt(perPage),
      after ? parseInt(after) : undefined,
      before ? parseInt(before) : undefined
    );

    return NextResponse.json({ activities });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    console.error('Strava activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, challengeType, target, timeframe } = body;

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const verification = await stravaAPI.verifyChallengeCompletion(
      accessToken,
      challengeType,
      target,
      timeframe
    );

    return NextResponse.json(verification);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    console.error('Challenge verification error:', error);
    return NextResponse.json({ error: 'Failed to verify challenge' }, { status: 500 });
  }
}