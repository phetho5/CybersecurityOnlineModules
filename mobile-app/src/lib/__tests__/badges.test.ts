import { BADGES, MODULE_BADGE_ID } from '@/data/badges';
import { getLessonProgress } from '@/data/lessons';
import { MODULES } from '@/data/modules';
import {
  computeEarnedBadgeIds,
  countEarnedBadges,
  isBadgeEarnable,
  lessonProgressPct,
  STREAK_BADGE_DAYS,
} from '@/lib/badges';

const NOTHING = { moduleProgress: {}, earnedBadgeIds: [], streak: 0 };

describe('computeEarnedBadgeIds', () => {
  it('gives a brand-new student no badges', () => {
    expect(computeEarnedBadgeIds(NOTHING)).toEqual([]);
  });

  it('awards First Steps as soon as any lesson in any module is finished', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '02': 12 } })).toEqual(['first-steps']);
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '03': 50 } })).toEqual(['first-steps']);
  });

  it('does not award First Steps for a module that was only opened (0%)', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 0, '02': 0 } })).toEqual([]);
  });

  it('awards POPIA Aware only once all three POPIA lessons are finished', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 67 } })).not.toContain('popia-basics');
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 99 } })).not.toContain('popia-basics');
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 100 } })).toContain('popia-basics');
  });

  it('does not award POPIA Aware for finishing a different module', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '02': 100, '03': 100 } })).not.toContain('popia-basics');
  });

  it('awards Cyber Aware Graduate only when every module is complete', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 100, '02': 100 } })).not.toContain('cyber-graduate');
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: { '01': 100, '02': 100, '03': 99 } })).not.toContain(
      'cyber-graduate'
    );
    const all = Object.fromEntries(MODULES.map((m) => [m.id, 100]));
    expect(computeEarnedBadgeIds({ ...NOTHING, moduleProgress: all })).toContain('cyber-graduate');
  });

  it('awards the streak badge at exactly seven days, not six', () => {
    expect(STREAK_BADGE_DAYS).toBe(7);
    expect(computeEarnedBadgeIds({ ...NOTHING, streak: 6 })).not.toContain('streak-7');
    expect(computeEarnedBadgeIds({ ...NOTHING, streak: 7 })).toContain('streak-7');
    expect(computeEarnedBadgeIds({ ...NOTHING, streak: 40 })).toContain('streak-7');
  });

  it('never takes a badge away: a streak badge stays after the streak is broken', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, earnedBadgeIds: ['streak-7'], streak: 1 })).toEqual(['streak-7']);
  });

  it('keeps the two assessment badges exactly as they were awarded, and never hands them out for progress alone', () => {
    const complete = Object.fromEntries(MODULES.map((m) => [m.id, 100]));
    const withoutPassing = computeEarnedBadgeIds({ ...NOTHING, moduleProgress: complete });
    expect(withoutPassing).not.toContain('scam-spotter');
    expect(withoutPassing).not.toContain('popia-aware');

    const afterPassing = computeEarnedBadgeIds({ ...NOTHING, earnedBadgeIds: ['scam-spotter'], moduleProgress: { '02': 100 } });
    expect(afterPassing).toEqual(['scam-spotter', 'first-steps']);
  });

  it('lists each badge once, already-earned ones first in their original order', () => {
    const result = computeEarnedBadgeIds({
      moduleProgress: { '01': 100 },
      earnedBadgeIds: ['popia-basics', 'first-steps', 'popia-basics'],
      streak: 7,
    });
    expect(result).toEqual(['popia-basics', 'first-steps', 'streak-7']);
  });

  it('keeps an id it does not recognise (e.g. earned on a newer version of the app) rather than dropping it', () => {
    expect(computeEarnedBadgeIds({ ...NOTHING, earnedBadgeIds: ['future-badge'] })).toEqual(['future-badge']);
  });

  it('survives damaged saved progress without crashing or awarding anything', () => {
    const damaged = { '01': Number.NaN, '02': -5, '03': undefined as unknown as number };
    expect(computeEarnedBadgeIds({ moduleProgress: damaged, earnedBadgeIds: [], streak: Number.NaN })).toEqual([]);
  });

  it('does not change the list it was given', () => {
    const earnedBadgeIds = ['scam-spotter'];
    computeEarnedBadgeIds({ moduleProgress: { '01': 100 }, earnedBadgeIds, streak: 7 });
    expect(earnedBadgeIds).toEqual(['scam-spotter']);
  });
});

describe('every badge in the catalogue can actually be earned', () => {
  it.each(BADGES.map((b) => b.id))('"%s" has a way to earn it', (id) => {
    expect(isBadgeEarnable(id)).toBe(true);
  });

  it('says a badge nobody defined cannot be earned', () => {
    expect(isBadgeEarnable('streak-30')).toBe(false);
    expect(isBadgeEarnable('')).toBe(false);
  });

  it('can award every progress badge from some reachable state', () => {
    const everything = computeEarnedBadgeIds({
      moduleProgress: Object.fromEntries(MODULES.map((m) => [m.id, 100])),
      earnedBadgeIds: Object.values(MODULE_BADGE_ID),
      streak: STREAK_BADGE_DAYS,
    });
    expect([...everything].sort()).toEqual(BADGES.map((b) => b.id).sort());
  });
});

describe('countEarnedBadges', () => {
  it('counts the badges a student holds that the app still has', () => {
    expect(countEarnedBadges([])).toBe(0);
    expect(countEarnedBadges(['first-steps', 'scam-spotter'])).toBe(2);
  });

  it('does not count a retired badge, an unknown id or the same badge twice', () => {
    expect(countEarnedBadges(['streak-30', 'first-steps', 'first-steps', ''])).toBe(1);
  });
});

describe('lessonProgressPct', () => {
  it('turns "finished lesson N" into a percentage the lesson list reads back as exactly N lessons done', () => {
    for (const mod of MODULES) {
      for (let n = 1; n <= mod.lessonCount; n++) {
        const pct = lessonProgressPct(mod.id, n);
        if (pct === null) continue;
        const done = getLessonProgress(mod.id, pct, mod.lessonCount).filter((l) => l.status === 'done').length;
        expect({ module: mod.id, n, done }).toEqual({ module: mod.id, n, done: n });
      }
    }
  });

  it('completes POPIA, which has no final assessment, when its last lesson is finished', () => {
    expect(lessonProgressPct('01', 1)).toBe(34);
    expect(lessonProgressPct('01', 2)).toBe(67);
    expect(lessonProgressPct('01', 3)).toBe(100);
  });

  it('never completes a module that has a final assessment just by reaching its last lesson', () => {
    expect(lessonProgressPct('02', 9)).toBeNull();
    expect(lessonProgressPct('03', 2)).toBeNull();
    expect(lessonProgressPct('02', 8)).toBeLessThan(100);
    expect(lessonProgressPct('03', 1)).toBe(50);
  });

  it('gives nothing for a lesson or module that does not exist', () => {
    expect(lessonProgressPct('99', 1)).toBeNull();
    expect(lessonProgressPct('', 1)).toBeNull();
    for (const n of [0, -1, 4, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(lessonProgressPct('01', n)).toBeNull();
    }
  });
});
