import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams: { moduleId: string; lessonN: string } = { moduleId: '02', lessonN: '1' };

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: (...args: unknown[]) => mockReplace(...args) },
  useLocalSearchParams: () => mockParams,
}));

const mockGetModule = jest.fn();
jest.mock('@/data/modules', () => ({
  getModule: (...args: unknown[]) => mockGetModule(...args),
}));

const mockGetModuleTopicQuiz = jest.fn();
const mockGetModuleFinalAssessment = jest.fn();
jest.mock('@/lib/topic-source', () => ({
  getModuleTopicQuiz: (...args: unknown[]) => mockGetModuleTopicQuiz(...args),
  getModuleFinalAssessment: (...args: unknown[]) => mockGetModuleFinalAssessment(...args),
}));

import '@/i18n';
import { useAppStore } from '@/store/useAppStore';

import TopicQuizScreen from '@/app/quiz/[moduleId]/[lessonN]';

const initialState = useAppStore.getState();

const QUIZ = [
  { text: 'What is the main purpose of an online scam?', options: ['Educate', 'Deceive for benefit', 'Entertain', 'Verify'], correct: 1 },
  { text: 'Which is a common characteristic?', options: ['Spelling only', 'Unknown numbers only', 'Urgency or pressure', 'Appearance'], correct: 2 },
];

describe('TopicQuizScreen (per-lesson knowledge check)', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockPush.mockClear();
    mockReplace.mockClear();
    mockGetModule.mockReturnValue({ id: '02', title: 'Online Scams', lessonCount: 9, minutes: 54 });
    mockGetModuleTopicQuiz.mockReturnValue(QUIZ);
    mockGetModuleFinalAssessment.mockReturnValue(undefined);
    mockParams = { moduleId: '02', lessonN: '1' };
  });

  it('shows a graceful not-found state instead of crashing when the topic quiz is missing', async () => {
    mockGetModuleTopicQuiz.mockReturnValue(undefined);
    const { getByText } = await render(<TopicQuizScreen />);
    expect(getByText(/not found/i)).toBeTruthy();
  });

  it('shows the first question unanswered', async () => {
    const { getByText } = await render(<TopicQuizScreen />);
    expect(getByText(QUIZ[0].text)).toBeTruthy();
  });

  it('marks the tapped option without silently advancing, and does not reveal the next question yet', async () => {
    const { getByText, queryByText } = await render(<TopicQuizScreen />);
    await fireEvent.press(getByText(QUIZ[0].options[QUIZ[0].correct]));
    expect(getByText(QUIZ[0].text)).toBeTruthy();
    expect(queryByText(QUIZ[1].text)).toBeNull();
  });

  it('ignores a second tap on a different option after the first is locked in (double-tap guard)', async () => {
    const { getByText } = await render(<TopicQuizScreen />);
    await fireEvent.press(getByText(QUIZ[0].options[QUIZ[0].correct]));
    const otherIndex = QUIZ[0].options.findIndex((_, i) => i !== QUIZ[0].correct);
    await fireEvent.press(getByText(QUIZ[0].options[otherIndex]));
    expect(useAppStore.getState().quizAnswers[0]).toBe(QUIZ[0].correct);
  });

  it('advances to the next question only after an explicit "Next question" tap', async () => {
    const { getByText, queryByText } = await render(<TopicQuizScreen />);
    await fireEvent.press(getByText(QUIZ[0].options[QUIZ[0].correct]));
    await fireEvent.press(getByText(/next question/i));
    expect(getByText(QUIZ[1].text)).toBeTruthy();
    expect(queryByText(QUIZ[0].text)).toBeNull();
  });

  it('routes to the next lesson after the last question of a non-final lesson’s knowledge check', async () => {
    mockParams = { moduleId: '02', lessonN: '3' };
    const { getByText } = await render(<TopicQuizScreen />);
    for (let i = 0; i < QUIZ.length; i++) {
      const label = i === QUIZ.length - 1 ? /continue/i : /next question/i;
      await fireEvent.press(getByText(QUIZ[i].options[QUIZ[i].correct]));
      await fireEvent.press(getByText(label));
    }
    expect(mockPush).toHaveBeenCalledWith('/lesson/02/4');
  });

  it('routes to the result screen (not the next lesson) after the capstone lesson’s knowledge check', async () => {
    mockParams = { moduleId: '02', lessonN: '9' };
    mockGetModuleFinalAssessment.mockReturnValue([{ text: 'x', options: ['a', 'b'], correct: 0, topic: '', area: '', explain: '' }]);
    const { getByText } = await render(<TopicQuizScreen />);
    for (let i = 0; i < QUIZ.length; i++) {
      const label = i === QUIZ.length - 1 ? /see my result/i : /next question/i;
      await fireEvent.press(getByText(QUIZ[i].options[QUIZ[i].correct]));
      await fireEvent.press(getByText(label));
    }
    expect(mockReplace).toHaveBeenCalledWith('/result/02');
  });

  it('routes back to the module screen (not /quiz/{moduleId}) after a non-capstone module’s last lesson, since it has no final assessment to gate', async () => {
    mockGetModule.mockReturnValue({ id: '01', title: 'POPIA & Your Personal Data', lessonCount: 3, minutes: 18 });
    mockGetModuleFinalAssessment.mockReturnValue(undefined);
    mockParams = { moduleId: '01', lessonN: '3' };
    const { getByText } = await render(<TopicQuizScreen />);
    for (let i = 0; i < QUIZ.length; i++) {
      const label = i === QUIZ.length - 1 ? /continue/i : /next question/i;
      await fireEvent.press(getByText(QUIZ[i].options[QUIZ[i].correct]));
      await fireEvent.press(getByText(label));
    }
    expect(mockReplace).toHaveBeenCalledWith('/module/01');
  });
});
