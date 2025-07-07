import { supabase } from './supabase';
import { Database } from './supabase';

type Activity = Database['public']['Tables']['activities']['Row'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
type ActivityUpdate = Database['public']['Tables']['activities']['Update'];

export const activities = {
  async createActivity(activity: Omit<ActivityInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserActivities(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getActivitiesByType(userId: string, type: Activity['type'], limit = 20) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getActivitiesByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateActivity(id: string, updates: ActivityUpdate) {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteActivity(id: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getDailyStats(userId: string, date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('activities')
      .select('type, subtype, value, unit')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const stats = {
      exercise: { total: 0, activities: [] as Activity[] },
      sleep: { total: 0, activities: [] as Activity[] },
      biohacking: { total: 0, activities: [] as Activity[] },
    };

    data.forEach((activity) => {
      const activityType = activity.type as keyof typeof stats;
      stats[activityType].total += activity.value;
      stats[activityType].activities.push(activity as Activity);
    });

    return stats;
  },

  async getWeeklyStats(userId: string, startDate: string) {
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(start.getDate() + 7);

    const { data, error } = await supabase
      .from('activities')
      .select('type, subtype, value, unit, created_at')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const weeklyStats = {
      totalActivities: data.length,
      exerciseMinutes: 0,
      sleepHours: 0,
      biohackingSessions: 0,
    };

    data.forEach((activity) => {
      switch (activity.type) {
        case 'exercise':
          if (activity.unit === 'minutes') {
            weeklyStats.exerciseMinutes += activity.value;
          }
          break;
        case 'sleep':
          if (activity.unit === 'hours') {
            weeklyStats.sleepHours += activity.value;
          }
          break;
        case 'biohacking':
          weeklyStats.biohackingSessions += 1;
          break;
      }
    });

    return { ...weeklyStats, activities: data };
  },

  async logExercise(
    userId: string,
    subtype: string,
    value: number,
    unit: string,
    notes?: string
  ) {
    return this.createActivity({
      user_id: userId,
      type: 'exercise',
      subtype,
      value,
      unit,
      notes,
    });
  },

  async logSleep(
    userId: string,
    value: number,
    unit: string = 'hours',
    notes?: string
  ) {
    return this.createActivity({
      user_id: userId,
      type: 'sleep',
      subtype: 'sleep',
      value,
      unit,
      notes,
    });
  },

  async logBiohacking(
    userId: string,
    subtype: string,
    value: number,
    unit: string,
    notes?: string
  ) {
    return this.createActivity({
      user_id: userId,
      type: 'biohacking',
      subtype,
      value,
      unit,
      notes,
    });
  },
};