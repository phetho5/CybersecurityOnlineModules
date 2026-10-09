import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  );
}

/**
 * Expo Router's web output renders once on the Node server (no `window`/`localStorage`) before
 * hydrating in the browser. Supabase's auth client self-initializes on construction and reads
 * from storage as soon as persistSession is true, which crashes that server-side render with
 * "ReferenceError: window is not defined" — so persistence/auto-refresh only make sense once a
 * real window exists (browser or native runtime) to actually hold a session in.
 */
export function getSupabaseAuthOptions(isBrowser: boolean): NonNullable<SupabaseClientOptions<'public'>['auth']> {
  return {
    storage: AsyncStorage,
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
    detectSessionInUrl: false,
  };
}

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: getSupabaseAuthOptions(isBrowser),
});
