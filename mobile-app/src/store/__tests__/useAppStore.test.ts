import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyQuestion } from '@/lib/daily-practice';
import { toLocalDateKey } from '@/lib/streak';
import * as sync from '@/lib/sync';
import { useAppStore } from '@/store/useAppStore';

jest.mock('@/lib/sync', () => {
  const actual = jest.requireActual('@/lib/sync');
  return {
    ...actual,
    upsertModuleProgress: jest.fn().mockResolvedValue({ ok: true }),
    awardBadge: jest.fn().mockResolvedValue({ ok: true }),
  };
});

jest.mock('@/i18n', () => ({
  __esModule: true,
  default: { changeLanguage: jest.fn() },
}));

const mockUpsertModuleProgress = sync.upsertModuleProgress as jest.Mock;
const mockAwardBadge = sync.awardBadge as jest.Mock;

const initialState = useAppStore.getState();

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockUpsertModuleProgress.mockClear();
    mockAwardBadge.mockClear();
  });

  describe('initial state', () => {
    it('starts a real student at zero — no seeded streak, progress or badges pretending prior activity', () => {
      expect(initialState.streak).toBe(0);
      expect(initialState.moduleProgress).toEqual({});
      expect(initialState.earnedBadgeIds).toEqual([]);
    });
  });

  describe('toggleClue / checkClues', () => {
    it('toggles a clue on and off before checking', () => {
      useAppStore.getState().toggleClue('clue-1');
      expect(useAppStore.getState().cluesPicked).toEqual(['clue-1']);
      useAppStore.getState().toggleClue('clue-1');
      expect(useAppStore.getState().cluesPicked).toEqual([]);
    });

    it('ignores further clue taps once clues have been checked (guards double-tap after submit)', () => {
      useAppStore.getState().toggleClue('clue-1');
      useAppStore.getState().checkClues();
      useAppStore.getState().toggleClue('clue-2');
      expect(useAppStore.getState().cluesPicked).toEqual(['clue-1']);
    });

    it('resetLesson clears picks and the checked flag', () => {
      useAppStore.getState().toggleClue('clue-1');
      useAppStore.getState().checkClues();
      useAppStore.getState().resetLesson();
      expect(useAppStore.getState().cluesPicked).toEqual([]);
      expect(useAppStore.getState().cluesChecked).toBe(false);
    });
  });

  describe('answerQuestion', () => {
    it('records the picked option for a question', () => {
      useAppStore.getState().answerQuestion(0, 2);
      expect(useAppStore.getState().quizAnswers).toEqual({ 0: 2 });
    });

    it('ignores a second tap on an already-answered question (double-tap before state settles)', () => {
      useAppStore.getState().answerQuestion(0, 2);
      useAppStore.getState().answerQuestion(0, 1);
      expect(useAppStore.getState().quizAnswers).toEqual({ 0: 2 });
    });

    it('resetQuiz clears all recorded answers', () => {
      useAppStore.getState().answerQuestion(0, 2);
      useAppStore.getState().resetQuiz();
      expect(useAppStore.getState().quizAnswers).toEqual({});
    });
  });

  describe('completeModule', () => {
    it('sets module progress to 100 locally regardless of sign-in state', () => {
      useAppStore.getState().completeModule('01');
      expect(useAppStore.getState().moduleProgress['01']).toBe(100);
    });

    it('adds a badge id once and never duplicates it on repeat completion', () => {
      useAppStore.getState().completeModule('02', 'scam-spotter');
      useAppStore.getState().completeModule('02', 'scam-spotter');
      expect(useAppStore.getState().earnedBadgeIds.filter((b) => b === 'scam-spotter')).toHaveLength(1);
    });

    it('does not add an assessment badge when none is passed', () => {
      useAppStore.getState().completeModule('03');
      expect(useAppStore.getState().earnedBadgeIds).not.toContain('popia-aware');
      expect(useAppStore.getState().earnedBadgeIds).not.toContain('scam-spotter');
    });

    it('does not sync to Supabase when there is no signed-in user (offline/anon sign-in disabled)', () => {
      useAppStore.setState({ userId: null });
      useAppStore.getState().completeModule('01', 'scam-spotter');
      expect(mockUpsertModuleProgress).not.toHaveBeenCalled();
      expect(mockAwardBadge).not.toHaveBeenCalled();
    });

    it('fires a background progress sync scoped to the signed-in user without blocking local state', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().completeModule('01');
      expect(useAppStore.getState().moduleProgress['01']).toBe(100);
      expect(mockUpsertModuleProgress).toHaveBeenCalledWith('user-1', '01', 100);
    });

    it('fires a background badge-award sync only when a badge id is provided', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().completeModule('02', 'scam-spotter');
      expect(mockAwardBadge).toHaveBeenCalledWith('user-1', 'scam-spotter');

      mockAwardBadge.mockClear();
      useAppStore.getState().completeModule('03');
      expect(mockAwardBadge).not.toHaveBeenCalled();
    });
  });

  describe('certificates', () => {
    afterEach(() => jest.useRealTimers());

    it('starts with no name and no certificates', () => {
      expect(initialState.studentName).toBeNull();
      expect(initialState.certificates).toEqual({});
    });

    it('issues a certificate with the score, today’s date and the current language when a final assessment is passed', () => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 9, 5, 12));
      useAppStore.setState({ language: 'zu' });
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      const cert = useAppStore.getState().certificates['02'];
      expect(cert).toMatchObject({ moduleId: '02', scorePct: 80, language: 'zu', awardedAt: new Date(2026, 9, 5, 12).toISOString() });
      expect(cert.id).toMatch(/^CA-02-20261005-[A-HJ-NP-Z2-9]{4}$/);
    });

    it('falls back to English when no language has been chosen yet', () => {
      useAppStore.setState({ language: null });
      useAppStore.getState().completeModule('03', 'popia-aware', 90);
      expect(useAppStore.getState().certificates['03'].language).toBe('en');
    });

    it('keeps the first certificate’s date, number and language on a repeat pass, raising only a better score', () => {
      useAppStore.setState({ language: 'zu' });
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      const first = useAppStore.getState().certificates['02'];

      useAppStore.setState({ language: 'en' });
      useAppStore.getState().completeModule('02', 'scam-spotter', 100);
      expect(useAppStore.getState().certificates['02']).toEqual({ ...first, scorePct: 100 });

      useAppStore.getState().completeModule('02', 'scam-spotter', 70);
      expect(useAppStore.getState().certificates['02'].scorePct).toBe(100);
    });

    it('issues no certificate for a module without one (POPIA), or when no score is given', () => {
      useAppStore.getState().completeModule('01', undefined, 100);
      useAppStore.getState().completeModule('02', 'scam-spotter');
      expect(useAppStore.getState().certificates).toEqual({});
    });

    it('saves a tidied name, and ignores an invalid one rather than wiping a good one', () => {
      useAppStore.getState().setStudentName('  Thandi   Nkosi ');
      expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
      useAppStore.getState().setStudentName('   ');
      expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
    });

    it('never sends the name or the certificate to Supabase', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().setStudentName('Thandi Nkosi');
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      const sent = JSON.stringify([...mockUpsertModuleProgress.mock.calls, ...mockAwardBadge.mock.calls]);
      expect(sent).not.toContain('Thandi');
      expect(sent).not.toContain('CA-02');
    });
  });

  describe('hydrateRemoteState', () => {
    it('merges remote progress/badges into local state without regressing existing local progress', () => {
      useAppStore.setState({ moduleProgress: { '01': 100, '02': 0 }, earnedBadgeIds: ['scam-spotter'] });
      useAppStore.getState().hydrateRemoteState({
        moduleProgress: { '01': 40, '02': 80, '03': 20 },
        badgeIds: ['popia-aware'],
      });
      const state = useAppStore.getState();
      expect(state.moduleProgress).toEqual({ '01': 100, '02': 80, '03': 20 });
      expect(state.earnedBadgeIds).toEqual(expect.arrayContaining(['popia-aware', 'scam-spotter']));
    });

    it('awards the badges that progress from another phone has earned, quietly, with no pop-up', () => {
      useAppStore.getState().hydrateRemoteState({ moduleProgress: { '01': 100 }, badgeIds: [] });
      const state = useAppStore.getState();
      expect(state.earnedBadgeIds).toEqual(expect.arrayContaining(['first-steps', 'popia-basics']));
      expect(state.badgeAnnouncements).toEqual([]);
    });

    it('is a no-op-safe merge when remote state is empty (brand-new account)', () => {
      const before = useAppStore.getState();
      useAppStore.getState().hydrateRemoteState({ moduleProgress: {}, badgeIds: [] });
      const after = useAppStore.getState();
      expect(after.moduleProgress).toEqual(before.moduleProgress);
      expect(after.earnedBadgeIds).toEqual(before.earnedBadgeIds);
    });
  });

  describe('completeLesson', () => {
    it('records how far through the module the student is when a lesson is finished', () => {
      useAppStore.getState().completeLesson('01', 1);
      expect(useAppStore.getState().moduleProgress['01']).toBe(34);
      useAppStore.getState().completeLesson('01', 2);
      expect(useAppStore.getState().moduleProgress['01']).toBe(67);
    });

    it('never moves progress backwards when an earlier lesson is redone', () => {
      useAppStore.getState().completeLesson('01', 2);
      useAppStore.getState().completeLesson('01', 1);
      expect(useAppStore.getState().moduleProgress['01']).toBe(67);
    });

    it('never lowers a module that is already complete', () => {
      useAppStore.setState({ moduleProgress: { '02': 100 } });
      useAppStore.getState().completeLesson('02', 3);
      expect(useAppStore.getState().moduleProgress['02']).toBe(100);
    });

    it('completes POPIA when its last lesson is finished, and awards POPIA Aware', () => {
      for (const n of [1, 2, 3]) useAppStore.getState().completeLesson('01', n);
      const state = useAppStore.getState();
      expect(state.moduleProgress['01']).toBe(100);
      expect(state.earnedBadgeIds).toEqual(['first-steps', 'popia-basics']);
    });

    it('does not complete a module with a final assessment from its last lesson — only passing does', () => {
      useAppStore.getState().completeLesson('02', 9);
      useAppStore.getState().completeLesson('03', 2);
      expect(useAppStore.getState().moduleProgress).toEqual({});
      expect(useAppStore.getState().earnedBadgeIds).toEqual([]);
    });

    it('ignores a lesson or module that does not exist', () => {
      useAppStore.getState().completeLesson('99', 1);
      useAppStore.getState().completeLesson('01', 0);
      useAppStore.getState().completeLesson('01', 4);
      useAppStore.getState().completeLesson('01', Number.NaN);
      expect(useAppStore.getState().moduleProgress).toEqual({});
      expect(useAppStore.getState().earnedBadgeIds).toEqual([]);
    });

    it('awards First Steps on the very first lesson and queues it to be shown to the student', () => {
      useAppStore.getState().completeLesson('02', 1);
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['first-steps']);
    });

    it('awards and announces a badge only once, even if the button is tapped twice', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().completeLesson('02', 1);
      useAppStore.getState().completeLesson('02', 1);
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['first-steps']);
      expect(mockAwardBadge).toHaveBeenCalledTimes(1);
    });

    it('sends the progress and the new badge to Supabase for a signed-in student', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().completeLesson('01', 1);
      expect(mockUpsertModuleProgress).toHaveBeenCalledWith('user-1', '01', 34);
      expect(mockAwardBadge).toHaveBeenCalledWith('user-1', 'first-steps');
    });

    it('still records everything on the phone when there is no signed-in user', () => {
      useAppStore.setState({ userId: null });
      useAppStore.getState().completeLesson('01', 1);
      expect(useAppStore.getState().moduleProgress['01']).toBe(34);
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
      expect(mockUpsertModuleProgress).not.toHaveBeenCalled();
      expect(mockAwardBadge).not.toHaveBeenCalled();
    });

    it('keeps the progress and badge on the phone when Supabase refuses the save', () => {
      mockUpsertModuleProgress.mockResolvedValueOnce({ ok: false, error: 'network' });
      mockAwardBadge.mockResolvedValueOnce({ ok: false, error: 'network' });
      useAppStore.setState({ userId: 'user-1' });
      expect(() => useAppStore.getState().completeLesson('01', 1)).not.toThrow();
      expect(useAppStore.getState().moduleProgress['01']).toBe(34);
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
    });

    it('does not re-send progress that has not moved', () => {
      useAppStore.setState({ userId: 'user-1' });
      useAppStore.getState().completeLesson('01', 2);
      mockUpsertModuleProgress.mockClear();
      useAppStore.getState().completeLesson('01', 1);
      expect(mockUpsertModuleProgress).not.toHaveBeenCalled();
    });
  });

  describe('completeModule and the progress badges', () => {
    it('awards Cyber Aware Graduate when the last module is passed, and announces it', () => {
      useAppStore.setState({ moduleProgress: { '01': 100, '02': 100 }, earnedBadgeIds: ['first-steps', 'popia-basics', 'scam-spotter'] });
      useAppStore.getState().completeModule('03', 'popia-aware', 90);
      const state = useAppStore.getState();
      expect(state.earnedBadgeIds).toEqual(expect.arrayContaining(['popia-aware', 'cyber-graduate']));
      // The assessment badge is celebrated first, then the one it unlocked.
      expect(state.badgeAnnouncements).toEqual(['popia-aware', 'cyber-graduate']);
    });

    it('celebrates the assessment badge the first time the assessment is passed', () => {
      useAppStore.setState({ moduleProgress: { '02': 89 }, earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      expect(useAppStore.getState().earnedBadgeIds).toContain('scam-spotter');
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['scam-spotter']);
    });

    it('does not celebrate it again when the assessment is passed a second time, or the result screen is reopened', () => {
      useAppStore.setState({ moduleProgress: { '02': 89 }, earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      useAppStore.getState().dismissBadgeAnnouncement();
      useAppStore.getState().completeModule('02', 'scam-spotter', 100);
      expect(useAppStore.getState().badgeAnnouncements).toEqual([]);
    });

    it('queues the assessment badge once when the result screen records the pass twice in a row', () => {
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      expect(useAppStore.getState().badgeAnnouncements.filter((id) => id === 'scam-spotter')).toHaveLength(1);
    });

    it('does not queue a celebration for a badge id the app does not have', () => {
      useAppStore.getState().completeModule('02', 'no-such-badge', 80);
      expect(useAppStore.getState().badgeAnnouncements).not.toContain('no-such-badge');
    });

    it('sends each newly earned badge to Supabase once', () => {
      useAppStore.setState({ userId: 'user-1', moduleProgress: { '01': 100, '02': 100 }, earnedBadgeIds: ['first-steps', 'popia-basics', 'scam-spotter'] });
      useAppStore.getState().completeModule('03', 'popia-aware', 90);
      expect(mockAwardBadge.mock.calls.map((c) => c[1]).sort()).toEqual(['cyber-graduate', 'popia-aware']);
    });
  });

  describe('setLastLesson (where "Continue learning" resumes)', () => {
    it('starts with no lesson opened', () => {
      expect(initialState.lastLesson).toBeNull();
    });

    it('remembers the lesson the student last opened', () => {
      useAppStore.getState().setLastLesson('02', 4);
      expect(useAppStore.getState().lastLesson).toEqual({ moduleId: '02', lessonN: 4 });
      useAppStore.getState().setLastLesson('01', 2);
      expect(useAppStore.getState().lastLesson).toEqual({ moduleId: '01', lessonN: 2 });
    });

    it('ignores a lesson or module that does not exist, keeping the last real one', () => {
      useAppStore.getState().setLastLesson('02', 4);
      useAppStore.getState().setLastLesson('99', 1);
      useAppStore.getState().setLastLesson('01', 0);
      useAppStore.getState().setLastLesson('01', 9);
      useAppStore.getState().setLastLesson('01', Number.NaN);
      expect(useAppStore.getState().lastLesson).toEqual({ moduleId: '02', lessonN: 4 });
    });
  });

  describe('daily practice', () => {
    const day = (d: number, h = 12) => new Date(2026, 9, d, h);
    const question = (n: number) => ({
      topicId: `01-${n}`,
      moduleId: '01',
      lessonN: n,
      text: `Question ${n}?`,
      options: ['a', 'b', 'c', 'd'],
      correct: 2,
      source: 'ai' as const,
    });
    const three = [question(1), question(2), question(3)];
    const start = (d: number, questions: DailyQuestion[] = three) => useAppStore.getState().startDailyPractice(questions, day(d));
    const answerAll = (d: number, picks = [2, 2, 2]) =>
      picks.forEach((pick, i) => useAppStore.getState().answerDailyQuestion(i, pick, day(d)));

    it('starts a new student with no questions, no history and empty totals', () => {
      expect(initialState.dailyPractice).toBeNull();
      expect(initialState.askedQuestions).toEqual([]);
      expect(initialState.practiceTopicCursor).toBe(0);
      expect(initialState.practiceStats).toEqual({ daysCompleted: 0, answered: 0, correct: 0 });
    });

    it('saves today’s questions against today’s date and the current language', () => {
      useAppStore.setState({ language: 'zu' });
      start(5);
      expect(useAppStore.getState().dailyPractice).toEqual({ date: '2026-10-05', language: 'zu', questions: three, answers: {} });
    });

    it('remembers every question shown, so it is never shown again, and moves the topic rotation on', () => {
      start(5);
      expect(useAppStore.getState().askedQuestions).toEqual([
        { topic: '01-1', text: 'Question 1?' },
        { topic: '01-2', text: 'Question 2?' },
        { topic: '01-3', text: 'Question 3?' },
      ]);
      expect(useAppStore.getState().practiceTopicCursor).toBe(3);

      start(6, [{ ...question(1), text: 'Another?', source: 'notes', id: 'notes:01-1:0' }]);
      expect(useAppStore.getState().askedQuestions).toHaveLength(4);
      expect(useAppStore.getState().askedQuestions[3]).toEqual({ topic: '01-1', text: 'Another?', id: 'notes:01-1:0' });
      expect(useAppStore.getState().practiceTopicCursor).toBe(6);
    });

    it('ignores an empty set rather than saving a day with nothing to answer', () => {
      start(5, []);
      expect(useAppStore.getState().dailyPractice).toBeNull();
      expect(useAppStore.getState().practiceTopicCursor).toBe(0);
    });

    it('records an answer and counts it in the totals, right or wrong', () => {
      start(5);
      useAppStore.getState().answerDailyQuestion(0, 2, day(5));
      useAppStore.getState().answerDailyQuestion(1, 0, day(5));
      expect(useAppStore.getState().dailyPractice?.answers).toEqual({ 0: 2, 1: 0 });
      expect(useAppStore.getState().practiceStats).toEqual({ daysCompleted: 0, answered: 2, correct: 1 });
    });

    it('ignores a second tap on a question that is already answered (double-tap)', () => {
      start(5);
      useAppStore.getState().answerDailyQuestion(0, 0, day(5));
      useAppStore.getState().answerDailyQuestion(0, 2, day(5));
      expect(useAppStore.getState().dailyPractice?.answers).toEqual({ 0: 0 });
      expect(useAppStore.getState().practiceStats).toEqual({ daysCompleted: 0, answered: 1, correct: 0 });
    });

    it('ignores an answer when there are no questions, or for a question or option that does not exist', () => {
      useAppStore.getState().answerDailyQuestion(0, 1, day(5));
      expect(useAppStore.getState().practiceStats.answered).toBe(0);

      start(5);
      useAppStore.getState().answerDailyQuestion(3, 1, day(5));
      useAppStore.getState().answerDailyQuestion(-1, 1, day(5));
      useAppStore.getState().answerDailyQuestion(0, 4, day(5));
      useAppStore.getState().answerDailyQuestion(0, -1, day(5));
      useAppStore.getState().answerDailyQuestion(0, Number.NaN, day(5));
      expect(useAppStore.getState().dailyPractice?.answers).toEqual({});
      expect(useAppStore.getState().practiceStats.answered).toBe(0);
    });

    it('does not move the streak until every question of the day is answered', () => {
      start(5);
      useAppStore.getState().answerDailyQuestion(0, 2, day(5));
      useAppStore.getState().answerDailyQuestion(1, 2, day(5));
      expect(useAppStore.getState().streak).toBe(0);
      expect(useAppStore.getState().practiceStats.daysCompleted).toBe(0);

      useAppStore.getState().answerDailyQuestion(2, 0, day(5));
      expect(useAppStore.getState().streak).toBe(1);
      expect(useAppStore.getState().lastActiveDate).toBe('2026-10-05');
      expect(useAppStore.getState().practiceStats).toEqual({ daysCompleted: 1, answered: 3, correct: 2 });
    });

    it('counts a finished day whatever the score — wrong answers still keep the streak', () => {
      start(5);
      answerAll(5, [0, 0, 0]);
      expect(useAppStore.getState().streak).toBe(1);
      expect(useAppStore.getState().practiceStats).toEqual({ daysCompleted: 1, answered: 3, correct: 0 });
    });

    it('adds a day to the streak for practice finished on the next day', () => {
      start(5);
      answerAll(5);
      start(6);
      answerAll(6);
      expect(useAppStore.getState().streak).toBe(2);
      expect(useAppStore.getState().practiceStats.daysCompleted).toBe(2);
    });

    it('starts the streak again at 1 after a missed day', () => {
      start(5);
      answerAll(5);
      start(8);
      answerAll(8);
      expect(useAppStore.getState().streak).toBe(1);
    });

    it('awards and announces the 7-Day Streak on the seventh finished day in a row, and not before', () => {
      useAppStore.setState({ userId: 'user-1' });
      for (let d = 1; d <= 6; d++) {
        start(d);
        answerAll(d);
      }
      expect(useAppStore.getState().earnedBadgeIds).not.toContain('streak-7');

      start(7);
      answerAll(7);
      expect(useAppStore.getState().streak).toBe(7);
      expect(useAppStore.getState().earnedBadgeIds).toContain('streak-7');
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['streak-7']);
      expect(mockAwardBadge).toHaveBeenCalledWith('user-1', 'streak-7');
    });

    it('lets the student keep the streak badge after the streak is broken', () => {
      for (let d = 1; d <= 7; d++) {
        start(d);
        answerAll(d);
      }
      start(12);
      answerAll(12);
      expect(useAppStore.getState().streak).toBe(1);
      expect(useAppStore.getState().earnedBadgeIds).toContain('streak-7');
    });

    it('completes a short set (fewer than three questions were available) once all of it is answered', () => {
      start(5, [question(1)]);
      useAppStore.getState().answerDailyQuestion(0, 2, day(5));
      expect(useAppStore.getState().streak).toBe(1);
      expect(useAppStore.getState().practiceStats.daysCompleted).toBe(1);
    });

    it('counts a set finished after midnight towards the day it was finished on', () => {
      start(5);
      useAppStore.getState().answerDailyQuestion(0, 2, day(5, 23));
      useAppStore.getState().answerDailyQuestion(1, 2, day(6, 0));
      useAppStore.getState().answerDailyQuestion(2, 2, day(6, 0));
      expect(useAppStore.getState().lastActiveDate).toBe('2026-10-06');
    });

    it('no longer counts opening the app or finishing a lesson towards the streak', () => {
      useAppStore.getState().completeLesson('01', 1);
      useAppStore.getState().completeModule('02', 'scam-spotter', 80);
      expect(useAppStore.getState().streak).toBe(0);
      expect(useAppStore.getState().lastActiveDate).toBeNull();
    });
  });

  describe('setReminderEnabled', () => {
    it('starts undecided, then remembers the student’s choice either way', () => {
      expect(initialState.reminderEnabled).toBeNull();
      useAppStore.getState().setReminderEnabled(true);
      expect(useAppStore.getState().reminderEnabled).toBe(true);
      useAppStore.getState().setReminderEnabled(false);
      expect(useAppStore.getState().reminderEnabled).toBe(false);
    });
  });

  describe('replayBadge (tapping an earned badge on Profile)', () => {
    it('starts with nothing being replayed', () => {
      expect(initialState.badgeReplayId).toBeNull();
    });

    it('replays the celebration for a badge the student holds', () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().replayBadge('first-steps');
      expect(useAppStore.getState().badgeReplayId).toBe('first-steps');
    });

    it('refuses a badge the student has not earned, and one the app does not have', () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps', 'streak-30'] });
      useAppStore.getState().replayBadge('scam-spotter');
      useAppStore.getState().replayBadge('streak-30');
      useAppStore.getState().replayBadge('');
      expect(useAppStore.getState().badgeReplayId).toBeNull();
    });

    it('does not count as earning it again: no new announcement, no sync, badges unchanged', () => {
      useAppStore.setState({ userId: 'user-1', earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().replayBadge('first-steps');
      expect(useAppStore.getState().badgeAnnouncements).toEqual([]);
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
      expect(mockAwardBadge).not.toHaveBeenCalled();
    });

    it('closes the replay, and closing twice is harmless', () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().replayBadge('first-steps');
      useAppStore.getState().closeBadgeReplay();
      useAppStore.getState().closeBadgeReplay();
      expect(useAppStore.getState().badgeReplayId).toBeNull();
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
    });

    it('is not saved on the phone, so a replay never reappears on the next launch', () => {
      useAppStore.setState({ earnedBadgeIds: ['first-steps'] });
      useAppStore.getState().replayBadge('first-steps');
      const saved = useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as Record<string, unknown>;
      expect(saved).not.toHaveProperty('badgeReplayId');
    });
  });

  describe('dismissBadgeAnnouncement', () => {
    it('removes the badge being shown and leaves the next one waiting', () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps', 'popia-basics'] });
      useAppStore.getState().dismissBadgeAnnouncement();
      expect(useAppStore.getState().badgeAnnouncements).toEqual(['popia-basics']);
    });

    it('does nothing when there is nothing to dismiss (double-tap on the close button)', () => {
      useAppStore.setState({ badgeAnnouncements: ['first-steps'] });
      useAppStore.getState().dismissBadgeAnnouncement();
      useAppStore.getState().dismissBadgeAnnouncement();
      expect(useAppStore.getState().badgeAnnouncements).toEqual([]);
    });

    it('never takes the badge itself away', () => {
      useAppStore.getState().completeLesson('02', 1);
      useAppStore.getState().dismissBadgeAnnouncement();
      expect(useAppStore.getState().earnedBadgeIds).toEqual(['first-steps']);
    });
  });

  describe('what is saved on the phone', () => {
    afterEach(async () => {
      await AsyncStorage.clear();
    });

    const save = (state: Record<string, unknown>, version: number) =>
      AsyncStorage.setItem('cyber-aware-store', JSON.stringify({ state, version }));

    it('saves the streak and the last active day, but not the pop-up queue', () => {
      useAppStore.setState({ streak: 4, lastActiveDate: '2026-10-04', badgeAnnouncements: ['first-steps'] });
      const saved = useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as Record<string, unknown>;
      expect(saved).toMatchObject({ streak: 4, lastActiveDate: '2026-10-04' });
      expect(saved).not.toHaveProperty('badgeAnnouncements');
    });

    it('saves where the student left off, today’s questions and answers, the question history, totals and the reminder choice', () => {
      useAppStore.getState().setLastLesson('02', 4);
      useAppStore.getState().startDailyPractice([
        { topicId: '01-1', moduleId: '01', lessonN: 1, text: 'Q?', options: ['a', 'b', 'c', 'd'], correct: 0, source: 'ai' },
      ]);
      useAppStore.getState().answerDailyQuestion(0, 0);
      useAppStore.getState().setReminderEnabled(true);
      const saved = useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as Record<string, unknown>;
      expect(saved).toMatchObject({
        lastLesson: { moduleId: '02', lessonN: 4 },
        dailyPractice: { answers: { 0: 0 } },
        askedQuestions: [{ topic: '01-1', text: 'Q?' }],
        practiceTopicCursor: 3,
        practiceStats: { daysCompleted: 1, answered: 1, correct: 1 },
        reminderEnabled: true,
      });
    });

    it('never saves the signed-in user id or unanswered quiz taps', () => {
      useAppStore.setState({ userId: 'user-1' });
      const saved = useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as Record<string, unknown>;
      expect(saved).not.toHaveProperty('userId');
      expect(saved).not.toHaveProperty('quizAnswers');
    });

    it('clears the demo progress, badges and streak the first build left on the phone (the reported "4 badges, 33% complete")', async () => {
      await save(
        {
          language: 'en',
          streak: 1,
          lastActiveDate: toLocalDateKey(new Date()),
          moduleProgress: { '01': 60, '02': 40, '03': 0, '04': 0, '05': 0 },
          earnedBadgeIds: ['scam-spotter', 'popia-aware', 'first-steps', 'streak-7'],
        },
        0
      );
      await useAppStore.persist.rehydrate();
      const state = useAppStore.getState();
      expect(state.moduleProgress).toEqual({});
      expect(state.earnedBadgeIds).toEqual([]);
      expect(state.badgeAnnouncements).toEqual([]);
      expect(state.streak).toBe(0);
      expect(state.language).toBe('en');
    });

    it('clears the untouched demo values too, including the 12-day streak', async () => {
      await save({ streak: 12, moduleProgress: { '01': 60, '02': 40, '03': 0 }, earnedBadgeIds: ['scam-spotter', 'popia-aware'] }, 0);
      await useAppStore.persist.rehydrate();
      const state = useAppStore.getState();
      expect(state.streak).toBe(0);
      expect(state.moduleProgress).toEqual({});
      expect(state.earnedBadgeIds).toEqual([]);
    });

    it('keeps a student’s real progress, badges, name and certificates through the same clean-up', async () => {
      const certificates = { '02': { id: 'CA-02-20261005-ABCD', moduleId: '02', scorePct: 80, awardedAt: '2026-10-05T10:00:00.000Z', language: 'en' } };
      await save(
        {
          language: 'zu',
          streak: 2,
          lastActiveDate: '2026-10-09',
          moduleProgress: { '01': 67, '02': 100 },
          earnedBadgeIds: ['first-steps', 'scam-spotter'],
          studentName: 'Thandi Nkosi',
          certificates,
        },
        0
      );
      await useAppStore.persist.rehydrate();
      const state = useAppStore.getState();
      expect(state.moduleProgress).toEqual({ '01': 67, '02': 100 });
      expect(state.earnedBadgeIds).toEqual(['first-steps', 'scam-spotter']);
      // Older builds counted days the app was opened; the streak now counts finished practice, so it starts again.
      expect(state.streak).toBe(0);
      expect(state.lastActiveDate).toBeNull();
      expect(state.studentName).toBe('Thandi Nkosi');
      expect(state.certificates).toEqual(certificates);
      expect(state.language).toBe('zu');
    });

    it('does not run the clean-up again on a save that has already been through it', async () => {
      // 60% cannot be reached by finishing lessons; a current save holding it is left for the app to handle, not rewritten on every launch.
      await save({ moduleProgress: { '01': 34 }, earnedBadgeIds: ['first-steps'], streak: 3, lastActiveDate: '2026-10-09' }, 1);
      await useAppStore.persist.rehydrate();
      expect(useAppStore.getState().moduleProgress).toEqual({ '01': 34 });
      expect(useAppStore.getState().streak).toBe(3);
    });

    it('does not count merely opening the app towards the streak', async () => {
      const yesterday = toLocalDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
      await save({ streak: 3, lastActiveDate: yesterday, moduleProgress: {}, earnedBadgeIds: [] }, 1);
      await useAppStore.persist.rehydrate();
      expect(useAppStore.getState().streak).toBe(3);
      expect(useAppStore.getState().lastActiveDate).toBe(yesterday);
    });

    it('starts a first-time student, with nothing saved, at zero', async () => {
      await useAppStore.persist.rehydrate();
      expect(useAppStore.getState().streak).toBe(0);
      expect(useAppStore.getState().earnedBadgeIds).toEqual([]);
    });

    it('still awards, quietly, a badge that saved progress has earned (a save from before that badge existed)', async () => {
      await save({ streak: 0, moduleProgress: { '02': 100 }, earnedBadgeIds: ['scam-spotter'] }, 0);
      await useAppStore.persist.rehydrate();
      const state = useAppStore.getState();
      expect(state.earnedBadgeIds).toEqual(expect.arrayContaining(['scam-spotter', 'first-steps']));
      expect(state.badgeAnnouncements).toEqual([]);
    });

    it('opens normally from a save made before daily practice existed, with empty practice fields', async () => {
      await save({ language: 'en', moduleProgress: { '01': 34 }, earnedBadgeIds: ['first-steps'] }, 0);
      await useAppStore.persist.rehydrate();
      const state = useAppStore.getState();
      expect(state.dailyPractice).toBeNull();
      expect(state.askedQuestions).toEqual([]);
      expect(state.practiceStats).toEqual({ daysCompleted: 0, answered: 0, correct: 0 });
      expect(state.lastLesson).toBeNull();
    });

    it('opens normally when the saved data is unreadable', async () => {
      await AsyncStorage.setItem('cyber-aware-store', '{not json');
      await expect(useAppStore.persist.rehydrate()).resolves.not.toThrow();
      expect(useAppStore.getState().moduleProgress).toEqual({});
    });
  });
});
