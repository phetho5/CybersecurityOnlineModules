import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { BADGES, MODULE_BADGE_ID } from '@/data/badges';
import { getModule } from '@/data/modules';
import { PASS_MARK } from '@/data/quiz';
import type { LanguageCode } from '@/i18n';
import { scoreQuiz } from '@/lib/scoring';
import { recordQuizAttempt } from '@/lib/sync';
import { getModuleFinalAssessment } from '@/lib/topic-source';
import { useAppStore } from '@/store/useAppStore';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const answers = useAppStore((s) => s.quizAnswers);
  const completeModule = useAppStore((s) => s.completeModule);
  const userId = useAppStore((s) => s.userId);
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const mod = getModule(id ?? '');
  const badgeId = mod ? MODULE_BADGE_ID[mod.id] : undefined;

  const questions = getModuleFinalAssessment(mod?.id ?? '', language) ?? [];
  const { correctCount, scorePct, passed, breakdown } = scoreQuiz(questions, answers, PASS_MARK);
  const badge = BADGES.find((b) => b.id === badgeId);

  useEffect(() => {
    if (passed && mod) {
      completeModule(mod.id, badgeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed]);

  useEffect(() => {
    if (mod) {
      void recordQuizAttempt(userId, mod.id, scorePct, passed);
    }
    // Every mount is a fresh attempt (assessment reset happens on entering the quiz screen).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mod) return null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>
            {t('assessment')} · {t('moduleLabel')} {mod.id}
          </Text>
          <Text style={styles.heroScore}>{scorePct}%</Text>
          <Text style={styles.heroHeadline}>{passed ? t('passedHeadline') : t('failedHeadline')}</Text>
          <Text style={styles.heroLine}>
            {t('correctOfTotal', { correct: correctCount, total: questions.length })} · {t('passMark')}
          </Text>
          <Text style={styles.heroSub}>
            {passed
              ? t('passedBody', { module: t(`moduleTitle_${mod.id}`, { defaultValue: mod.title }) })
              : t('failedBody')}
          </Text>
        </View>

        {passed && badge && (
          <View style={styles.badgeRow}>
            <View style={styles.badgeIcon}>
              <Icon name="ribbon" size={28} color={Colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeKicker}>{t('badgeEarned')}</Text>
              <Text style={styles.badgeName}>{t(`badgeName_${badge.id}`, { defaultValue: badge.name })}</Text>
              <Text style={styles.badgeMeta}>{t('badgeVerifiable')}</Text>
            </View>
          </View>
        )}

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>{t('marksByTopic')}</Text>
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
              onPress={() =>
                passed ? router.replace('/(tabs)/home') : router.replace(`/quiz/${mod.id}/${mod.lessonCount}`)
              }
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
