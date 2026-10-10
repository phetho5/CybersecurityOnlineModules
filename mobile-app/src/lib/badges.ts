import { getBadge, MODULE_BADGE_ID } from '@/data/badges';
import { getModule, MODULES } from '@/data/modules';

export const STREAK_BADGE_DAYS = 7;

export type BadgeProgress = {
  moduleProgress: Record<string, number>;
  earnedBadgeIds: readonly string[];
  streak: number;
};

const pct = (progress: BadgeProgress, moduleId: string) => {
  const value = progress.moduleProgress[moduleId];
  return Number.isFinite(value) ? value : 0;
};

/**
 * Badges earned from progress alone, in the order they are awarded. The two assessment badges
 * are not here: they are awarded by passing a final assessment (`MODULE_BADGE_ID`).
 */
const PROGRESS_RULES: Record<string, (progress: BadgeProgress) => boolean> = {
  'first-steps': (p) => Object.keys(p.moduleProgress).some((moduleId) => pct(p, moduleId) > 0),
  'popia-basics': (p) => pct(p, '01') >= 100,
  'cyber-graduate': (p) => MODULES.every((m) => pct(p, m.id) >= 100),
  'streak-7': (p) => Number.isFinite(p.streak) && p.streak >= STREAK_BADGE_DAYS,
};

/** Every badge the student holds: the ones already awarded (never taken away) plus any now earned. */
export function computeEarnedBadgeIds(progress: BadgeProgress): string[] {
  const earned = new Set(progress.earnedBadgeIds);
  for (const [badgeId, isEarned] of Object.entries(PROGRESS_RULES)) {
    if (!earned.has(badgeId) && isEarned(progress)) earned.add(badgeId);
  }
  return Array.from(earned);
}

/** How far through the whole course the student is: the average of every module, 0–100. */
export function overallProgressPct(moduleProgress: Record<string, number>): number {
  const total = MODULES.reduce((sum, m) => {
    const value = moduleProgress[m.id];
    return sum + (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0);
  }, 0);
  return Math.round(total / MODULES.length);
}

/** False for a badge nothing in the app can award. */
export function isBadgeEarnable(badgeId: string): boolean {
  return badgeId in PROGRESS_RULES || Object.values(MODULE_BADGE_ID).includes(badgeId);
}

/** How many of the app's current badges the student holds (a retired or unknown id is not counted). */
export function countEarnedBadges(earnedBadgeIds: readonly string[]): number {
  return new Set(earnedBadgeIds.filter((id) => getBadge(id))).size;
}

/**
 * Module progress once lesson `lessonN` is finished, or null if finishing it records nothing: an
 * unknown lesson, or the last lesson of a module whose final assessment has to be passed instead.
 */
export function lessonProgressPct(moduleId: string, lessonN: number): number | null {
  const mod = getModule(moduleId);
  if (!mod || !Number.isInteger(lessonN) || lessonN < 1 || lessonN > mod.lessonCount) return null;
  if (lessonN === mod.lessonCount && MODULE_BADGE_ID[moduleId]) return null;
  // Rounded up so the lesson list (which rounds down) counts exactly `lessonN` lessons as done.
  return Math.ceil((lessonN / mod.lessonCount) * 100);
}
