import { getLessonProgress } from '@/data/lessons';
import { MODULES } from '@/data/modules';
import type { LanguageCode } from '@/i18n';

export type ContinueLesson = {
  moduleId: string;
  moduleTitle: string;
  lessonN: number;
  lessonTitle: string;
  lessonCount: number;
  minutes: number;
};

/** The next lesson the student should pick up (named in `lang`), or null once every module is complete. */
export function getContinueLesson(
  moduleProgress: Record<string, number>,
  lang: LanguageCode = 'en'
): ContinueLesson | null {
  const mod = MODULES.find((m) => (moduleProgress[m.id] ?? 0) < 100);
  if (!mod) return null;

  const pct = moduleProgress[mod.id] ?? 0;
  const lessons = getLessonProgress(mod.id, pct, mod.lessonCount, lang);
  const lesson = lessons.find((l) => l.status === 'in-progress') ?? lessons[0];
  if (!lesson) return null;

  return {
    moduleId: mod.id,
    moduleTitle: mod.title,
    lessonN: lesson.n,
    lessonTitle: lesson.title,
    lessonCount: mod.lessonCount,
    minutes: lesson.minutes,
  };
}
