import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

/**
 * Ensures a Supabase session exists so RLS policies have an auth.uid() to scope to,
 * without ever showing the user a login screen. Never throws: a student with no
 * connectivity (or before the "allow anonymous sign-ins" toggle is enabled on the
 * project) must keep using the app entirely off the local Zustand store.
 */
export async function ensureAnonymousSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('ensureAnonymousSession: getSession failed', error);
      return null;
    }
    if (data.session) {
      return data.session;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      console.error('ensureAnonymousSession: signInAnonymously failed', signInError);
      return null;
    }
    return signInData.session;
  } catch (err) {
    console.error('ensureAnonymousSession: unexpected error', err);
    return null;
  }
}
