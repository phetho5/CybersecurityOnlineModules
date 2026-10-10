import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn(), back: jest.fn() },
}));

const mockLoadDailyQuestions = jest.fn();
jest.mock('@/lib/daily-practice', () => ({
  ...jest.requireActual('@/lib/daily-practice'),
  loadDailyQuestions: (...args: unknown[]) => mockLoadDailyQuestions(...args),
}));

import { DailyPractice } from '@/components/daily-practice';
import i18n from '@/i18n';
import type { DailyQuestion } from '@/lib/daily-practice';
import { toLocalDateKey } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();
const today = () => toLocalDateKey(new Date());

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const question = (n: number, overrides: Partial<DailyQuestion> = {}): DailyQuestion => ({
  topicId: `0${n}-1`,
  moduleId: `0${n}`,
  lessonN: 1,
  text: `Question ${n}?`,
  options: [`Q${n} wrong A`, `Q${n} right`, `Q${n} wrong C`, `Q${n} wrong D`],
  correct: 1,
  explain: `Explanation ${n}.`,
  source: 'ai',
  ...overrides,
});
const three = [question(1), question(2), question(3)];
const loaded = { ok: true as const, questions: three };

describe('DailyPractice', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockLoadDailyQuestions.mockReset();
    mockPush.mockReset();
  });

  describe('loading today’s questions', () => {
    it('fetches the questions by itself and shows a skeleton with text while they are written', async () => {
      const { promise, resolve } = deferred<typeof loaded>();
      mockLoadDailyQuestions.mockReturnValue(promise);
      const { getByTestId, getByText, queryByTestId } = await render(<DailyPractice />);

      expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(1);
      expect(getByTestId('daily-skeleton')).toBeTruthy();
      expect(getByText('Writing today\'s questions…')).toBeTruthy();

      await act(async () => {
        resolve(loaded);
        await promise;
      });
      expect(queryByTestId('daily-skeleton')).toBeNull();
      expect(getByText('Question 1?')).toBeTruthy();
      expect(getByText('Question 3?')).toBeTruthy();
    });

    it('changes the waiting text after a few seconds, so a slow connection still looks alive', async () => {
      const { promise, resolve } = deferred<typeof loaded>();
      mockLoadDailyQuestions.mockReturnValue(promise);
      jest.useFakeTimers();
      try {
        const { getByText, queryByText } = await render(<DailyPractice />);
        expect(queryByText('Still writing — almost there…')).toBeNull();
        await act(async () => {
          jest.advanceTimersByTime(5000);
        });
        expect(getByText('Still writing — almost there…')).toBeTruthy();
        await act(async () => {
          resolve(loaded);
          await promise;
        });
      } finally {
        jest.useRealTimers();
      }
    });

    it('asks for questions in the student’s language, from where the topic rotation has reached, with the history of asked questions', async () => {
      const asked = [{ topic: '01-1', text: 'Old question?' }];
      useAppStore.setState({ language: 'nso', practiceTopicCursor: 6, askedQuestions: asked });
      mockLoadDailyQuestions.mockResolvedValue(loaded);
      await render(<DailyPractice />);
      await waitFor(() => expect(mockLoadDailyQuestions).toHaveBeenCalled());
      expect(mockLoadDailyQuestions.mock.calls[0][0]).toMatchObject({ lang: 'nso', cursor: 6, asked });
    });

    it('saves the questions once loaded, so they count as shown and are never asked again', async () => {
      mockLoadDailyQuestions.mockResolvedValue(loaded);
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Question 1?')).toBeTruthy());
      const state = useAppStore.getState();
      expect(state.dailyPractice).toMatchObject({ date: today(), questions: three });
      expect(state.askedQuestions.map((a) => a.text)).toEqual(['Question 1?', 'Question 2?', 'Question 3?']);
    });

    it('does not fetch again when today’s questions are already saved — reopening the app shows the same ones', async () => {
      useAppStore.setState({ dailyPractice: { date: today(), language: 'en', questions: three, answers: { 0: 1 } } });
      const { getByText, queryByTestId } = await render(<DailyPractice />);
      expect(mockLoadDailyQuestions).not.toHaveBeenCalled();
      expect(queryByTestId('daily-skeleton')).toBeNull();
      expect(getByText('Question 2?')).toBeTruthy();
      // The answer given earlier is still shown.
      expect(getByText('Explanation 1.')).toBeTruthy();
    });

    it('fetches a new set when the saved questions are from an earlier day, without showing the old ones', async () => {
      useAppStore.setState({ dailyPractice: { date: '2026-01-01', language: 'en', questions: [question(1, { text: 'Stale?' })], answers: { 0: 1 } } });
      const { promise, resolve } = deferred<typeof loaded>();
      mockLoadDailyQuestions.mockReturnValue(promise);
      const { queryByText, getByText } = await render(<DailyPractice />);
      expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(1);
      expect(queryByText('Stale?')).toBeNull();
      expect(queryByText('Done for today')).toBeNull();
      await act(async () => {
        resolve(loaded);
        await promise;
      });
      expect(getByText('Question 1?')).toBeTruthy();
    });
  });

  describe('when the questions cannot be loaded', () => {
    it('says what went wrong and offers a retry, instead of an empty section', async () => {
      mockLoadDailyQuestions.mockResolvedValue({ ok: false, error: 'network' });
      const { getByText, queryByTestId } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText("Couldn't load today's questions — check your connection and try again.")).toBeTruthy());
      expect(getByText('Try again')).toBeTruthy();
      expect(queryByTestId('daily-skeleton')).toBeNull();
      expect(useAppStore.getState().dailyPractice).toBeNull();
    });

    it('loads the questions when the retry succeeds', async () => {
      mockLoadDailyQuestions.mockResolvedValueOnce({ ok: false, error: 'network' });
      mockLoadDailyQuestions.mockResolvedValueOnce(loaded);
      const { getByText, queryByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Try again')).toBeTruthy());
      await fireEvent.press(getByText('Try again'));
      await waitFor(() => expect(getByText('Question 1?')).toBeTruthy());
      expect(queryByText('Try again')).toBeNull();
      expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(2);
    });

    it('ignores a second tap on Try again while the retry is still running', async () => {
      mockLoadDailyQuestions.mockResolvedValueOnce({ ok: false, error: 'network' });
      const { promise, resolve } = deferred<typeof loaded>();
      mockLoadDailyQuestions.mockReturnValueOnce(promise);
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Try again')).toBeTruthy());
      const retry = getByText('Try again');
      await act(async () => {
        fireEvent.press(retry);
        fireEvent.press(retry);
        resolve(loaded);
        await promise;
      });
      expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(2);
    });

    it.each([
      ['rate-limited', 'Too many requests right now — wait a moment and try again.'],
      ['missing-key', "AI checking isn't set up yet."],
      ['no-new-questions', "You've answered every saved question — connect to the internet to get new ones."],
      ['something-unknown', "Couldn't load today's questions — check your connection and try again."],
    ])('gives a human message for a %s failure, never a raw error', async (error, message) => {
      mockLoadDailyQuestions.mockResolvedValue({ ok: false, error });
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText(message)).toBeTruthy());
    });

    it('shows the retry rather than hanging if loading itself throws', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLoadDailyQuestions.mockRejectedValue(new Error('boom'));
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Try again')).toBeTruthy());
      jest.restoreAllMocks();
    });
  });

  describe('answering', () => {
    beforeEach(() => {
      mockLoadDailyQuestions.mockResolvedValue(loaded);
    });

    it('shows each question with its number, its module and four options', async () => {
      const { getByText, getAllByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Question 1?')).toBeTruthy());
      expect(getByText(/Question 1 of 3/)).toBeTruthy();
      expect(getByText(/POPIA & Your Personal Data/)).toBeTruthy();
      expect(getByText(/Online Scams/)).toBeTruthy();
      for (const option of three[0].options) expect(getByText(option)).toBeTruthy();
      expect(getAllByText('A')).toHaveLength(3);
    });

    it('says the questions were written by AI from the lesson notes', async () => {
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Written by AI from your lesson notes')).toBeTruthy());
    });

    it('labels a set taken from the notes as such, without claiming AI wrote it', async () => {
      mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: three.map((q) => ({ ...q, source: 'notes', explain: undefined })) });
      const { getByText, queryByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('From your lesson notes')).toBeTruthy());
      expect(queryByText('Written by AI from your lesson notes')).toBeNull();
    });

    it('confirms a correct answer and explains why', async () => {
      const { getByText, queryByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 right')).toBeTruthy());
      expect(queryByText('Explanation 1.')).toBeNull();
      await fireEvent.press(getByText('Q1 right'));
      expect(getByText('Correct')).toBeTruthy();
      expect(getByText('Explanation 1.')).toBeTruthy();
      expect(useAppStore.getState().practiceStats).toMatchObject({ answered: 1, correct: 1 });
    });

    it('tells the student a wrong answer was wrong, still explains, and points to the lesson to revise', async () => {
      const { getByText, getByTestId } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q2 wrong A')).toBeTruthy());
      await fireEvent.press(getByText('Q2 wrong A'));
      expect(getByText('Not quite')).toBeTruthy();
      expect(getByText('Explanation 2.')).toBeTruthy();
      expect(useAppStore.getState().practiceStats).toMatchObject({ answered: 1, correct: 0 });

      await fireEvent.press(getByTestId('daily-revise-1'));
      expect(mockPush).toHaveBeenCalledWith('/lesson/02/1');
    });

    it('still gives feedback for a question that has no explanation', async () => {
      mockLoadDailyQuestions.mockResolvedValue({ ok: true, questions: [question(1, { explain: undefined })] });
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 right')).toBeTruthy());
      await fireEvent.press(getByText('Q1 right'));
      expect(getByText('Correct')).toBeTruthy();
    });

    it('keeps the first answer when another option is tapped afterwards', async () => {
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 wrong A')).toBeTruthy());
      await fireEvent.press(getByText('Q1 wrong A'));
      await fireEvent.press(getByText('Q1 right'));
      expect(useAppStore.getState().dailyPractice?.answers).toEqual({ 0: 0 });
      expect(useAppStore.getState().practiceStats).toMatchObject({ answered: 1, correct: 0 });
    });

    it('records one answer when an option is double-tapped before the screen updates', async () => {
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 right')).toBeTruthy());
      const option = getByText('Q1 right');
      await act(async () => {
        fireEvent.press(option);
        fireEvent.press(option);
      });
      expect(useAppStore.getState().practiceStats.answered).toBe(1);
    });

    it('lets the questions be answered in any order', async () => {
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q3 right')).toBeTruthy());
      await fireEvent.press(getByText('Q3 right'));
      await fireEvent.press(getByText('Q1 right'));
      expect(useAppStore.getState().dailyPractice?.answers).toEqual({ 2: 1, 0: 1 });
    });

    it('celebrates finishing the day with the score, and moves the streak on', async () => {
      const { getByText, queryByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 right')).toBeTruthy());
      await fireEvent.press(getByText('Q1 right'));
      await fireEvent.press(getByText('Q2 wrong A'));
      expect(queryByText('Done for today')).toBeNull();
      await fireEvent.press(getByText('Q3 right'));

      expect(getByText('Done for today')).toBeTruthy();
      expect(getByText('2 of 3 correct. Come back tomorrow for new questions.')).toBeTruthy();
      expect(useAppStore.getState().streak).toBe(1);
      expect(useAppStore.getState().practiceStats).toEqual({ daysCompleted: 1, answered: 3, correct: 2 });
      // The answered questions and their explanations stay on screen to read back.
      expect(getByText('Explanation 2.')).toBeTruthy();
    });

    it('shows the finished state straight away when the day was already completed earlier', async () => {
      useAppStore.setState({ dailyPractice: { date: today(), language: 'en', questions: three, answers: { 0: 1, 1: 1, 2: 0 } } });
      const { getByText } = await render(<DailyPractice />);
      expect(getByText('Done for today')).toBeTruthy();
      expect(getByText('2 of 3 correct. Come back tomorrow for new questions.')).toBeTruthy();
      expect(mockLoadDailyQuestions).not.toHaveBeenCalled();
    });
  });

  describe('language', () => {
    afterEach(async () => {
      await i18n.changeLanguage('en');
    });

    it.each(['zu', 'nso', 'ts'] as const)('shows its own text in %s, with nothing left in English', async (lang) => {
      useAppStore.setState({ language: lang });
      await i18n.changeLanguage(lang);
      mockLoadDailyQuestions.mockResolvedValue(loaded);
      const tr = (key: string, options?: Record<string, unknown>) => i18n.t(key, { lng: lang, ...options }) as string;

      const { getByText, queryByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText(tr('dailyAiLabel'))).toBeTruthy());
      for (const q of three) await fireEvent.press(getByText(q.options[1]));
      expect(getByText(tr('dailyDoneTitle'))).toBeTruthy();
      expect(getByText(tr('dailyDoneBody', { correct: 3, total: 3 }))).toBeTruthy();
      expect(queryByText('Done for today')).toBeNull();
      expect(queryByText('Correct')).toBeNull();
      expect(queryByText(/Question 1 of 3/)).toBeNull();
    });

    it('fetches the questions again in the new language if the student switches before answering any', async () => {
      mockLoadDailyQuestions.mockResolvedValue(loaded);
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Question 1?')).toBeTruthy());

      const zulu = { ok: true as const, questions: [question(1, { text: 'Umbuzo 1?' })] };
      mockLoadDailyQuestions.mockResolvedValue(zulu);
      await act(async () => {
        useAppStore.getState().setLanguage('zu');
      });
      await waitFor(() => expect(getByText('Umbuzo 1?')).toBeTruthy());
      expect(mockLoadDailyQuestions.mock.calls[1][0]).toMatchObject({ lang: 'zu' });
    });

    it('keeps today’s questions when the student switches language part-way through, so answers are not lost', async () => {
      mockLoadDailyQuestions.mockResolvedValue(loaded);
      const { getByText } = await render(<DailyPractice />);
      await waitFor(() => expect(getByText('Q1 right')).toBeTruthy());
      await fireEvent.press(getByText('Q1 right'));
      await act(async () => {
        useAppStore.getState().setLanguage('zu');
      });
      expect(getByText('Question 2?')).toBeTruthy();
      expect(mockLoadDailyQuestions).toHaveBeenCalledTimes(1);
    });

    it('ignores a slow reply in the old language after the student has switched', async () => {
      const slow = deferred<typeof loaded>();
      mockLoadDailyQuestions.mockReturnValueOnce(slow.promise);
      const { getByText, queryByText } = await render(<DailyPractice />);

      const zulu = { ok: true as const, questions: [question(1, { text: 'Umbuzo 1?' })] };
      mockLoadDailyQuestions.mockResolvedValueOnce(zulu);
      await act(async () => {
        useAppStore.getState().setLanguage('zu');
      });
      await waitFor(() => expect(getByText('Umbuzo 1?')).toBeTruthy());

      await act(async () => {
        slow.resolve(loaded);
        await slow.promise;
      });
      expect(queryByText('Question 1?')).toBeNull();
      // The discarded English questions were never shown, so they are not counted as asked.
      expect(useAppStore.getState().askedQuestions.map((a) => a.text)).toEqual(['Umbuzo 1?']);
    });
  });
});
