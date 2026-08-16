import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
);

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Supabase initialization warning:', err);
  }
}

export const supabase = supabaseInstance;
