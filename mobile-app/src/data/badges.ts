import type { IoniconName } from '@/components/icon';

export type Badge = {
  id: string;
  name: string;
  icon: IoniconName;
  earned: boolean;
};

// `earned` here is always false: it's the catalog definition, not a specific student's progress.
// Screens derive the real per-student value from `useAppStore`'s `earnedBadgeIds` (see profile.tsx).
export const BADGES: Badge[] = [
  { id: 'scam-spotter', name: 'Scam Spotter', icon: 'alert-circle', earned: false },
  { id: 'popia-aware', name: 'Digital Privacy Pro', icon: 'lock-closed', earned: false },
  { id: 'streak-30', name: '30-Day Streak', icon: 'flame', earned: false },
];

/**
 * The single source of truth for which module passing an assessment actually awards a badge.
 * POPIA (01) has no badge: its source material never authored a standalone final exam for it,
 * only per-topic knowledge checks. Screens must check this rather than assuming every module
 * awards a badge on pass.
 */
export const MODULE_BADGE_ID: Record<string, string> = {
  '02': 'scam-spotter',
  '03': 'popia-aware',
};
