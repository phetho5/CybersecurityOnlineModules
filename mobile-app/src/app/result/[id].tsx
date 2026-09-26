import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { getModule } from '@/data/modules';
import { PASS_MARK, QUESTIONS } from '@/data/quiz';
import { useAppStore } from '@/store/useAppStore';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const answers = useAppStore((s) => s.quizAnswers);
  const completeModule = useAppStore((s) => s.completeModule);
  const mod = getModule(id ?? '');

  const correctCount = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const scorePct = Math.round((correctCount / QUESTIONS.length) * 100);
  const passed = scorePct >= PASS_MARK;

  const breakdown = QUESTIONS.map((q, i) => ({
    area: q.area,
    correct: answers[i] === q.correct,
  }));

  useEffect(() => {
    if (passed && mod) {
      completeModule(mod.id, mod.id === '02' ? 'scam-spotter' : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed]);

  if (!mod) return null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>
            {t('assessment')} · Module {mod.id}
          </Text>
          <Text style={styles.heroScore}>{scorePct}%</Text>
          <Text style={styles.heroHeadline}>{passed ? t('passedHeadline') : t('failedHeadline')}</Text>
          <Text style={styles.heroLine}>
            {correctCount} of {QUESTIONS.length} correct · {t('passMark')}
          </Text>
          <Text style={styles.heroSub}>
            {passed
              ? 'You can identify fake bank alerts on WhatsApp and know where to report them. Review anything marked below before the next module.'
              : 'You need 70% to earn the badge. Redo the lessons for the topics marked in red, then retake the assessment.'}
          </Text>
        </View>

        {passed && (
          <View style={styles.badgeRow}>
            <View style={styles.badgeIcon}>
              <Icon name="ribbon" size={28} color={Colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeKicker}>{t('badgeEarned')}</Text>
              <Text style={styles.badgeName}>Scam Spotter — WhatsApp</Text>
              <Text style={styles.badgeMeta}>Issued 26 Sep 2026 · verifiable</Text>
            </View>
          </View>
        )}

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Marks by topic</Text>
          {breakdown.map((row, i) => (
            <View key={i} style={styles.breakdownRow}>
              <Text style={styles.breakdownArea}>{row.area}</Text>
              <Text style={[styles.breakdownMark, { color: row.correct ? Colors.text : Colors.accent700 }]}>
                {row.correct ? 1 : 0} / 1
              </Text>
            </View>
          ))}

          <View style={styles.actions}>
            {passed && (
              <PrimaryButton label={t('viewCertificate')} onPress={() => router.replace('/(tabs)/profile')} />
            )}
            <PrimaryButton
              label={passed ? t('backToModules') : t('retakeAssessment')}
              variant="secondary"
              onPress={() => (passed ? router.replace('/(tabs)/home') : router.replace(`/quiz/${mod.id}`))}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  hero: { backgroundColor: Colors.accent, padding: Spacing.lg, gap: 6 },
  heroKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accentContrast,
  },
  heroScore: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 64, lineHeight: 66, color: Colors.accentContrast, marginTop: Spacing.sm },
  heroHeadline: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 20, color: Colors.accentContrast },
  heroLine: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.accentContrast,
    opacity: 0.9,
  },
  heroSub: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.accentContrast, opacity: 0.95, marginTop: Spacing.xs },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  badgeName: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 19, color: Colors.text, marginTop: 4 },
  badgeMeta: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  breakdownSection: { padding: Spacing.lg, gap: Spacing.sm },
  breakdownTitle: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  breakdownArea: { fontFamily: Fonts.body, fontSize: 13, color: Colors.text },
  breakdownMark: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700' },
  actions: { gap: Spacing.sm, marginTop: Spacing.md },
});
