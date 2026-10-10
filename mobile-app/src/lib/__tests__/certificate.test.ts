import i18n from '@/i18n';
import {
  CERTIFICATE_MODULE_IDS,
  CERTIFICATE_NAME_MAX_LENGTH,
  RESEARCHERS,
  buildCertificateView,
  certificateNameScale,
  createCertificateId,
  formatCertificateDate,
  hasCertificate,
  issueCertificate,
  listCertificates,
  validateCertificateName,
  type CertificateRecord,
} from '@/lib/certificate';

const tr = (lang: string, key: string) => i18n.t(key, { lng: lang }) as string;

const RECORD: CertificateRecord = {
  id: 'CA-02-20261005-ABCD',
  moduleId: '02',
  scorePct: 80,
  awardedAt: new Date(2026, 9, 5, 12).toISOString(),
  language: 'en',
};

describe('which modules award a certificate', () => {
  it('awards one for each module with a final assessment (Online Scams and Digital Privacy), not POPIA', () => {
    expect(CERTIFICATE_MODULE_IDS).toEqual(['02', '03']);
    expect(hasCertificate('02')).toBe(true);
    expect(hasCertificate('03')).toBe(true);
    expect(hasCertificate('01')).toBe(false);
  });

  it('says no for an unknown or empty module id', () => {
    expect(hasCertificate('99')).toBe(false);
    expect(hasCertificate('')).toBe(false);
  });
});

describe('validateCertificateName', () => {
  it('accepts an ordinary name and returns it tidied', () => {
    expect(validateCertificateName('  Thandi   Nkosi ')).toEqual({ ok: true, name: 'Thandi Nkosi' });
  });

  it('accepts names with hyphens, apostrophes and accented letters unchanged', () => {
    expect(validateCertificateName("Zoë O'Brien-Mokoena")).toEqual({ ok: true, name: "Zoë O'Brien-Mokoena" });
  });

  it('rejects an empty name and a name made only of spaces as "required"', () => {
    expect(validateCertificateName('')).toEqual({ ok: false, reason: 'required' });
    expect(validateCertificateName('    ')).toEqual({ ok: false, reason: 'required' });
  });

  it('rejects a single character as "too-short"', () => {
    expect(validateCertificateName(' T ')).toEqual({ ok: false, reason: 'too-short' });
  });

  it('accepts a name exactly at the length limit and rejects one character more', () => {
    expect(validateCertificateName('a'.repeat(CERTIFICATE_NAME_MAX_LENGTH)).ok).toBe(true);
    expect(validateCertificateName('a'.repeat(CERTIFICATE_NAME_MAX_LENGTH + 1))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('treats a missing value as "required" instead of throwing', () => {
    expect(validateCertificateName(null)).toEqual({ ok: false, reason: 'required' });
    expect(validateCertificateName(undefined)).toEqual({ ok: false, reason: 'required' });
  });
});

describe('certificateNameScale', () => {
  it('prints an ordinary name at full size', () => {
    expect(certificateNameScale('Thandi Nkosi')).toBe(1);
    expect(certificateNameScale('')).toBe(1);
  });

  it('shrinks a long name so it still fits, and the longer the name the smaller it gets', () => {
    const long = certificateNameScale('Nomvula Thandiwe Mahlangu');
    const longer = certificateNameScale('Nomvula Thandiwe Mahlangu-Nkosi');
    expect(long).toBeLessThan(1);
    expect(longer).toBeLessThan(long);
  });

  it('never shrinks the longest allowed name below a readable size', () => {
    expect(certificateNameScale('a'.repeat(CERTIFICATE_NAME_MAX_LENGTH))).toBeGreaterThanOrEqual(0.55);
  });
});

describe('createCertificateId', () => {
  it('builds the number from the module, the date and four random characters', () => {
    expect(createCertificateId('02', new Date(2026, 9, 5), () => 0)).toBe('CA-02-20261005-AAAA');
  });

  it('only ever uses characters that cannot be misread (no 0, O, 1 or I)', () => {
    for (const r of [0, 0.25, 0.5, 0.75, 0.999999]) {
      const suffix = createCertificateId('03', new Date(2026, 0, 1), () => r).split('-')[3];
      expect(suffix).toMatch(/^[A-HJ-NP-Z2-9]{4}$/);
    }
  });

  it('gives two certificates issued the same day different numbers', () => {
    const a = createCertificateId('02', new Date(2026, 9, 5), () => 0.1);
    const b = createCertificateId('02', new Date(2026, 9, 5), () => 0.9);
    expect(a).not.toBe(b);
  });
});

describe('formatCertificateDate', () => {
  it('writes the date as day/month/year with leading zeros', () => {
    expect(formatCertificateDate(new Date(2026, 9, 5, 12).toISOString())).toBe('05/10/2026');
  });

  it('returns null for a missing or unreadable date instead of printing "Invalid Date"', () => {
    expect(formatCertificateDate(null)).toBeNull();
    expect(formatCertificateDate('')).toBeNull();
    expect(formatCertificateDate('not a date')).toBeNull();
  });
});

describe('issueCertificate', () => {
  const now = new Date(2026, 9, 5, 12);

  it('issues a new certificate with the score, the date, a number and the language it was passed in', () => {
    const cert = issueCertificate(undefined, { moduleId: '02', scorePct: 80, language: 'zu', now, random: () => 0 });
    expect(cert).toEqual({
      id: 'CA-02-20261005-AAAA',
      moduleId: '02',
      scorePct: 80,
      awardedAt: now.toISOString(),
      language: 'zu',
    });
  });

  it('keeps the original date, number and language when the student passes again', () => {
    const again = issueCertificate(RECORD, { moduleId: '02', scorePct: 80, language: 'ts', now: new Date(2027, 0, 1), random: () => 0.5 });
    expect(again).toEqual(RECORD);
  });

  it('raises the printed score when a later pass is better', () => {
    const again = issueCertificate(RECORD, { moduleId: '02', scorePct: 100, language: 'en', now, random: () => 0 });
    expect(again).toEqual({ ...RECORD, scorePct: 100 });
  });

  it('never lowers the printed score when a later pass is worse', () => {
    const again = issueCertificate(RECORD, { moduleId: '02', scorePct: 70, language: 'en', now, random: () => 0 });
    expect(again.scorePct).toBe(80);
  });
});

describe('listCertificates', () => {
  it('lists every certificate as locked for a brand-new student', () => {
    expect(listCertificates({}, [])).toEqual([
      { moduleId: '02', earned: false, record: null },
      { moduleId: '03', earned: false, record: null },
    ]);
  });

  it('marks a certificate earned, with its details, once it has been issued', () => {
    const [scams, privacy] = listCertificates({ '02': RECORD }, ['scam-spotter']);
    expect(scams).toEqual({ moduleId: '02', earned: true, record: RECORD });
    expect(privacy.earned).toBe(false);
  });

  it('still counts a badge earned before certificates existed (or on another phone), with no details', () => {
    const [, privacy] = listCertificates({}, ['popia-aware']);
    expect(privacy).toEqual({ moduleId: '03', earned: true, record: null });
  });

  it('ignores badges that have no certificate, and stored records for modules that have none', () => {
    const list = listCertificates({ '01': { ...RECORD, moduleId: '01' } }, ['streak-30']);
    expect(list.map((c) => c.moduleId)).toEqual(['02', '03']);
    expect(list.every((c) => !c.earned)).toBe(true);
  });
});

describe('buildCertificateView', () => {
  it('fills in the name, module, badge, score, date, number and researchers', () => {
    const view = buildCertificateView({ moduleId: '02', record: RECORD, name: 'Thandi Nkosi', fallbackLanguage: 'en' })!;
    expect(view.name).toBe('Thandi Nkosi');
    expect(view.title).toBe('Certificate of Completion');
    expect(view.moduleTitle).toBe('Online Scams');
    expect(view.badgeName).toBe('Scam Spotter');
    expect(view.score).toEqual({ label: tr('en', 'certificateScoreLabel'), value: '80%', passMark: tr('en', 'passMark') });
    expect(view.date).toEqual({ label: tr('en', 'certificateDateLabel'), value: '05/10/2026' });
    expect(view.number).toEqual({ label: tr('en', 'certificateNumberLabel'), value: 'CA-02-20261005-ABCD' });
    expect(view.researchers).toEqual(RESEARCHERS);
    expect(RESEARCHERS).toEqual(['Phetho Nemavhola', 'Vhulenda Mashamba']);
  });

  it.each(['zu', 'nso', 'ts'] as const)('writes the certificate in the language the module was passed in (%s), whatever the app is set to now', (lang) => {
    const view = buildCertificateView({ moduleId: '03', record: { ...RECORD, moduleId: '03', language: lang }, name: 'Thandi', fallbackLanguage: 'en' })!;
    expect(view.language).toBe(lang);
    expect(view.title).toBe(tr(lang, 'certificateTitle'));
    expect(view.presentedTo).toBe(tr(lang, 'certificatePresentedTo'));
    expect(view.moduleTitle).toBe(tr(lang, 'moduleTitle_03'));
    expect(view.badgeName).toBe(tr(lang, 'badgeName_popia-aware'));
    expect(view.title).not.toBe('Certificate of Completion');
  });

  it('leaves the score, date and number off — rather than inventing them — for a pass recorded before certificates existed', () => {
    const view = buildCertificateView({ moduleId: '02', record: null, name: 'Thandi', fallbackLanguage: 'zu' })!;
    expect(view.score).toBeNull();
    expect(view.date).toBeNull();
    expect(view.number).toBeNull();
    expect(view.language).toBe('zu');
    expect(view.title).toBe(tr('zu', 'certificateTitle'));
  });

  it('leaves only the date off when a stored date is unreadable', () => {
    const view = buildCertificateView({ moduleId: '02', record: { ...RECORD, awardedAt: 'garbage' }, name: 'Thandi', fallbackLanguage: 'en' })!;
    expect(view.date).toBeNull();
    expect(view.score?.value).toBe('80%');
  });

  it('returns nothing for a module that has no certificate or does not exist', () => {
    expect(buildCertificateView({ moduleId: '01', record: null, name: 'Thandi', fallbackLanguage: 'en' })).toBeNull();
    expect(buildCertificateView({ moduleId: '99', record: null, name: 'Thandi', fallbackLanguage: 'en' })).toBeNull();
  });
});
