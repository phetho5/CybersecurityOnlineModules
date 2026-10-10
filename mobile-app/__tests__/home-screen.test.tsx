import { act, fireEvent, render, within } from '@testing-library/react-native';
import React from 'react';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn(), back: jest.fn() },
}));

import HomeScreen from '@/app/(tabs)/home';
import i18n from '@/i18n';
import { getLesson } from '@/data/lessons';
import { toLocalDateKey } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();
const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => toLocalDateKey(new Date(Date.now() - n * DAY_MS));

const question = (n: number) => ({
  topicId: `01-${n}`,
  moduleId: '01',
  lessonN: n,
  text: `Question ${n}?`,
  options: ['a', 'b', 'c', 'd'],
  correct: 1,
  source: 'ai' as const,
});
const three = [question(1), question(2), question(3)];

beforeEach(async () => {
  useAppStore.setState({ ...initialState, language: 'en' }, true);
  await i18n.changeLanguage('en');
  mockPush.mockReset();
});

describe('HomeScreen — the three numbers at the top are the student’s own', () => {
  const stat = (utils: Awaited<ReturnType<typeof render>>, id: string) => within(utils.getByTestId(id));

  it('shows a brand-new student zeros, not invented progress', async () => {
    const utils = await render(<HomeScreen />);
    expect(stat(utils, 'stat-streak').getByText('0')).toBeTruthy();
    expect(stat(utils, 'stat-badges').getByText('0')).toBeTruthy();
    expect(stat(utils, 'stat-complete').getByText('0%')).toBeTruthy();
  });

  it('counts the badges the student really holds, ignoring one the app no longer has', async () => {
    useAppStore.setState({ earnedBadgeIds: ['first-steps', 'popia-basics', 'streak-30'] });
    const utils = await render(<HomeScreen />);
    expect(stat(utils, 'stat-badges').getByText('2')).toBeTruthy();
  });

  it('works out "complete" from real lesson progress across all three modules', async () => {
    // One of POPIA's three lessons (34%), nothing else: 34 / 3 modules = 11%.
    useAppStore.setState({ moduleProgress: { '01': 34 } });
    const first = await render(<HomeScreen />);
    expect(stat(first, 'stat-complete').getByText('11%')).toBeTruthy();
    await first.unmount();

    useAppStore.setState({ moduleProgress: { '01': 100, '02': 100, '03': 100 } });
    const all = await render(<HomeScreen />);
    expect(stat(all, 'stat-complete').getByText('100%')).toBeTruthy();
  });

  it('never shows more than 100% or a broken number from damaged saved progress', async () => {
    useAppStore.setState({ moduleProgress: { '01': 250, '02': Number.NaN, '03': -40 } as Record<string, number> });
    const utils = await render(<HomeScreen />);
    expect(stat(utils, 'stat-complete').getByText('33%')).toBeTruthy();
  });

  it('shows the streak while it is alive: practised today, or yesterday with today still to do', async () => {
    useAppStore.setState({ streak: 4, lastActiveDate: daysAgo(0) });
    const today = await render(<HomeScreen />);
    expect(stat(today, 'stat-streak').getByText('4')).toBeTruthy();
    await today.unmount();

    useAppStore.setState({ streak: 4, lastActiveDate: daysAgo(1) });
    const yesterday = await render(<HomeScreen />);
    expect(stat(yesterday, 'stat-streak').getByText('4')).toBeTruthy();
  });

  it('shows 0 once a day has been missed, instead of a streak that is no longer true', async () => {
    useAppStore.setState({ streak: 4, lastActiveDate: daysAgo(3) });
    const utils = await render(<HomeScreen />);
    expect(stat(utils, 'stat-streak').getByText('0')).toBeTruthy();
  });
});

describe('HomeScreen — greeting the student by name', () => {
  it('greets a student who has not given a name with the plain greeting, no stray comma', async () => {
    const { getByTestId } = await render(<HomeScreen />);
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon', { exact: true });
  });

  it('greets a student by their first name once they have saved one', async () => {
    useAppStore.setState({ studentName: 'Thandi Nkosi' });
    const { getByTestId } = await render(<HomeScreen />);
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon, Thandi', { exact: true });
  });

  it('changes the greeting as soon as the name is saved or changed', async () => {
    const { getByTestId } = await render(<HomeScreen />);
    await act(async () => useAppStore.getState().setStudentName('Sipho Dlamini'));
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon, Sipho', { exact: true });
    await act(async () => useAppStore.getState().setStudentName('Lerato Dlamini'));
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon, Lerato', { exact: true });
  });

  it.each([
    ['zu', 'Sawubona, Thandi'],
    ['nso', 'Thobela, Thandi'],
    ['ts', 'Xewani, Thandi'],
  ] as const)('keeps the %s greeting and adds the name to it', async (lang, expected) => {
    useAppStore.setState({ language: lang, studentName: 'Thandi Nkosi' });
    await i18n.changeLanguage(lang);
    const { getByTestId } = await render(<HomeScreen />);
    expect(getByTestId('home-greeting')).toHaveTextContent(expected, { exact: true });
    await i18n.changeLanguage('en');
  });

  it('falls back to the plain greeting when the saved name is damaged', async () => {
    useAppStore.setState({ studentName: 42 as unknown as string });
    const { getByTestId } = await render(<HomeScreen />);
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon', { exact: true });
  });

  // Three lines, not two: on a narrow phone "Good afternoon" already fills two, and the name must still show.
  it('gives the greeting room for the name on a narrow phone, but caps a very long one at three lines', async () => {
    useAppStore.setState({ studentName: 'Nkosazanathandiwenomvulamahlangu Nkosi' });
    const { getByTestId } = await render(<HomeScreen />);
    expect(getByTestId('home-greeting').props.numberOfLines).toBe(3);
    expect(getByTestId('home-greeting')).toHaveTextContent('Good afternoon, Nkosazanathandiwenomvulamahlangu', { exact: true });
  });
});

describe('HomeScreen — Continue learning', () => {
  it('points a new student at the first lesson', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText(getLesson('01', 1)!.title)).toBeTruthy();
    await fireEvent.press(getByText('Continue lesson'));
    expect(mockPush).toHaveBeenCalledWith('/lesson/01/1');
  });

  it('resumes the lesson the student actually had open last, with its module and position', async () => {
    useAppStore.setState({ moduleProgress: { '01': 34 } });
    useAppStore.getState().setLastLesson('02', 4);
    const { getByText } = await render(<HomeScreen />);
    expect(getByText(getLesson('02', 4)!.title)).toBeTruthy();
    expect(getByText(/Online Scams · 4 of 9/)).toBeTruthy();
    await fireEvent.press(getByText('Continue lesson'));
    expect(mockPush).toHaveBeenCalledWith('/lesson/02/4');
  });

  it('moves on to the next lesson once the last-opened one has been finished', async () => {
    useAppStore.getState().setLastLesson('01', 1);
    useAppStore.getState().completeLesson('01', 1);
    const { getByText } = await render(<HomeScreen />);
    expect(getByText(getLesson('01', 2)!.title)).toBeTruthy();
  });

  it('congratulates a student who has completed everything, with no dead "continue" button', async () => {
    useAppStore.setState({ moduleProgress: { '01': 100, '02': 100, '03': 100 } });
    const { getByText, queryByText } = await render(<HomeScreen />);
    expect(getByText("You've completed every module. Nice work!")).toBeTruthy();
    expect(queryByText('Continue lesson')).toBeNull();
  });
});

describe('HomeScreen — today’s practice card', () => {
  it('invites a student who has not started today to answer today’s questions', async () => {
    const { getByText, getByTestId } = await render(<HomeScreen />);
    expect(getByText("Today's practice")).toBeTruthy();
    expect(getByText('0 of 3 answered')).toBeTruthy();
    await fireEvent.press(getByTestId('daily-home-cta'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/practice');
  });

  it('shows how far through today’s questions the student is', async () => {
    useAppStore.setState({ dailyPractice: { date: daysAgo(0), language: 'en', questions: three, answers: { 0: 1 } } });
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('1 of 3 answered')).toBeTruthy();
    expect(getByText("Answer today's questions")).toBeTruthy();
  });

  it('confirms the day is done, with the score, and drops the call to action', async () => {
    useAppStore.setState({ dailyPractice: { date: daysAgo(0), language: 'en', questions: three, answers: { 0: 1, 1: 0, 2: 1 } } });
    const { getByText, queryByText } = await render(<HomeScreen />);
    expect(getByText('Done for today — 2 of 3 correct')).toBeTruthy();
    expect(queryByText("Answer today's questions")).toBeNull();
  });

  it('does not count yesterday’s finished practice as today’s', async () => {
    useAppStore.setState({ dailyPractice: { date: daysAgo(1), language: 'en', questions: three, answers: { 0: 1, 1: 1, 2: 1 } } });
    const { getByText, queryByText } = await render(<HomeScreen />);
    expect(getByText('0 of 3 answered')).toBeTruthy();
    expect(queryByText(/Done for today/)).toBeNull();
  });

  it.each(['zu', 'nso', 'ts'] as const)('is written in %s when that language is chosen', async (lang) => {
    useAppStore.setState({ language: lang });
    await i18n.changeLanguage(lang);
    const { getByText, queryByText } = await render(<HomeScreen />);
    expect(getByText(i18n.t('dailyHomeKicker', { lng: lang }) as string)).toBeTruthy();
    expect(getByText(i18n.t('dailyHomeProgress', { lng: lang, answered: 0, total: 3 }) as string)).toBeTruthy();
    expect(queryByText("Today's practice")).toBeNull();
    await i18n.changeLanguage('en');
  });
});
