import { router, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radii, Spacing } from '@/constants/theme';
import type { LanguageCode } from '@/i18n';
import {
  loadDailyQuestions,
  practiceStatus,
  type DailyQuestion,
  type LoadDailyQuestionsResult,
} from '@/lib/daily-practice';
import { useToday } from '@/lib/use-today';
import { useAppStore } from '@/store/useAppStore';

type LoadError = Extract<LoadDailyQuestionsResult, { ok: false }>['error'];

// How long the questions may take before the waiting text changes, so a slow reply still feels alive.
const SLOW_LOAD_MS = 5000;

function errorKey(reason: LoadError): string {
  switch (reason) {
    case 'missing-key':
      return 'aiErrorMissingKey';
    case 'invalid-key':
      return 'aiErrorInvalidKey';
    case 'rate-limited':
      return 'aiErrorRateLimited';
    case 'no-new-questions':
      return 'dailyNoNewQuestions';
    default:
      return 'dailyLoadFailed';
  }
}

/**
 * Today's practice questions: loads them once a day, shows them with feedback as each is answered,
 * and marks the day done when all are answered. The questions and answers live in the store, so
 * closing and reopening the app shows the same set.
 */
export function DailyPractice() {
  const { t } = useTranslation();
  const language = (useAppStore((s) => s.language) ?? 'en') as LanguageCode;
  const practice = useAppStore((s) => s.dailyPractice);
  const answer = useAppStore((s) => s.answerDailyQuestion);
  const today = useToday();

  const status = practiceStatus(practice, today);
  // Questions nobody has answered yet are swapped for ones in the language just chosen; once an
  // answer is in, the set stays as it is so the answer is not lost.
  const needsQuestions = status.state === 'none' || (practice?.language !== language && status.answered === 0);

  const [error, setError] = useState<LoadError | null>(null);
  // Which day and language is being fetched, so a repeat request is skipped and a reply that
  // arrives after the student has switched language is thrown away.
  const loadingFor = useRef<string | null>(null);

  function load() {
    const key = `${today}|${language}`;
    if (loadingFor.current === key) return;
    loadingFor.current = key;

    const { practiceTopicCursor, askedQuestions, startDailyPractice } = useAppStore.getState();
    loadDailyQuestions({ lang: language, cursor: practiceTopicCursor, asked: askedQuestions })
      .catch((err): LoadDailyQuestionsResult => {
        console.error('DailyPractice: loading questions failed', err);
        return { ok: false, error: 'unexpected-error' };
      })
      .then((result) => {
        if (loadingFor.current !== key) return;
        loadingFor.current = null;
        if (result.ok) {
          startDailyPractice(result.questions);
          setError(null);
        } else {
          setError(result.error);
        }
      });
  }

  useEffect(() => {
    if (needsQuestions) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsQuestions, today, language]);

  if (needsQuestions) {
    if (error) {
      return (
        <View style={styles.block}>
          <Text style={styles.errorText}>{t(errorKey(error))}</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            hitSlop={8}
            onPress={() => {
              if (loadingFor.current) return;
              setError(null);
              load();
            }}>
            <Text style={styles.retryText}>{t('tryAgain')}</Text>
          </Pressable>
        </View>
      );
    }
    return <DailySkeleton />;
  }

  const questions = practice?.questions ?? [];
  const answers = practice?.answers ?? {};
  const aiWritten = questions.some((q) => q.source === 'ai');

  return (
    <View>
      {status.state === 'done' && (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>{t('dailyDoneTitle')}</Text>
          <Text style={styles.doneBody}>{t('dailyDoneBody', { correct: status.correct, total: status.total })}</Text>
        </View>
      )}
      <Text style={styles.sourceLabel}>{aiWritten ? t('dailyAiLabel') : t('dailyNotesLabel')}</Text>
      {questions.map((question, i) => (
        <QuestionCard
          key={i}
          index={i}
          count={questions.length}
          question={question}
          picked={answers[i]}
          onPick={(option) => answer(i, option)}
        />
      ))}
    </View>
  );
}

function DailySkeleton() {
  const { t } = useTranslation();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.block} testID="daily-skeleton">
      <View style={styles.loadingRow}>
        <ActivityIndicator color={Colors.accent} />
        <Text style={styles.loadingText}>{slow ? t('dailyLoadingSlow') : t('dailyLoading')}</Text>
      </View>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '70%' }]} />
        </View>
      ))}
    </View>
  );
}

function QuestionCard({
  index,
  count,
  question,
  picked,
  onPick,
}: {
  index: number;
  count: number;
  question: DailyQuestion;
  picked: number | undefined;
  onPick: (option: number) => void;
}) {
  const { t } = useTranslation();
  const answered = picked !== undefined;
  const right = picked === question.correct;

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>
        {t('question')} {index + 1} {t('of')} {count} · {t(`moduleTitle_${question.moduleId}`)}
      </Text>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.options}>
        {question.options.map((option, i) => {
          const isCorrect = answered && i === question.correct;
          const isWrongPick = answered && i === picked && !right;
          const fg = isCorrect ? Colors.accentContrast : Colors.text;
          return (
            <Pressable
              key={i}
              testID={`daily-option-${index}-${i}`}
              accessibilityRole="button"
              disabled={answered}
              onPress={() => onPick(i)}
              style={[styles.optionRow, isCorrect && styles.optionCorrect, isWrongPick && styles.optionWrong]}>
              <Text style={[styles.optionKey, { color: fg }]}>{'ABCD'[i]}</Text>
              <Text style={[styles.optionText, { color: fg }]}>{option}</Text>
              <Text style={[styles.optionMark, { color: fg }]}>{isCorrect ? '✓' : isWrongPick ? '✕' : ''}</Text>
            </Pressable>
          );
        })}
      </View>
      {answered && (
        <View style={styles.feedback}>
          <Text style={styles.verdict}>{right ? t('correct') : t('notQuite')}</Text>
          {question.explain ? <Text style={styles.explain}>{question.explain}</Text> : null}
          <Pressable
            testID={`daily-revise-${index}`}
            accessibilityRole="link"
            hitSlop={8}
            style={styles.reviseLink}
            onPress={() => router.push(`/lesson/${question.moduleId}/${question.lessonN}` as Href)}>
            <Text style={styles.reviseText}>{t('dailyReviseLesson')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  loadingText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted },
  skeletonCard: { backgroundColor: Colors.neutral200, borderRadius: Radii.sm, padding: Spacing.lg, gap: Spacing.sm },
  skeletonLine: { height: 12, borderRadius: Radii.sm, backgroundColor: Colors.neutral300, width: '90%' },
  errorText: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.accent700 },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
  },
  retryText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.accent },
  doneCard: { backgroundColor: Colors.accent, padding: Spacing.lg, gap: Spacing.xs, marginTop: Spacing.md },
  doneTitle: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 20, color: Colors.accentContrast },
  doneBody: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.accentContrast },
  sourceLabel: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  card: { borderBottomWidth: 2, borderBottomColor: Colors.divider, paddingVertical: Spacing.lg, gap: Spacing.sm },
  kicker: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
  },
  questionText: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 23,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
  },
  options: { borderTopWidth: 1, borderTopColor: Colors.neutral300, marginTop: Spacing.xs },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  optionCorrect: { backgroundColor: Colors.accent },
  optionWrong: { backgroundColor: Colors.neutral300 },
  optionKey: { fontFamily: Fonts.heading, fontWeight: '800', fontSize: 13 },
  optionText: { flex: 1, fontFamily: Fonts.body, fontSize: 14, lineHeight: 20 },
  optionMark: { fontFamily: Fonts.heading, fontWeight: '800' },
  feedback: { paddingHorizontal: Spacing.lg, gap: Spacing.xs },
  verdict: {
    fontFamily: Fonts.heading,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.accent700,
  },
  explain: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 19, color: Colors.text },
  reviseLink: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  reviseText: { fontFamily: Fonts.bodyMedium, fontSize: 13, fontWeight: '700', color: Colors.accent700, textDecorationLine: 'underline' },
});
