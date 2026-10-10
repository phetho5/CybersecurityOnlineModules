import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { toLocalDateKey } from '@/lib/streak';

/** The hour of the day (on the phone's own clock) the reminder arrives. */
export const REMINDER_HOUR = 18;
/**
 * Reminders are planned this many days ahead and re-planned every time the app is opened. They are
 * separate one-off notifications rather than one repeating one so that today's can be left out
 * once today's practice is done.
 */
export const REMINDER_DAYS_AHEAD = 14;

const CHANNEL_ID = 'daily-practice';
const ID_PREFIX = 'daily-practice-';
// iOS reports a "provisional" (quiet) permission separately from `granted`.
const IOS_PROVISIONAL = 3;

export type ReminderPermission = 'granted' | 'denied' | 'unsupported' | 'failed';
export type ReminderSyncResult = 'scheduled' | 'cleared' | 'not-allowed' | 'unsupported' | 'failed';

const supported = () => Platform.OS === 'ios' || Platform.OS === 'android';

/** When the coming reminders should arrive: today's is left out if it has passed or isn't needed. */
export function planReminderDates(now: Date, doneToday: boolean): Date[] {
  const dates: Date[] = [];
  for (let offset = 0; dates.length < REMINDER_DAYS_AHEAD; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, REMINDER_HOUR);
    if (date.getTime() <= now.getTime() || (offset === 0 && doneToday)) continue;
    dates.push(date);
  }
  return dates;
}

async function isAllowed(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted || settings.ios?.status === IOS_PROVISIONAL;
}

/** Asks the student to allow notifications, if they haven't already. Never throws. */
export async function requestReminderPermission(channelName: string): Promise<ReminderPermission> {
  if (!supported()) return 'unsupported';
  try {
    // Android 13+ only shows its permission prompt once the app has a notification channel.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: channelName,
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    if (await isAllowed()) return 'granted';
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted || asked.ios?.status === IOS_PROVISIONAL ? 'granted' : 'denied';
  } catch (err) {
    console.error('requestReminderPermission failed', err);
    return 'failed';
  }
}

type SyncOptions = {
  /** The student's own choice; anything but true means no reminders. */
  enabled: boolean;
  doneToday: boolean;
  title: string;
  body: string;
  channelName: string;
  now?: Date;
};

let queue: Promise<unknown> = Promise.resolve();

async function sync({ enabled, doneToday, title, body, channelName, now = new Date() }: SyncOptions): Promise<ReminderSyncResult> {
  if (!supported()) return 'unsupported';
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const { identifier } of scheduled) {
      if (identifier.startsWith(ID_PREFIX)) await Notifications.cancelScheduledNotificationAsync(identifier);
    }
    if (!enabled) return 'cleared';
    if (!(await isAllowed())) return 'not-allowed';

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: channelName,
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    for (const date of planReminderDates(now, doneToday)) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${ID_PREFIX}${toLocalDateKey(date)}`,
        content: { title, body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
      });
    }
    return 'scheduled';
  } catch (err) {
    console.error('syncDailyReminder failed', err);
    return 'failed';
  }
}

/**
 * Makes the phone's scheduled reminders match the student's choice and today's progress: clears
 * the ones this app set before, then (if reminders are on and allowed) schedules the coming days.
 * Calls run one after another. Never throws.
 */
export function syncDailyReminder(options: SyncOptions): Promise<ReminderSyncResult> {
  const run = queue.then(() => sync(options));
  queue = run;
  return run;
}

/** Without this a reminder that arrives while the app is open is silently dropped. */
export function showRemindersWhileOpen(): void {
  if (!supported()) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Calls `onOpened` when the student taps a daily reminder. Returns a function that stops listening. */
export function onReminderOpened(onOpened: () => void): () => void {
  if (!supported()) return () => {};
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const isTap = response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER;
    if (isTap && response.notification.request.identifier.startsWith(ID_PREFIX)) onOpened();
  });
  return () => subscription.remove();
}
