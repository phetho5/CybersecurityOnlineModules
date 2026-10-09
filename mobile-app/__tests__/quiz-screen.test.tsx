import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  router: { replace: (...args: unknown[]) => mockReplace(...args), back: jest.fn(), push: jest.fn() },
  useLocalSearchParams: () => ({ id: '02' }),
}));

import '@/i18n';
import { QUESTIONS } from '@/data/quiz';
import { useAppStore } from '@/store/useAppStore';

import QuizScreen from '@/app/quiz/[id]';

const initialState = useAppStore.getState();

describe('QuizScreen (regression: per-question feedback)', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockReplace.mockClear();
  });

  it('shows question 1 first, unanswered', async () => {
    const { getByText } = await render(<QuizScreen />);
    expect(getByText(QUESTIONS[0].text)).toBeTruthy();
  });

  it('shows the Correct/Not quite feedback and explanation for question 1 immediately after answering it, without silently advancing to question 2', async () => {
    const { getByText, queryByText } = await render(<QuizScreen />);

    const correctOptionText = QUESTIONS[0].options[QUESTIONS[0].correct];
    await fireEvent.press(getByText(correctOptionText));

    // The question actually being displayed must still be question 1 — the student needs to see
    // why they were right/wrong before moving on, not be swept to the next question mid-tap.
    expect(getByText(QUESTIONS[0].text)).toBeTruthy();
    expect(getByText('Correct')).toBeTruthy();
    expect(getByText(QUESTIONS[0].explain)).toBeTruthy();
    expect(getByText('Next question')).toBeTruthy();
    expect(queryByText(QUESTIONS[1].text)).toBeNull();
  });

  it('only advances to question 2 after the student explicitly taps "Next question"', async () => {
    const { getByText, queryByText } = await render(<QuizScreen />);

    await fireEvent.press(getByText(QUESTIONS[0].options[QUESTIONS[0].correct]));
    await fireEvent.press(getByText('Next question'));

    expect(getByText(QUESTIONS[1].text)).toBeTruthy();
    expect(queryByText(QUESTIONS[0].text)).toBeNull();
  });

  it('shows "Not quite" feedback (not a silent skip) when the answer is wrong', async () => {
    const { getByText } = await render(<QuizScreen />);

    const wrongIndex = QUESTIONS[0].options.findIndex((_, i) => i !== QUESTIONS[0].correct);
    await fireEvent.press(getByText(QUESTIONS[0].options[wrongIndex]));

    expect(getByText('Not quite')).toBeTruthy();
    expect(getByText(QUESTIONS[0].text)).toBeTruthy();
  });

  it('ignores a second tap on a different option after question 1 is already answered (double-tap guard)', async () => {
    const { getByText } = await render(<QuizScreen />);

    const correctIndex = QUESTIONS[0].correct;
    const otherIndex = QUESTIONS[0].options.findIndex((_, i) => i !== correctIndex);
    await fireEvent.press(getByText(QUESTIONS[0].options[correctIndex]));
    await fireEvent.press(getByText(QUESTIONS[0].options[otherIndex]));

    expect(useAppStore.getState().quizAnswers[0]).toBe(correctIndex);
  });

  it('walks through all three questions and navigates to the result screen only after the last one', async () => {
    const { getByText } = await render(<QuizScreen />);

    for (let i = 0; i < QUESTIONS.length; i++) {
      const label = i === QUESTIONS.length - 1 ? 'See my result' : 'Next question';
      await fireEvent.press(getByText(QUESTIONS[i].options[QUESTIONS[i].correct]));
      expect(getByText(QUESTIONS[i].text)).toBeTruthy();
      await fireEvent.press(getByText(label));
    }

    expect(mockReplace).toHaveBeenCalledWith('/result/02');
  });
});
