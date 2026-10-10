import { render } from '@testing-library/react-native';
import React from 'react';

let mockParams: Record<string, string> = { id: '02' };

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@/components/video-player', () => ({
  VideoPlayer: () => null,
}));

jest.mock('@/components/audio-player', () => ({
  AudioPlayer: () => null,
}));

import HomeScreen from '@/app/(tabs)/home';
import ModulesScreen from '@/app/(tabs)/modules';
import ProfileScreen from '@/app/(tabs)/profile';
import ModuleScreen from '@/app/module/[id]';
import ResultScreen from '@/app/result/[id]';
import { BadgeTile } from '@/components/badge-tile';
import { ModuleCard } from '@/components/module-card';
import { TopicLesson } from '@/components/topic-lesson';
import { BADGES } from '@/data/badges';
import { MODULES } from '@/data/modules';
import i18n, { type LanguageCode } from '@/i18n';
import { getModuleTopicContent } from '@/lib/topic-source';
import { useAppStore } from '@/store/useAppStore';

const LANGUAGES = ['zu', 'nso', 'ts'] as const;
const initialState = useAppStore.getState();
const tr = (lang: LanguageCode, key: string, options?: Record<string, unknown>) =>
  i18n.t(key, { lng: lang, ...options }) as string;

async function useLanguage(lang: LanguageCode) {
  useAppStore.setState({ ...initialState, language: lang }, true);
  await i18n.changeLanguage(lang);
}

afterAll(async () => {
  await i18n.changeLanguage('en');
});

describe.each(LANGUAGES)('the whole app follows the chosen language: %s', (lang) => {
  beforeEach(async () => {
    mockParams = { id: '02' };
    await useLanguage(lang);
  });

  it('module cards show the module name and the lesson/minute counts in that language', async () => {
    const { getByText, queryByText } = await render(<ModuleCard module={MODULES[1]} pct={0} onPress={() => {}} />);
    expect(getByText(tr(lang, 'moduleTitle_02'))).toBeTruthy();
    expect(queryByText('Online Scams')).toBeNull();
    expect(queryByText(/lessons/)).toBeNull();
    expect(queryByText(/\bmin\b/)).toBeNull();
  });

  it('the Modules tab shows its heading, subtitle and all three module names in that language', async () => {
    const { getByText, queryByText } = await render(<ModulesScreen />);
    expect(getByText(tr(lang, 'modulesSubtitle'))).toBeTruthy();
    for (const mod of MODULES) {
      expect(getByText(tr(lang, `moduleTitle_${mod.id}`))).toBeTruthy();
      expect(queryByText(mod.title)).toBeNull();
    }
    expect(queryByText(/South African-context/)).toBeNull();
  });

  it('Home shows the next lesson, its module and the AI tutor card in that language, with no raw code names', async () => {
    const { getByText, queryByText } = await render(<HomeScreen />);
    // A brand-new student continues at POPIA topic 1.
    expect(getByText(getModuleTopicContent('01', lang, 1)!.title)).toBeTruthy();
    expect(getByText(tr(lang, 'aiTutorBody'))).toBeTruthy();
    expect(queryByText(/aiTutor[A-Z]/)).toBeNull();
    expect(queryByText(/POPIA & Your Personal Data/)).toBeNull();
  });

  it('a module page shows its tag, description, lesson names and status labels in that language', async () => {
    useAppStore.setState({ moduleProgress: { '02': 20 } });
    const { getByText, getAllByText, queryByText } = await render(<ModuleScreen />);
    expect(getByText(tr(lang, 'moduleTag_02'))).toBeTruthy();
    expect(getByText(tr(lang, 'moduleIntro_02'))).toBeTruthy();
    expect(getByText(tr(lang, 'badgeOnPass'))).toBeTruthy();
    expect(getAllByText(getModuleTopicContent('02', lang, 1)!.title).length).toBeGreaterThan(0);
    expect(getAllByText(new RegExp(tr(lang, 'lessonDone'))).length).toBeGreaterThan(0);
    expect(getAllByText(new RegExp(tr(lang, 'lessonInProgress'))).length).toBeGreaterThan(0);
    expect(queryByText('Local scams')).toBeNull();
    expect(queryByText('Badge on pass')).toBeNull();
    expect(queryByText(/In progress/)).toBeNull();
  });

  it('a lesson shows its built-in labels (example, key takeaway) in that language', async () => {
    const topic = getModuleTopicContent('01', lang, 2)!;
    const { getByText, queryByText } = await render(<TopicLesson topic={{ ...topic, example: 'x' }} />);
    expect(getByText(tr(lang, 'example'))).toBeTruthy();
    expect(getByText(tr(lang, 'keyTakeaway'))).toBeTruthy();
    expect(queryByText('Example')).toBeNull();
    expect(queryByText('Key takeaway')).toBeNull();
  });

  it('a capstone lesson shows its "Reflection" heading in that language', async () => {
    const capstone = getModuleTopicContent('02', lang, 9)!;
    const { getByText, queryByText } = await render(<TopicLesson topic={capstone} />);
    expect(getByText(tr(lang, 'reflection'))).toBeTruthy();
    expect(queryByText('Reflection')).toBeNull();
  });

  it.each(BADGES.map((badge) => [badge.id, badge] as const))('badge "%s" shows its name in that language', async (_id, badge) => {
    const { getByText, queryByText } = await render(<BadgeTile badge={badge} />);
    expect(getByText(tr(lang, `badgeName_${badge.id}`))).toBeTruthy();
    expect(queryByText(badge.name)).toBeNull();
  });

  it('Profile shows the certificate and the language switcher labels in that language', async () => {
    useAppStore.setState({ earnedBadgeIds: ['scam-spotter'] });
    const { getByText, getAllByText, queryByText } = await render(<ProfileScreen />);
    expect(getByText(tr(lang, 'certificateBody', { module: tr(lang, 'moduleTitle_02') }))).toBeTruthy();
    expect(getByText(tr(lang, 'certificateLocked'))).toBeTruthy();
    expect(queryByText('Pass the final assessment to earn it')).toBeNull();
    expect(getByText(tr(lang, 'languageSelected'))).toBeTruthy();
    expect(getAllByText(tr(lang, 'languageSwitch')).length).toBe(3);
    expect(queryByText('Certificate of Completion')).toBeNull();
    expect(queryByText('Selected')).toBeNull();
    expect(queryByText('Switch')).toBeNull();
  });

  it('Profile with no badges shows the empty certificate message in that language', async () => {
    const { getByText } = await render(<ProfileScreen />);
    expect(getByText(tr(lang, 'certificateEmpty'))).toBeTruthy();
  });

  it('a failed result explains the score and what to do next in that language', async () => {
    mockParams = { id: '03' };
    useAppStore.setState({ quizAnswers: {} });
    const { getByText, queryByText } = await render(<ResultScreen />);
    expect(getByText(tr(lang, 'failedHeadline'))).toBeTruthy();
    expect(getByText(tr(lang, 'failedBody'))).toBeTruthy();
    expect(getByText(tr(lang, 'marksByTopic'))).toBeTruthy();
    expect(getByText(tr(lang, 'retakeAssessment'))).toBeTruthy();
    expect(queryByText('Marks by topic')).toBeNull();
    expect(queryByText(/You need 70%/)).toBeNull();
    expect(queryByText(/of 10 correct/)).toBeNull();
  });

  it('a passed result names the module and the badge in that language', async () => {
    mockParams = { id: '03' };
    // All ten final-assessment answers correct.
    useAppStore.setState({ quizAnswers: { 0: 3, 1: 2, 2: 1, 3: 2, 4: 3, 5: 2, 6: 1, 7: 2, 8: 2, 9: 1 } });
    const { getByText, queryByText } = await render(<ResultScreen />);
    expect(getByText(tr(lang, 'passedHeadline'))).toBeTruthy();
    expect(getByText(tr(lang, 'passedBody', { module: tr(lang, 'moduleTitle_03') }))).toBeTruthy();
    expect(getByText(tr(lang, 'badgeName_popia-aware'))).toBeTruthy();
    expect(queryByText('Digital Privacy Pro')).toBeNull();
    expect(queryByText('verifiable')).toBeNull();
  });
});

describe('English stays English', () => {
  beforeEach(async () => {
    mockParams = { id: '02' };
    await useLanguage('en');
  });

  it('shows the English module name, counts and labels unchanged', async () => {
    const { getByText } = await render(<ModuleCard module={MODULES[1]} pct={0} onPress={() => {}} />);
    expect(getByText('Online Scams')).toBeTruthy();
    expect(getByText('9 lessons · 54 min')).toBeTruthy();
  });

  it('shows a real sentence on the Home AI tutor card, not a code name', async () => {
    const { getByText, queryByText } = await render(<HomeScreen />);
    expect(getByText(i18n.t('aiTutorBody', { lng: 'en' }) as string)).toBeTruthy();
    expect(queryByText('aiTutorComingSoonBody')).toBeNull();
  });
});
