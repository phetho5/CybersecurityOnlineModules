import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Linking, Platform } from 'react-native';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args), replace: jest.fn(), back: jest.fn() },
}));

const mockRequestPermission = jest.fn();
const mockSync = jest.fn();
const mockShowWhileOpen = jest.fn();
const mockOnOpened = jest.fn();
jest.mock('@/lib/reminders', () => ({
  ...jest.requireActual('@/lib/reminders'),
  requestReminderPermission: (...args: unknown[]) => mockRequestPermission(...args),
  syncDailyReminder: (...args: unknown[]) => mockSync(...args),
  showRemindersWhileOpen: (...args: unknown[]) => mockShowWhileOpen(...args),
  onReminderOpened: (...args: unknown[]) => mockOnOpened(...args),
}));

import { DailyReminder, ReminderSync } from '@/components/daily-reminder';
import i18n from '@/i18n';
import { toLocalDateKey } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';

const initialState = useAppStore.getState();
// The native switch reports its position as `value` on iPhone and `on` on Android.
const isOn = (control: { props: Record<string, unknown> }) => control.props.value ?? control.props.on;
const originalOS = Platform.OS;
const setOS = (os: string) => Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const question = { topicId: '01-1', moduleId: '01', lessonN: 1, text: 'Q?', options: ['a', 'b', 'c', 'd'], correct: 0, source: 'ai' as const };
const ON_TEXT = "On — you'll be reminded at 18:00 on days you haven't practised yet.";
const OFF_TEXT = "Get a reminder at 18:00 on days you haven't practised yet.";
const DENIED_TEXT = "Notifications are blocked for this app — allow them in your phone's settings, then try again.";

beforeEach(async () => {
  useAppStore.setState({ ...initialState, language: 'en' }, true);
  await i18n.changeLanguage('en');
  [mockRequestPermission, mockSync, mockShowWhileOpen, mockOnOpened, mockPush].forEach((fn) => fn.mockReset());
  mockSync.mockResolvedValue('scheduled');
  mockOnOpened.mockReturnValue(() => {});
  mockRequestPermission.mockResolvedValue('granted');
  setOS('android');
});
afterEach(() => {
  setOS(originalOS);
  jest.restoreAllMocks();
});

describe('DailyReminder (the switch on the Profile screen)', () => {
  const flip = (utils: Awaited<ReturnType<typeof render>>, value: boolean) =>
    fireEvent(utils.getByTestId('reminder-switch'), 'valueChange', value);

  it('shows the switch off, with what the reminder does, when reminders are off or not decided', async () => {
    const utils = await render(<DailyReminder />);
    expect(utils.getByText('Daily reminder')).toBeTruthy();
    expect(utils.getByText(OFF_TEXT)).toBeTruthy();
    expect(isOn(utils.getByTestId('reminder-switch'))).toBe(false);
  });

  it('shows the switch on, and says so in words, when reminders are on', async () => {
    useAppStore.setState({ reminderEnabled: true });
    const utils = await render(<DailyReminder />);
    expect(isOn(utils.getByTestId('reminder-switch'))).toBe(true);
    expect(utils.getByText(ON_TEXT)).toBeTruthy();
  });

  it('turns reminders on when the switch is flipped and the phone allows notifications', async () => {
    useAppStore.setState({ reminderEnabled: false });
    const utils = await render(<DailyReminder />);
    await flip(utils, true);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(true));
    expect(isOn(utils.getByTestId('reminder-switch'))).toBe(true);
    expect(utils.getByText(ON_TEXT)).toBeTruthy();
  });

  it('turns reminders off with one flip, without asking the phone anything', async () => {
    useAppStore.setState({ reminderEnabled: true });
    const utils = await render(<DailyReminder />);
    await flip(utils, false);
    expect(useAppStore.getState().reminderEnabled).toBe(false);
    expect(isOn(utils.getByTestId('reminder-switch'))).toBe(false);
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  it('stays off and explains what to do when the phone has notifications blocked, with a way into the phone’s settings', async () => {
    const openSettings = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    mockRequestPermission.mockResolvedValue('denied');
    useAppStore.setState({ reminderEnabled: false });
    const utils = await render(<DailyReminder />);
    await flip(utils, true);

    await waitFor(() => expect(utils.getByText(DENIED_TEXT)).toBeTruthy());
    expect(isOn(utils.getByTestId('reminder-switch'))).toBe(false);
    expect(useAppStore.getState().reminderEnabled).toBe(false);

    await fireEvent.press(utils.getByText('Open phone settings'));
    expect(openSettings).toHaveBeenCalled();
  });

  it('does not crash if the phone’s settings cannot be opened', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Linking, 'openSettings').mockRejectedValue(new Error('no settings'));
    mockRequestPermission.mockResolvedValue('denied');
    const utils = await render(<DailyReminder />);
    await flip(utils, true);
    await waitFor(() => expect(utils.getByText('Open phone settings')).toBeTruthy());
    await fireEvent.press(utils.getByText('Open phone settings'));
    expect(utils.getByText(DENIED_TEXT)).toBeTruthy();
  });

  it('says so and lets the student try again when the phone’s notification system fails', async () => {
    mockRequestPermission.mockResolvedValueOnce('failed');
    mockRequestPermission.mockResolvedValueOnce('granted');
    const utils = await render(<DailyReminder />);
    await flip(utils, true);
    await waitFor(() => expect(utils.getByText("Couldn't set the reminder — try again.")).toBeTruthy());
    expect(utils.queryByText('Open phone settings')).toBeNull();

    await flip(utils, true);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(true));
    expect(utils.queryByText("Couldn't set the reminder — try again.")).toBeNull();
  });

  it('clears an earlier "blocked" message once reminders are successfully turned on', async () => {
    mockRequestPermission.mockResolvedValueOnce('denied');
    mockRequestPermission.mockResolvedValueOnce('granted');
    const utils = await render(<DailyReminder />);
    await flip(utils, true);
    await waitFor(() => expect(utils.getByText(DENIED_TEXT)).toBeTruthy());
    await flip(utils, true);
    await waitFor(() => expect(utils.getByText(ON_TEXT)).toBeTruthy());
    expect(utils.queryByText(DENIED_TEXT)).toBeNull();
  });

  it('asks the phone once when the switch is flipped twice quickly', async () => {
    const { promise, resolve } = deferred<string>();
    mockRequestPermission.mockReturnValue(promise);
    const utils = await render(<DailyReminder />);
    const control = utils.getByTestId('reminder-switch');
    await act(async () => {
      fireEvent(control, 'valueChange', true);
      fireEvent(control, 'valueChange', true);
      resolve('granted');
      await promise;
    });
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('is not shown in a web browser, where reminders cannot work', async () => {
    setOS('web');
    const { toJSON } = await render(<DailyReminder />);
    expect(toJSON()).toBeNull();
  });

  it.each(['zu', 'nso', 'ts'] as const)('is written in %s when that language is chosen', async (lang) => {
    useAppStore.setState({ language: lang });
    await i18n.changeLanguage(lang);
    mockRequestPermission.mockResolvedValue('denied');
    const utils = await render(<DailyReminder />);
    expect(utils.getByText(i18n.t('reminderTitle', { lng: lang }) as string)).toBeTruthy();
    expect(utils.getByText(i18n.t('reminderOffBody', { lng: lang }) as string)).toBeTruthy();
    await flip(utils, true);
    await waitFor(() => expect(utils.getByText(i18n.t('reminderOpenSettings', { lng: lang }) as string)).toBeTruthy());
    expect(utils.queryByText('Daily reminder')).toBeNull();
    expect(utils.queryByText('Open phone settings')).toBeNull();
    await i18n.changeLanguage('en');
  });
});

describe('ReminderSync — asking for notifications when the student gets into the app', () => {
  it('asks the phone for permission by itself the first time a student is in the app', async () => {
    await render(<ReminderSync />);
    await waitFor(() => expect(mockRequestPermission).toHaveBeenCalledTimes(1));
    expect(mockRequestPermission).toHaveBeenCalledWith('Daily practice reminders');
  });

  it('turns reminders on when the student allows notifications', async () => {
    await render(<ReminderSync />);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(true));
    await waitFor(() => expect(mockSync.mock.calls.at(-1)?.[0]).toMatchObject({ enabled: true }));
  });

  it('records a refusal as "off", so the student is not asked again on every launch', async () => {
    mockRequestPermission.mockResolvedValue('denied');
    const first = await render(<ReminderSync />);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(false));
    await first.unmount();

    await render(<ReminderSync />);
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('waits until a language has been chosen: nothing is asked on the language picker', async () => {
    useAppStore.setState({ language: null });
    await render(<ReminderSync />);
    expect(mockRequestPermission).not.toHaveBeenCalled();

    await act(async () => {
      useAppStore.getState().setLanguage('zu');
    });
    await waitFor(() => expect(mockRequestPermission).toHaveBeenCalledTimes(1));
    await i18n.changeLanguage('en');
  });

  it('does not ask a student who has already decided, either way', async () => {
    useAppStore.setState({ reminderEnabled: false });
    const off = await render(<ReminderSync />);
    await off.unmount();
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  it('asks once even if the screen redraws while the phone’s prompt is still open', async () => {
    const { promise, resolve } = deferred<string>();
    mockRequestPermission.mockReturnValue(promise);
    const utils = await render(<ReminderSync />);
    await utils.rerender(<ReminderSync />);
    await act(async () => {
      useAppStore.getState().setLanguage('nso');
    });
    await act(async () => {
      resolve('granted');
      await promise;
    });
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    await i18n.changeLanguage('en');
  });

  it('leaves the question open when the phone’s notification system fails, so it is asked again next launch', async () => {
    mockRequestPermission.mockResolvedValue('failed');
    await render(<ReminderSync />);
    await waitFor(() => expect(mockRequestPermission).toHaveBeenCalled());
    expect(useAppStore.getState().reminderEnabled).toBeNull();
  });

  it('does not override a choice the student made in Profile while the prompt was open', async () => {
    const { promise, resolve } = deferred<string>();
    mockRequestPermission.mockReturnValue(promise);
    await render(<ReminderSync />);
    await act(async () => {
      useAppStore.getState().setReminderEnabled(false);
    });
    await act(async () => {
      resolve('granted');
      await promise;
    });
    expect(useAppStore.getState().reminderEnabled).toBe(false);
  });

  it('asks nothing in a web browser', async () => {
    mockRequestPermission.mockResolvedValue('unsupported');
    setOS('web');
    await render(<ReminderSync />);
    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(useAppStore.getState().reminderEnabled).toBeNull();
  });
});

describe('ReminderSync — keeping the phone’s scheduled reminders up to date', () => {
  it('schedules the reminders, worded in the student’s language, when reminders are on', async () => {
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await waitFor(() => expect(mockSync).toHaveBeenCalledTimes(1));
    expect(mockSync.mock.calls[0][0]).toEqual({
      enabled: true,
      doneToday: false,
      title: 'Your daily practice is ready',
      body: 'Three quick cybersecurity questions are waiting — keep your streak going.',
      channelName: 'Daily practice reminders',
    });
  });

  it('re-plans without today’s reminder as soon as today’s practice is finished', async () => {
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await waitFor(() => expect(mockSync).toHaveBeenCalledTimes(1));

    await act(async () => {
      useAppStore.getState().startDailyPractice([question]);
      useAppStore.getState().answerDailyQuestion(0, 0);
    });
    await waitFor(() => expect(mockSync.mock.calls.at(-1)?.[0]).toMatchObject({ doneToday: true }));
  });

  it('knows today is already done when the app is opened later the same day', async () => {
    useAppStore.setState({
      reminderEnabled: true,
      dailyPractice: { date: toLocalDateKey(new Date()), language: 'en', questions: [question], answers: { 0: 1 } },
    });
    await render(<ReminderSync />);
    await waitFor(() => expect(mockSync).toHaveBeenCalled());
    expect(mockSync.mock.calls[0][0]).toMatchObject({ doneToday: true });
  });

  it('re-words the reminders when the student changes language', async () => {
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await waitFor(() => expect(mockSync).toHaveBeenCalledTimes(1));
    await act(async () => {
      useAppStore.getState().setLanguage('zu');
    });
    await waitFor(() =>
      expect(mockSync.mock.calls.at(-1)?.[0]).toMatchObject({ title: i18n.t('reminderNotificationTitle', { lng: 'zu' }) })
    );
    await i18n.changeLanguage('en');
  });

  it('clears the reminders when the student turns them off', async () => {
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await act(async () => {
      useAppStore.getState().setReminderEnabled(false);
    });
    await waitFor(() => expect(mockSync.mock.calls.at(-1)?.[0]).toMatchObject({ enabled: false }));
  });

  it('switches the reminder off in the app if notifications were blocked in the phone’s settings, so the switch tells the truth', async () => {
    mockSync.mockResolvedValue('not-allowed');
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await waitFor(() => expect(useAppStore.getState().reminderEnabled).toBe(false));
  });

  it('leaves the student’s choice alone when scheduling merely fails', async () => {
    mockSync.mockResolvedValue('failed');
    useAppStore.setState({ reminderEnabled: true });
    await render(<ReminderSync />);
    await waitFor(() => expect(mockSync).toHaveBeenCalled());
    expect(useAppStore.getState().reminderEnabled).toBe(true);
  });

  it('lets reminders show while the app is open, and opens Practice when one is tapped', async () => {
    useAppStore.setState({ reminderEnabled: false });
    const { unmount } = await render(<ReminderSync />);
    expect(mockShowWhileOpen).toHaveBeenCalled();
    const onOpened = mockOnOpened.mock.calls[0][0] as () => void;
    onOpened();
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/practice');

    const stop = jest.fn();
    mockOnOpened.mockReturnValue(stop);
    const second = await render(<ReminderSync />);
    await second.unmount();
    expect(stop).toHaveBeenCalled();
    await unmount();
  });
});
