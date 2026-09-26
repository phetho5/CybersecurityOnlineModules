import type { LanguageCode } from '@/i18n';

const SCENARIO_TEXT: Record<LanguageCode, { title: string; intro: string; lesson: string }> = {
  en: {
    title: 'The debit order that never happened',
    intro:
      'A message lands while you are in a lecture. It looks like your bank. Read it, then mark what does not add up.',
    lesson: 'Fake bank alerts on WhatsApp',
  },
  zu: {
    title: 'I-debit order engakaze yenzeke',
    intro:
      'Umyalezo ufika ngesikhathi usesifundweni. Ubukeka sengathi uvela ebhange lakho. Wufunde, bese umaka okungahambi kahle.',
    lesson: 'Izaziso mbumbulu zebhange ku-WhatsApp',
  },
  nso: {
    title: 'Taelo ya tšhelete yeo e se ke ya direga',
    intro:
      'Molaetša o tsena ge o le ka thutong. O bonala eke o tšwa pankeng ya gago. O bale, gomme o swaye seo se se lokago.',
    lesson: 'Ditsebišo tša maaka tša panka ka WhatsApp',
  },
  ts: {
    title: 'Xiboho xa mali lexi nga endlekiki',
    intro:
      'Rungula ri fika loko u ri edyondzweni. Ri languteka onge ri huma ebangi ya wena. Ri hlaye, kutani u funghela leswi nga tirhisiki.',
    lesson: 'Switiviso swa mavunwa swa bangi eka WhatsApp',
  },
};

export function getScenarioText(lang: LanguageCode) {
  return SCENARIO_TEXT[lang] ?? SCENARIO_TEXT.en;
}

// The message bubble, sender details and clue explanation are not yet
// translated in the source content — that is the project's separate
// "Multilingual Content Development" milestone, not a UI concern.
export const SCENARIO = {
  sender: {
    initials: 'SB',
    name: 'Standard Bank Alerts',
    detail: '+27 81 442 9903 · not in contacts',
    timestamp: '14:24',
  },
  message: [
    'URGENT: A debit order of R4,850.00 to CRYPTOPAY was approved on your account today at 14:22.',
    'If this was not you, cancel immediately: standardbank-secure-verify.co.za/stop',
    'Do not share this message with anyone. Reply with your card PIN to confirm identity.',
  ],
  explanation:
    'Banks never ask for your PIN or OTP, and a real Standard Bank link ends in standardbank.co.za. Under POPIA you can also report the unlawful use of your number to the Information Regulator.',
};

export type Clue = {
  id: string;
  text: string;
  isRedFlag: boolean;
};

export const CLUES: Clue[] = [
  { id: 'c1', isRedFlag: true, text: 'The link is standardbank-secure-verify.co.za — not the bank’s real domain' },
  { id: 'c2', isRedFlag: true, text: 'It asks you to reply with your card PIN' },
  { id: 'c3', isRedFlag: false, text: 'The message shows a rand amount and a time' },
  { id: 'c4', isRedFlag: true, text: 'It tells you not to tell anyone — isolation pressure' },
  { id: 'c5', isRedFlag: false, text: 'The sender has a South African +27 number' },
];
