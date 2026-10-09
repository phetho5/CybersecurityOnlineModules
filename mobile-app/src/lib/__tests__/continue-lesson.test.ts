import { getContinueLesson } from '@/lib/continue-lesson';

describe('getContinueLesson', () => {
  it('picks the first not-yet-complete module and its in-progress lesson', () => {
    const result = getContinueLesson({ '01': 100, '02': 40, '03': 0 });
    expect(result?.moduleId).toBe('02');
    // 40% of 9 lessons = floor(3.6) = 3 done, so lesson 4 (1-indexed) is in progress.
    expect(result?.lessonN).toBe(4);
  });

  it('picks lesson 1 of the first module when nothing has been started', () => {
    const result = getContinueLesson({ '01': 0, '02': 0, '03': 0 });
    expect(result?.moduleId).toBe('01');
    expect(result?.lessonN).toBe(1);
  });

  it('returns null when every module is 100% complete, instead of pointing at stale content', () => {
    expect(getContinueLesson({ '01': 100, '02': 100, '03': 100 })).toBeNull();
  });

  it('treats a module missing from progress as 0%, not as complete', () => {
    const result = getContinueLesson({ '01': 100 });
    expect(result?.moduleId).toBe('02');
    expect(result?.lessonN).toBe(1);
  });
});

describe('getContinueLesson — language', () => {
  it('names the next lesson in the chosen language', () => {
    expect(getContinueLesson({}, 'zu')?.lessonTitle).toBe('Yini i-POPIA?');
    expect(getContinueLesson({}, 'nso')?.lessonTitle).toBe('POPIA ke eng?');
  });

  it('defaults to English and still points at the same lesson whatever the language', () => {
    const en = getContinueLesson({ '01': 100, '02': 40 });
    const ts = getContinueLesson({ '01': 100, '02': 40 }, 'ts');
    expect(en?.lessonTitle).toBe(getContinueLesson({ '01': 100, '02': 40 }, 'en')?.lessonTitle);
    expect(ts?.moduleId).toBe(en?.moduleId);
    expect(ts?.lessonN).toBe(en?.lessonN);
    expect(ts?.lessonTitle).not.toBe(en?.lessonTitle);
  });

  it('still returns null in every language once every module is complete', () => {
    for (const lang of ['en', 'zu', 'nso', 'ts'] as const) {
      expect(getContinueLesson({ '01': 100, '02': 100, '03': 100 }, lang)).toBeNull();
    }
  });
});
