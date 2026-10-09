import {
  getCapstoneQuestions as getOnlineScamsFinalAssessment,
  getTopicContent as getOnlineScamsTopicContent,
  getTopicQuiz as getOnlineScamsTopicQuiz,
} from '@/data/online-scams-topics';
import {
  getDigitalPrivacyFinalAssessment,
  getDigitalPrivacyTopicContent,
  getDigitalPrivacyTopicQuiz,
} from '@/data/digital-privacy-topics';
import { getPopiaTopicContent, getPopiaTopicQuiz } from '@/data/popia-topics';
import type { Question } from '@/data/quiz';
import type { TopicContent, TopicQuizQuestion } from '@/data/topic-types';
import type { LanguageCode } from '@/i18n';

/**
 * Per-module lookup of topic content/quizzes, so lesson/quiz/result screens don't need to special-case
 * module ids. POPIA (01) and Digital Privacy (03) are only partly translated so far, so their
 * getters return the native-language topic where the team has supplied one and the real sourced
 * English topic otherwise — matching the project's translation-scope rule rather than fabricating
 * a translation or showing a blank lesson.
 */
type TopicSource = {
  getContent: (lang: LanguageCode, n: number) => TopicContent | undefined;
  getQuiz: (lang: LanguageCode, n: number) => TopicQuizQuestion[] | undefined;
  /** Only present for modules whose last lesson is a real, source-authored graded exam. */
  getFinalAssessment?: (lang: LanguageCode) => Question[];
};

const TOPIC_SOURCES: Record<string, TopicSource> = {
  '01': {
    getContent: (lang, n) => getPopiaTopicContent(n, lang),
    getQuiz: (lang, n) => getPopiaTopicQuiz(n, lang),
  },
  '02': {
    getContent: getOnlineScamsTopicContent,
    getQuiz: getOnlineScamsTopicQuiz,
    getFinalAssessment: getOnlineScamsFinalAssessment,
  },
  '03': {
    getContent: (lang, n) => getDigitalPrivacyTopicContent(n, lang),
    getQuiz: (lang, n) => getDigitalPrivacyTopicQuiz(n, lang),
    getFinalAssessment: (lang) => getDigitalPrivacyFinalAssessment(lang),
  },
};

export function getModuleTopicContent(moduleId: string, lang: LanguageCode, n: number): TopicContent | undefined {
  return TOPIC_SOURCES[moduleId]?.getContent(lang, n);
}

export function getModuleTopicQuiz(moduleId: string, lang: LanguageCode, n: number): TopicQuizQuestion[] | undefined {
  return TOPIC_SOURCES[moduleId]?.getQuiz(lang, n);
}

export function getModuleFinalAssessment(moduleId: string, lang: LanguageCode): Question[] | undefined {
  return TOPIC_SOURCES[moduleId]?.getFinalAssessment?.(lang);
}
