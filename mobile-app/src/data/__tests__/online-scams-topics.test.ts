import { SUPPORTED_LANGUAGES } from '@/i18n';
import {
  getCapstoneQuestions,
  getTopicContent,
  getTopicQuiz,
  TOPIC_CONTENT,
  TOPIC_QUIZZES,
  type TopicContent,
} from '@/data/online-scams-topics';

const EXPECTED_QUIZ_LENGTHS = [3, 3, 3, 3, 3, 3, 3, 3, 5];

describe('TOPIC_CONTENT', () => {
  it.each(SUPPORTED_LANGUAGES)('has exactly 9 topics for %s', (lang) => {
    expect(TOPIC_CONTENT[lang]).toHaveLength(9);
  });

  it.each(SUPPORTED_LANGUAGES)('numbers topics 1-9 in order for %s', (lang) => {
    expect(TOPIC_CONTENT[lang].map((t) => t.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it.each(SUPPORTED_LANGUAGES)('gives every topic a non-empty title, intro and key takeaway for %s', (lang) => {
    for (const topic of TOPIC_CONTENT[lang]) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.intro.length).toBeGreaterThan(0);
      expect(topic.keyTakeaway.length).toBeGreaterThan(0);
    }
  });

  it.each(SUPPORTED_LANGUAGES)('gives topics 1-8 at least one content section; topic 9 (capstone) uses scenarios instead for %s', (lang) => {
    for (const topic of TOPIC_CONTENT[lang].slice(0, 8)) {
      expect(topic.sections.length).toBeGreaterThan(0);
    }
    expect(TOPIC_CONTENT[lang][8].sections).toHaveLength(0);
  });

  it.each(SUPPORTED_LANGUAGES)('gives every section a heading and at least one item for %s', (lang) => {
    for (const topic of TOPIC_CONTENT[lang]) {
      for (const section of topic.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.items.length).toBeGreaterThan(0);
        for (const item of section.items) {
          expect(item.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it.each(SUPPORTED_LANGUAGES)('gives topics 1-8 a worked example and an activity, topic 9 scenarios instead', (lang) => {
    const topics = TOPIC_CONTENT[lang];
    for (const topic of topics.slice(0, 8)) {
      expect(topic.example && topic.example.length).toBeGreaterThan(0);
      expect(topic.activity?.prompt.length).toBeGreaterThan(0);
      expect(topic.activity?.feedback.length).toBeGreaterThan(0);
    }
    const capstone = topics[8];
    expect(capstone.example).toBeUndefined();
    expect(capstone.scenarios).toBeDefined();
    expect(capstone.scenarios!.length).toBe(4);
    expect(capstone.reflection).toBeDefined();
    expect(capstone.reflection!.length).toBeGreaterThan(0);
    for (const scenario of capstone.scenarios!) {
      expect(scenario.label.length).toBeGreaterThan(0);
      expect(scenario.tasks.length).toBeGreaterThan(0);
    }
  });

  it.each(SUPPORTED_LANGUAGES)(
    'only marks an activity as graded when the source gave an explicit correct letter (topics 5 and 8), never fabricated',
    (lang) => {
      const topics = TOPIC_CONTENT[lang];
      const gradedTopicNumbers = topics
        .filter((t) => t.activity?.correctIndex !== undefined)
        .map((t) => t.n);
      expect(gradedTopicNumbers).toEqual([5, 8]);
    }
  );

  it.each(SUPPORTED_LANGUAGES)('keeps a graded activity correctIndex within its own options bounds for %s', (lang) => {
    for (const topic of TOPIC_CONTENT[lang]) {
      if (topic.activity?.correctIndex !== undefined) {
        expect(topic.activity.options).toBeDefined();
        expect(topic.activity.correctIndex).toBeGreaterThanOrEqual(0);
        expect(topic.activity.correctIndex).toBeLessThan(topic.activity.options!.length);
      }
    }
  });
});

describe('TOPIC_QUIZZES', () => {
  it.each(SUPPORTED_LANGUAGES)('has 9 knowledge checks, sized 3/3/3/3/3/3/3/3/5, for %s', (lang) => {
    expect(TOPIC_QUIZZES[lang]).toHaveLength(9);
    expect(TOPIC_QUIZZES[lang].map((qs) => qs.length)).toEqual(EXPECTED_QUIZ_LENGTHS);
  });

  it.each(SUPPORTED_LANGUAGES)('gives every question exactly 4 non-empty options for %s', (lang) => {
    for (const quiz of TOPIC_QUIZZES[lang]) {
      for (const q of quiz) {
        expect(q.options).toHaveLength(4);
        for (const option of q.options) {
          expect(option.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it.each(SUPPORTED_LANGUAGES)('keeps every correct index within the 4 options for %s', (lang) => {
    for (const quiz of TOPIC_QUIZZES[lang]) {
      for (const q of quiz) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(4);
      }
    }
  });

  it('agrees on correct-answer index across all 4 languages for every question (same source, same answers)', () => {
    for (let topicIdx = 0; topicIdx < 9; topicIdx++) {
      const lengths = SUPPORTED_LANGUAGES.map((lang) => TOPIC_QUIZZES[lang][topicIdx].length);
      expect(new Set(lengths).size).toBe(1);
      const questionCount = lengths[0];
      for (let qIdx = 0; qIdx < questionCount; qIdx++) {
        const corrects = SUPPORTED_LANGUAGES.map((lang) => TOPIC_QUIZZES[lang][topicIdx][qIdx].correct);
        expect(new Set(corrects).size).toBe(1);
      }
    }
  });
});

describe('getTopicContent', () => {
  it('returns the matching topic for a supported language', () => {
    const topic = getTopicContent('zu', 2) as TopicContent;
    expect(topic.n).toBe(2);
    expect(topic).toBe(TOPIC_CONTENT.zu[1]);
  });

  it('falls back to English for an unsupported language code instead of throwing', () => {
    // @ts-expect-error deliberately passing an unsupported code to check the runtime fallback
    const topic = getTopicContent('fr', 1);
    expect(topic).toBe(TOPIC_CONTENT.en[0]);
  });

  it('returns undefined for a topic number outside 1-9', () => {
    expect(getTopicContent('en', 0)).toBeUndefined();
    expect(getTopicContent('en', 10)).toBeUndefined();
  });
});

describe('getCapstoneQuestions', () => {
  it.each(SUPPORTED_LANGUAGES)('returns the 5 topic-9 questions in the shape scoreQuiz expects, for %s', (lang) => {
    const questions = getCapstoneQuestions(lang);
    expect(questions).toHaveLength(5);
    for (const [i, q] of questions.entries()) {
      expect(q.text).toBe(TOPIC_QUIZZES[lang][8][i].text);
      expect(q.options).toBe(TOPIC_QUIZZES[lang][8][i].options);
      expect(q.correct).toBe(TOPIC_QUIZZES[lang][8][i].correct);
      expect(q.area).toBe(TOPIC_CONTENT[lang][8].title);
    }
  });

  it('falls back to English for an unsupported language code instead of throwing', () => {
    // @ts-expect-error deliberately passing an unsupported code to check the runtime fallback
    expect(getCapstoneQuestions('fr')).toEqual(getCapstoneQuestions('en'));
  });
});

describe('getTopicQuiz', () => {
  it('returns the matching knowledge check for a supported language', () => {
    expect(getTopicQuiz('nso', 9)).toBe(TOPIC_QUIZZES.nso[8]);
  });

  it('falls back to English for an unsupported language code instead of throwing', () => {
    // @ts-expect-error deliberately passing an unsupported code to check the runtime fallback
    expect(getTopicQuiz('fr', 1)).toBe(TOPIC_QUIZZES.en[0]);
  });

  it('returns undefined for a topic number outside 1-9', () => {
    expect(getTopicQuiz('en', 0)).toBeUndefined();
    expect(getTopicQuiz('en', 10)).toBeUndefined();
  });
});
