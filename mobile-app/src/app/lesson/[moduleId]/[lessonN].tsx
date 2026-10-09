import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenHeader } from '@/components/screen-header';
import { TopicLesson } from '@/components/topic-lesson';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { getLesson } from '@/data/lessons';
import { getModule } from '@/data/modules';
import type { LanguageCode } from '@/i18n';
import { getModuleTopicContent } from '@/lib/topic-source';
import { useAppStore } from '@/store/useAppStore';

export default function LessonScreen() {
  const { moduleId, lessonN } = useLocalSearchParams<{ moduleId: string; lessonN: string }>();
  const { t } = useTranslation();
  const n = Number(lessonN);
  const lesson = getLesson(moduleId ?? '', n);
  const mod = getModule(moduleId ?? '');
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const topic = getModuleTopicContent(moduleId ?? '', language, n);

  const resetLesson = useAppStore((s) => s.resetLesson);
  useEffect(() => {
    resetLesson();
  }, [resetLesson]);

  if (!lesson || !mod || !topic) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScreenHeader title={t('modules')} onBack={() => router.replace('/(tabs)/modules')} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('lessonNotFound')}</Text>
          <PrimaryButton label={t('backToModules')} onPress={() => router.replace('/(tabs)/modules')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader
        title={`${t('modules')} · ${n} / ${mod.lessonCount}`}
        onBack={() =>
          n > 1 ? router.replace(`/lesson/${moduleId}/${n - 1}` as Href) : router.replace(`/module/${moduleId}` as Href)
        }
      />
      <ProgressBar pct={Math.round((n / mod.lessonCount) * 100)} height={4} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopicLesson topic={topic} videoUrl={lesson.videoUrl} audioUrl={lesson.audioUrl} />
        <View style={styles.footer}>
          <PrimaryButton
            label={t('startKnowledgeCheck')}
            onPress={() => router.push(`/quiz/${moduleId}/${n}` as Href)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.lg },
  notFoundText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMuted },
  footer: { padding: Spacing.lg, gap: Spacing.md },
});
