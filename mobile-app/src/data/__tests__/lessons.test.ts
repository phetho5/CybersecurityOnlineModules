import { DIGITAL_PRIVACY_TOPIC_CONTENT } from '@/data/digital-privacy-topics';
import { getLesson, getLessonProgress, getLessons } from '@/data/lessons';
import { TOPIC_CONTENT } from '@/data/online-scams-topics';
import { POPIA_TOPIC_CONTENT } from '@/data/popia-topics';

describe('getLessons', () => {
  it('returns every lesson for a known module, numbered from 1', () => {
    const lessons = getLessons('01');
    expect(lessons.map((l) => l.n)).toEqual([1, 2, 3]);
    expect(lessons).toHaveLength(3);
  });

  it('returns an empty array for an unknown module id instead of throwing', () => {
    expect(getLessons('99')).toEqual([]);
  });

  it('gives module 01 (POPIA) 3 lessons, titled from the sourced topic content, not invented', () => {
    const lessons = getLessons('01');
    expect(lessons.map((l) => l.title)).toEqual(POPIA_TOPIC_CONTENT.map((t) => t.title));
  });

  it("gives module 02 (Online Scams) 9 lessons, titled from the sourced topic content, not invented", () => {
    const lessons = getLessons('02');
    expect(lessons).toHaveLength(9);
    expect(lessons.map((l) => l.title)).toEqual(TOPIC_CONTENT.en.map((t) => t.title));
  });

  it('gives module 03 (Digital Privacy) 2 lessons, titled from the sourced topic content, not invented', () => {
    const lessons = getLessons('03');
    expect(lessons.map((l) => l.title)).toEqual(DIGITAL_PRIVACY_TOPIC_CONTENT.map((t) => t.title));
  });

  it('leaves videoUrl/audioUrl undefined for lessons with no media yet, rather than fabricating a value', () => {
    for (const lesson of [getLesson('01', 1), getLesson('01', 3), getLesson('02', 1), getLesson('03', 2)]) {
      expect(lesson?.videoUrl).toBeUndefined();
      expect(lesson?.audioUrl).toBeUndefined();
    }
  });

  it("sets Thabo's identity theft video on Digital Privacy topic 1 (How Your Data Gets Misused) only", () => {
    const lessons = getLessons('03');
    expect(lessons[0].videoUrl).toBe(
      'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/Digital%20Privacy.mp4'
    );
    expect(lessons[1].videoUrl).toBeUndefined();
  });

  it('gives Digital Privacy no audio, since none has been supplied', () => {
    for (const lesson of getLessons('03')) expect(lesson.audioUrl).toBeUndefined();
  });

  it('shows the Digital Privacy video in every language, since it has no narration', () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      expect(getLesson('03', 1, lang)?.videoUrl).toContain('lesson-media/Digital%20Privacy.mp4');
    }
  });

  it('does not put the Digital Privacy video on any other module', () => {
    for (const moduleId of ['01', '02']) {
      for (const lesson of getLessons(moduleId)) expect(lesson.videoUrl ?? '').not.toContain('Digital%20Privacy.mp4');
    }
  });

  it("sets Lerato's POPIA video on POPIA topic 2 (Your Rights as a Data Subject) only", () => {
    const lessons = getLessons('01');
    expect(lessons[1].videoUrl).toBe(
      'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/POPIA.mp4'
    );
    expect(lessons[0].videoUrl).toBeUndefined();
    expect(lessons[2].videoUrl).toBeUndefined();
  });

  it('gives POPIA no audio, since none has been supplied', () => {
    for (const lesson of getLessons('01')) expect(lesson.audioUrl).toBeUndefined();
  });

  it('shows the POPIA video in every language, since it has no narration', () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      expect(getLesson('01', 2, lang)?.videoUrl).toContain('lesson-media/POPIA.mp4');
    }
  });

  it('does not put the POPIA video on any other module', () => {
    for (const moduleId of ['02', '03']) {
      for (const lesson of getLessons(moduleId)) expect(lesson.videoUrl ?? '').not.toContain('POPIA.mp4');
    }
  });

  it('sets real uploaded video URLs only on the Online Scams topics that actually have one (2, 3, 5, 9)', () => {
    const lessons = getLessons('02');
    const withVideo = lessons.filter((l) => l.videoUrl).map((l) => l.n);
    expect(withVideo.sort((a, b) => a - b)).toEqual([2, 3, 5, 9]);
    expect(lessons[1].videoUrl).toContain('WHATSAPP%20SCAM.mp4');
    expect(lessons[2].videoUrl).toContain('SMS%20SCAM.mp4');
    expect(lessons[4].videoUrl).toContain('DIGIAL%20SCAM%20SCENARIO.mp4');
    expect(lessons[8].videoUrl).toContain('AVOID%20SCAMS.mp4');
  });
});

describe('getLesson', () => {
  it('returns the matching lesson for a valid module + lesson number', () => {
    const lesson = getLesson('02', 2);
    expect(lesson?.title).toBe(TOPIC_CONTENT.en[1].title);
  });

  it('returns undefined for a lesson number below the valid range', () => {
    expect(getLesson('02', 0)).toBeUndefined();
    expect(getLesson('02', -1)).toBeUndefined();
  });

  it('returns undefined for a lesson number past the end of the module', () => {
    expect(getLesson('02', 10)).toBeUndefined();
  });

  it('returns undefined for an unknown module id', () => {
    expect(getLesson('99', 1)).toBeUndefined();
  });
});

describe('getLessonProgress', () => {
  it('marks lessons done up to the completed count, one in-progress, the rest locked', () => {
    const progress = getLessonProgress('02', 25, 9);
    expect(progress.map((l) => l.status)).toEqual([
      'done',
      'done',
      'in-progress',
      'locked',
      'locked',
      'locked',
      'locked',
      'locked',
      'locked',
    ]);
  });

  it('marks every lesson locked-then-in-progress at 0% (nothing done yet)', () => {
    const progress = getLessonProgress('01', 0, 3);
    expect(progress[0].status).toBe('in-progress');
    expect(progress.slice(1).every((l) => l.status === 'locked')).toBe(true);
  });

  it('marks every lesson done at 100%', () => {
    const progress = getLessonProgress('01', 100, 3);
    expect(progress.every((l) => l.status === 'done')).toBe(true);
  });
});

describe('lesson names follow the chosen language', () => {
  it('defaults to English when no language is given', () => {
    expect(getLessons('01').map((l) => l.title)).toEqual(POPIA_TOPIC_CONTENT.map((t) => t.title));
  });

  it('names every Online Scams lesson in isiZulu, Sepedi and Xitsonga', () => {
    for (const lang of ['zu', 'nso', 'ts'] as const) {
      expect(getLessons('02', lang).map((l) => l.title)).toEqual(TOPIC_CONTENT[lang].map((t) => t.title));
      expect(getLessons('02', lang)[0].title).not.toBe(TOPIC_CONTENT.en[0].title);
    }
  });

  it('names POPIA and Digital Privacy lessons in the chosen language', () => {
    expect(getLessons('01', 'zu').map((l) => l.title)).toEqual([
      'Yini i-POPIA?',
      'Amalungelo Akho Njengomnikazi Wemininingwane',
      'Okumele Kwenziwe Yizinhlangano Ngaphansi Kwe-POPIA',
    ]);
    expect(getLessons('03', 'nso')[1].title).toBe('Go Šireletša Sephiri sa Gago sa Dijithale');
  });

  it('names every POPIA lesson in Xitsonga', () => {
    const titles = getLessons('01', 'ts').map((l) => l.title);
    expect(titles[0]).toBe('POPIA i Yini?');
    expect(titles[1]).toBe('Timfanelo ta Wena tanihi Nhloko-mhaka ya Datha');
  });

  it('falls back to the English lesson names for a language with no translation, rather than blanks', () => {
    const unknown = 'xx' as unknown as 'en';
    expect(getLessons('01', unknown).map((l) => l.title)).toEqual(POPIA_TOPIC_CONTENT.map((t) => t.title));
  });

  it('keeps the same lesson count, numbering, minutes and media in every language', () => {
    for (const moduleId of ['01', '02', '03']) {
      const en = getLessons(moduleId);
      for (const lang of ['zu', 'nso', 'ts'] as const) {
        const translated = getLessons(moduleId, lang);
        expect(translated.map(({ n, minutes, videoUrl, audioUrl }) => ({ n, minutes, videoUrl, audioUrl }))).toEqual(
          en.map(({ n, minutes, videoUrl, audioUrl }) => ({ n, minutes, videoUrl, audioUrl }))
        );
      }
    }
  });

  it('getLesson and getLessonProgress pass the language through', () => {
    expect(getLesson('01', 1, 'nso')?.title).toBe('POPIA ke eng?');
    expect(getLessonProgress('01', 0, 3, 'zu')[0].title).toBe('Yini i-POPIA?');
    expect(getLesson('99', 1, 'zu')).toBeUndefined();
    expect(getLessons('99', 'zu')).toEqual([]);
  });
});
