import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          xp: number
          stage: string
          skin: string
          skin_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          xp?: number
          stage?: string
          skin?: string
          skin_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          xp?: number
          stage?: string
          skin?: string
          skin_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          type: 'exercise' | 'sleep' | 'biohacking'
          subtype: string
          value: number
          unit: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'exercise' | 'sleep' | 'biohacking'
          subtype: string
          value: number
          unit: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'exercise' | 'sleep' | 'biohacking'
          subtype?: string
          value?: number
          unit?: string
          notes?: string | null
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'cardio' | 'sleep' | 'strength' | 'hydration' | 'meditation'
          target: number
          progress: number
          unit: string
          completed: boolean
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'cardio' | 'sleep' | 'strength' | 'hydration' | 'meditation'
          target: number
          progress?: number
          unit: string
          completed?: boolean
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'cardio' | 'sleep' | 'strength' | 'hydration' | 'meditation'
          target?: number
          progress?: number
          unit?: string
          completed?: boolean
          streak?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);