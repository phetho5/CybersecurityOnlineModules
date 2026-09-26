import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { CLUES, SCENARIO, getScenarioText } from '@/data/scenario';
import type { LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const scenarioText = getScenarioText(language);
  const cluesPicked = useAppStore((s) => s.cluesPicked);
  const cluesChecked = useAppStore((s) => s.cluesChecked);
  const toggleClue = useAppStore((s) => s.toggleClue);
  const checkClues = useAppStore((s) => s.checkClues);
  const resetLesson = useAppStore((s) => s.resetLesson);

  useEffect(() => {
    resetLesson();
  }, [resetLesson]);

  const foundCount = CLUES.filter((c) => c.isRedFlag && cluesPicked.includes(c.id)).length;
  const totalFlags = CLUES.filter((c) => c.isRedFlag).length;

  function handlePrimary() {
    if (cluesChecked) {
      router.push(`/quiz/${id}`);
    } else {
      checkClues();
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title="Lesson 2 / 5" onBack={() => router.replace(`/module/${id}`)} />
      <ProgressBar pct={40} height={4} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.kicker}>{t('scenario')}</Text>
          <Text style={styles.title}>{scenarioText.title}</Text>
          <Text style={styles.body}>{scenarioText.intro}</Text>
        </View>

        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{SCENARIO.sender.initials}</Text>
            </View>
            <View>
              <Text style={styles.senderName}>{SCENARIO.sender.name}</Text>
              <Text style={styles.senderDetail}>{SCENARIO.sender.detail}</Text>
            </View>
          </View>
          <View style={styles.messageBody}>
            {SCENARIO.message.map((line, i) => (
              <Text key={i} style={styles.messageLine}>
                {line}
              </Text>
            ))}
            <Text style={styles.timestamp}>{SCENARIO.sender.timestamp} ✓✓</Text>
          </View>
        </View>

        <View style={styles.cluesHeader}>
          <Text style={styles.cluesHeaderText}>{t('tapRedFlags')}</Text>
        </View>
        <View>
          {CLUES.map((clue) => {
            const picked = cluesPicked.includes(clue.id);
            let state: 'idle' | 'picked' | 'hit' | 'missed' | 'wrongPick' = 'idle';
            if (cluesChecked) {
              if (clue.isRedFlag && picked) state = 'hit';
              else if (clue.isRedFlag && !picked) state = 'missed';
              else if (!clue.isRedFlag && picked) state = 'wrongPick';
            } else if (picked) {
              state = 'picked';
            }
            return (
              <Pressable
                key={clue.id}
                disabled={cluesChecked}
                onPress={() => toggleClue(clue.id)}
                style={[
                  styles.clueRow,
                  state === 'picked' && { backgroundColor: Colors.text },
                  state === 'hit' && { backgroundColor: Colors.accent },
                  state === 'missed' && { backgroundColor: Colors.accent200 },
                  state === 'wrongPick' && { backgroundColor: Colors.neutral300 },
                ]}>
                <View
                  style={[
                    styles.clueMark,
                    { borderColor: state === 'idle' ? Colors.text : 'transparent' },
                  ]}>
                  {state === 'hit' && <Icon name="checkmark" size={13} color={Colors.accentContrast} />}
                  {state === 'picked' && <Icon name="checkmark" size={13} color={Colors.background} />}
                  {state === 'missed' && <Icon name="alert" size={13} color={Colors.accent900} />}
                  {state === 'wrongPick' && <Icon name="close" size={13} color={Colors.neutral900} />}
                </View>
                <Text
                  style={[
                    styles.clueText,
                    (state === 'picked' || state === 'hit') && { color: Colors.accentContrast },
                  ]}>
                  {clue.text}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          {cluesChecked && (
            <View style={styles.feedback}>
              <Text style={styles.feedbackScore}>
                {foundCount} of {totalFlags} red flags found
              </Text>
              <Text style={styles.feedbackBody}>{SCENARIO.explanation}</Text>
            </View>
          )}
          <PrimaryButton
            label={cluesChecked ? t('nextLesson') : t('checkMyAnswer')}
            onPress={handlePrimary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  intro: { padding: Spacing.lg, gap: Spacing.sm },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, lineHeight: 30, color: Colors.text },
  body: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 21, color: Colors.text },
  messageCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 2, borderColor: Colors.text, backgroundColor: Colors.neutral100 },
  messageHeader: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    padding: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.text,
  },
  avatar: { width: 34, height: 34, backgroundColor: Colors.neutral300, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 12, color: Colors.text },
  senderName: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 14, color: Colors.text },
  senderDetail: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMuted },
  messageBody: { padding: Spacing.md, gap: Spacing.xs },
  messageLine: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text },
  timestamp: { fontFamily: Fonts.body, fontSize: 11, color: Colors.neutral600, marginTop: 6 },
  cluesHeader: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  cluesHeaderText: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text,
    borderTopWidth: 2,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.sm,
  },
  clueRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  clueMark: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  clueText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text },
  footer: { padding: Spacing.lg, gap: Spacing.md },
  feedback: { borderWidth: 2, borderColor: Colors.text, padding: Spacing.md, borderRadius: Radii.sm },
  feedbackScore: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  feedbackBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.text, marginTop: Spacing.sm },
});
