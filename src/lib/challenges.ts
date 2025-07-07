import { supabase } from './supabase';
import { Database } from './supabase';

type Challenge = Database['public']['Tables']['challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['challenges']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['challenges']['Update'];

export const challenges = {
  async getUserChallenges(userId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createChallenge(challenge: Omit<ChallengeInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('challenges')
      .insert(challenge)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChallenge(id: string, updates: ChallengeUpdate) {
    const { data, error } = await supabase
      .from('challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChallengeProgress(id: string, progress: number) {
    const { data: challenge, error: fetchError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const completed = progress >= challenge.target;
    const newStreak = completed && !challenge.completed ? challenge.streak + 1 : challenge.streak;

    const { data, error } = await supabase
      .from('challenges')
      .update({ 
        progress, 
        completed,
        streak: newStreak 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resetDailyChallenges(userId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .update({ 
        progress: 0, 
        completed: false 
      })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteChallenge(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getCompletedChallenges(userId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getChallengesByType(userId: string, type: Challenge['type']) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addProgressToChallenge(id: string, additionalProgress: number) {
    const { data: challenge, error: fetchError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newProgress = Math.min(challenge.progress + additionalProgress, challenge.target);
    return this.updateChallengeProgress(id, newProgress);
  },

  async getLeaderboard(limit = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('username, xp')
      .order('xp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async updateUserXP(userId: string, xpGain: number) {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('xp, stage')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newXp = user.xp + xpGain;
    const newStage = this.calculateStage(newXp);

    const { data, error } = await supabase
      .from('users')
      .update({ xp: newXp, stage: newStage })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  calculateStage(xp: number): string {
    if (xp >= 500) return 'Tough Turtle Titan';
    if (xp >= 300) return 'Shadow Shell';
    if (xp >= 150) return 'Shelless Seeker';
    if (xp >= 50) return 'Spry Snapper';
    return 'Batchling Hatchling';
  },

  getXPForChallengeCompletion(challengeType: Challenge['type']): number {
    const xpMap = {
      cardio: 25,
      strength: 30,
      sleep: 20,
      hydration: 15,
      meditation: 25,
    };
    return xpMap[challengeType] || 20;
  },
};