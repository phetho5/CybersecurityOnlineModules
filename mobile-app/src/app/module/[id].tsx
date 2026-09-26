import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { getLessonProgress } from '@/data/lessons';
import { getModule } from '@/data/modules';
import { useAppStore } from '@/store/useAppStore';

const MODULE_TAG: Record<string, string> = {
  '01': 'Data privacy',
  '02': 'Local scams',
  '03': 'Local scams',
  '04': 'Phishing',
  '05': 'Cyber law',
};

const MODULE_INTRO: Record<string, string> = {
  '01': 'Understand what POPIA protects, when consent is required, and how to report unlawful use of your data.',
  '02': 'Spot the fake bank alert, the "mom I lost my phone" request, and the job offer that asks for a R150 registration fee.',
  '03': 'Recognise re-delivery fee scams and OTP fraud sent by SMS, and know what to do before you tap a link.',
  '04': 'Tell a spoofed university domain from the real thing, and learn why legitimate mail never needs a link.',
  '05': 'Know the key offences under the Cybercrimes Act and where to report an incident in South Africa.',
};

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const moduleProgress = useAppStore((s) => s.moduleProgress);
  const mod = getModule(id ?? '');

  if (!mod) return null;

  const pct = moduleProgress[mod.id] ?? 0;
  const lessons = getLessonProgress(mod.id, pct, mod.lessonCount);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title={`${t('modules')} / ${mod.id}`} onBack={() => router.replace('/(tabs)/home')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{MODULE_TAG[mod.id]}</Text>
          </View>
          <Text style={styles.title}>{mod.title}</Text>
          <Text style={styles.description}>{MODULE_INTRO[mod.id]}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              {mod.lessonCount} {t('lessons')}
            </Text>
            <Text style={styles.metaItem}>
              {mod.minutes} {t('min')}
            </Text>
            <Text style={styles.metaItem}>Badge on pass</Text>
          </View>
        </View>

        <View style={styles.lessonRail}>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.n}
              onPress={() => router.push(`/lesson/${mod.id}`)}
              style={({ pressed }) => [
                styles.lessonRow,
                lesson.status === 'in-progress' && styles.lessonRowActive,
                pressed && { backgroundColor: Colors.neutral200 },
              ]}>
              <View
                style={[
                  styles.lessonDot,
                  lesson.status === 'done' && { backgroundColor: Colors.text },
                ]}>
                {lesson.status === 'done' ? (
                  <Icon name="checkmark" size={14} color={Colors.background} />
                ) : (
                  <Text style={styles.lessonDotText}>{lesson.n}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>
                  {lesson.status === 'done' ? 'Done · ' : lesson.status === 'in-progress' ? 'In progress · ' : ''}
                  {lesson.minutes} {t('min')}
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={Colors.neutral600} />
            </Pressable>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <PrimaryButton label={t('takeAssessment')} onPress={() => router.push(`/quiz/${mod.id}`)} />
          <Text style={styles.ctaNote}>Pass mark 70%. Two attempts per day.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  intro: { padding: Spacing.lg, borderBottomWidth: 2, borderBottomColor: Colors.divider, gap: Spacing.sm },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent100,
    borderRadius: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
    fontWeight: '700',
  },
  title: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 28, lineHeight: 32, color: Colors.text },
  description: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 21, color: Colors.neutral800 },
  metaRow: { flexDirection: 'row', gap: Spacing.md },
  metaItem: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  lessonRail: { borderBottomWidth: 2, borderBottomColor: Colors.divider },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  lessonRowActive: { backgroundColor: Colors.accent100 },
  lessonDot: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonDotText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 12, color: Colors.text },
  lessonTitle: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 15, color: Colors.text },
  lessonMeta: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: 4,
  },
  ctaSection: { padding: Spacing.lg, gap: Spacing.sm },
  ctaNote: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
});
