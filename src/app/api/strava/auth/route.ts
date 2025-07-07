import { NextRequest, NextResponse } from 'next/server';
import { stravaAPI } from '@/lib/strava';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/dashboard?strava_error=access_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?strava_error=no_code', request.url));
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/strava/auth`;
    const tokens = await stravaAPI.exchangeCodeForToken(code, redirectUri);
    
    // Get athlete info
    const athlete = await stravaAPI.getAthlete(tokens.access_token);

    // Store tokens in database (you'll need to implement this)
    // For now, we'll redirect with success and store in localStorage via URL params
    const params = new URLSearchParams({
      strava_success: 'true',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at.toString(),
      athlete_id: athlete.id.toString(),
      athlete_name: `${athlete.firstname} ${athlete.lastname}`,
    });

    return NextResponse.redirect(new URL(`/dashboard?${params.toString()}`, request.url));
  } catch (error) {
    console.error('Strava auth error:', error);
    return NextResponse.redirect(new URL('/dashboard?strava_error=auth_failed', request.url));
  }
}