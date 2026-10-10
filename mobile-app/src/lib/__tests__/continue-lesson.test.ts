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

describe('getContinueLesson — where the student actually left off', () => {
  it('resumes the lesson the student last had open, even in a later module than the first unfinished one', () => {
    const result = getContinueLesson({ '01': 34 }, 'en', { moduleId: '02', lessonN: 4 });
    expect(result?.moduleId).toBe('02');
    expect(result?.lessonN).toBe(4);
    expect(result?.lessonCount).toBe(9);
  });

  it('resumes a lesson the student opened ahead of their recorded progress', () => {
    expect(getContinueLesson({}, 'en', { moduleId: '01', lessonN: 3 })?.lessonN).toBe(3);
  });

  it('moves on to the next lesson of that module once the last-opened lesson has been finished', () => {
    // Lesson 2 of POPIA finished (67%), and it was the last one opened: carry on at lesson 3.
    const result = getContinueLesson({ '01': 67 }, 'en', { moduleId: '01', lessonN: 2 });
    expect(result?.moduleId).toBe('01');
    expect(result?.lessonN).toBe(3);
  });

  it('falls back to the first unfinished module when the last-opened module is now complete', () => {
    const result = getContinueLesson({ '01': 100 }, 'en', { moduleId: '01', lessonN: 3 });
    expect(result?.moduleId).toBe('02');
    expect(result?.lessonN).toBe(1);
  });

  it('ignores a saved lesson that does not exist, rather than pointing at a "Lesson not found" screen', () => {
    for (const bad of [
      { moduleId: '99', lessonN: 1 },
      { moduleId: '01', lessonN: 0 },
      { moduleId: '01', lessonN: 7 },
      { moduleId: '01', lessonN: Number.NaN },
      { moduleId: '01', lessonN: 1.5 },
    ]) {
      const result = getContinueLesson({}, 'en', bad);
      expect(result?.moduleId).toBe('01');
      expect(result?.lessonN).toBe(1);
    }
  });

  it('behaves exactly as before when nothing has been opened yet', () => {
    expect(getContinueLesson({ '01': 100, '02': 40 }, 'en', null)).toEqual(getContinueLesson({ '01': 100, '02': 40 }, 'en'));
  });

  it('still says everything is complete, whatever was opened last', () => {
    expect(getContinueLesson({ '01': 100, '02': 100, '03': 100 }, 'en', { moduleId: '02', lessonN: 4 })).toBeNull();
  });

  it('names the resumed lesson in the chosen language', () => {
    const zu = getContinueLesson({}, 'zu', { moduleId: '02', lessonN: 4 });
    const en = getContinueLesson({}, 'en', { moduleId: '02', lessonN: 4 });
    expect(zu?.lessonN).toBe(4);
    expect(zu?.lessonTitle).not.toBe(en?.lessonTitle);
  });
});
