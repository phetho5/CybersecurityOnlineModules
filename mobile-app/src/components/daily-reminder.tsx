import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { practiceStatus } from '@/lib/daily-practice';
import { onReminderOpened, requestReminderPermission, showRemindersWhileOpen, syncDailyReminder } from '@/lib/reminders';
import { useToday } from '@/lib/use-today';
import { useAppStore } from '@/store/useAppStore';

/** The switch on Profile that turns the daily practice reminder on or off. */
export function DailyReminder() {
  const { t } = useTranslation();
  const enabled = useAppStore((s) => s.reminderEnabled) === true;
  const setEnabled = useAppStore((s) => s.setReminderEnabled);
  const [problem, setProblem] = useState<'denied' | 'failed' | null>(null);
  const asking = useRef(false);

  // A browser cannot deliver a reminder while the page is closed, so the choice is not offered there.
  if (Platform.OS === 'web') return null;

  async function turnOn() {
    if (asking.current) return;
    asking.current = true;
    const permission = await requestReminderPermission(t('reminderChannelName'));
    asking.current = false;

    if (permission === 'granted') {
      setProblem(null);
      setEnabled(true);
    } else {
      setProblem(permission === 'denied' ? 'denied' : 'failed');
    }
  }

  function turnOff() {
    setProblem(null);
    setEnabled(false);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={styles.title}>{t('reminderTitle')}</Text>
          <Text style={styles.body}>{enabled ? t('reminderOnBody') : t('reminderOffBody')}</Text>
        </View>
        <Switch
          testID="reminder-switch"
          accessibilityLabel={t('reminderTitle')}
          value={enabled}
          onValueChange={(next) => (next ? void turnOn() : turnOff())}
          trackColor={{ false: Colors.neutral300, true: Colors.accent }}
        />
      </View>
      {problem && !enabled && (
        <View style={styles.problem}>
          <Text style={styles.problemText}>{t(problem === 'denied' ? 'reminderDenied' : 'reminderFailed')}</Text>
          {/* Once refused, the phone will not show its prompt again: the only way on is its settings. */}
          {problem === 'denied' && (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              style={styles.settingsLink}
              onPress={() => {
                Linking.openSettings().catch((err) => console.error('Could not open the phone settings', err));
              }}>
              <Text style={styles.settingsText}>{t('reminderOpenSettings')}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Mounted once at the root. Asks for notification permission the first time the student is in the
 * app, then keeps the phone's scheduled reminders in step with their choice, today's progress, the
 * language and the day. Opens Practice when a reminder is tapped.
 */
export function ReminderSync() {
  const { t } = useTranslation();
  const enabled = useAppStore((s) => s.reminderEnabled);
  const language = useAppStore((s) => s.language);
  const setEnabled = useAppStore((s) => s.setReminderEnabled);
  const today = useToday();
  const doneToday = useAppStore((s) => practiceStatus(s.dailyPractice, today).state === 'done');
  const asked = useRef(false);

  useEffect(() => {
    showRemindersWhileOpen();
    return onReminderOpened(() => router.push('/(tabs)/practice'));
  }, []);

  // A student who has never been asked gets the phone's own prompt as soon as they are past the
  // language picker. Their answer is saved, so they are asked once; Profile has the switch after that.
  useEffect(() => {
    if (enabled !== null || language === null || asked.current || Platform.OS === 'web') return;
    asked.current = true;
    void requestReminderPermission(t('reminderChannelName')).then((permission) => {
      // They may have used the switch in Profile while the prompt was open: that choice stands.
      if (useAppStore.getState().reminderEnabled !== null) return;
      if (permission === 'granted') setEnabled(true);
      else if (permission === 'denied') setEnabled(false);
      // Anything else was a fault, not an answer: leave it open so the next launch asks again.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, language]);

  useEffect(() => {
    // Never answered: nothing has been scheduled, so there is nothing to keep in step.
    if (enabled === null) return;
    void syncDailyReminder({
      enabled,
      doneToday,
      title: t('reminderNotificationTitle'),
      body: t('reminderNotificationBody'),
      channelName: t('reminderChannelName'),
    }).then((result) => {
      // Notifications were blocked in the phone's settings after the student turned reminders on.
      if (result === 'not-allowed') setEnabled(false);
    });
    // `t` changes with the language, which is already listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, doneToday, language, today]);

  return null;
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 44 },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 14, color: Colors.text },
  body: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18, color: Colors.neutral800 },
  problem: { gap: Spacing.xs },
  problemText: { fontFamily: Fonts.body, fontSize: 12, lineHeight: 18, color: Colors.accent700 },
  settingsLink: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  settingsText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent700,
    textDecorationLine: 'underline',
  },
});
