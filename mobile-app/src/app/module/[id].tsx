import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ScreenHeader } from '@/components/screen-header';
import { VideoPlayer } from '@/components/video-player';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { MODULE_BADGE_ID } from '@/data/badges';
import { getLessonProgress } from '@/data/lessons';
import { getModule } from '@/data/modules';
import type { LanguageCode } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const moduleProgress = useAppStore((s) => s.moduleProgress);
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const mod = getModule(id ?? '');

  if (!mod) return null;

  const pct = moduleProgress[mod.id] ?? 0;
  const lessons = getLessonProgress(mod.id, pct, mod.lessonCount, language);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader title={`${t('modules')} / ${mod.id}`} onBack={() => router.replace('/(tabs)/home')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{t(`moduleTag_${mod.id}`)}</Text>
          </View>
          <Text style={styles.title}>{t(`moduleTitle_${mod.id}`, { defaultValue: mod.title })}</Text>
          <Text style={styles.description}>{t(`moduleIntro_${mod.id}`)}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              {mod.lessonCount} {t('lessons')}
            </Text>
            <Text style={styles.metaItem}>
              {mod.minutes} {t('min')}
            </Text>
            {MODULE_BADGE_ID[mod.id] && <Text style={styles.metaItem}>{t('badgeOnPass')}</Text>}
          </View>
        </View>

        {mod.overviewVideoUrl && (
          <View style={styles.overviewVideoWrap}>
            <VideoPlayer source={mod.overviewVideoUrl} />
          </View>
        )}

        <View style={styles.lessonRail}>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.n}
              onPress={() => router.push(`/lesson/${mod.id}/${lesson.n}`)}
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
                  {lesson.status === 'done'
                    ? `${t('lessonDone')} · `
                    : lesson.status === 'in-progress'
                      ? `${t('lessonInProgress')} · `
                      : ''}
                  {lesson.minutes} {t('min')}
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={Colors.neutral600} />
            </Pressable>
          ))}
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
  overviewVideoWrap: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
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
});
