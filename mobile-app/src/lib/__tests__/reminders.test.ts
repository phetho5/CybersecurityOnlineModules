import { Platform } from 'react-native';

const mockNotifications = {
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
};

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: (...args: unknown[]) => mockNotifications.getPermissionsAsync(...args),
  requestPermissionsAsync: (...args: unknown[]) => mockNotifications.requestPermissionsAsync(...args),
  setNotificationChannelAsync: (...args: unknown[]) => mockNotifications.setNotificationChannelAsync(...args),
  scheduleNotificationAsync: (...args: unknown[]) => mockNotifications.scheduleNotificationAsync(...args),
  cancelScheduledNotificationAsync: (...args: unknown[]) => mockNotifications.cancelScheduledNotificationAsync(...args),
  getAllScheduledNotificationsAsync: (...args: unknown[]) => mockNotifications.getAllScheduledNotificationsAsync(...args),
  setNotificationHandler: (...args: unknown[]) => mockNotifications.setNotificationHandler(...args),
  addNotificationResponseReceivedListener: (...args: unknown[]) =>
    mockNotifications.addNotificationResponseReceivedListener(...args),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
  DEFAULT_ACTION_IDENTIFIER: 'default-action',
}));

import {
  onReminderOpened,
  planReminderDates,
  REMINDER_DAYS_AHEAD,
  REMINDER_HOUR,
  requestReminderPermission,
  showRemindersWhileOpen,
  syncDailyReminder,
} from '@/lib/reminders';

const at = (d: number, h = 9, m = 0) => new Date(2026, 9, d, h, m);
const TEXT = { title: 'Your daily practice is ready', body: 'Three questions are waiting.', channelName: 'Daily practice reminders' };
const originalOS = Platform.OS;
const setOS = (os: string) => Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });

beforeEach(() => {
  Object.values(mockNotifications).forEach((fn) => fn.mockReset());
  mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: true });
  mockNotifications.requestPermissionsAsync.mockResolvedValue({ granted: true });
  mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
  mockNotifications.scheduleNotificationAsync.mockResolvedValue('id');
  mockNotifications.cancelScheduledNotificationAsync.mockResolvedValue(undefined);
  mockNotifications.setNotificationChannelAsync.mockResolvedValue(null);
  jest.spyOn(console, 'error').mockImplementation(() => {});
  setOS('android');
});
afterEach(() => {
  jest.restoreAllMocks();
  setOS(originalOS);
});

describe('planReminderDates', () => {
  it('plans one reminder a day at the reminder hour, starting today when that hour is still ahead', () => {
    const dates = planReminderDates(at(5, 9), false);
    expect(dates).toHaveLength(REMINDER_DAYS_AHEAD);
    expect(dates[0]).toEqual(at(5, REMINDER_HOUR));
    expect(dates[1]).toEqual(at(6, REMINDER_HOUR));
    expect(dates.every((d) => d.getHours() === REMINDER_HOUR && d.getMinutes() === 0)).toBe(true);
  });

  it('skips today once the student has already practised, and starts tomorrow', () => {
    const dates = planReminderDates(at(5, 9), true);
    expect(dates[0]).toEqual(at(6, REMINDER_HOUR));
    expect(dates).toHaveLength(REMINDER_DAYS_AHEAD);
  });

  it('skips today when the reminder hour has already passed, or is this very minute', () => {
    expect(planReminderDates(at(5, REMINDER_HOUR, 0), false)[0]).toEqual(at(6, REMINDER_HOUR));
    expect(planReminderDates(at(5, 23), false)[0]).toEqual(at(6, REMINDER_HOUR));
  });

  it('carries on correctly across the end of a month', () => {
    const dates = planReminderDates(new Date(2026, 9, 30, 20), false);
    expect(dates[0]).toEqual(new Date(2026, 9, 31, REMINDER_HOUR));
    expect(dates[1]).toEqual(new Date(2026, 10, 1, REMINDER_HOUR));
  });

  it('never plans a reminder in the past', () => {
    const now = at(5, 19);
    expect(planReminderDates(now, false).every((d) => d.getTime() > now.getTime())).toBe(true);
  });
});

describe('requestReminderPermission', () => {
  it('creates the Android channel before asking, because Android will not show the prompt without one', async () => {
    const order: string[] = [];
    mockNotifications.setNotificationChannelAsync.mockImplementation(async () => void order.push('channel'));
    mockNotifications.requestPermissionsAsync.mockImplementation(async () => {
      order.push('ask');
      return { granted: true };
    });
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: false });

    expect(await requestReminderPermission(TEXT.channelName)).toBe('granted');
    expect(order).toEqual(['channel', 'ask']);
    expect(mockNotifications.setNotificationChannelAsync.mock.calls[0][1]).toMatchObject({ name: TEXT.channelName });
  });

  it('does not ask again when permission is already given', async () => {
    expect(await requestReminderPermission(TEXT.channelName)).toBe('granted');
    expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('reports a refusal', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: false });
    mockNotifications.requestPermissionsAsync.mockResolvedValue({ granted: false });
    expect(await requestReminderPermission(TEXT.channelName)).toBe('denied');
  });

  it('counts an iPhone’s provisional permission as allowed', async () => {
    setOS('ios');
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: false, ios: { status: 3 } });
    expect(await requestReminderPermission(TEXT.channelName)).toBe('granted');
    expect(mockNotifications.setNotificationChannelAsync).not.toHaveBeenCalled();
  });

  it('says reminders are unsupported in a web browser, without touching the notification system', async () => {
    setOS('web');
    expect(await requestReminderPermission(TEXT.channelName)).toBe('unsupported');
    expect(mockNotifications.getPermissionsAsync).not.toHaveBeenCalled();
  });

  it('reports a failure instead of throwing when the phone’s notification system errors', async () => {
    mockNotifications.getPermissionsAsync.mockRejectedValue(new Error('boom'));
    expect(await requestReminderPermission(TEXT.channelName)).toBe('failed');
  });
});

describe('syncDailyReminder', () => {
  const sync = (overrides: Partial<Parameters<typeof syncDailyReminder>[0]> = {}) =>
    syncDailyReminder({ enabled: true, doneToday: false, now: at(5, 9), ...TEXT, ...overrides });
  const scheduledDates = () =>
    mockNotifications.scheduleNotificationAsync.mock.calls.map((call) => call[0].trigger.date as Date);

  it('schedules a reminder for each of the coming days, with the given wording', async () => {
    expect(await sync()).toBe('scheduled');
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledTimes(REMINDER_DAYS_AHEAD);
    const first = mockNotifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(first.content).toMatchObject({ title: TEXT.title, body: TEXT.body });
    expect(first.trigger).toMatchObject({ type: 'date', date: at(5, REMINDER_HOUR) });
  });

  it('does not remind the student today once today’s practice is done', async () => {
    await sync({ doneToday: true });
    expect(scheduledDates()[0]).toEqual(at(6, REMINDER_HOUR));
    expect(scheduledDates().some((d) => d.getDate() === 5)).toBe(false);
  });

  it('replaces the reminders it scheduled before, so they never pile up or keep old wording', async () => {
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
      { identifier: 'daily-practice-2026-10-05' },
      { identifier: 'daily-practice-2026-10-06' },
      { identifier: 'something-else' },
    ]);
    await sync();
    const cancelled = mockNotifications.cancelScheduledNotificationAsync.mock.calls.map((c) => c[0]);
    expect(cancelled).toEqual(['daily-practice-2026-10-05', 'daily-practice-2026-10-06']);
  });

  it('gives each day’s reminder its own identifier', async () => {
    await sync();
    const ids = mockNotifications.scheduleNotificationAsync.mock.calls.map((c) => c[0].identifier);
    expect(new Set(ids).size).toBe(REMINDER_DAYS_AHEAD);
    expect(ids[0]).toBe('daily-practice-2026-10-05');
  });

  it('cancels its reminders and schedules nothing when the student has turned reminders off, or not decided yet', async () => {
    mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([{ identifier: 'daily-practice-2026-10-05' }]);
    expect(await sync({ enabled: false })).toBe('cleared');
    expect(mockNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('daily-practice-2026-10-05');
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules nothing, and says so, when notifications have since been blocked in the phone’s settings', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ granted: false });
    expect(await sync()).toBe('not-allowed');
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('does nothing in a web browser', async () => {
    setOS('web');
    expect(await sync()).toBe('unsupported');
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('reports a failure instead of throwing when scheduling errors', async () => {
    mockNotifications.scheduleNotificationAsync.mockRejectedValue(new Error('boom'));
    expect(await sync()).toBe('failed');
  });

  it('runs one sync at a time, so two quick changes cannot leave doubled reminders', async () => {
    await Promise.all([sync(), sync({ doneToday: true })]);
    const ids = mockNotifications.scheduleNotificationAsync.mock.calls.map((c) => c[0].identifier);
    // The second run started only after the first finished, so its cancel saw the first run's work.
    expect(mockNotifications.getAllScheduledNotificationsAsync).toHaveBeenCalledTimes(2);
    expect(ids.slice(0, REMINDER_DAYS_AHEAD)[0]).toBe('daily-practice-2026-10-05');
    expect(ids.slice(REMINDER_DAYS_AHEAD)[0]).toBe('daily-practice-2026-10-06');
  });
});

describe('showRemindersWhileOpen / onReminderOpened', () => {
  it('lets a reminder show as a banner even while the app is open', async () => {
    showRemindersWhileOpen();
    const handler = mockNotifications.setNotificationHandler.mock.calls[0][0];
    expect(await handler.handleNotification()).toMatchObject({ shouldShowBanner: true, shouldShowList: true });
  });

  it('calls back when the student taps a reminder, and stops when unsubscribed', () => {
    const remove = jest.fn();
    mockNotifications.addNotificationResponseReceivedListener.mockReturnValue({ remove });
    const opened = jest.fn();
    const unsubscribe = onReminderOpened(opened);

    const listener = mockNotifications.addNotificationResponseReceivedListener.mock.calls[0][0];
    listener({ actionIdentifier: 'default-action', notification: { request: { identifier: 'daily-practice-2026-10-05' } } });
    expect(opened).toHaveBeenCalledTimes(1);

    // Some other notification, or an action other than a plain tap, is not ours to handle.
    listener({ actionIdentifier: 'default-action', notification: { request: { identifier: 'other' } } });
    listener({ actionIdentifier: 'dismiss', notification: { request: { identifier: 'daily-practice-2026-10-05' } } });
    expect(opened).toHaveBeenCalledTimes(1);

    unsubscribe();
    expect(remove).toHaveBeenCalled();
  });

  it('does nothing in a web browser', () => {
    setOS('web');
    showRemindersWhileOpen();
    const unsubscribe = onReminderOpened(jest.fn());
    expect(mockNotifications.setNotificationHandler).not.toHaveBeenCalled();
    expect(mockNotifications.addNotificationResponseReceivedListener).not.toHaveBeenCalled();
    expect(() => unsubscribe()).not.toThrow();
  });
});
