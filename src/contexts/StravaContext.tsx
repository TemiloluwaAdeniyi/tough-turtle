"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { stravaAPI, StravaActivity, StravaAthlete } from '@/lib/strava';

interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface StravaContextType {
  isConnected: boolean;
  athlete: StravaAthlete | null;
  tokens: StravaTokens | null;
  activities: StravaActivity[];
  loading: boolean;
  error: string | null;
  connectToStrava: () => void;
  disconnect: () => void;
  refreshActivities: () => Promise<void>;
  verifyChallenge: (challengeType: string, target: number, timeframe?: 'today' | 'week' | 'month') => Promise<{ completed: boolean; progress: number; activities: StravaActivity[] }>;
}

const StravaContext = createContext<StravaContextType | undefined>(undefined);

export function StravaProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);
  const [tokens, setTokens] = useState<StravaTokens | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load stored tokens from localStorage
    const storedTokens = localStorage.getItem('strava_tokens');
    const storedAthlete = localStorage.getItem('strava_athlete');
    
    if (storedTokens && storedAthlete) {
      const parsedTokens = JSON.parse(storedTokens);
      const parsedAthlete = JSON.parse(storedAthlete);
      
      // Check if token is still valid
      if (parsedTokens.expires_at > Date.now() / 1000) {
        setTokens(parsedTokens);
        setAthlete(parsedAthlete);
        setIsConnected(true);
      } else {
        // Try to refresh token
        refreshToken(parsedTokens.refresh_token);
      }
    }

    // Check for auth callback params
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('strava_success') === 'true') {
      const accessToken = urlParams.get('access_token');
      const refreshTokenParam = urlParams.get('refresh_token');
      const expiresAt = urlParams.get('expires_at');
      const athleteId = urlParams.get('athlete_id');
      const athleteName = urlParams.get('athlete_name');

      if (accessToken && refreshTokenParam && expiresAt && athleteId && athleteName) {
        const newTokens = {
          access_token: accessToken,
          refresh_token: refreshTokenParam,
          expires_at: parseInt(expiresAt),
        };

        const newAthlete = {
          id: parseInt(athleteId),
          firstname: athleteName.split(' ')[0] || '',
          lastname: athleteName.split(' ')[1] || '',
        } as StravaAthlete;

        setTokens(newTokens);
        setAthlete(newAthlete);
        setIsConnected(true);

        localStorage.setItem('strava_tokens', JSON.stringify(newTokens));
        localStorage.setItem('strava_athlete', JSON.stringify(newAthlete));

        // Clean up URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Handle auth errors
    const stravaError = urlParams.get('strava_error');
    if (stravaError) {
      setError(`Strava connection failed: ${stravaError}`);
      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const refreshToken = async (refreshTokenValue: string) => {
    try {
      const response = await fetch('/api/strava/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response.ok) {
        const newTokens = await response.json();
        setTokens(newTokens);
        localStorage.setItem('strava_tokens', JSON.stringify(newTokens));
        setIsConnected(true);
      } else {
        // Refresh failed, disconnect
        disconnect();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      disconnect();
    }
  };

  const connectToStrava = () => {
    const redirectUri = `${window.location.origin}/api/strava/auth`;
    const authUrl = stravaAPI.getAuthorizationURL(redirectUri);
    window.location.href = authUrl;
  };

  const disconnect = () => {
    setIsConnected(false);
    setAthlete(null);
    setTokens(null);
    setActivities([]);
    localStorage.removeItem('strava_tokens');
    localStorage.removeItem('strava_athlete');
  };

  const refreshActivities = async () => {
    if (!tokens) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/strava/activities?access_token=${tokens.access_token}&per_page=50`);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        await refreshToken(tokens.refresh_token);
        return refreshActivities();
      }

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const verifyChallenge = async (
    challengeType: string,
    target: number,
    timeframe: 'today' | 'week' | 'month' = 'today'
  ) => {
    if (!tokens) {
      throw new Error('Not connected to Strava');
    }

    const response = await fetch('/api/strava/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: tokens.access_token,
        challengeType,
        target,
        timeframe,
      }),
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await refreshToken(tokens.refresh_token);
      return verifyChallenge(challengeType, target, timeframe);
    }

    if (!response.ok) {
      throw new Error('Failed to verify challenge');
    }

    return response.json();
  };

  const value = {
    isConnected,
    athlete,
    tokens,
    activities,
    loading,
    error,
    connectToStrava,
    disconnect,
    refreshActivities,
    verifyChallenge,
  };

  return (
    <StravaContext.Provider value={value}>
      {children}
    </StravaContext.Provider>
  );
}

export function useStrava() {
  const context = useContext(StravaContext);
  if (context === undefined) {
    throw new Error('useStrava must be used within a StravaProvider');
  }
  return context;
}