export type LessonDef = {
  n: number;
  title: string;
  minutes: number;
};

const LESSON_TITLES: Record<string, string[]> = {
  '01': [
    'What POPIA protects and why it exists',
    'Consent, purpose and your data subject rights',
    'Spotting unlawful data collection on campus',
    'Reporting a breach to the Information Regulator',
  ],
  '02': [
    'How WhatsApp scams reach you',
    'Fake bank alerts on WhatsApp',
    'The "new number" family scam',
    'Fake job offers & R150 fees',
    'Reporting and blocking',
  ],
  '03': [
    'Reading a delivery SMS without getting caught out',
    'Courier and parcel re-delivery scams',
    'One-time-PIN (OTP) SMS fraud',
    'Blocking and reporting SMS scams',
  ],
  '04': [
    'Spotting a spoofed university domain',
    'Why "no links, ever" is the safest habit',
    'Fake fee-payment and bursary emails',
    'Business email compromise basics',
    'Checking a sender the right way',
    'What to do after clicking a bad link',
  ],
  '05': [
    'Key offences under the Cybercrimes Act',
    'What counts as unlawful access or interception',
    'How and where to report cybercrime in South Africa',
  ],
};

export function getLessons(moduleId: string): LessonDef[] {
  const titles = LESSON_TITLES[moduleId] ?? [];
  return titles.map((title, i) => ({ n: i + 1, title, minutes: 4 + ((i * 2) % 6) }));
}

export function getLessonProgress(moduleId: string, pct: number, lessonCount: number) {
  const doneCount = Math.floor((pct / 100) * lessonCount);
  return getLessons(moduleId).map((lesson, i) => ({
    ...lesson,
    status: i < doneCount ? 'done' : i === doneCount ? 'in-progress' : 'locked',
  }));
}
