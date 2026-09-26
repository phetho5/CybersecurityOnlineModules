import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { DRILLS } from '@/data/drills';
import { useAppStore } from '@/store/useAppStore';

export default function PracticeScreen() {
  const { t } = useTranslation();
  const drillPicks = useAppStore((s) => s.drillPicks);
  const answerDrill = useAppStore((s) => s.answerDrill);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('practice')}</Text>
          <Text style={styles.subtitle}>
            Daily drill: three real messages reported by UP students. Call each one.
          </Text>
          <View style={styles.rule} />
        </View>

        {DRILLS.map((drill, i) => {
          const pick = drillPicks[i];
          const answered = pick !== undefined;
          const right = answered && (pick === 'scam') === drill.isScam;
          return (
            <View key={i} style={styles.drillCard}>
              <View style={styles.drillHeaderRow}>
                <Text style={styles.channel}>{drill.channel}</Text>
                <Text style={styles.from}>{drill.from}</Text>
              </View>
              <Text style={styles.body}>{drill.body}</Text>
              <View style={styles.choiceRow}>
                <DrillChoice
                  label={t('scam')}
                  active={pick === 'scam'}
                  correct={answered && pick === 'scam' && right}
                  wrong={answered && pick === 'scam' && !right}
                  onPress={() => answerDrill(i, 'scam')}
                />
                <DrillChoice
                  label={t('legit')}
                  active={pick === 'safe'}
                  correct={answered && pick === 'safe' && right}
                  wrong={answered && pick === 'safe' && !right}
                  onPress={() => answerDrill(i, 'safe')}
                />
              </View>
              {answered && (
                <Text style={styles.explain}>
                  <Text style={styles.explainBold}>{right ? t('correct') : t('notQuite')}. </Text>
                  {drill.explain}
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.aiSection}>
          <Text style={styles.aiKicker}>{t('aiTutor')}</Text>
          <View style={styles.inputRow}>
            <Icon name="chatbox-ellipses-outline" size={18} color={Colors.textMuted} />
            <TextInput
              placeholder="Paste a message to check…"
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
              multiline
            />
          </View>
          <PrimaryButton label={t('checkMessage')} variant="secondary" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DrillChoice({
  label,
  active,
  correct,
  wrong,
  onPress,
}: {
  label: string;
  active: boolean;
  correct: boolean;
  wrong: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceButton,
        correct && { backgroundColor: Colors.accent, borderColor: Colors.accent },
        wrong && { backgroundColor: Colors.neutral300, borderColor: Colors.neutral300 },
      ]}>
      <Text style={[styles.choiceText, (correct || wrong) && { color: correct ? Colors.accentContrast : Colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.textMuted, marginTop: Spacing.sm },
  rule: { height: 2, backgroundColor: Colors.text, marginTop: Spacing.md },
  drillCard: { borderBottomWidth: 2, borderBottomColor: Colors.divider, padding: Spacing.lg, gap: Spacing.sm },
  drillHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  channel: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  from: { fontFamily: Fonts.body, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: Colors.neutral600 },
  body: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.text },
  choiceRow: { flexDirection: 'row', gap: Spacing.sm },
  choiceButton: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.text },
  explain: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.text,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral300,
  },
  explainBold: { fontFamily: Fonts.bodyMedium, fontWeight: '700' },
  aiSection: { padding: Spacing.lg, gap: Spacing.sm },
  aiKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    minHeight: 44,
  },
  input: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.text, minHeight: 28 },
});
