import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ModuleCard } from '@/components/module-card';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { MODULES } from '@/data/modules';
import { getScenarioText } from '@/data/scenario';
import { LANGUAGE_META, type LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const streak = useAppStore((s) => s.streak);
  const earnedBadgeIds = useAppStore((s) => s.earnedBadgeIds);
  const moduleProgress = useAppStore((s) => s.moduleProgress);

  const overall = Math.round(
    MODULES.reduce((sum, m) => sum + (moduleProgress[m.id] ?? 0), 0) / MODULES.length
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>{t('greeting')}</Text>
            <Text style={styles.name}>Vhulenda</Text>
          </View>
          <Pressable style={styles.langPill} onPress={() => router.push('/language')}>
            <Text style={styles.langPillText}>{LANGUAGE_META[language].code}</Text>
          </Pressable>
        </View>
        <View style={styles.rule} />

        <View style={styles.statsRow}>
          <Stat value={String(streak)} label={t('dayStreak')} />
          <Stat value={String(earnedBadgeIds.length)} label={t('badges')} />
          <Stat value={`${overall}%`} label={t('complete')} accent />
        </View>

        <View style={styles.continueCard}>
          <Text style={styles.continueKicker}>{t('continueLearning')}</Text>
          <Text style={styles.continueTitle}>{getScenarioText(language).lesson}</Text>
          <Text style={styles.continueMeta}>Module 02 · Lesson 2 of 5 · 6 min</Text>
          <Pressable style={styles.continueButton} onPress={() => router.push('/lesson/02')}>
            <Text style={styles.continueButtonText}>{t('continue')}</Text>
            <Icon name="arrow-forward" size={18} color={Colors.accent700} />
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>{t('modules')}</Text>
          <Text style={styles.sectionCount}>{MODULES.length}</Text>
        </View>
        <View style={styles.moduleList}>
          {MODULES.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              pct={moduleProgress[m.id] ?? 0}
              onPress={() => router.push(`/module/${m.id}`)}
            />
          ))}
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiKicker}>{t('aiTutor')}</Text>
          <Text style={styles.aiBody}>
            Paste any suspicious SMS, WhatsApp or email and the tutor explains the red flags in your language.
          </Text>
          <PrimaryButton
            label={t('checkMessage')}
            variant="secondary"
            onPress={() => router.push('/(tabs)/practice')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, accent && { color: Colors.accent700 }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  name: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, marginTop: 4, color: Colors.text },
  langPill: {
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 40,
    justifyContent: 'center',
  },
  langPillText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 11, letterSpacing: 1, color: Colors.text },
  rule: { height: 2, backgroundColor: Colors.text, marginTop: Spacing.md, marginHorizontal: Spacing.lg },
  statsRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.divider,
    marginTop: Spacing.sm,
  },
  stat: { flex: 1, paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  statValue: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 26, color: Colors.text },
  statLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: 4,
  },
  continueCard: {
    backgroundColor: Colors.accent,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  continueKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.accentContrast,
  },
  continueTitle: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 22, color: Colors.accentContrast },
  continueMeta: { fontFamily: Fonts.body, fontSize: 12, color: Colors.accentContrast, opacity: 0.92 },
  continueButton: {
    backgroundColor: Colors.accentContrast,
    borderRadius: Radii.sm,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  continueButtonText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 14, color: Colors.accent700 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionHeader: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  sectionCount: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMuted },
  moduleList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  aiCard: {
    margin: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radii.md,
  },
  aiKicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  aiBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text },
});
