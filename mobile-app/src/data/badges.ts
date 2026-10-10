import type { ImageSourcePropType } from 'react-native';

export type Badge = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  earned: boolean;
};

// `earned` here is always false: it's the catalog definition, not a specific student's progress.
// Screens derive the real per-student value from `useAppStore`'s `earnedBadgeIds` (see profile.tsx).
// How each one is earned lives in `src/lib/badges.ts` (progress badges) and `MODULE_BADGE_ID` below.
// `popia-aware` is the id students already hold for Digital Privacy Pro, so it keeps that id and
// the POPIA Aware badge has its own (`popia-basics`).
export const BADGES: Badge[] = [
  { id: 'first-steps', name: 'First Steps', image: require('../../assets/images/badges/first-steps.png'), earned: false },
  { id: 'popia-basics', name: 'POPIA Aware', image: require('../../assets/images/badges/popia-basics.png'), earned: false },
  { id: 'scam-spotter', name: 'Scam Spotter', image: require('../../assets/images/badges/scam-spotter.png'), earned: false },
  { id: 'popia-aware', name: 'Digital Privacy Pro', image: require('../../assets/images/badges/popia-aware.png'), earned: false },
  { id: 'streak-7', name: '7-Day Streak', image: require('../../assets/images/badges/streak-7.png'), earned: false },
  { id: 'cyber-graduate', name: 'Cyber Aware Graduate', image: require('../../assets/images/badges/cyber-graduate.png'), earned: false },
];

export function getBadge(id: string | undefined): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

/**
 * The single source of truth for which module passing an assessment actually awards a badge.
 * POPIA (01) has no badge here: its source material never authored a standalone final exam for
 * it, only per-topic knowledge checks. Screens must check this rather than assuming every module
 * awards a badge on pass.
 */
export const MODULE_BADGE_ID: Record<string, string> = {
  '02': 'scam-spotter',
  '03': 'popia-aware',
};
