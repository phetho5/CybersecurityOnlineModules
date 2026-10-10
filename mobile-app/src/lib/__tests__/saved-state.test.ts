import { removeUnearnedProgress } from '@/lib/saved-state';

// What the very first build of the app saved on every phone: demo values, not anything a student did.
const SEEDED = {
  streak: 12,
  moduleProgress: { '01': 60, '02': 40, '03': 0, '04': 0, '05': 0 },
  earnedBadgeIds: ['scam-spotter', 'popia-aware'],
};

describe('removeUnearnedProgress', () => {
  it('clears the demo progress, badges and streak the first build saved on the phone', () => {
    const cleaned = removeUnearnedProgress(SEEDED);
    expect(cleaned.moduleProgress).toEqual({});
    expect(cleaned.earnedBadgeIds).toEqual([]);
    expect(cleaned.streak).toBe(0);
  });

  it('clears the extra badges later builds awarded on top of the demo values (the reported "4 badges, 33%")', () => {
    const cleaned = removeUnearnedProgress({
      ...SEEDED,
      streak: 1,
      lastActiveDate: '2026-10-10',
      earnedBadgeIds: ['scam-spotter', 'popia-aware', 'first-steps', 'streak-7'],
    });
    expect(cleaned.moduleProgress).toEqual({});
    expect(cleaned.earnedBadgeIds).toEqual([]);
    // A streak that was really counted is left alone.
    expect(cleaned.streak).toBe(1);
    expect(cleaned.lastActiveDate).toBe('2026-10-10');
  });

  it('keeps everything a student really earned', () => {
    const real = {
      streak: 3,
      lastActiveDate: '2026-10-10',
      moduleProgress: { '01': 100, '02': 100, '03': 100 },
      earnedBadgeIds: ['first-steps', 'popia-basics', 'scam-spotter', 'popia-aware', 'cyber-graduate'],
    };
    const cleaned = removeUnearnedProgress(real);
    expect(cleaned.moduleProgress).toEqual(real.moduleProgress);
    expect([...cleaned.earnedBadgeIds].sort()).toEqual([...real.earnedBadgeIds].sort());
    expect(cleaned.streak).toBe(3);
  });

  it('keeps real part-way progress: every value a finished lesson can produce', () => {
    const cleaned = removeUnearnedProgress({ moduleProgress: { '01': 34, '02': 45, '03': 50 }, earnedBadgeIds: ['first-steps'] });
    expect(cleaned.moduleProgress).toEqual({ '01': 34, '02': 45, '03': 50 });
    expect(cleaned.earnedBadgeIds).toEqual(['first-steps']);
  });

  it('keeps real progress in one module while clearing a demo value in another', () => {
    const cleaned = removeUnearnedProgress({ moduleProgress: { '01': 67, '02': 40 }, earnedBadgeIds: ['first-steps', 'scam-spotter'] });
    expect(cleaned.moduleProgress).toEqual({ '01': 67 });
    expect(cleaned.earnedBadgeIds).toEqual(['first-steps']);
  });

  it('drops an assessment badge whose module was never completed', () => {
    const cleaned = removeUnearnedProgress({ moduleProgress: { '02': 89 }, earnedBadgeIds: ['first-steps', 'scam-spotter'] });
    expect(cleaned.earnedBadgeIds).toEqual(['first-steps']);
  });

  it('drops a streak badge and streak that were never counted from a real day', () => {
    const cleaned = removeUnearnedProgress({ streak: 12, moduleProgress: {}, earnedBadgeIds: ['streak-7'] });
    expect(cleaned.streak).toBe(0);
    expect(cleaned.earnedBadgeIds).toEqual([]);
  });

  it('keeps a streak badge backed by a real seven-day streak', () => {
    const cleaned = removeUnearnedProgress({ streak: 7, lastActiveDate: '2026-10-10', moduleProgress: {}, earnedBadgeIds: ['streak-7'] });
    expect(cleaned.earnedBadgeIds).toEqual(['streak-7']);
  });

  it('copes with an empty, partial or damaged save without throwing', () => {
    expect(removeUnearnedProgress({})).toMatchObject({ moduleProgress: {}, earnedBadgeIds: [], streak: 0 });
    expect(removeUnearnedProgress(null)).toMatchObject({ moduleProgress: {}, earnedBadgeIds: [], streak: 0 });
    const damaged = removeUnearnedProgress({
      moduleProgress: { '01': 'lots', '02': Number.NaN, '03': -5 } as unknown as Record<string, number>,
      earnedBadgeIds: 'scam-spotter' as unknown as string[],
      streak: 'twelve' as unknown as number,
    });
    expect(damaged).toMatchObject({ moduleProgress: {}, earnedBadgeIds: [], streak: 0 });
  });

  it('leaves everything else in the save untouched (language, name, certificates)', () => {
    const cleaned = removeUnearnedProgress({ ...SEEDED, language: 'zu', studentName: 'Thandi Nkosi', certificates: {} });
    expect(cleaned).toMatchObject({ language: 'zu', studentName: 'Thandi Nkosi', certificates: {} });
  });
});
