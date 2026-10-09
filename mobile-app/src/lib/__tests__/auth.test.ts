import { ensureAnonymousSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInAnonymously: jest.fn(),
    },
  },
}));

const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockSignInAnonymously = supabase.auth.signInAnonymously as jest.Mock;

describe('ensureAnonymousSession', () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockSignInAnonymously.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the existing session without signing in again', async () => {
    const existingSession = { user: { id: 'existing-user' } };
    mockGetSession.mockResolvedValue({ data: { session: existingSession }, error: null });

    const session = await ensureAnonymousSession();

    expect(session).toBe(existingSession);
    expect(mockSignInAnonymously).not.toHaveBeenCalled();
  });

  it('signs in anonymously when there is no session yet', async () => {
    const newSession = { user: { id: 'new-anon-user' } };
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSignInAnonymously.mockResolvedValue({ data: { session: newSession, user: newSession.user }, error: null });

    const session = await ensureAnonymousSession();

    expect(mockSignInAnonymously).toHaveBeenCalledTimes(1);
    expect(session).toBe(newSession);
  });

  it('returns null instead of throwing when getSession fails (e.g. offline)', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: { message: 'network error' } });

    const session = await ensureAnonymousSession();

    expect(session).toBeNull();
    expect(mockSignInAnonymously).not.toHaveBeenCalled();
  });

  it('returns null instead of throwing when signInAnonymously fails (e.g. anonymous sign-ins disabled)', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSignInAnonymously.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Anonymous sign-ins are disabled' },
    });

    const session = await ensureAnonymousSession();

    expect(session).toBeNull();
  });

  it('returns null instead of throwing when getSession itself rejects', async () => {
    mockGetSession.mockRejectedValue(new Error('network down'));

    const session = await ensureAnonymousSession();

    expect(session).toBeNull();
  });
});
