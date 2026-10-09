/// <reference types="node" />
import fs from 'fs';
import path from 'path';

import { BADGES } from '@/data/badges';
import { MODULES } from '@/data/modules';
import i18n, { SUPPORTED_LANGUAGES } from '@/i18n';
import enNative from '@/i18n/locales/en.json';
import nsoAi from '@/i18n/locales/nso.ai.json';
import nsoNative from '@/i18n/locales/nso.json';
import tsAi from '@/i18n/locales/ts.ai.json';
import tsNative from '@/i18n/locales/ts.json';
import zuAi from '@/i18n/locales/zu.ai.json';
import zuNative from '@/i18n/locales/zu.json';

type Dict = Record<string, string>;

const TRANSLATED_LANGUAGES = ['zu', 'nso', 'ts'] as const;
const NATIVE: Record<(typeof TRANSLATED_LANGUAGES)[number], Dict> = { zu: zuNative, nso: nsoNative, ts: tsNative };
const AI: Record<(typeof TRANSLATED_LANGUAGES)[number], Dict> = { zu: zuAi, nso: nsoAi, ts: tsAi };

const en = enNative as Dict;
const resources = (lang: string) => i18n.getResourceBundle(lang, 'translation') as Dict;
const placeholders = (text: string) => (text.match(/\{\{\s*\w+\s*\}\}/g) ?? []).map((p) => p.replace(/\s/g, '')).sort();

// Text that is legitimately identical in every language: it has no words in it.
const SAME_IN_EVERY_LANGUAGE = new Set(['charactersCount']);

const SRC_ROOT = path.join(__dirname, '..', '..');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe('interface text: every language is complete', () => {
  it.each(TRANSLATED_LANGUAGES)('%s has a translation for every piece of interface text English has', (lang) => {
    const bundle = resources(lang);
    const missing = Object.keys(en).filter((key) => typeof bundle[key] !== 'string' || bundle[key].trim() === '');
    expect(missing).toEqual([]);
  });

  it.each(TRANSLATED_LANGUAGES)('%s has no leftover keys that English no longer uses', (lang) => {
    const extra = Object.keys(resources(lang)).filter((key) => !(key in en));
    expect(extra).toEqual([]);
  });

  it.each(TRANSLATED_LANGUAGES)('%s never ships an English sentence as its "translation"', (lang) => {
    const bundle = resources(lang);
    const stillEnglish = Object.keys(en).filter((key) => !SAME_IN_EVERY_LANGUAGE.has(key) && bundle[key] === en[key]);
    expect(stillEnglish).toEqual([]);
  });

  it.each(TRANSLATED_LANGUAGES)('%s keeps every fill-in slot (e.g. {{count}}) that the English text has', (lang) => {
    const bundle = resources(lang);
    for (const key of Object.keys(en)) {
      expect({ key, slots: placeholders(bundle[key] ?? '') }).toEqual({ key, slots: placeholders(en[key]) });
    }
  });

  it.each(TRANSLATED_LANGUAGES)('%s has no stray whitespace around any text', (lang) => {
    for (const [key, value] of Object.entries(resources(lang))) {
      expect({ key, value }).toEqual({ key, value: value.trim() });
    }
  });

  it.each(TRANSLATED_LANGUAGES)(
    '%s keeps its AI-translated text in its own file, never overwriting an original translation',
    (lang) => {
      const overlap = Object.keys(AI[lang]).filter((key) => key in NATIVE[lang]);
      expect(overlap).toEqual([]);
    }
  );

  it('actually switches the displayed text when the language changes', async () => {
    for (const lang of TRANSLATED_LANGUAGES) {
      await i18n.changeLanguage(lang);
      expect(i18n.t('nextQuestion')).toBe(resources(lang).nextQuestion);
      expect(i18n.t('nextQuestion')).not.toBe(en.nextQuestion);
    }
    await i18n.changeLanguage('en');
    expect(i18n.t('nextQuestion')).toBe('Next question');
  });

  it('fills in numbers correctly in every language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const text = i18n.t('correctOfTotal', { lng: lang, correct: 7, total: 10 });
      expect(text).toContain('7');
      expect(text).toContain('10');
      expect(text).not.toContain('{{');
    }
  });
});

describe('interface text: every key the screens ask for exists', () => {
  const files = sourceFiles(SRC_ROOT);

  it('defines every key that a screen looks up by name (a missing key shows students a raw code name)', () => {
    const undefinedKeys: string[] = [];
    for (const file of files) {
      const source = fs.readFileSync(file, 'utf8');
      for (const match of source.matchAll(/\bt\(\s*['"]([A-Za-z0-9_-]+)['"]/g)) {
        if (!(match[1] in en)) undefinedKeys.push(`${match[1]} (${path.relative(SRC_ROOT, file)})`);
      }
    }
    expect(undefinedKeys).toEqual([]);
  });

  it('defines the keys that are built up at runtime: verdicts, confidence levels and AI errors', () => {
    const runtimeKeys = [
      'verdictScam',
      'verdictLegit',
      'verdictUnsure',
      'confidenceHigh',
      'confidenceMedium',
      'confidenceLow',
      'aiErrorMissingKey',
      'aiErrorInvalidInput',
      'aiErrorInvalidKey',
      'aiErrorRateLimited',
      'aiErrorNetwork',
      'aiErrorInvalidResponse',
      'aiErrorUnexpected',
      'aiDrillsNoneReturned',
    ];
    expect(runtimeKeys.filter((key) => !(key in en))).toEqual([]);
  });

  it('has a name, tag and description for every module, and a name for every badge, in every language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const bundle = resources(lang);
      for (const mod of MODULES) {
        for (const prefix of ['moduleTitle', 'moduleTag', 'moduleIntro']) {
          expect({ lang, key: `${prefix}_${mod.id}`, ok: Boolean(bundle[`${prefix}_${mod.id}`]) }).toMatchObject({ ok: true });
        }
      }
      for (const badge of BADGES) {
        expect({ lang, key: `badgeName_${badge.id}`, ok: Boolean(bundle[`badgeName_${badge.id}`]) }).toMatchObject({ ok: true });
      }
    }
  });

  it('keeps the English module and badge names identical to the catalogue they came from', () => {
    for (const mod of MODULES) expect(en[`moduleTitle_${mod.id}`]).toBe(mod.title);
    for (const badge of BADGES) expect(en[`badgeName_${badge.id}`]).toBe(badge.name);
  });
});

describe('screens: no English text typed straight into the layout', () => {
  // The language picker is shown before a language is chosen, so it is deliberately multilingual.
  const EXEMPT_FILES = new Set(['language.tsx']);
  const BRAND = /CyberAware SA/;

  const screenFiles = [
    ...sourceFiles(path.join(SRC_ROOT, 'app')),
    ...sourceFiles(path.join(SRC_ROOT, 'components')),
  ].filter((file) => file.endsWith('.tsx') && !EXEMPT_FILES.has(path.basename(file)));

  const offenders = (pattern: RegExp) =>
    screenFiles.flatMap((file) =>
      fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ line, where: `${path.relative(SRC_ROOT, file)}:${i + 1}` }))
        .filter(({ line }) => pattern.test(line) && !BRAND.test(line))
        .map(({ line, where }) => `${where}  ${line.trim()}`)
    );

  it('has no words written directly between tags', () => {
    expect(offenders(/>[^<>{}]*[A-Za-z]{2,}[^<>{}]*<\//)).toEqual([]);
  });

  it('has no words written directly into a title, label, placeholder or accessibility label', () => {
    expect(offenders(/\b(title|label|placeholder|accessibilityLabel)\s*[=:]\s*["'][^"']*[A-Za-z]{2,}/)).toEqual([]);
  });

  it('has no words written directly into an either/or choice of text (e.g. "Selected" or "Switch")', () => {
    expect(offenders(/\?\s*'[A-Z][a-z]+[^']*'\s*:\s*'/)).toEqual([]);
  });
});
