/**
 * Design tokens ported from the "Cyber Aware Mobile LMS" prototype
 * (Cyber Aware Mobile LMS (offline).html) so the built app matches
 * the artefact that was already designed and validated.
 */

import { Platform } from 'react-native';

export const Colors = {
  background: '#f3f2f2',
  surface: '#eae9e9',
  card: '#ffffff',
  text: '#201e1d',
  textMuted: '#605d5d',
  divider: '#d7d3d3',

  accent: '#ec3013',
  accentContrast: '#ffffff',

  neutral100: '#f8f4f4',
  neutral200: '#eae7e7',
  neutral300: '#d7d3d3',
  neutral400: '#bab6b6',
  neutral500: '#9b9797',
  neutral600: '#7d7979',
  neutral700: '#605d5d',
  neutral800: '#444141',
  neutral900: '#2d2b2b',

  accent100: '#fff2ef',
  accent200: '#ffe0d9',
  accent300: '#ffc4b8',
  accent400: '#ff9783',
  accent500: '#ff563c',
  accent600: '#dd2b0f',
  accent700: '#ae1800',
  accent800: '#7c1405',
  accent900: '#4d170e',

  success: '#1f7a4d',
  successBg: '#e3f5eb',
} as const;

export const Fonts = Platform.select({
  ios: { heading: 'Archivo_800ExtraBold', body: 'Archivo_400Regular', bodyMedium: 'Archivo_600SemiBold' },
  android: { heading: 'Archivo_800ExtraBold', body: 'Archivo_400Regular', bodyMedium: 'Archivo_600SemiBold' },
  default: { heading: 'System', body: 'System', bodyMedium: 'System' },
})!;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 24, android: 12 }) ?? 0;
export const MaxContentWidth = 480;
