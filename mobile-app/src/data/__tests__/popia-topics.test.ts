import {
  getPopiaTopicContent,
  getPopiaTopicQuiz,
  POPIA_TOPIC_CONTENT,
  POPIA_TOPIC_QUIZZES,
  POPIA_TRANSLATED_CONTENT,
  POPIA_TRANSLATED_QUIZZES,
} from '@/data/popia-topics';

describe('POPIA_TOPIC_CONTENT', () => {
  it('has exactly 3 topics, sourced from PDF Sections 1, 2 and 4', () => {
    expect(POPIA_TOPIC_CONTENT).toHaveLength(3);
  });

  it('numbers topics 1-3 in order', () => {
    expect(POPIA_TOPIC_CONTENT.map((t) => t.n)).toEqual([1, 2, 3]);
  });

  it('gives every topic a non-empty title, intro and key takeaway', () => {
    for (const topic of POPIA_TOPIC_CONTENT) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.intro.length).toBeGreaterThan(0);
      expect(topic.keyTakeaway.length).toBeGreaterThan(0);
    }
  });

  it('gives every topic at least one content section, each with a heading and at least one item', () => {
    for (const topic of POPIA_TOPIC_CONTENT) {
      expect(topic.sections.length).toBeGreaterThan(0);
      for (const section of topic.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.items.length).toBeGreaterThan(0);
        for (const item of section.items) {
          expect(item.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('only gives topic 3 (What Organisations Must Do) a graded activity — the source\'s own "Extract A is compliant" checklist', () => {
    const graded = POPIA_TOPIC_CONTENT.filter((t) => t.activity?.correctIndex !== undefined).map((t) => t.n);
    expect(graded).toEqual([3]);
    const topic3 = POPIA_TOPIC_CONTENT[2];
    expect(topic3.activity?.options).toBeDefined();
    expect(topic3.activity!.correctIndex).toBeGreaterThanOrEqual(0);
    expect(topic3.activity!.correctIndex).toBeLessThan(topic3.activity!.options!.length);
  });

  it('leaves topic 1 (What is POPIA?) without a fabricated activity — the source has none for it', () => {
    expect(POPIA_TOPIC_CONTENT[0].activity).toBeUndefined();
  });
});

describe('POPIA_TOPIC_QUIZZES', () => {
  it('has 3 questions for each of the 3 topics, matching the source\'s Part B knowledge checks', () => {
    expect(POPIA_TOPIC_QUIZZES).toHaveLength(3);
    for (const quiz of POPIA_TOPIC_QUIZZES) {
      expect(quiz).toHaveLength(3);
    }
  });

  it('gives every question 4 options and a correct index within range', () => {
    for (const quiz of POPIA_TOPIC_QUIZZES) {
      for (const q of quiz) {
        expect(q.options).toHaveLength(4);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    }
  });

  it('matches the source\'s marked correct answers', () => {
    // Topic 1 (What is POPIA?): B) Protection of Personal Information Act, C) Data Subject, C) 1 July 2021
    expect(POPIA_TOPIC_QUIZZES[0].map((q) => q.correct)).toEqual([1, 2, 2]);
    // Topic 2 (Your Rights): C) not sold/shared without consent, B) correct/delete, D) know about a data breach [explicitly marked]
    expect(POPIA_TOPIC_QUIZZES[1].map((q) => q.correct)).toEqual([2, 1, 3]);
    // Topic 3 (What Orgs Must Do): B) Processing Limitation, C) Information Officer, C) vague/unspecified
    expect(POPIA_TOPIC_QUIZZES[2].map((q) => q.correct)).toEqual([1, 2, 2]);
  });
});

describe('getPopiaTopicContent', () => {
  it('returns the matching topic for a valid topic number', () => {
    expect(getPopiaTopicContent(1)?.title).toBe('What is POPIA?');
  });

  it('returns undefined outside the 1-3 range', () => {
    expect(getPopiaTopicContent(0)).toBeUndefined();
    expect(getPopiaTopicContent(4)).toBeUndefined();
  });
});

describe('getPopiaTopicQuiz', () => {
  it('returns the matching quiz for a valid topic number', () => {
    expect(getPopiaTopicQuiz(2)).toHaveLength(3);
  });

  it('returns undefined outside the 1-3 range', () => {
    expect(getPopiaTopicQuiz(0)).toBeUndefined();
    expect(getPopiaTopicQuiz(4)).toBeUndefined();
  });
});

// isiZulu and Xitsonga are sourced verbatim from the team's own native-language notes ("Zulu Notes/",
// "Tsonga Notes/" at the repo root): isiZulu has Sections 1, 2 and 4; Xitsonga has Sections 2 and 4
// only (its "Section 1" file turned out to be Sepedi). Sepedi topic 1 is that native-speaker file.
// Xitsonga topic 1 and Sepedi topics 2 and 3 are AI-translated from the English at the researcher's
// explicit request, so every language now covers every topic.
const TRANSLATED_COVERAGE = { zu: [1, 2, 3], ts: [1, 2, 3], nso: [1, 2, 3] } as const;
const LEFTOVER_MARKUP = /\*\*|\[IMPENDULO|\{ListParagraph\}|\{Heading|[Ѐ-ӿ]|•/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('POPIA translations', () => {
  it('covers every topic in every language, in topic order', () => {
    for (const [lang, topics] of Object.entries(TRANSLATED_COVERAGE)) {
      const content = POPIA_TRANSLATED_CONTENT[lang as keyof typeof TRANSLATED_COVERAGE] ?? [];
      const quizzes = POPIA_TRANSLATED_QUIZZES[lang as keyof typeof TRANSLATED_COVERAGE] ?? {};
      expect(content.map((t) => t.n)).toEqual([...topics]);
      expect(Object.keys(quizzes).map(Number)).toEqual([...topics]);
    }
  });

  it('never stores English under a translated language', () => {
    expect(POPIA_TRANSLATED_CONTENT.en).toBeUndefined();
    expect(POPIA_TRANSLATED_QUIZZES.en).toBeUndefined();
  });

  it('gives every translated topic the same shape as its English topic', () => {
    for (const content of Object.values(POPIA_TRANSLATED_CONTENT)) {
      for (const topic of content ?? []) {
        const en = POPIA_TOPIC_CONTENT[topic.n - 1];
        expect(topic.title.length).toBeGreaterThan(0);
        expect(topic.title).not.toBe(en.title);
        expect(topic.intro.length).toBeGreaterThan(0);
        expect(topic.keyTakeaway.length).toBeGreaterThan(0);
        expect(topic.sections).toHaveLength(en.sections.length);
        for (const section of topic.sections) {
          expect(section.heading.length).toBeGreaterThan(0);
          expect(section.items.length).toBeGreaterThan(0);
        }
        expect(Boolean(topic.example)).toBe(Boolean(en.example));
        expect(Boolean(topic.activity)).toBe(Boolean(en.activity));
        expect(topic.activity?.options?.length).toBe(en.activity?.options?.length);
        // A translation may never grade an activity the English source left ungraded, or flip the answer.
        expect(topic.activity?.correctIndex).toBe(en.activity?.correctIndex);
      }
    }
  });

  it('gives every translated quiz the same question count, option count and correct answer as English', () => {
    for (const quizzes of Object.values(POPIA_TRANSLATED_QUIZZES)) {
      for (const [n, quiz] of Object.entries(quizzes ?? {})) {
        const en = POPIA_TOPIC_QUIZZES[Number(n) - 1];
        expect(quiz).toHaveLength(en.length);
        quiz.forEach((q, i) => {
          expect(q.text.length).toBeGreaterThan(0);
          expect(q.options).toHaveLength(4);
          expect(q.correct).toBe(en[i].correct);
        });
      }
    }
  });

  it('carries no leftover document markup, answer-key markers or stray non-Latin characters into the app', () => {
    for (const text of [...allStrings(POPIA_TRANSLATED_CONTENT), ...allStrings(POPIA_TRANSLATED_QUIZZES)]) {
      expect(text).not.toMatch(LEFTOVER_MARKUP);
      expect(text).toBe(text.trim());
    }
  });
});

describe('getPopiaTopicContent / getPopiaTopicQuiz with a language', () => {
  it('defaults to English when no language is given', () => {
    expect(getPopiaTopicContent(1)).toBe(POPIA_TOPIC_CONTENT[0]);
    expect(getPopiaTopicQuiz(1)).toBe(POPIA_TOPIC_QUIZZES[0]);
  });

  it('returns English for "en"', () => {
    expect(getPopiaTopicContent(2, 'en')).toBe(POPIA_TOPIC_CONTENT[1]);
    expect(getPopiaTopicQuiz(2, 'en')).toBe(POPIA_TOPIC_QUIZZES[1]);
  });

  it('returns the isiZulu topic and quiz for every topic', () => {
    expect(getPopiaTopicContent(1, 'zu')?.title).toBe('Yini i-POPIA?');
    expect(getPopiaTopicContent(2, 'zu')?.title).toBe('Amalungelo Akho Njengomnikazi Wemininingwane');
    expect(getPopiaTopicContent(3, 'zu')?.title).toBe('Okumele Kwenziwe Yizinhlangano Ngaphansi Kwe-POPIA');
    expect(getPopiaTopicQuiz(1, 'zu')?.[0].text).toBe('I-POPIA isho ukuthini?');
  });

  it('returns the Xitsonga topic and quiz for every topic', () => {
    expect(getPopiaTopicContent(1, 'ts')?.title).toBe('POPIA i Yini?');
    expect(getPopiaTopicQuiz(1, 'ts')?.[0].text).toBe('Xana POPIA yi yimela yini?');
    expect(getPopiaTopicContent(2, 'ts')?.title).toBe('Timfanelo ta Wena tanihi Nhloko-mhaka ya Datha');
    expect(getPopiaTopicContent(3, 'ts')?.title).toBe('Leswi Tinhlangano Ti Faneleke Ti Swi Endla Ehansi ka POPIA');
    expect(getPopiaTopicQuiz(3, 'ts')?.[1].options[2]).toBe('Mutirhela-vuxokoxoko');
  });

  it('falls back to the English topic AND quiz together for a language with no translation at all', () => {
    // Every real language is covered now, so an unknown code stands in for "no translation".
    const unknown = 'xx' as unknown as 'en';
    expect(getPopiaTopicContent(1, unknown)).toBe(POPIA_TOPIC_CONTENT[0]);
    expect(getPopiaTopicQuiz(1, unknown)).toBe(POPIA_TOPIC_QUIZZES[0]);
    expect(getPopiaTopicContent(4, unknown)).toBeUndefined();
  });

  it('returns the Sepedi topic and quiz for every topic', () => {
    expect(getPopiaTopicContent(1, 'nso')?.title).toBe('POPIA ke eng?');
    expect(getPopiaTopicQuiz(1, 'nso')?.[0].text).toBe('POPIA e emela eng?');
    expect(getPopiaTopicContent(2, 'nso')?.title).toBe('Ditokelo tša Gago bjalo ka Mong wa Datha');
    expect(getPopiaTopicContent(3, 'nso')?.title).toBe('Seo Mekgatlo e Swanetšego go se Dira');
    expect(getPopiaTopicQuiz(2, 'nso')).not.toBe(POPIA_TOPIC_QUIZZES[1]);
    expect(getPopiaTopicQuiz(3, 'nso')).not.toBe(POPIA_TOPIC_QUIZZES[2]);
  });

  it('keeps the Sepedi topics item-for-item aligned with the English they were translated from', () => {
    for (const n of [2, 3]) {
      const nso = getPopiaTopicContent(n, 'nso')!;
      const en = POPIA_TOPIC_CONTENT[n - 1];
      nso.sections.forEach((section, i) => {
        expect(section.items).toHaveLength(en.sections[i].items.length);
        expect(Boolean(section.body)).toBe(Boolean(en.sections[i].body));
      });
    }
  });

  it('keeps facts that must not change in translation: the penalty figures, the regulator URL and the contact email', () => {
    const text = JSON.stringify(POPIA_TRANSLATED_CONTENT.nso);
    expect(text).toContain('R10 milione');
    expect(text).toContain('www.inforegulator.org.za');
    expect(text).toContain('privacy@company.co.za');
    expect(text).toContain('30');
  });

  it('still returns undefined out of range, in every language, instead of falling back to some topic', () => {
    for (const lang of ['en', 'zu', 'nso', 'ts'] as const) {
      expect(getPopiaTopicContent(0, lang)).toBeUndefined();
      expect(getPopiaTopicContent(4, lang)).toBeUndefined();
      expect(getPopiaTopicQuiz(0, lang)).toBeUndefined();
      expect(getPopiaTopicQuiz(4, lang)).toBeUndefined();
      expect(getPopiaTopicContent(Number.NaN, lang)).toBeUndefined();
      expect(getPopiaTopicQuiz(Number.NaN, lang)).toBeUndefined();
    }
  });
});
