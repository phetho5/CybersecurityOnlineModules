import { getSupabaseAuthOptions } from '@/lib/supabase';

describe('getSupabaseAuthOptions', () => {
  it('enables session persistence and auto-refresh in a real browser/native runtime', () => {
    const options = getSupabaseAuthOptions(true);
    expect(options.persistSession).toBe(true);
    expect(options.autoRefreshToken).toBe(true);
  });

  it('disables session persistence and auto-refresh when there is no window (SSR/Node render)', () => {
    // Expo Router's web output renders the app once on the Node server (no `window`/`localStorage`)
    // before hydrating in the browser. GoTrueClient eagerly self-initializes on construction and
    // reads from storage as soon as persistSession is true, which previously crashed the SSR render
    // with "ReferenceError: window is not defined" the first time this module was ever imported.
    const options = getSupabaseAuthOptions(false);
    expect(options.persistSession).toBe(false);
    expect(options.autoRefreshToken).toBe(false);
  });

  it('always keeps detectSessionInUrl off (this app never receives an OAuth redirect)', () => {
    expect(getSupabaseAuthOptions(true).detectSessionInUrl).toBe(false);
    expect(getSupabaseAuthOptions(false).detectSessionInUrl).toBe(false);
  });
});
