import { MODULE_BADGE_ID } from '@/data/badges';
import { MODULES } from '@/data/modules';
import { computeEarnedBadgeIds, lessonProgressPct, STREAK_BADGE_DAYS } from '@/lib/badges';

type SavedProgress = {
  streak?: number;
  lastActiveDate?: string | null;
  moduleProgress?: Record<string, number>;
  earnedBadgeIds?: string[];
  [key: string]: unknown;
};

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Every progress value finishing lessons or passing the final assessment can give a module. */
function reachablePcts(moduleId: string, lessonCount: number): Set<number> {
  const reachable = new Set<number>([100]);
  for (let n = 1; n <= lessonCount; n++) {
    const pct = lessonProgressPct(moduleId, n);
    if (pct !== null) reachable.add(pct);
  }
  return reachable;
}

/**
 * Strips progress, badges and streak that nothing the student did can account for. The app's first
 * build saved demo values (60% and 40% progress, two badges, a 12-day streak) on every phone, and
 * later builds awarded more badges on top of them. Anything really earned is kept.
 */
export function removeUnearnedProgress<T extends SavedProgress>(saved: T | null | undefined): T & Required<Pick<SavedProgress, 'streak' | 'moduleProgress' | 'earnedBadgeIds'>> {
  const source = (saved ?? {}) as T;

  const moduleProgress: Record<string, number> = {};
  for (const mod of MODULES) {
    const pct = source.moduleProgress?.[mod.id];
    if (typeof pct === 'number' && reachablePcts(mod.id, mod.lessonCount).has(pct)) moduleProgress[mod.id] = pct;
  }

  // A streak has only ever been counted alongside the day it was last added to.
  const counted = typeof source.lastActiveDate === 'string' && DATE_KEY.test(source.lastActiveDate);
  const streak = counted && typeof source.streak === 'number' && Number.isFinite(source.streak) ? source.streak : 0;

  const held = Array.isArray(source.earnedBadgeIds) ? source.earnedBadgeIds : [];
  const assessmentBadges = Object.entries(MODULE_BADGE_ID)
    .filter(([moduleId, badgeId]) => held.includes(badgeId) && moduleProgress[moduleId] === 100)
    .map(([, badgeId]) => badgeId);
  const rebuilt = computeEarnedBadgeIds({ moduleProgress, streak, earnedBadgeIds: assessmentBadges });
  // The streak badge is kept once earned, so a real one is backed by a streak that reached it.
  const earnedBadgeIds = held.filter((id) => rebuilt.includes(id) && (id !== 'streak-7' || streak >= STREAK_BADGE_DAYS));

  return { ...source, moduleProgress, streak, earnedBadgeIds };
}
