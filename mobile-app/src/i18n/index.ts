import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import nsoAi from './locales/nso.ai.json';
import nso from './locales/nso.json';
import tsAi from './locales/ts.ai.json';
import ts from './locales/ts.json';
import zuAi from './locales/zu.ai.json';
import zu from './locales/zu.json';

export const SUPPORTED_LANGUAGES = ['en', 'zu', 'nso', 'ts'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_META: Record<LanguageCode, { name: string; note: string; code: string }> = {
  en: { name: en.name, note: en.note, code: en.code },
  zu: { name: zu.name, note: zu.note, code: zu.code },
  nso: { name: nso.name, note: nso.note, code: nso.code },
  ts: { name: ts.name, note: ts.note, code: ts.code },
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    // <lang>.json holds the original translations. <lang>.ai.json holds the rest of the interface
    // text, AI-translated on 2026-10-09 at the researcher's request and not yet reviewed by a native
    // speaker. The original file always wins, so reviewed text can be moved across key by key.
    zu: { translation: { ...zuAi, ...zu } },
    nso: { translation: { ...nsoAi, ...nso } },
    ts: { translation: { ...tsAi, ...ts } },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
