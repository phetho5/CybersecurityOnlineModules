import { awardBadge, mergeBadgeIds, mergeModuleProgress, pullRemoteState, recordQuizAttempt, upsertModuleProgress } from '@/lib/sync';

describe('mergeModuleProgress (pure merge logic)', () => {
  it('returns an empty object when both sides are empty', () => {
    expect(mergeModuleProgress({}, {})).toEqual({});
  });

  it('keeps local-only modules untouched when remote has nothing yet (first sync)', () => {
    expect(mergeModuleProgress({ '01': 60 }, {})).toEqual({ '01': 60 });
  });

  it('adopts remote-only modules the local device never saw (progress made on another device)', () => {
    expect(mergeModuleProgress({}, { '01': 100 })).toEqual({ '01': 100 });
  });

  it('takes the higher value when local and remote disagree, never regressing progress', () => {
    expect(mergeModuleProgress({ '01': 40 }, { '01': 100 })).toEqual({ '01': 100 });
    expect(mergeModuleProgress({ '01': 100 }, { '01': 40 })).toEqual({ '01': 100 });
  });

  it('clamps out-of-range remote values instead of trusting corrupted/tampered data', () => {
    expect(mergeModuleProgress({ '01': 0 }, { '01': 150 })).toEqual({ '01': 100 });
    expect(mergeModuleProgress({ '01': 0 }, { '01': -20 })).toEqual({ '01': 0 });
  });

  it('merges disjoint module sets from both sides', () => {
    expect(mergeModuleProgress({ '01': 60, '02': 40 }, { '02': 100, '03': 20 })).toEqual({
      '01': 60,
      '02': 100,
      '03': 20,
    });
  });
});

describe('mergeBadgeIds (pure merge logic)', () => {
  it('returns an empty list when both sides are empty', () => {
    expect(mergeBadgeIds([], [])).toEqual([]);
  });

  it('unions badges earned on either side without duplicates', () => {
    expect(mergeBadgeIds(['scam-spotter'], ['popia-aware'])).toEqual(['scam-spotter', 'popia-aware']);
  });

  it('dedupes a badge present on both sides', () => {
    expect(mergeBadgeIds(['scam-spotter'], ['scam-spotter'])).toEqual(['scam-spotter']);
  });

  it('dedupes repeats within a single side', () => {
    expect(mergeBadgeIds(['scam-spotter', 'scam-spotter'], [])).toEqual(['scam-spotter']);
  });
});

const mockUpsert = jest.fn();
const mockInsert = jest.fn();
const mockEq = jest.fn();
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn((_table: string) => ({ upsert: mockUpsert, insert: mockInsert, select: mockSelect }));

jest.mock('@/lib/supabase', () => ({
  supabase: { from: (table: string) => mockFrom(table) },
}));

describe('upsertModuleProgress', () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockUpsert.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('does nothing and reports failure when there is no signed-in user', async () => {
    const result = await upsertModuleProgress(null, '01', 60);
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range progress value before ever calling Supabase', async () => {
    const result = await upsertModuleProgress('user-1', '01', 150);
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('upserts scoped to the current user on success', async () => {
    mockUpsert.mockResolvedValue({ error: null });
    const result = await upsertModuleProgress('user-1', '01', 60);
    expect(result.ok).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith('module_progress');
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', module_id: '01', progress: 60 }),
      expect.objectContaining({ onConflict: 'user_id,module_id' })
    );
  });

  it('reports failure instead of throwing when the network/Supabase call errors', async () => {
    mockUpsert.mockResolvedValue({ error: { message: 'network down' } });
    const result = await upsertModuleProgress('user-1', '01', 60);
    expect(result.ok).toBe(false);
  });

  it('reports failure instead of throwing when the call itself rejects', async () => {
    mockUpsert.mockRejectedValue(new Error('offline'));
    const result = await upsertModuleProgress('user-1', '01', 60);
    expect(result.ok).toBe(false);
  });
});

describe('awardBadge', () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockUpsert.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('does nothing when there is no signed-in user', async () => {
    const result = await awardBadge(null, 'scam-spotter');
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('rejects a missing/empty badge id before calling Supabase', async () => {
    const result = await awardBadge('user-1', '');
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('upserts with duplicate-award protection so re-earning the same badge is a no-op, not an error', async () => {
    mockUpsert.mockResolvedValue({ error: null });
    const result = await awardBadge('user-1', 'scam-spotter');
    expect(result.ok).toBe(true);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', badge_id: 'scam-spotter' }),
      expect.objectContaining({ onConflict: 'user_id,badge_id', ignoreDuplicates: true })
    );
  });
});

describe('recordQuizAttempt', () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockInsert.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('does nothing when there is no signed-in user (assessment still completes locally)', async () => {
    const result = await recordQuizAttempt(null, '01', 80, true);
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range score before calling Supabase', async () => {
    const result = await recordQuizAttempt('user-1', '01', 140, true);
    expect(result.ok).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('inserts a row scoped to the current user on success', async () => {
    mockInsert.mockResolvedValue({ error: null });
    const result = await recordQuizAttempt('user-1', '01', 80, true);
    expect(result.ok).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', module_id: '01', score: 80, passed: true })
    );
  });

  it('reports failure instead of throwing when the insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'network down' } });
    const result = await recordQuizAttempt('user-1', '01', 80, true);
    expect(result.ok).toBe(false);
  });
});

describe('pullRemoteState', () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockEq.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('returns null without querying when there is no signed-in user', async () => {
    const result = await pullRemoteState(null);
    expect(result).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('returns empty collections for a brand-new user with no remote rows yet', async () => {
    mockEq.mockResolvedValue({ data: [], error: null });
    const result = await pullRemoteState('user-1');
    expect(result).toEqual({ moduleProgress: {}, badgeIds: [] });
  });

  it('shapes rows from both tables into the expected local state', async () => {
    mockEq
      .mockResolvedValueOnce({ data: [{ module_id: '01', progress: 60 }], error: null })
      .mockResolvedValueOnce({ data: [{ badge_id: 'scam-spotter' }], error: null });
    const result = await pullRemoteState('user-1');
    expect(result).toEqual({ moduleProgress: { '01': 60 }, badgeIds: ['scam-spotter'] });
  });

  it('returns null (graceful offline fallback) instead of throwing when a query errors', async () => {
    mockEq.mockResolvedValue({ data: null, error: { message: 'network down' } });
    const result = await pullRemoteState('user-1');
    expect(result).toBeNull();
  });

  it('returns null instead of throwing when the query itself rejects', async () => {
    mockEq.mockRejectedValue(new Error('offline'));
    const result = await pullRemoteState('user-1');
    expect(result).toBeNull();
  });
});
