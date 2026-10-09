import { scoreQuiz } from '@/lib/scoring';
import type { Question } from '@/data/quiz';

function makeQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    topic: `topic-${i}`,
    area: `area-${i}`,
    text: `question ${i}`,
    options: ['a', 'b', 'c', 'd'],
    correct: 0,
    explain: 'because',
  }));
}

describe('scoreQuiz', () => {
  it('scores 0% and fails when nothing was answered', () => {
    const result = scoreQuiz(makeQuestions(3), {}, 70);
    expect(result.correctCount).toBe(0);
    expect(result.scorePct).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.breakdown).toEqual([
      { area: 'area-0', correct: false },
      { area: 'area-1', correct: false },
      { area: 'area-2', correct: false },
    ]);
  });

  it('scores 100% and passes when every answer is correct', () => {
    const questions = makeQuestions(4);
    const answers = { 0: 0, 1: 0, 2: 0, 3: 0 };
    const result = scoreQuiz(questions, answers, 70);
    expect(result.correctCount).toBe(4);
    expect(result.scorePct).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores 0% and fails when every answer is wrong', () => {
    const questions = makeQuestions(3);
    const answers = { 0: 1, 1: 1, 2: 1 };
    const result = scoreQuiz(questions, answers, 70);
    expect(result.correctCount).toBe(0);
    expect(result.scorePct).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('passes exactly at the pass-mark boundary', () => {
    const questions = makeQuestions(10);
    const answers = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 1 };
    const result = scoreQuiz(questions, answers, 70);
    expect(result.scorePct).toBe(70);
    expect(result.passed).toBe(true);
  });

  it('fails one point below the pass-mark boundary', () => {
    const questions = makeQuestions(10);
    const answers = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1, 9: 1 };
    const result = scoreQuiz(questions, answers, 70);
    expect(result.scorePct).toBe(60);
    expect(result.passed).toBe(false);
  });

  it('ignores answer entries with no matching question and never crashes on out-of-range indices', () => {
    const questions = makeQuestions(2);
    const answers = { 0: 0, 1: 0, 5: 0, [-1]: 0 };
    const result = scoreQuiz(questions, answers, 70);
    expect(result.correctCount).toBe(2);
    expect(result.totalCount).toBe(2);
    expect(result.scorePct).toBe(100);
  });

  it('returns a safe zero-result for an empty question set instead of dividing by zero', () => {
    const result = scoreQuiz([], {}, 70);
    expect(result.totalCount).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.scorePct).toBe(0);
    expect(result.passed).toBe(false);
    expect(Number.isNaN(result.scorePct)).toBe(false);
  });

  it('treats an undefined answer as unanswered, not as option index 0', () => {
    const questions = makeQuestions(1);
    const result = scoreQuiz(questions, { 0: undefined as unknown as number }, 70);
    expect(result.correctCount).toBe(0);
    expect(result.breakdown[0].correct).toBe(false);
  });
});
