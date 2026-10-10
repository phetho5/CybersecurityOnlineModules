import { MODULES } from '@/data/modules';
import type { LanguageCode } from '@/i18n';
import {
  generateDailyQuestions,
  type DailyTopicInput,
  type DeepSeekErrorReason,
  type GenerateQuestionsResult,
} from '@/lib/deepseek';
import { getModuleTopicContent, getModuleTopicQuiz } from '@/lib/topic-source';

export const DAILY_QUESTION_COUNT = 3;
// Roughly 1,500 words: more than any topic's notes today, and a ceiling on what one request costs.
const MAX_NOTES_LENGTH = 9000;
// How many of a topic's earlier questions the AI is shown so it writes different ones.
const MAX_AVOID_PER_TOPIC = 12;

export type PracticeTopic = { id: string; moduleId: string; lessonN: number };

export type DailyQuestion = {
  topicId: string;
  moduleId: string;
  lessonN: number;
  text: string;
  options: string[];
  correct: number;
  explain?: string;
  /** Written by the AI from the lesson notes, or a knowledge-check question taken from the notes. */
  source: 'ai' | 'notes';
  /** Only notes questions have one: it stays the same whatever language the question is shown in. */
  id?: string;
};

/** A question the student has been shown, kept so it is never shown again. */
export type AskedQuestion = { topic: string; text: string; id?: string };

export type DailyPracticeSet = {
  /** The calendar day these questions belong to (YYYY-MM-DD). */
  date: string;
  language: LanguageCode;
  questions: DailyQuestion[];
  /** Question position -> the option the student picked. */
  answers: Record<number, number>;
};

export type LoadDailyQuestionsResult =
  | { ok: true; questions: DailyQuestion[] }
  | { ok: false; error: DeepSeekErrorReason | 'no-new-questions' };

/**
 * Every lesson of every module, taking one module at a time in turn, so three topics in a row
 * come from different modules for as long as each module still has lessons to give.
 */
export const PRACTICE_TOPICS: PracticeTopic[] = (() => {
  const topics: PracticeTopic[] = [];
  const longest = Math.max(...MODULES.map((m) => m.lessonCount));
  for (let lessonN = 1; lessonN <= longest; lessonN++) {
    for (const mod of MODULES) {
      if (lessonN <= mod.lessonCount) topics.push({ id: `${mod.id}-${lessonN}`, moduleId: mod.id, lessonN });
    }
  }
  return topics;
})();

/** The topics for one day, starting `cursor` topics into the rotation and wrapping at the end. */
export function pickDailyTopics(cursor: number, count: number = DAILY_QUESTION_COUNT): PracticeTopic[] {
  const start = Number.isInteger(cursor) && cursor > 0 ? cursor : 0;
  return Array.from({ length: Math.min(count, PRACTICE_TOPICS.length) }, (_, i) => PRACTICE_TOPICS[(start + i) % PRACTICE_TOPICS.length]);
}

/** A question reduced to its letters and digits, so the same question always compares equal. */
export function questionKey(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

/** A topic's lesson notes as plain text for the AI to write questions from, in `lang`. */
export function topicNotes(topic: PracticeTopic, lang: LanguageCode): { title: string; notes: string } | null {
  const content = getModuleTopicContent(topic.moduleId, lang, topic.lessonN);
  if (!content) return null;

  const parts = [content.intro];
  for (const section of content.sections) {
    parts.push(section.heading);
    if (section.body) parts.push(section.body);
    parts.push(...section.items.map((item) => `- ${item}`));
  }
  if (content.example) parts.push(content.example);
  for (const scenario of content.scenarios ?? []) parts.push(scenario.text);
  parts.push(content.keyTakeaway);

  return { title: content.title, notes: parts.filter(Boolean).join('\n').slice(0, MAX_NOTES_LENGTH) };
}

function notesQuestions(topic: PracticeTopic, lang: LanguageCode): DailyQuestion[] {
  return (getModuleTopicQuiz(topic.moduleId, lang, topic.lessonN) ?? []).map((question, i) => ({
    topicId: topic.id,
    moduleId: topic.moduleId,
    lessonN: topic.lessonN,
    text: question.text,
    options: question.options,
    correct: question.correct,
    source: 'notes',
    id: `notes:${topic.id}:${i}`,
  }));
}

function shuffled<T>(items: T[], rng: () => number): { items: T[]; order: number[] } {
  const order = items.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { items: order.map((i) => items[i]), order };
}

type LoadOptions = {
  lang: LanguageCode;
  /** How far through the topic rotation the student is. */
  cursor: number;
  /** Every daily question the student has been shown before. */
  asked: AskedQuestion[];
  generate?: (topics: DailyTopicInput[], lang: LanguageCode) => Promise<GenerateQuestionsResult>;
  rng?: () => number;
};

/**
 * Today's questions: one new AI-written question for each of the day's topics, none of them ever
 * shown to this student before. Where the AI has nothing new (or cannot be reached), an unseen
 * knowledge-check question from the lesson notes takes its place. Never throws.
 */
export async function loadDailyQuestions({
  lang,
  cursor,
  asked,
  generate = generateDailyQuestions,
  rng = Math.random,
}: LoadOptions): Promise<LoadDailyQuestionsResult> {
  const history = (Array.isArray(asked) ? asked : []).filter(
    (a): a is AskedQuestion => Boolean(a) && typeof a.text === 'string' && typeof a.topic === 'string'
  );
  const seen = new Set<string>();
  for (const a of history) {
    seen.add(questionKey(a.text));
    if (a.id) seen.add(a.id);
  }
  const isNew = (q: { text: string; id?: string }) => !seen.has(questionKey(q.text)) && !(q.id && seen.has(q.id));
  const take = (q: DailyQuestion) => {
    seen.add(questionKey(q.text));
    if (q.id) seen.add(q.id);
    return q;
  };

  const topics = pickDailyTopics(cursor).flatMap((topic) => {
    const notes = topicNotes(topic, lang);
    return notes ? [{ topic, ...notes }] : [];
  });

  let generated: GenerateQuestionsResult;
  try {
    generated = await generate(
      topics.map(({ topic, title, notes }) => ({
        title,
        notes,
        avoid: history.filter((a) => a.topic === topic.id).slice(-MAX_AVOID_PER_TOPIC).map((a) => a.text),
      })),
      lang
    );
  } catch (err) {
    console.error('loadDailyQuestions: generating questions failed', err);
    generated = { ok: false, error: 'unexpected-error' };
  }

  const questions: DailyQuestion[] = [];
  topics.forEach(({ topic }, i) => {
    const written = generated.ok ? generated.questions.find((q) => q.topic === i + 1 && isNew(q)) : undefined;
    if (written) {
      const { items: options, order } = shuffled(written.options, rng);
      questions.push(
        take({
          topicId: topic.id,
          moduleId: topic.moduleId,
          lessonN: topic.lessonN,
          text: written.text,
          options,
          correct: order.indexOf(written.correct),
          explain: written.explain || undefined,
          source: 'ai',
        })
      );
      return;
    }
    // Nothing new from the AI for this topic: an unseen question from its notes, or failing that
    // from any other topic's notes, so the day still has its question.
    const fromNotes =
      notesQuestions(topic, lang).find(isNew) ?? PRACTICE_TOPICS.flatMap((other) => notesQuestions(other, lang)).find(isNew);
    if (fromNotes) questions.push(take(fromNotes));
  });

  if (questions.length > 0) return { ok: true, questions };
  return { ok: false, error: generated.ok ? 'no-new-questions' : generated.error };
}

export type PracticeStatus = {
  state: 'none' | 'in-progress' | 'done';
  answered: number;
  correct: number;
  total: number;
};

/** How far the student is through today's questions. A set from another day counts for nothing. */
export function practiceStatus(set: DailyPracticeSet | null | undefined, today: string): PracticeStatus {
  const questions = set?.date === today && Array.isArray(set.questions) ? set.questions : [];
  if (!set || questions.length === 0) return { state: 'none', answered: 0, correct: 0, total: DAILY_QUESTION_COUNT };

  const answers = set.answers ?? {};
  const answered = questions.filter((_, i) => answers[i] !== undefined).length;
  const correct = questions.filter((q, i) => answers[i] === q.correct).length;
  return { state: answered >= questions.length ? 'done' : 'in-progress', answered, correct, total: questions.length };
}
