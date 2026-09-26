import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import nso from './locales/nso.json';
import ts from './locales/ts.json';
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
    zu: { translation: zu },
    nso: { translation: nso },
    ts: { translation: ts },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
