import type { LanguageCode } from '@/i18n';
import { getModuleTopicContent } from '@/lib/topic-source';

import { DIGITAL_PRIVACY_TOPIC_CONTENT } from './digital-privacy-topics';
import { TOPIC_CONTENT } from './online-scams-topics';
import { POPIA_TOPIC_CONTENT } from './popia-topics';

export type LessonDef = {
  n: number;
  title: string;
  minutes: number;
  /** Storage URL for the lesson video, once uploaded. Undefined until real content exists. */
  videoUrl?: string;
  /** Storage URL for the lesson audio, once uploaded. Undefined until real content exists. */
  audioUrl?: string;
};

type LessonSeed = {
  title: string;
  videoUrl?: string;
  audioUrl?: string;
};

// Topic number (1-9) -> real uploaded video URL, supplied one at a time by the team.
const ONLINE_SCAMS_VIDEO_URLS: Record<number, string> = {
  2: 'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/WHATSAPP%20SCAM.mp4',
  3: 'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/SMS%20SCAM.mp4',
  5: 'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/DIGIAL%20SCAM%20SCENARIO.mp4',
  9: 'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/AVOID%20SCAMS.mp4',
};

// Topic number (1-9) -> real uploaded audio URL, supplied one at a time by the team.
// Rendered under that topic's video (or in its place, if there is none) — see TopicLesson.
const ONLINE_SCAMS_AUDIO_URLS: Record<number, string> = {};

// Titles for all three modules come from their sourced topic content, not invented here, so the
// module list and the lesson content can never drift out of sync. No video/audio exists yet for
// POPIA (01) or Digital Privacy (03) — only Online Scams (02) has real uploaded media so far.
const LESSON_SEEDS: Record<string, LessonSeed[]> = {
  '01': POPIA_TOPIC_CONTENT.map((topic) => ({ title: topic.title })),
  // Video URLs are keyed by topic number (1-9), supplied real per-lesson.
  '02': TOPIC_CONTENT.en.map((topic) => ({
    title: topic.title,
    videoUrl: ONLINE_SCAMS_VIDEO_URLS[topic.n],
    audioUrl: ONLINE_SCAMS_AUDIO_URLS[topic.n],
  })),
  '03': DIGITAL_PRIVACY_TOPIC_CONTENT.map((topic) => ({ title: topic.title })),
};

/**
 * A module's lessons, named in `lang` where that lesson has a translation and in English otherwise
 * (the same per-lesson fallback the lesson content itself uses, so a list never names a lesson in
 * one language and then opens it in another).
 */
export function getLessons(moduleId: string, lang: LanguageCode = 'en'): LessonDef[] {
  const seeds = LESSON_SEEDS[moduleId] ?? [];
  return seeds.map((seed, i) => ({
    n: i + 1,
    title: getModuleTopicContent(moduleId, lang, i + 1)?.title ?? seed.title,
    minutes: 4 + ((i * 2) % 6),
    videoUrl: seed.videoUrl,
    audioUrl: seed.audioUrl,
  }));
}

export function getLesson(moduleId: string, lessonN: number, lang: LanguageCode = 'en'): LessonDef | undefined {
  return getLessons(moduleId, lang).find((l) => l.n === lessonN);
}

export function getLessonProgress(moduleId: string, pct: number, lessonCount: number, lang: LanguageCode = 'en') {
  const doneCount = Math.floor((pct / 100) * lessonCount);
  return getLessons(moduleId, lang).map((lesson, i) => ({
    ...lesson,
    status: i < doneCount ? 'done' : i === doneCount ? 'in-progress' : 'locked',
  }));
}
