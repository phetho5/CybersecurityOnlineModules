import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockReplace = jest.fn();
let mockParams: { id: string } = { id: '03' };

jest.mock('expo-router', () => ({
  router: { replace: (...args: unknown[]) => mockReplace(...args), push: jest.fn() },
  useLocalSearchParams: () => mockParams,
}));

const mockGetModule = jest.fn();
jest.mock('@/data/modules', () => ({
  getModule: (...args: unknown[]) => mockGetModule(...args),
}));

const mockGetModuleFinalAssessment = jest.fn();
jest.mock('@/lib/topic-source', () => ({
  getModuleFinalAssessment: (...args: unknown[]) => mockGetModuleFinalAssessment(...args),
}));

const mockRecordQuizAttempt = jest.fn();
jest.mock('@/lib/sync', () => ({
  recordQuizAttempt: (...args: unknown[]) => mockRecordQuizAttempt(...args),
}));

import '@/i18n';
import { useAppStore } from '@/store/useAppStore';

import ResultScreen from '@/app/result/[id]';

const initialState = useAppStore.getState();

const QUESTIONS = [
  { topic: 'Digital Privacy', area: 'Digital Privacy', text: 'Q1', options: ['a', 'b'], correct: 0, explain: '' },
  { topic: 'Digital Privacy', area: 'Digital Privacy', text: 'Q2', options: ['a', 'b'], correct: 1, explain: '' },
];

describe('ResultScreen', () => {
  beforeEach(() => {
    useAppStore.setState(initialState, true);
    mockReplace.mockClear();
    mockGetModule.mockReset();
    mockGetModuleFinalAssessment.mockReset();
    mockRecordQuizAttempt.mockClear();
    mockGetModule.mockReturnValue({ id: '03', title: 'Digital Privacy', lessonCount: 2, minutes: 16 });
    mockGetModuleFinalAssessment.mockReturnValue(QUESTIONS);
    mockParams = { id: '03' };
  });

  it('scores against the module’s own final assessment, not a hardcoded one', async () => {
    useAppStore.setState({ quizAnswers: { 0: 0, 1: 1 } });
    const { getByText } = await render(<ResultScreen />);
    await waitFor(() => expect(getByText('100%')).toBeTruthy());
  });

  it('shows the earned badge when the module has one and the student passed', async () => {
    useAppStore.setState({ quizAnswers: { 0: 0, 1: 1 } });
    const { getByText } = await render(<ResultScreen />);
    await waitFor(() => expect(getByText(/digital privacy pro/i)).toBeTruthy());
  });

  it('shows no badge block when the student failed, even though the module has a badge', async () => {
    useAppStore.setState({ quizAnswers: { 0: 1, 1: 0 } });
    const { getByText, queryByText } = await render(<ResultScreen />);
    await waitFor(() => expect(getByText('0%')).toBeTruthy());
    expect(queryByText(/digital privacy pro/i)).toBeNull();
  });

  it('retakes the failed assessment at the capstone lesson’s own quiz route, not the old flat module route', async () => {
    useAppStore.setState({ quizAnswers: { 0: 1, 1: 0 } });
    const { getByText } = await render(<ResultScreen />);
    await waitFor(() => expect(getByText('Retake the assessment')).toBeTruthy());
    await fireEvent.press(getByText('Retake the assessment'));
    expect(mockReplace).toHaveBeenCalledWith('/quiz/03/2');
  });

  it('renders nothing (no crash) for an unknown module id', async () => {
    mockGetModule.mockReturnValue(undefined);
    const { toJSON } = await render(<ResultScreen />);
    expect(toJSON()).toBeNull();
  });
});
