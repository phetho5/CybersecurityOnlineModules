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

/** The lesson the student last had open. */
export type LastLesson = { moduleId: string; lessonN: number };

/**
 * The lesson the student should pick up (named in `lang`), or null once every module is complete.
 * That is the lesson they last had open, unless they have since finished it (then the next one in
 * that module) or finished its whole module (then the first module still unfinished).
 */
export function getContinueLesson(
  moduleProgress: Record<string, number>,
  lang: LanguageCode = 'en',
  lastLesson: LastLesson | null = null
): ContinueLesson | null {
  const unfinished = (m: (typeof MODULES)[number]) => (moduleProgress[m.id] ?? 0) < 100;
  const lastModule = MODULES.find((m) => m.id === lastLesson?.moduleId && unfinished(m));
  const mod = lastModule ?? MODULES.find(unfinished);
  if (!mod) return null;

  const pct = moduleProgress[mod.id] ?? 0;
  const lessons = getLessonProgress(mod.id, pct, mod.lessonCount, lang);
  const lastOpened = lastModule ? lessons.find((l) => l.n === lastLesson?.lessonN && l.status !== 'done') : undefined;
  const lesson = lastOpened ?? lessons.find((l) => l.status === 'in-progress') ?? lessons[0];
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
