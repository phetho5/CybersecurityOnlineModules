import { TOPIC_CONTENT } from '@/data/online-scams-topics';
import { getModuleFinalAssessment, getModuleTopicContent, getModuleTopicQuiz } from '@/lib/topic-source';

describe('getModuleTopicContent', () => {
  it('resolves POPIA (01) topics from the POPIA data source', () => {
    expect(getModuleTopicContent('01', 'en', 1)?.title).toBe('What is POPIA?');
  });

  it('resolves Online Scams (02) topics from its own data source, ignoring language for now', () => {
    expect(getModuleTopicContent('02', 'en', 1)?.title).toBe(TOPIC_CONTENT.en[0].title);
  });

  it('resolves Digital Privacy (03) topics from the Digital Privacy data source', () => {
    expect(getModuleTopicContent('03', 'en', 2)?.title).toBe('Protecting Your Digital Privacy');
  });

  it('returns undefined for an unknown module id instead of throwing', () => {
    expect(getModuleTopicContent('99', 'en', 1)).toBeUndefined();
  });

  it('returns undefined for a topic number out of range for a known module', () => {
    expect(getModuleTopicContent('01', 'en', 99)).toBeUndefined();
  });
});

describe('getModuleTopicQuiz', () => {
  it('resolves each module’s own quiz by topic number', () => {
    expect(getModuleTopicQuiz('01', 'en', 1)).toHaveLength(3);
    expect(getModuleTopicQuiz('03', 'en', 2)).toHaveLength(10);
  });

  it('returns undefined for an unknown module id', () => {
    expect(getModuleTopicQuiz('99', 'en', 1)).toBeUndefined();
  });
});

describe('getModuleFinalAssessment', () => {
  it('gives Online Scams (02) and Digital Privacy (03) a real final assessment', () => {
    expect(getModuleFinalAssessment('02', 'en')).toHaveLength(5);
    expect(getModuleFinalAssessment('03', 'en')).toHaveLength(10);
  });

  it('gives POPIA (01) no final assessment — its source never authored a standalone exam', () => {
    expect(getModuleFinalAssessment('01', 'en')).toBeUndefined();
  });

  it('returns undefined for an unknown module id', () => {
    expect(getModuleFinalAssessment('99', 'en')).toBeUndefined();
  });
});

describe('language handling for POPIA (01) and Digital Privacy (03)', () => {
  it("serves POPIA lesson content and its knowledge check in the student's language", () => {
    expect(getModuleTopicContent('01', 'zu', 1)?.title).toBe('Yini i-POPIA?');
    expect(getModuleTopicQuiz('01', 'zu', 1)?.[0].text).toBe('I-POPIA isho ukuthini?');
    expect(getModuleTopicContent('01', 'ts', 2)?.title).toBe('Timfanelo ta Wena tanihi Nhloko-mhaka ya Datha');
  });

  it("serves Digital Privacy lesson content, knowledge check and final assessment in the student's language", () => {
    expect(getModuleTopicContent('03', 'ts', 2)?.title).toBe('Ku Sirhelela Vuhlayiseki bya wena bya Dijitali');
    expect(getModuleTopicQuiz('03', 'zu', 1)?.[0].text).toContain('UZanele');
    expect(getModuleFinalAssessment('03', 'zu')?.[1].text).toContain('UThandi');
  });

  it('shows the English lesson, never a blank one, for a language with no translation', () => {
    const unknown = 'xx' as unknown as 'en';
    expect(getModuleTopicContent('01', unknown, 1)?.title).toBe('What is POPIA?');
    expect(getModuleTopicQuiz('03', unknown, 2)).toHaveLength(10);
    expect(getModuleFinalAssessment('03', unknown)).toHaveLength(10);
  });

  it('has no English lesson left in any language: every topic of every module is translated', () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      for (const [moduleId, count] of [['01', 3], ['02', 9], ['03', 2]] as const) {
        for (let n = 1; n <= count; n += 1) {
          const translated = getModuleTopicContent(moduleId, lang, n);
          expect({ lang, moduleId, n, title: translated?.title }).not.toEqual({
            lang,
            moduleId,
            n,
            title: getModuleTopicContent(moduleId, 'en', n)?.title,
          });
        }
      }
    }
  });

  it('serves both modules in Sepedi, including the Digital Privacy final assessment', () => {
    expect(getModuleTopicContent('01', 'nso', 2)?.title).toBe('Ditokelo tša Gago bjalo ka Mong wa Datha');
    expect(getModuleTopicContent('03', 'nso', 1)?.title).toBe('Kamoo Datha ya Gago e Šomišwago Gampe ka Gona');
    expect(getModuleFinalAssessment('03', 'nso')).toHaveLength(10);
    expect(getModuleFinalAssessment('03', 'nso')?.[1].text).toContain('Thandi');
    expect(getModuleFinalAssessment('03', 'nso')?.[1].text).not.toBe(getModuleFinalAssessment('03', 'en')?.[1].text);
  });

  it('never lets the language change which answer is correct, so a score means the same in every language', () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      for (const [moduleId, topics] of [
        ['01', [1, 2, 3]],
        ['03', [1, 2]],
      ] as const) {
        for (const n of topics) {
          expect(getModuleTopicQuiz(moduleId, lang, n)?.map((q) => q.correct)).toEqual(
            getModuleTopicQuiz(moduleId, 'en', n)?.map((q) => q.correct),
          );
        }
      }
    }
  });
});
