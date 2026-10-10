import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { getModule } from '@/data/modules';
import type { LanguageCode } from '@/i18n';
import { getModuleFinalAssessment, getModuleTopicQuiz } from '@/lib/topic-source';
import { useAppStore } from '@/store/useAppStore';

export default function TopicQuizScreen() {
  const { moduleId, lessonN } = useLocalSearchParams<{ moduleId: string; lessonN: string }>();
  const { t } = useTranslation();
  const n = Number(lessonN);
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const mod = getModule(moduleId ?? '');
  const questions = getModuleTopicQuiz(moduleId ?? '', language, n);

  const answers = useAppStore((s) => s.quizAnswers);
  const answerQuestion = useAppStore((s) => s.answerQuestion);
  const resetQuiz = useAppStore((s) => s.resetQuiz);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const [qi, setQi] = useState(0);

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz, moduleId, lessonN]);

  if (!mod || !questions || questions.length === 0) {
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

  const question = questions[qi];
  const answer = answers[qi];
  const answered = answer !== undefined;
  const isLastQuestion = qi + 1 >= questions.length;
  const isLastLessonOfModule = n >= mod.lessonCount;
  // Only a module whose source material authored a real final assessment gates a badge on its
  // last lesson — POPIA's last topic is just a regular knowledge check, not a graded capstone.
  const isCapstone = isLastLessonOfModule && Boolean(getModuleFinalAssessment(moduleId ?? '', language));

  const progressPct = Math.round(((qi + (answered ? 1 : 0)) / questions.length) * 100);

  function next() {
    if (!isLastQuestion) {
      setQi(qi + 1);
    } else if (isCapstone) {
      router.replace(`/result/${moduleId}`);
    } else if (isLastLessonOfModule) {
      completeLesson(moduleId ?? '', n);
      router.replace(`/module/${moduleId}` as Href);
    } else {
      completeLesson(moduleId ?? '', n);
      router.push(`/lesson/${moduleId}/${n + 1}` as Href);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader
        title={`${t('knowledgeCheck')} · ${qi + 1} / ${questions.length}`}
        onBack={() => router.replace(`/lesson/${moduleId}/${n}`)}
      />
      <ProgressBar pct={progressPct} height={4} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.questionBlock}>
          <Text style={styles.kicker}>
            {t('question')} {qi + 1} {t('of')} {questions.length}
          </Text>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        <View style={styles.options}>
          {question.options.map((option, i) => {
            let bg: string = 'transparent';
            let fg: string = Colors.text;
            let mark = '';
            if (answered) {
              if (i === question.correct) {
                bg = Colors.accent;
                fg = Colors.accentContrast;
                mark = '✓';
              } else if (i === answer) {
                bg = Colors.neutral300;
                fg = Colors.text;
                mark = '✕';
              }
            }
            return (
              <Pressable
                key={i}
                disabled={answered}
                onPress={() => answerQuestion(qi, i)}
                style={[styles.optionRow, { backgroundColor: bg }]}>
                <Text style={[styles.optionKey, { color: fg }]}>{'ABCD'[i]}</Text>
                <Text style={[styles.optionText, { color: fg }]}>{option}</Text>
                <Text style={[styles.optionMark, { color: fg }]}>{mark}</Text>
              </Pressable>
            );
          })}
        </View>

        {answered && (
          <View style={styles.footer}>
            <Text style={styles.feedbackVerdict}>{answer === question.correct ? t('correct') : t('notQuite')}</Text>
            <PrimaryButton
              label={
                !isLastQuestion ? t('nextQuestion') : isCapstone ? t('seeMyResult') : t('continueToNextLesson')
              }
              onPress={next}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.lg },
  notFoundText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMuted },
  questionBlock: { padding: Spacing.lg, gap: Spacing.sm },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  questionText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 22, lineHeight: 28, color: Colors.text },
  options: { borderTopWidth: 2, borderTopColor: Colors.divider, paddingHorizontal: Spacing.lg },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  optionKey: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 13 },
  optionText: { flex: 1, fontFamily: Fonts.body, fontSize: 14, lineHeight: 20 },
  optionMark: { fontFamily: Fonts.heading, fontWeight: '800' },
  footer: { padding: Spacing.lg, gap: Spacing.md },
  feedbackVerdict: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
});
