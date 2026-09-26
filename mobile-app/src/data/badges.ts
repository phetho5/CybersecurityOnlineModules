import type { IoniconName } from '@/components/icon';

export type Badge = {
  id: string;
  name: string;
  icon: IoniconName;
  earned: boolean;
};

export const BADGES: Badge[] = [
  { id: 'scam-spotter', name: 'Scam Spotter', icon: 'alert-circle', earned: true },
  { id: 'popia-aware', name: 'POPIA Aware', icon: 'lock-closed', earned: true },
  { id: 'phish-hunter', name: 'Phish Hunter', icon: 'mail', earned: false },
  { id: 'sms-shield', name: 'SMS Shield', icon: 'chatbubble-ellipses', earned: false },
  { id: 'cyber-law', name: 'Cyber Law', icon: 'hammer', earned: false },
  { id: 'streak-30', name: '30-Day Streak', icon: 'flame', earned: false },
];
