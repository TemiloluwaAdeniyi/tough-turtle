import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  username: string;
  xp: number;
  stage: string;
  skin: string;
  skin_expiry: string | null;
}

export const auth = {
  async signUp(email: string, password: string, username: string) {
    try {
      console.log('Client: Attempting signup with:', { email, username });
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      console.log('Client: Signup successful');
      return result.data;
    } catch (error) {
      console.error('Client: Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error) throw error;
    return userData;
  },

  async updateUser(updates: Partial<User>) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', authData.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const user = await this.getUser();
          callback(user);
        } catch (error) {
          console.error('Error fetching user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};