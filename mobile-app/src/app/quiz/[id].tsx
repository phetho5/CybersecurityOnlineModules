import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ProgressBar } from '@/components/progress-bar';
import { ScreenHeader } from '@/components/screen-header';
import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import { QUESTIONS } from '@/data/quiz';
import { useAppStore } from '@/store/useAppStore';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const answers = useAppStore((s) => s.quizAnswers);
  const answerQuestion = useAppStore((s) => s.answerQuestion);
  const resetQuiz = useAppStore((s) => s.resetQuiz);

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  const answeredCount = Object.keys(answers).length;
  const qi = Math.min(answeredCount < QUESTIONS.length ? answeredCount : QUESTIONS.length - 1, QUESTIONS.length - 1);
  const question = QUESTIONS[qi];
  const answer = answers[qi];
  const answered = answer !== undefined;

  const progressPct = useMemo(
    () => Math.round(((qi + (answered ? 1 : 0)) / QUESTIONS.length) * 100),
    [qi, answered]
  );

  function next() {
    if (qi + 1 >= QUESTIONS.length) {
      router.replace(`/result/${id}`);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader
        title={`${t('assessment')} · ${qi + 1} / ${QUESTIONS.length}`}
        onBack={() => router.replace(`/module/${id}`)}
      />
      <ProgressBar pct={progressPct} height={4} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.questionBlock}>
          <Text style={styles.kicker}>
            {t('question')} {qi + 1} {t('of')} {QUESTIONS.length} · {question.topic}
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
            <View style={styles.feedback}>
              <Text style={styles.feedbackVerdict}>{answer === question.correct ? t('correct') : t('notQuite')}</Text>
              <Text style={styles.feedbackBody}>{question.explain}</Text>
            </View>
            <PrimaryButton
              label={qi + 1 >= QUESTIONS.length ? t('seeMyResult') : t('nextQuestion')}
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
  questionBlock: { padding: Spacing.lg, gap: Spacing.sm },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  questionText: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 24, lineHeight: 30, color: Colors.text },
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
  feedback: { borderWidth: 2, borderColor: Colors.text, backgroundColor: Colors.neutral100, padding: Spacing.md, borderRadius: Radii.sm },
  feedbackVerdict: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  feedbackBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: Colors.text, marginTop: Spacing.sm },
});
