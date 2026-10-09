import type { Question } from '@/data/quiz';

export type QuizBreakdownRow = { area: string; correct: boolean };

export type QuizResult = {
  correctCount: number;
  totalCount: number;
  scorePct: number;
  passed: boolean;
  breakdown: QuizBreakdownRow[];
};

export function scoreQuiz(
  questions: Question[],
  answers: Record<number, number>,
  passMark: number
): QuizResult {
  const totalCount = questions.length;
  if (totalCount === 0) {
    return { correctCount: 0, totalCount: 0, scorePct: 0, passed: false, breakdown: [] };
  }

  const breakdown = questions.map((q, i) => ({
    area: q.area,
    correct: answers[i] === q.correct,
  }));
  const correctCount = breakdown.filter((row) => row.correct).length;
  const scorePct = Math.round((correctCount / totalCount) * 100);
  const passed = scorePct >= passMark;

  return { correctCount, totalCount, scorePct, passed, breakdown };
}
