import { useAppStore } from '@/store/useAppStore';
import * as sync from '@/lib/sync';

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

  describe('answerDrill', () => {
    it('records a drill pick', () => {
      useAppStore.getState().answerDrill(0, 'scam');
      expect(useAppStore.getState().drillPicks).toEqual({ 0: 'scam' });
    });

    it('ignores a second tap on an already-answered drill', () => {
      useAppStore.getState().answerDrill(0, 'scam');
      useAppStore.getState().answerDrill(0, 'safe');
      expect(useAppStore.getState().drillPicks).toEqual({ 0: 'scam' });
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

    it('does not add a badge when none is passed', () => {
      const before = useAppStore.getState().earnedBadgeIds.length;
      useAppStore.getState().completeModule('03');
      expect(useAppStore.getState().earnedBadgeIds).toHaveLength(before);
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

  describe('hydrateRemoteState', () => {
    it('merges remote progress/badges into local state without regressing existing local progress', () => {
      useAppStore.setState({ moduleProgress: { '01': 100, '02': 0 }, earnedBadgeIds: ['scam-spotter'] });
      useAppStore.getState().hydrateRemoteState({
        moduleProgress: { '01': 40, '02': 80, '03': 20 },
        badgeIds: ['popia-aware'],
      });
      const state = useAppStore.getState();
      expect(state.moduleProgress).toEqual({ '01': 100, '02': 80, '03': 20 });
      expect(state.earnedBadgeIds.sort()).toEqual(['popia-aware', 'scam-spotter'].sort());
    });

    it('is a no-op-safe merge when remote state is empty (brand-new account)', () => {
      const before = useAppStore.getState();
      useAppStore.getState().hydrateRemoteState({ moduleProgress: {}, badgeIds: [] });
      const after = useAppStore.getState();
      expect(after.moduleProgress).toEqual(before.moduleProgress);
      expect(after.earnedBadgeIds).toEqual(before.earnedBadgeIds);
    });
  });
});
