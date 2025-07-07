export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  calories?: number;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  profile_medium: string;
  profile: string;
}

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class StravaAPI {
  private clientId: string;
  private clientSecret: string;
  private baseURL = 'https://www.strava.com/api/v3';

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID || '';
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET || '';
  }

  // Generate OAuth URL for user authorization
  getAuthorizationURL(redirectUri: string, scope: string = 'read,activity:read_all'): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      approval_prompt: 'force'
    });

    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  }

  // Make authenticated API request
  private async makeRequest<T>(endpoint: string, accessToken: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get athlete information
  async getAthlete(accessToken: string): Promise<StravaAthlete> {
    return this.makeRequest<StravaAthlete>('/athlete', accessToken);
  }

  // Get athlete activities
  async getActivities(
    accessToken: string,
    page: number = 1,
    perPage: number = 30,
    after?: number,
    before?: number
  ): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (after) {
      params.append('after', after.toString());
    }

    if (before) {
      params.append('before', before.toString());
    }

    return this.makeRequest<StravaActivity[]>(`/athlete/activities?${params.toString()}`, accessToken);
  }

  // Get specific activity
  async getActivity(activityId: number, accessToken: string): Promise<StravaActivity> {
    return this.makeRequest<StravaActivity>(`/activities/${activityId}`, accessToken);
  }

  // Get activities within date range
  async getActivitiesInDateRange(
    accessToken: string,
    startDate: Date,
    endDate: Date
  ): Promise<StravaActivity[]> {
    const after = Math.floor(startDate.getTime() / 1000);
    const before = Math.floor(endDate.getTime() / 1000);

    return this.getActivities(accessToken, 1, 200, after, before);
  }

  // Verify challenge completion based on Strava data
  async verifyChallengeCompletion(
    accessToken: string,
    challengeType: string,
    target: number,
    timeframe: 'today' | 'week' | 'month' = 'today'
  ): Promise<{ completed: boolean; progress: number; activities: StravaActivity[] }> {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const activities = await this.getActivitiesInDateRange(accessToken, startDate, now);
    
    let progress = 0;
    const relevantActivities: StravaActivity[] = [];

    switch (challengeType) {
      case 'distance':
        activities.forEach(activity => {
          if (this.isCardioActivity(activity.type)) {
            progress += activity.distance / 1000; // Convert to km
            relevantActivities.push(activity);
          }
        });
        break;

      case 'time':
        activities.forEach(activity => {
          if (this.isCardioActivity(activity.type)) {
            progress += activity.moving_time / 60; // Convert to minutes
            relevantActivities.push(activity);
          }
        });
        break;

      case 'elevation':
        activities.forEach(activity => {
          if (this.isCardioActivity(activity.type)) {
            progress += activity.total_elevation_gain;
            relevantActivities.push(activity);
          }
        });
        break;

      case 'calories':
        activities.forEach(activity => {
          if (activity.calories && this.isCardioActivity(activity.type)) {
            progress += activity.calories;
            relevantActivities.push(activity);
          }
        });
        break;

      case 'activities':
        relevantActivities.push(...activities.filter(activity => this.isCardioActivity(activity.type)));
        progress = relevantActivities.length;
        break;
    }

    return {
      completed: progress >= target,
      progress,
      activities: relevantActivities,
    };
  }

  // Check if activity type is cardio-related
  private isCardioActivity(type: string): boolean {
    const cardioTypes = [
      'Run',
      'Ride', 
      'Walk',
      'Hike',
      'Swim',
      'VirtualRide',
      'VirtualRun',
      'EBikeRide',
      'Elliptical',
      'StairStepper',
      'Rowing',
      'Crosstraining'
    ];
    return cardioTypes.includes(type);
  }

  // Get athlete stats summary
  async getAthleteStats(accessToken: string, athleteId: number): Promise<Record<string, unknown>> {
    return this.makeRequest(`/athletes/${athleteId}/stats`, accessToken);
  }
}

export const stravaAPI = new StravaAPI();