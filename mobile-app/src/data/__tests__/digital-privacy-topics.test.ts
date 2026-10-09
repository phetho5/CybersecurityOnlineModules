import {
  DIGITAL_PRIVACY_TOPIC_CONTENT,
  DIGITAL_PRIVACY_TOPIC_QUIZZES,
  DIGITAL_PRIVACY_TRANSLATED_CONTENT,
  DIGITAL_PRIVACY_TRANSLATED_QUIZZES,
  getDigitalPrivacyFinalAssessment,
  getDigitalPrivacyTopicContent,
  getDigitalPrivacyTopicQuiz,
} from '@/data/digital-privacy-topics';

describe('DIGITAL_PRIVACY_TOPIC_CONTENT', () => {
  it('has exactly 2 topics, sourced from PDF Sections 3 and 5', () => {
    expect(DIGITAL_PRIVACY_TOPIC_CONTENT).toHaveLength(2);
  });

  it('numbers topics 1-2 in order', () => {
    expect(DIGITAL_PRIVACY_TOPIC_CONTENT.map((t) => t.n)).toEqual([1, 2]);
  });

  it('gives every topic a non-empty title, intro and key takeaway', () => {
    for (const topic of DIGITAL_PRIVACY_TOPIC_CONTENT) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.intro.length).toBeGreaterThan(0);
      expect(topic.keyTakeaway.length).toBeGreaterThan(0);
    }
  });

  it('gives every topic at least one content section, each with a heading and at least one item', () => {
    for (const topic of DIGITAL_PRIVACY_TOPIC_CONTENT) {
      expect(topic.sections.length).toBeGreaterThan(0);
      for (const section of topic.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.items.length).toBeGreaterThan(0);
      }
    }
  });

  it('gives topic 1 (How Your Data Gets Misused) the real Sipho/WhatsApp group scenario as its example', () => {
    expect(DIGITAL_PRIVACY_TOPIC_CONTENT[0].example).toContain('Sipho');
  });

  it('leaves both topics without a fabricated activity — neither source section had a labelled exercise', () => {
    for (const topic of DIGITAL_PRIVACY_TOPIC_CONTENT) {
      expect(topic.activity).toBeUndefined();
    }
  });
});

describe('DIGITAL_PRIVACY_TOPIC_QUIZZES', () => {
  it('gives topic 1 a 3-question knowledge check and topic 2 the real 10-question final assessment', () => {
    expect(DIGITAL_PRIVACY_TOPIC_QUIZZES).toHaveLength(2);
    expect(DIGITAL_PRIVACY_TOPIC_QUIZZES[0]).toHaveLength(3);
    expect(DIGITAL_PRIVACY_TOPIC_QUIZZES[1]).toHaveLength(10);
  });

  it('gives every question 4 options and a correct index within range', () => {
    for (const quiz of DIGITAL_PRIVACY_TOPIC_QUIZZES) {
      for (const q of quiz) {
        expect(q.options).toHaveLength(4);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    }
  });

  it("matches the source's marked correct answers for topic 1 (How Your Data Gets Misused)", () => {
    expect(DIGITAL_PRIVACY_TOPIC_QUIZZES[0].map((q) => q.correct)).toEqual([1, 2, 1]);
  });

  it("matches the source's marked correct answers for the Section 5 final assessment", () => {
    expect(DIGITAL_PRIVACY_TOPIC_QUIZZES[1].map((q) => q.correct)).toEqual([3, 2, 1, 2, 3, 2, 1, 2, 2, 1]);
  });
});

describe('getDigitalPrivacyTopicContent / getDigitalPrivacyTopicQuiz', () => {
  it('returns the matching topic/quiz for a valid topic number', () => {
    expect(getDigitalPrivacyTopicContent(2)?.title).toBe('Protecting Your Digital Privacy');
    expect(getDigitalPrivacyTopicQuiz(2)).toHaveLength(10);
  });

  it('returns undefined outside the 1-2 range', () => {
    expect(getDigitalPrivacyTopicContent(0)).toBeUndefined();
    expect(getDigitalPrivacyTopicContent(3)).toBeUndefined();
    expect(getDigitalPrivacyTopicQuiz(0)).toBeUndefined();
    expect(getDigitalPrivacyTopicQuiz(3)).toBeUndefined();
  });
});

describe('getDigitalPrivacyFinalAssessment', () => {
  it("adapts topic 2's 10-question quiz into the shared Question[] shape used by scoreQuiz/the result screen", () => {
    const questions = getDigitalPrivacyFinalAssessment();
    expect(questions).toHaveLength(10);
    expect(questions[0].text).toBe(DIGITAL_PRIVACY_TOPIC_QUIZZES[1][0].text);
    expect(questions[0].correct).toBe(DIGITAL_PRIVACY_TOPIC_QUIZZES[1][0].correct);
    expect(questions[0].area.length).toBeGreaterThan(0);
  });
});

// isiZulu and Xitsonga are sourced verbatim from the team's own native-language notes ("Zulu Notes/",
// "Tsonga Notes/" at the repo root): both have Sections 3 and 5. Sepedi is AI-translated from the
// English at the researcher's explicit request — no native-speaker source exists for it.
const LEFTOVER_MARKUP = /\*\*|\[IMPENDULO|\{ListParagraph\}|\{Heading|<TABLE>|[Ѐ-ӿ]|•|–/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('Digital Privacy translations', () => {
  it('covers both topics in isiZulu, Xitsonga and Sepedi', () => {
    for (const lang of ['zu', 'ts', 'nso'] as const) {
      expect(DIGITAL_PRIVACY_TRANSLATED_CONTENT[lang]?.map((t) => t.n)).toEqual([1, 2]);
      expect(Object.keys(DIGITAL_PRIVACY_TRANSLATED_QUIZZES[lang] ?? {}).map(Number)).toEqual([1, 2]);
    }
    expect(DIGITAL_PRIVACY_TRANSLATED_CONTENT.en).toBeUndefined();
  });

  it('gives every translated topic the same shape as its English topic', () => {
    for (const content of Object.values(DIGITAL_PRIVACY_TRANSLATED_CONTENT)) {
      for (const topic of content ?? []) {
        const en = DIGITAL_PRIVACY_TOPIC_CONTENT[topic.n - 1];
        expect(topic.title.length).toBeGreaterThan(0);
        expect(topic.title).not.toBe(en.title);
        expect(topic.intro.length).toBeGreaterThan(0);
        expect(topic.keyTakeaway.length).toBeGreaterThan(0);
        expect(topic.sections).toHaveLength(en.sections.length);
        topic.sections.forEach((section, i) => {
          expect(section.heading.length).toBeGreaterThan(0);
          expect(section.items).toHaveLength(en.sections[i].items.length);
        });
        expect(Boolean(topic.example)).toBe(Boolean(en.example));
        // Neither source section has a labelled exercise, in any language.
        expect(topic.activity).toBeUndefined();
      }
    }
  });

  it("keeps the Sipho/WhatsApp group scenario as topic 1's example in every translation", () => {
    expect(DIGITAL_PRIVACY_TRANSLATED_CONTENT.zu?.[0].example).toContain('USipho');
    expect(DIGITAL_PRIVACY_TRANSLATED_CONTENT.ts?.[0].example).toContain('Sipho');
    expect(DIGITAL_PRIVACY_TRANSLATED_CONTENT.nso?.[0].example).toContain('Sipho');
  });

  it('gives every translated quiz the same question count, option count and correct answer as English', () => {
    for (const quizzes of Object.values(DIGITAL_PRIVACY_TRANSLATED_QUIZZES)) {
      for (const [n, quiz] of Object.entries(quizzes ?? {})) {
        const en = DIGITAL_PRIVACY_TOPIC_QUIZZES[Number(n) - 1];
        expect(quiz).toHaveLength(en.length);
        quiz.forEach((q, i) => {
          expect(q.text.length).toBeGreaterThan(0);
          expect(q.options).toHaveLength(4);
          expect(q.correct).toBe(en[i].correct);
        });
      }
    }
  });

  it('keeps the language-neutral password options identical to English in the final assessment', () => {
    const enOptions = DIGITAL_PRIVACY_TOPIC_QUIZZES[1][0].options;
    expect(DIGITAL_PRIVACY_TRANSLATED_QUIZZES.zu?.[2][0].options).toEqual(enOptions);
    expect(DIGITAL_PRIVACY_TRANSLATED_QUIZZES.ts?.[2][0].options).toEqual(enOptions);
    expect(DIGITAL_PRIVACY_TRANSLATED_QUIZZES.nso?.[2][0].options).toEqual(enOptions);
  });

  it('keeps facts that must not change in the Sepedi translation: figures, names and contact details', () => {
    const text = JSON.stringify(DIGITAL_PRIVACY_TRANSLATED_CONTENT.nso);
    for (const fact of [
      'Experian',
      '2020',
      '793 000',
      'SASSA',
      'www.inforegulator.org.za',
      'inforeg@justice.gov.za',
      'JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001',
      '010 023 5207',
      'Legal Aid South Africa',
    ]) {
      expect(text).toContain(fact);
    }
  });

  it('carries no leftover document markup, answer-key markers or stray non-Latin characters into the app', () => {
    for (const text of [
      ...allStrings(DIGITAL_PRIVACY_TRANSLATED_CONTENT),
      ...allStrings(DIGITAL_PRIVACY_TRANSLATED_QUIZZES),
    ]) {
      expect(text).not.toMatch(LEFTOVER_MARKUP);
      expect(text).toBe(text.trim());
    }
  });
});

describe('Digital Privacy getters with a language', () => {
  it('defaults to English when no language is given', () => {
    expect(getDigitalPrivacyTopicContent(1)).toBe(DIGITAL_PRIVACY_TOPIC_CONTENT[0]);
    expect(getDigitalPrivacyTopicQuiz(2)).toBe(DIGITAL_PRIVACY_TOPIC_QUIZZES[1]);
  });

  it('returns isiZulu and Xitsonga content and quizzes', () => {
    expect(getDigitalPrivacyTopicContent(1, 'zu')?.title).toBe('Isetshenziswa Kanjani Kabi Imininingwane Yakho');
    expect(getDigitalPrivacyTopicContent(2, 'zu')?.title).toBe('Ukuvikela Ubumfihlo Bakho Bedijithali');
    expect(getDigitalPrivacyTopicContent(2, 'ts')?.title).toBe('Ku Sirhelela Vuhlayiseki bya wena bya Dijitali');
    expect(getDigitalPrivacyTopicQuiz(2, 'zu')).toHaveLength(10);
    expect(getDigitalPrivacyTopicQuiz(1, 'ts')).toHaveLength(3);
  });

  it('returns Sepedi content and quizzes', () => {
    expect(getDigitalPrivacyTopicContent(1, 'nso')?.title).toBe('Kamoo Datha ya Gago e Šomišwago Gampe ka Gona');
    expect(getDigitalPrivacyTopicContent(2, 'nso')?.title).toBe('Go Šireletša Sephiri sa Gago sa Dijithale');
    expect(getDigitalPrivacyTopicQuiz(1, 'nso')).toHaveLength(3);
    expect(getDigitalPrivacyTopicQuiz(2, 'nso')).toHaveLength(10);
  });

  it('still returns undefined out of range in every language', () => {
    for (const lang of ['en', 'zu', 'nso', 'ts'] as const) {
      expect(getDigitalPrivacyTopicContent(0, lang)).toBeUndefined();
      expect(getDigitalPrivacyTopicContent(3, lang)).toBeUndefined();
      expect(getDigitalPrivacyTopicQuiz(0, lang)).toBeUndefined();
      expect(getDigitalPrivacyTopicQuiz(3, lang)).toBeUndefined();
    }
  });
});

describe('getDigitalPrivacyFinalAssessment with a language', () => {
  it('serves the final assessment in the requested language, scored against the same answers as English', () => {
    const en = getDigitalPrivacyFinalAssessment('en');
    for (const lang of ['zu', 'ts', 'nso'] as const) {
      const questions = getDigitalPrivacyFinalAssessment(lang);
      expect(questions).toHaveLength(10);
      expect(questions.map((q) => q.correct)).toEqual(en.map((q) => q.correct));
      expect(questions[1].text).not.toBe(en[1].text);
      expect(questions[0].area).toBe(getDigitalPrivacyTopicContent(2, lang)?.title);
    }
  });

});
