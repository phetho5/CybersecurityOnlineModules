import { MODULE_BADGE_ID } from '@/data/badges';
import i18n, { type LanguageCode } from '@/i18n';

/** A certificate as issued: stored on the phone only, never sent to Supabase. */
export type CertificateRecord = {
  id: string;
  moduleId: string;
  scorePct: number;
  /** ISO timestamp of the first pass. */
  awardedAt: string;
  /** The language the module was passed in. The certificate stays in this language for good. */
  language: LanguageCode;
};

export type CertificateEntry = { moduleId: string; earned: boolean; record: CertificateRecord | null };

type Labelled = { label: string; value: string };

/** Everything printed on a certificate, already in the certificate's own language. */
export type CertificateView = {
  language: LanguageCode;
  title: string;
  presentedTo: string;
  name: string;
  completed: string;
  moduleTitle: string;
  badgeName: string;
  score: (Labelled & { passMark: string }) | null;
  date: Labelled | null;
  number: Labelled | null;
  researchersLabel: string;
  researchers: readonly string[];
  project: string;
};

export const CERTIFICATE_NAME_MIN_LENGTH = 2;
export const CERTIFICATE_NAME_MAX_LENGTH = 60;

export const RESEARCHERS = ['Phetho Nemavhola', 'Vhulenda Mashamba'] as const;

/** A module awards a certificate exactly when it has a final assessment — the same modules that award a badge. */
export const CERTIFICATE_MODULE_IDS = Object.keys(MODULE_BADGE_ID).sort();

export function hasCertificate(moduleId: string): boolean {
  return CERTIFICATE_MODULE_IDS.includes(moduleId);
}

export type CertificateNameResult =
  | { ok: true; name: string }
  | { ok: false; reason: 'required' | 'too-short' | 'too-long' };

export function validateCertificateName(input: string | null | undefined): CertificateNameResult {
  const name = (input ?? '').trim().replace(/\s+/g, ' ');
  if (name.length === 0) return { ok: false, reason: 'required' };
  if (name.length < CERTIFICATE_NAME_MIN_LENGTH) return { ok: false, reason: 'too-short' };
  if (name.length > CERTIFICATE_NAME_MAX_LENGTH) return { ok: false, reason: 'too-long' };
  return { ok: true, name };
}

// A name up to this long fits at full size, on two lines at most. Longer names shrink in proportion.
const NAME_FULL_SIZE_LENGTH = 22;
const NAME_MIN_SCALE = 0.55;

/** How much to shrink the printed name (1 = full size) so that a long one is never cut off. */
export function certificateNameScale(name: string): number {
  if (name.length <= NAME_FULL_SIZE_LENGTH) return 1;
  return Math.max(NAME_MIN_SCALE, NAME_FULL_SIZE_LENGTH / name.length);
}

// No 0/O or 1/I, so a number read off a printed certificate can't be mistyped.
const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const pad = (n: number) => String(n).padStart(2, '0');

export function createCertificateId(moduleId: string, date: Date, random: () => number = Math.random): string {
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += ID_ALPHABET[Math.min(ID_ALPHABET.length - 1, Math.floor(random() * ID_ALPHABET.length))];
  }
  return `CA-${moduleId}-${day}-${suffix}`;
}

/** Day/month/year in digits: month names would need a native-speaker translation in three languages. */
export function formatCertificateDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** A first pass issues the certificate. A later pass keeps its date, number and language, and can only raise the score. */
export function issueCertificate(
  existing: CertificateRecord | undefined,
  pass: { moduleId: string; scorePct: number; language: LanguageCode; now?: Date; random?: () => number }
): CertificateRecord {
  if (existing) return { ...existing, scorePct: Math.max(existing.scorePct, pass.scorePct) };
  const now = pass.now ?? new Date();
  return {
    id: createCertificateId(pass.moduleId, now, pass.random),
    moduleId: pass.moduleId,
    scorePct: pass.scorePct,
    awardedAt: now.toISOString(),
    language: pass.language,
  };
}

/**
 * Every certificate the app offers, earned or not. A badge with no stored record still counts as
 * earned: it was passed before certificates existed, or on another phone, so its details are unknown.
 */
export function listCertificates(
  certificates: Record<string, CertificateRecord>,
  earnedBadgeIds: readonly string[]
): CertificateEntry[] {
  return CERTIFICATE_MODULE_IDS.map((moduleId) => {
    const record = certificates[moduleId] ?? null;
    return { moduleId, earned: record !== null || earnedBadgeIds.includes(MODULE_BADGE_ID[moduleId]), record };
  });
}

export function buildCertificateView({
  moduleId,
  record,
  name,
  fallbackLanguage,
}: {
  moduleId: string;
  record: CertificateRecord | null;
  name: string;
  fallbackLanguage: LanguageCode;
}): CertificateView | null {
  if (!hasCertificate(moduleId)) return null;

  const language = record?.language ?? fallbackLanguage;
  const t = i18n.getFixedT(language);
  const date = formatCertificateDate(record?.awardedAt);

  return {
    language,
    title: t('certificateTitle'),
    presentedTo: t('certificatePresentedTo'),
    name,
    completed: t('certificateCompleted'),
    moduleTitle: t(`moduleTitle_${moduleId}`),
    badgeName: t(`badgeName_${MODULE_BADGE_ID[moduleId]}`),
    score: record ? { label: t('certificateScoreLabel'), value: `${record.scorePct}%`, passMark: t('passMark') } : null,
    date: date ? { label: t('certificateDateLabel'), value: date } : null,
    number: record ? { label: t('certificateNumberLabel'), value: record.id } : null,
    researchersLabel: t('certificateResearchers'),
    researchers: RESEARCHERS,
    project: t('certificateProject'),
  };
}
