import { act, fireEvent, render, waitFor, within } from '@testing-library/react-native';
import React from 'react';
import { Platform } from 'react-native';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn(), back: jest.fn() },
}));

const mockRequestPermission = jest.fn();
jest.mock('@/lib/reminders', () => ({
  ...jest.requireActual('@/lib/reminders'),
  requestReminderPermission: (...args: unknown[]) => mockRequestPermission(...args),
}));

import ProfileScreen from '@/app/(tabs)/profile';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();
// The native switch reports its position as `value` on iPhone and `on` on Android.
const isOn = (control: { props: Record<string, unknown> }) => control.props.value ?? control.props.on;

const RECORD = {
  id: 'CA-02-20261005-ABCD',
  moduleId: '02',
  scorePct: 80,
  awardedAt: new Date(2026, 9, 5, 12).toISOString(),
  language: 'en' as const,
};

describe('ProfileScreen — your name', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
  });

  const open = async (label: string) => {
    const utils = await render(<ProfileScreen />);
    await fireEvent.press(utils.getByText(label));
    return utils;
  };

  it('shows a student with no name what the name is for and a way to add it, not an empty section', async () => {
    const { getByText, queryByTestId } = await render(<ProfileScreen />);
    expect(getByText('Your name')).toBeTruthy();
    expect(getByText('Add your name to be greeted on Home and to have it printed on your certificates.')).toBeTruthy();
    expect(getByText('Add your name')).toBeTruthy();
    expect(queryByTestId('profile-name-input')).toBeNull();
  });

  it('opens an empty name box and says why the save button is not ready yet', async () => {
    const { getByTestId, getByText } = await open('Add your name');
    expect(getByTestId('profile-name-input').props.value).toBe('');
    expect(getByText('Enter your name to continue.')).toBeTruthy();
    expect(getByText('0 / 60')).toBeTruthy();
  });

  it('does nothing when save is pressed with no name', async () => {
    const { getByText, getByTestId } = await open('Add your name');
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBeNull();
    expect(getByTestId('profile-name-input')).toBeTruthy();
  });

  it('does not accept a name made only of spaces', async () => {
    const { getByText, getByTestId } = await open('Add your name');
    await fireEvent.changeText(getByTestId('profile-name-input'), '     ');
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBeNull();
  });

  it('points out a too-short name once the student leaves the box, and does not save it', async () => {
    const { getByText, getByTestId, queryByText } = await open('Add your name');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'T');
    expect(queryByText('Enter at least 2 characters.')).toBeNull();
    await fireEvent(getByTestId('profile-name-input'), 'blur');
    expect(getByText('Enter at least 2 characters.')).toBeTruthy();
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBeNull();
  });

  it('blocks a name over the limit and says why', async () => {
    const { getByText, getByTestId } = await open('Add your name');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'a'.repeat(61));
    expect(getByText('That name is too long — shorten it to continue.')).toBeTruthy();
    expect(getByText('61 / 60')).toBeTruthy();
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBeNull();
  });

  it('saves a valid name, tidied, shows it and closes the box', async () => {
    const { getByText, getByTestId, queryByTestId, queryByText } = await open('Add your name');
    await fireEvent.changeText(getByTestId('profile-name-input'), '  Thandi   Nkosi ');
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
    expect(getByTestId('profile-name-value')).toHaveTextContent('Thandi Nkosi');
    expect(queryByTestId('profile-name-input')).toBeNull();
    expect(queryByText('Add your name')).toBeNull();
    expect(getByText('Change name')).toBeTruthy();
  });

  it('saves once when save is tapped twice quickly', async () => {
    const { getByText, getByTestId, queryByTestId } = await open('Add your name');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'Thandi Nkosi');
    const save = getByText('Save name');
    await act(async () => {
      fireEvent.press(save);
      fireEvent.press(save);
    });
    expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
    expect(queryByTestId('profile-name-input')).toBeNull();
  });

  it('shows a name that is already saved (for example one typed for a certificate)', async () => {
    useAppStore.setState({ studentName: 'Thandi Nkosi' });
    const { getByTestId, queryByText } = await render(<ProfileScreen />);
    expect(getByTestId('profile-name-value')).toHaveTextContent('Thandi Nkosi');
    expect(queryByText('Add your name')).toBeNull();
  });

  it('opens the box with the current name filled in when changing it, and saves the new one', async () => {
    useAppStore.setState({ studentName: 'Thandi Nkosi' });
    const { getByText, getByTestId } = await open('Change name');
    expect(getByTestId('profile-name-input').props.value).toBe('Thandi Nkosi');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'Thandiwe Nkosi');
    await fireEvent.press(getByText('Save name'));
    expect(useAppStore.getState().studentName).toBe('Thandiwe Nkosi');
    expect(getByTestId('profile-name-value')).toHaveTextContent('Thandiwe Nkosi');
  });

  it('keeps the old name when the student cancels a change', async () => {
    useAppStore.setState({ studentName: 'Thandi Nkosi' });
    const { getByText, getByTestId, queryByTestId } = await open('Change name');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'Someone Else');
    await fireEvent.press(getByText('Cancel'));
    expect(useAppStore.getState().studentName).toBe('Thandi Nkosi');
    expect(queryByTestId('profile-name-input')).toBeNull();
    expect(getByTestId('profile-name-value')).toHaveTextContent('Thandi Nkosi');
  });

  it('starts from the saved name again, not the abandoned typing, when the box is reopened', async () => {
    useAppStore.setState({ studentName: 'Thandi Nkosi' });
    const { getByText, getByTestId } = await open('Change name');
    await fireEvent.changeText(getByTestId('profile-name-input'), 'Someone Else');
    await fireEvent.press(getByText('Cancel'));
    await fireEvent.press(getByText('Change name'));
    expect(getByTestId('profile-name-input').props.value).toBe('Thandi Nkosi');
  });

  it('treats a damaged saved name as no name, and keeps the rest of Profile working', async () => {
    useAppStore.setState({ studentName: 42 as unknown as string });
    const { getByText, queryByTestId } = await render(<ProfileScreen />);
    expect(getByText('Add your name')).toBeTruthy();
    expect(queryByTestId('profile-name-value')).toBeNull();
    expect(getByText('0 of 6 earned')).toBeTruthy();
  });

  it('still fits a very long name: it wraps instead of running off the screen', async () => {
    const longName = 'Nomvula Thandiwe Mahlangu-Van der Westhuizen Nkosazana';
    useAppStore.setState({ studentName: longName });
    const { getByTestId } = await render(<ProfileScreen />);
    expect(getByTestId('profile-name-value')).toHaveTextContent(longName);
    expect(getByTestId('profile-name-value').props.numberOfLines).toBeUndefined();
  });

  it.each(['zu', 'nso', 'ts'] as const)('is written in %s when that language is chosen', async (lang) => {
    useAppStore.setState({ language: lang });
    await i18n.changeLanguage(lang);
    const tr = (key: string) => i18n.t(key, { lng: lang }) as string;
    const { getByText, queryByText } = await render(<ProfileScreen />);
    expect(getByText(tr('yourName'))).toBeTruthy();
    expect(getByText(tr('nameEmpty'))).toBeTruthy();
    expect(queryByText('Your name')).toBeNull();
    await fireEvent.press(getByText(tr('nameAdd')));
    expect(getByText(tr('nameSave'))).toBeTruthy();
    expect(getByText(tr('cancel'))).toBeTruthy();
    expect(queryByText('Save name')).toBeNull();
    await i18n.changeLanguage('en');
  });
});

describe('ProfileScreen — badges', () => {
  const ALL = ['scam-spotter', 'popia-aware', 'popia-basics', 'first-steps', 'cyber-graduate', 'streak-7'];
  const HOW = [
    'Pass the Online Scams final assessment',
    'Pass the Digital Privacy final assessment',
    'Finish all three POPIA lessons',
    'Finish your first lesson',
    'Complete all three modules',
    'Finish the daily practice 7 days in a row',
  ];

  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
  });

  it('shows a student with no badges all six and how to earn each, not an empty grid', async () => {
    const { getByText, getByTestId, queryByText } = await render(<ProfileScreen />);
    for (const id of ALL) expect(getByTestId(`badge-image-${id}`)).toBeTruthy();
    for (const line of HOW) expect(getByText(line)).toBeTruthy();
    expect(getByText('0 of 6 earned')).toBeTruthy();
    expect(queryByText('30-Day Streak')).toBeNull();
  });

  it('marks only the earned badges as earned and keeps the how-to-earn line on the rest', async () => {
    useAppStore.setState({ earnedBadgeIds: ['first-steps', 'scam-spotter'] });
    const { getByText, queryByText, getByTestId } = await render(<ProfileScreen />);
    expect(getByText('2 of 6 earned')).toBeTruthy();
    expect(queryByText('Finish your first lesson')).toBeNull();
    expect(queryByText('Pass the Online Scams final assessment')).toBeNull();
    expect(getByText('Finish the daily practice 7 days in a row')).toBeTruthy();
    expect(getByTestId('badge-image-first-steps')).toHaveStyle({ opacity: 1 });
    expect(getByTestId('badge-image-streak-7')).toHaveStyle({ opacity: 0.3 });
  });

  it('celebrates a student who has earned every badge', async () => {
    useAppStore.setState({ earnedBadgeIds: ALL });
    const { getByText, queryByText } = await render(<ProfileScreen />);
    expect(getByText("You've earned every badge — well done!")).toBeTruthy();
    expect(queryByText('6 of 6 earned')).toBeNull();
    for (const line of HOW) expect(queryByText(line)).toBeNull();
  });

  it('ignores a saved badge the app no longer has (the old 30-Day Streak) instead of crashing or miscounting', async () => {
    useAppStore.setState({ earnedBadgeIds: ['streak-30', 'first-steps'] });
    const { getByText, queryByText } = await render(<ProfileScreen />);
    expect(getByText('1 of 6 earned')).toBeTruthy();
    expect(queryByText(/badgeName_|badgeHow_/)).toBeNull();
  });
});

describe('ProfileScreen — tapping a badge', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
  });

  it('replays the celebration when an earned badge is tapped', async () => {
    useAppStore.setState({ earnedBadgeIds: ['first-steps', 'scam-spotter'] });
    const { getByTestId } = await render(<ProfileScreen />);
    await fireEvent.press(getByTestId('badge-tile-scam-spotter'));
    expect(useAppStore.getState().badgeReplayId).toBe('scam-spotter');
  });

  it('does nothing when a locked badge is tapped: it still shows how to earn it', async () => {
    useAppStore.setState({ earnedBadgeIds: ['first-steps'] });
    const { getByTestId, getByText } = await render(<ProfileScreen />);
    await fireEvent.press(getByTestId('badge-tile-scam-spotter'));
    expect(useAppStore.getState().badgeReplayId).toBeNull();
    expect(getByText('Pass the Online Scams final assessment')).toBeTruthy();
  });

  it('replays the badge that was tapped last when two are tapped quickly', async () => {
    useAppStore.setState({ earnedBadgeIds: ['first-steps', 'scam-spotter'] });
    const { getByTestId } = await render(<ProfileScreen />);
    await act(async () => {
      fireEvent.press(getByTestId('badge-tile-first-steps'));
      fireEvent.press(getByTestId('badge-tile-scam-spotter'));
    });
    expect(useAppStore.getState().badgeReplayId).toBe('scam-spotter');
  });
});

describe('ProfileScreen — daily practice totals', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
  });

  const value = (utils: Awaited<ReturnType<typeof render>>, id: string, text: string) =>
    within(utils.getByTestId(id)).getByText(text);

  it('shows a student who has not practised yet zeros and how to start, not an empty section', async () => {
    const utils = await render(<ProfileScreen />);
    expect(utils.getByText("Answer today's questions to start your record.")).toBeTruthy();
    expect(value(utils, 'stat-days-practised', '0')).toBeTruthy();
    expect(value(utils, 'stat-questions-answered', '0')).toBeTruthy();
    expect(value(utils, 'stat-correct-answers', '0')).toBeTruthy();
  });

  it('shows the real totals: days practised, questions answered and correct answers', async () => {
    useAppStore.setState({ practiceStats: { daysCompleted: 4, answered: 12, correct: 9 } });
    const utils = await render(<ProfileScreen />);
    expect(value(utils, 'stat-days-practised', '4')).toBeTruthy();
    expect(value(utils, 'stat-questions-answered', '12')).toBeTruthy();
    expect(value(utils, 'stat-correct-answers', '9')).toBeTruthy();
    expect(utils.getByText('Days practised')).toBeTruthy();
    expect(utils.queryByText("Answer today's questions to start your record.")).toBeNull();
  });

  it('updates as soon as a question is answered', async () => {
    const utils = await render(<ProfileScreen />);
    await act(async () => {
      useAppStore.getState().startDailyPractice([
        { topicId: '01-1', moduleId: '01', lessonN: 1, text: 'Q?', options: ['a', 'b', 'c', 'd'], correct: 0, source: 'ai' },
      ]);
      useAppStore.getState().answerDailyQuestion(0, 0);
    });
    expect(value(utils, 'stat-days-practised', '1')).toBeTruthy();
    expect(value(utils, 'stat-correct-answers', '1')).toBeTruthy();
  });

  it('shows 0 rather than a broken number if a saved total is damaged', async () => {
    useAppStore.setState({ practiceStats: { daysCompleted: Number.NaN, answered: 3, correct: Number.NaN } });
    const utils = await render(<ProfileScreen />);
    expect(value(utils, 'stat-days-practised', '0')).toBeTruthy();
    expect(utils.queryByText('NaN')).toBeNull();
  });

  it.each(['zu', 'nso', 'ts'] as const)('is labelled in %s when that language is chosen', async (lang) => {
    useAppStore.setState({ language: lang });
    await i18n.changeLanguage(lang);
    const utils = await render(<ProfileScreen />);
    expect(utils.getByText(i18n.t('statDaysPractised', { lng: lang }) as string)).toBeTruthy();
    expect(utils.queryByText('Days practised')).toBeNull();
    await i18n.changeLanguage('en');
  });
});

describe('ProfileScreen — notifications switch', () => {
  const originalOS = Platform.OS;
  const setOS = (os: string) => Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });

  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockRequestPermission.mockReset();
    mockRequestPermission.mockResolvedValue('granted');
    setOS('android');
  });
  afterEach(() => setOS(originalOS));

  it('has a switch for the daily reminder that shows whether it is on', async () => {
    useAppStore.setState({ reminderEnabled: true });
    const { getByTestId, getByText } = await render(<ProfileScreen />);
    expect(getByText('Daily reminder')).toBeTruthy();
    expect(isOn(getByTestId('reminder-switch'))).toBe(true);
  });

  it('switches the reminder off and back on from Profile', async () => {
    useAppStore.setState({ reminderEnabled: true });
    const { getByTestId } = await render(<ProfileScreen />);
    await fireEvent(getByTestId('reminder-switch'), 'valueChange', false);
    expect(useAppStore.getState().reminderEnabled).toBe(false);

    await fireEvent(getByTestId('reminder-switch'), 'valueChange', true);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(true));
    expect(isOn(getByTestId('reminder-switch'))).toBe(true);
  });

  it('keeps the rest of Profile working when notifications are blocked on the phone', async () => {
    mockRequestPermission.mockResolvedValue('denied');
    const { getByTestId, getByText } = await render(<ProfileScreen />);
    await fireEvent(getByTestId('reminder-switch'), 'valueChange', true);
    await waitFor(() => expect(getByText('Open phone settings')).toBeTruthy());
    expect(getByText('0 of 6 earned')).toBeTruthy();
    expect(isOn(getByTestId('reminder-switch'))).toBe(false);
  });

  it('has no switch in a web browser, and the rest of Profile still shows', async () => {
    setOS('web');
    const { queryByTestId, getByText } = await render(<ProfileScreen />);
    expect(queryByTestId('reminder-switch')).toBeNull();
    expect(getByText('0 of 6 earned')).toBeTruthy();
  });
});

describe('ProfileScreen — certificates', () => {
  beforeEach(async () => {
    useAppStore.setState({ ...initialState, language: 'en' }, true);
    await i18n.changeLanguage('en');
    mockPush.mockClear();
  });

  it('shows a student with no certificates which ones exist and how to earn the first, not an empty box', async () => {
    const { getByText, getAllByText, getByTestId } = await render(<ProfileScreen />);
    expect(getByText('Pass an assessment to earn your first certificate.')).toBeTruthy();
    expect(getByTestId('certificate-row-02')).toBeTruthy();
    expect(getByTestId('certificate-row-03')).toBeTruthy();
    expect(getAllByText('Pass the final assessment to earn it').length).toBe(2);
  });

  it('takes the student to the module when they tap a certificate they have not earned', async () => {
    const { getByTestId } = await render(<ProfileScreen />);
    await fireEvent.press(getByTestId('certificate-row-03'));
    expect(mockPush).toHaveBeenCalledWith('/module/03');
  });

  it('shows an earned certificate with its date, and opens it when tapped', async () => {
    useAppStore.setState({ earnedBadgeIds: ['scam-spotter'], certificates: { '02': RECORD } });
    const { getByText, getAllByText, getByTestId, queryByText } = await render(<ProfileScreen />);
    expect(getByText('Awarded for passing the Online Scams module.')).toBeTruthy();
    expect(getByText('05/10/2026')).toBeTruthy();
    expect(queryByText('Pass an assessment to earn your first certificate.')).toBeNull();
    // The other certificate is still locked.
    expect(getAllByText('Pass the final assessment to earn it').length).toBe(1);

    await fireEvent.press(getByTestId('certificate-row-02'));
    expect(mockPush).toHaveBeenCalledWith('/certificate/02');
  });

  it('opens a certificate earned before certificates existed, showing it without a date', async () => {
    useAppStore.setState({ earnedBadgeIds: ['popia-aware'], certificates: {} });
    const { getByText, getByTestId, queryByText } = await render(<ProfileScreen />);
    expect(getByText('Awarded for passing the Digital Privacy module.')).toBeTruthy();
    expect(queryByText(/Invalid|null|undefined/)).toBeNull();
    await fireEvent.press(getByTestId('certificate-row-03'));
    expect(mockPush).toHaveBeenCalledWith('/certificate/03');
  });

  it('shows no locked rows once every certificate has been earned', async () => {
    useAppStore.setState({ earnedBadgeIds: ['scam-spotter', 'popia-aware'], certificates: { '02': RECORD } });
    const { queryByText, getByText } = await render(<ProfileScreen />);
    expect(queryByText('Pass the final assessment to earn it')).toBeNull();
    expect(getByText('Awarded for passing the Online Scams module.')).toBeTruthy();
    expect(getByText('Awarded for passing the Digital Privacy module.')).toBeTruthy();
  });

  it('no longer shows a download button that can never be pressed', async () => {
    useAppStore.setState({ earnedBadgeIds: ['scam-spotter'], certificates: { '02': RECORD } });
    const { queryByText } = await render(<ProfileScreen />);
    expect(queryByText('Download PDF')).toBeNull();
  });
});
