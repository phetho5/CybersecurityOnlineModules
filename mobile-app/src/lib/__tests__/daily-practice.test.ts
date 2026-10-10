import { MODULES } from '@/data/modules';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import {
  DAILY_QUESTION_COUNT,
  loadDailyQuestions,
  pickDailyTopics,
  PRACTICE_TOPICS,
  practiceStatus,
  questionKey,
  topicNotes,
  type AskedQuestion,
  type DailyPracticeSet,
} from '@/lib/daily-practice';
import type { DailyTopicInput, GenerateQuestionsResult } from '@/lib/deepseek';
import { getModuleTopicQuiz } from '@/lib/topic-source';

const aiQuestion = (topic: number, text: string, correct = 1) => ({
  topic,
  text,
  options: [`${text} — wrong A`, `${text} — right`, `${text} — wrong C`, `${text} — wrong D`].map((o, i) =>
    i === correct ? `${text} — right` : o
  ),
  correct,
  explain: `Because of ${text}.`,
});

/** A generator that answers with two fresh questions for each topic it was asked about. */
const twoPerTopic = jest.fn(
  async (topics: DailyTopicInput[]): Promise<GenerateQuestionsResult> => ({
    ok: true,
    questions: topics.flatMap((t, i) => [aiQuestion(i + 1, `${t.title} first`), aiQuestion(i + 1, `${t.title} second`)]),
  })
);
const offline = jest.fn(async (): Promise<GenerateQuestionsResult> => ({ ok: false, error: 'network' }));

const everyNotesQuestionAsked = (): AskedQuestion[] =>
  PRACTICE_TOPICS.flatMap((topic) =>
    (getModuleTopicQuiz(topic.moduleId, 'en', topic.lessonN) ?? []).map((q, i) => ({
      topic: topic.id,
      text: q.text,
      id: `notes:${topic.id}:${i}`,
    }))
  );

beforeEach(() => {
  twoPerTopic.mockClear();
  offline.mockClear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('the topics daily practice draws from', () => {
  it('covers every lesson of every module exactly once', () => {
    const expected = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
    expect(PRACTICE_TOPICS).toHaveLength(expected);
    expect(new Set(PRACTICE_TOPICS.map((t) => t.id)).size).toBe(expected);
  });

  it('has lesson notes to write questions from for every topic, in every language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      for (const topic of PRACTICE_TOPICS) {
        const notes = topicNotes(topic, lang);
        expect({ topic: topic.id, lang, hasNotes: Boolean(notes && notes.notes.length > 100 && notes.title) }).toMatchObject({
          hasNotes: true,
        });
      }
    }
  });

  it('returns no notes for a topic that does not exist', () => {
    expect(topicNotes({ id: '99-1', moduleId: '99', lessonN: 1 }, 'en')).toBeNull();
  });
});

describe('pickDailyTopics', () => {
  it('gives three different topics a day, one from each module on the first day', () => {
    const picked = pickDailyTopics(0);
    expect(picked).toHaveLength(DAILY_QUESTION_COUNT);
    expect(new Set(picked.map((t) => t.moduleId)).size).toBe(3);
  });

  it('moves on to different topics the next day, and reaches every topic before repeating one', () => {
    const seen: string[] = [];
    for (let cursor = 0; seen.length < PRACTICE_TOPICS.length; cursor += DAILY_QUESTION_COUNT) {
      seen.push(...pickDailyTopics(cursor).map((t) => t.id));
    }
    expect(new Set(seen.slice(0, PRACTICE_TOPICS.length)).size).toBe(PRACTICE_TOPICS.length);
  });

  it('wraps round to the start after the last topic', () => {
    expect(pickDailyTopics(PRACTICE_TOPICS.length)).toEqual(pickDailyTopics(0));
  });

  it('treats a missing or damaged position as the start', () => {
    for (const bad of [Number.NaN, -4, 2.5, undefined as unknown as number]) {
      expect(pickDailyTopics(bad)).toHaveLength(DAILY_QUESTION_COUNT);
    }
    expect(pickDailyTopics(Number.NaN)).toEqual(pickDailyTopics(0));
  });
});

describe('questionKey', () => {
  it('treats the same question as the same whatever its capitals, spacing or punctuation', () => {
    expect(questionKey('What is POPIA?')).toBe(questionKey('  what is popia  '));
    expect(questionKey('What is POPIA?')).not.toBe(questionKey('What is phishing?'));
  });

  it('keeps accented letters, so questions in other languages do not all collapse into one', () => {
    expect(questionKey('Naa molaetša wo ke bofora?')).not.toBe(questionKey('Naa molaetsa wo ke bofora?'));
    expect(questionKey('šš')).not.toBe(questionKey(''));
  });
});

describe('loadDailyQuestions', () => {
  it('returns three AI-written questions, one for each of the day’s topics', async () => {
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: twoPerTopic });
    if (!result.ok) throw new Error('expected questions');
    const topics = pickDailyTopics(0);
    expect(result.questions.map((q) => q.topicId)).toEqual(topics.map((t) => t.id));
    expect(result.questions.every((q) => q.source === 'ai')).toBe(true);
    expect(result.questions.every((q) => q.options.length === 4)).toBe(true);
  });

  it('gives the AI each topic’s lesson notes in the student’s language, and asks for that language', async () => {
    await loadDailyQuestions({ lang: 'zu', cursor: 0, asked: [], generate: twoPerTopic });
    const [topics, lang] = twoPerTopic.mock.calls[0] as unknown as [DailyTopicInput[], string];
    expect(lang).toBe('zu');
    pickDailyTopics(0).forEach((topic, i) => {
      expect(topics[i].notes).toBe(topicNotes(topic, 'zu')?.notes);
    });
  });

  it('tells the AI which questions that topic has already had, so it writes different ones', async () => {
    const [first] = pickDailyTopics(0);
    const asked = [
      { topic: first.id, text: 'An old question about this topic?' },
      { topic: 'some-other-topic', text: 'An unrelated old question?' },
    ];
    await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: twoPerTopic });
    const [topics] = twoPerTopic.mock.calls[0] as unknown as [DailyTopicInput[]];
    expect(topics[0].avoid).toContain('An old question about this topic?');
    expect(topics[0].avoid).not.toContain('An unrelated old question?');
    expect(topics[1].avoid).toEqual([]);
  });

  it('never shows a question the student has had before, even if the AI writes it again', async () => {
    const [first] = pickDailyTopics(0);
    const title = topicNotes(first, 'en')!.title;
    const asked = [{ topic: first.id, text: `${title.toUpperCase()}   FIRST!!` }];
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: twoPerTopic });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions[0].text).toBe(`${title} second`);
  });

  it('uses an unseen question from the lesson notes when every AI question for a topic is a repeat', async () => {
    const [first] = pickDailyTopics(0);
    const title = topicNotes(first, 'en')!.title;
    const asked = [
      { topic: first.id, text: `${title} first` },
      { topic: first.id, text: `${title} second` },
    ];
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: twoPerTopic });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions).toHaveLength(3);
    expect(result.questions[0]).toMatchObject({ source: 'notes', topicId: first.id });
    expect(result.questions[1].source).toBe('ai');
  });

  it('falls back to questions from the lesson notes when the AI cannot be reached', async () => {
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: offline });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions).toHaveLength(3);
    expect(result.questions.every((q) => q.source === 'notes')).toBe(true);
    expect(result.questions.map((q) => q.topicId)).toEqual(pickDailyTopics(0).map((t) => t.id));
    // Each one really is a knowledge-check question from that lesson.
    for (const q of result.questions) {
      const fromNotes = getModuleTopicQuiz(q.moduleId, 'en', q.lessonN)!.map((n) => n.text);
      expect(fromNotes).toContain(q.text);
    }
  });

  it('serves the notes fallback in the student’s language', async () => {
    const result = await loadDailyQuestions({ lang: 'zu', cursor: 0, asked: [], generate: offline });
    if (!result.ok) throw new Error('expected questions');
    const q = result.questions[0];
    expect(getModuleTopicQuiz(q.moduleId, 'zu', q.lessonN)!.map((n) => n.text)).toContain(q.text);
  });

  it('never repeats a notes question, even when the student has since switched language', async () => {
    const first = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: offline });
    if (!first.ok) throw new Error('expected questions');
    const asked = first.questions.map((q) => ({ topic: q.topicId, text: q.text, id: q.id }));
    const second = await loadDailyQuestions({ lang: 'zu', cursor: 0, asked, generate: offline });
    if (!second.ok) throw new Error('expected questions');
    const firstIds = first.questions.map((q) => q.id);
    expect(second.questions.some((q) => firstIds.includes(q.id))).toBe(false);
  });

  it('borrows an unseen notes question from another topic when the day’s topic has none left', async () => {
    const [first] = pickDailyTopics(0);
    const asked = everyNotesQuestionAsked().filter((a) => a.topic === first.id);
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: offline });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions).toHaveLength(3);
    expect(new Set(result.questions.map((q) => q.id)).size).toBe(3);
    for (const q of result.questions) expect(asked.map((a) => a.id)).not.toContain(q.id);
  });

  it('says why when the AI is unreachable and every notes question has been used — never an empty set', async () => {
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: everyNotesQuestionAsked(), generate: offline });
    expect(result).toEqual({ ok: false, error: 'network' });
  });

  it('reports that there is nothing new when the AI replies but with nothing usable and the notes are used up', async () => {
    const empty = async (): Promise<GenerateQuestionsResult> => ({ ok: true, questions: [] });
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: everyNotesQuestionAsked(), generate: empty });
    expect(result).toEqual({ ok: false, error: 'no-new-questions' });
  });

  it('returns the questions it could find when fewer than three are left', async () => {
    const asked = everyNotesQuestionAsked().slice(2);
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: offline });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions).toHaveLength(2);
  });

  it('never puts the same question in one day’s set twice', async () => {
    const sameEveryTime = async (topics: DailyTopicInput[]): Promise<GenerateQuestionsResult> => ({
      ok: true,
      questions: topics.map((_, i) => aiQuestion(i + 1, 'The very same question')),
    });
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: sameEveryTime });
    if (!result.ok) throw new Error('expected questions');
    expect(new Set(result.questions.map((q) => questionKey(q.text))).size).toBe(result.questions.length);
  });

  it('ignores an AI question labelled for a topic it was not asked about', async () => {
    const stray = async (): Promise<GenerateQuestionsResult> => ({ ok: true, questions: [aiQuestion(9, 'Stray'), aiQuestion(0, 'Zero')] });
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: stray });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions.every((q) => q.source === 'notes')).toBe(true);
  });

  it('mixes up the answer order but still marks the right option as correct', async () => {
    for (const rng of [() => 0, () => 0.5, () => 0.999]) {
      const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: twoPerTopic, rng });
      if (!result.ok) throw new Error('expected questions');
      for (const q of result.questions) {
        expect(q.options[q.correct]).toBe(`${q.text} — right`);
        expect(new Set(q.options).size).toBe(4);
      }
    }
  });

  it('does not always leave the correct answer in the position the AI put it', async () => {
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: twoPerTopic, rng: () => 0 });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions.some((q) => q.correct !== 1)).toBe(true);
  });

  it('never throws if the AI call itself blows up: it falls back to the notes', async () => {
    const broken = async (): Promise<GenerateQuestionsResult> => {
      throw new Error('boom');
    };
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked: [], generate: broken });
    if (!result.ok) throw new Error('expected questions');
    expect(result.questions.every((q) => q.source === 'notes')).toBe(true);
  });

  it('copes with a damaged history without throwing', async () => {
    const asked = [null, { topic: 3 }, { text: 42 }, 'junk'] as unknown as AskedQuestion[];
    const result = await loadDailyQuestions({ lang: 'en', cursor: 0, asked, generate: twoPerTopic });
    expect(result.ok).toBe(true);
  });
});

describe('practiceStatus', () => {
  const question = { topicId: '01-1', moduleId: '01', lessonN: 1, text: 'Q', options: ['a', 'b', 'c', 'd'], correct: 2, source: 'ai' as const };
  const set = (answers: Record<number, number>, date = '2026-10-10'): DailyPracticeSet => ({
    date,
    language: 'en',
    questions: [question, { ...question, text: 'Q2' }, { ...question, text: 'Q3' }],
    answers,
  });

  it('says nothing has been answered before today’s questions exist', () => {
    expect(practiceStatus(null, '2026-10-10')).toEqual({ state: 'none', answered: 0, correct: 0, total: DAILY_QUESTION_COUNT });
  });

  it('does not count yesterday’s answers towards today', () => {
    expect(practiceStatus(set({ 0: 2, 1: 2, 2: 2 }, '2026-10-09'), '2026-10-10').state).toBe('none');
  });

  it('counts answers and correct answers part-way through', () => {
    expect(practiceStatus(set({ 0: 2, 1: 0 }), '2026-10-10')).toEqual({ state: 'in-progress', answered: 2, correct: 1, total: 3 });
    expect(practiceStatus(set({}), '2026-10-10').state).toBe('in-progress');
  });

  it('is done once every question is answered, right or wrong', () => {
    expect(practiceStatus(set({ 0: 0, 1: 0, 2: 2 }), '2026-10-10')).toEqual({ state: 'done', answered: 3, correct: 1, total: 3 });
  });

  it('treats a damaged or empty saved set as nothing answered', () => {
    expect(practiceStatus({ date: '2026-10-10' } as unknown as DailyPracticeSet, '2026-10-10').state).toBe('none');
    expect(practiceStatus({ ...set({}), questions: [] }, '2026-10-10').state).toBe('none');
  });
});
