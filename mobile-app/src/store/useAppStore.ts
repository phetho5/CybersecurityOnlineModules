import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getBadge, MODULE_BADGE_ID } from '@/data/badges';
import { getModule } from '@/data/modules';
import i18n, { type LanguageCode } from '@/i18n';
import { computeEarnedBadgeIds, lessonProgressPct } from '@/lib/badges';
import type { LastLesson } from '@/lib/continue-lesson';
import {
  DAILY_QUESTION_COUNT,
  type AskedQuestion,
  type DailyPracticeSet,
  type DailyQuestion,
} from '@/lib/daily-practice';
import { hasCertificate, issueCertificate, validateCertificateName, type CertificateRecord } from '@/lib/certificate';
import { removeUnearnedProgress } from '@/lib/saved-state';
import { nextStreak, toLocalDateKey } from '@/lib/streak';
import { awardBadge, mergeBadgeIds, mergeModuleProgress, upsertModuleProgress, type RemoteState } from '@/lib/sync';

type ModuleProgress = Record<string, number>;

export type PracticeStats = {
  /** Days on which every daily question was answered. */
  daysCompleted: number;
  answered: number;
  correct: number;
};

type AppState = {
  language: LanguageCode | null;
  streak: number;
  /** The last calendar day the student finished the daily practice (YYYY-MM-DD), which the streak is counted from. */
  lastActiveDate: string | null;
  moduleProgress: ModuleProgress;
  earnedBadgeIds: string[];
  /** Badges earned this session that the student has not been shown yet. Not persisted. */
  badgeAnnouncements: string[];
  /** An earned badge whose celebration the student asked to see again. Not persisted. */
  badgeReplayId: string | null;
  /** The name the student typed for their certificates. Kept on the phone only — never synced. */
  studentName: string | null;
  /** Issued certificates by module id. Kept on the phone only — never synced. */
  certificates: Record<string, CertificateRecord>;
  /** The lesson the student last had open, which "Continue learning" resumes. */
  lastLesson: LastLesson | null;
  /** The most recent day's practice questions and the answers given. Kept on the phone only. */
  dailyPractice: DailyPracticeSet | null;
  /** Every daily question ever shown, so none is shown twice. Kept on the phone only. */
  askedQuestions: AskedQuestion[];
  /** How far through the rotation of topics daily practice has got. */
  practiceTopicCursor: number;
  practiceStats: PracticeStats;
  /** Whether the student wants the daily reminder; null until they have been asked. */
  reminderEnabled: boolean | null;
  /** Current Supabase auth.uid(), or null when signed out/offline. Not persisted — re-established each launch. */
  userId: string | null;

  quizAnswers: Record<number, number>;
  cluesPicked: string[];
  cluesChecked: boolean;

  setLanguage: (lang: LanguageCode) => void;
  setUserId: (userId: string | null) => void;
  hydrateRemoteState: (remote: RemoteState) => void;
  toggleClue: (id: string) => void;
  checkClues: () => void;
  resetLesson: () => void;
  answerQuestion: (index: number, optionIndex: number) => void;
  resetQuiz: () => void;
  setStudentName: (name: string) => void;
  /** `scorePct` is the final-assessment score; passing it issues (or updates) the module's certificate. */
  completeModule: (moduleId: string, badgeId?: string, scorePct?: number) => void;
  /** A lesson's knowledge check was finished: moves the module's progress on, never back. */
  completeLesson: (moduleId: string, lessonN: number) => void;
  setLastLesson: (moduleId: string, lessonN: number) => void;
  /** Saves the day's questions and marks them as shown. */
  startDailyPractice: (questions: DailyQuestion[], now?: Date) => void;
  /** Records the first answer to a daily question; the last one of the day counts towards the streak. */
  answerDailyQuestion: (index: number, optionIndex: number, now?: Date) => void;
  setReminderEnabled: (enabled: boolean) => void;
  dismissBadgeAnnouncement: () => void;
  /** Plays the celebration again for a badge the student already holds (tapped on Profile). */
  replayBadge: (badgeId: string) => void;
  closeBadgeReplay: () => void;
};

type BadgeInputs = Pick<AppState, 'moduleProgress' | 'earnedBadgeIds' | 'streak' | 'badgeAnnouncements'>;

/**
 * Adds any badge the given progress has now earned. With `announce`, newly earned badges are also
 * queued to be celebrated on screen. (An assessment badge is queued by `completeModule`, which awards it.)
 */
function withEarnedBadges(
  state: BadgeInputs,
  announce: boolean,
): Pick<AppState, 'earnedBadgeIds' | 'badgeAnnouncements'> {
  const earnedBadgeIds = computeEarnedBadgeIds(state);
  if (earnedBadgeIds.length === state.earnedBadgeIds.length) {
    return {
      earnedBadgeIds: state.earnedBadgeIds,
      badgeAnnouncements: state.badgeAnnouncements,
    };
  }
  const toAnnounce = earnedBadgeIds.filter(
    (id) => !state.earnedBadgeIds.includes(id) && !state.badgeAnnouncements.includes(id) && getBadge(id) !== undefined,
  );
  return {
    earnedBadgeIds,
    badgeAnnouncements: announce ? [...state.badgeAnnouncements, ...toAnnounce] : state.badgeAnnouncements,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Applies a change, then awards whatever it earned and syncs new badges in the background. */
      const applyProgress = (change: (state: AppState) => Partial<AppState>, practisedAt?: Date) => {
        const before = get().earnedBadgeIds;
        set((state) => {
          const next = { ...state, ...change(state) };
          // Only a finished daily practice counts towards the streak.
          const streak = practisedAt
            ? nextStreak({ streak: next.streak, lastActiveDate: next.lastActiveDate }, practisedAt)
            : { streak: next.streak, lastActiveDate: next.lastActiveDate };
          return {
            ...next,
            ...streak,
            ...withEarnedBadges({ ...next, ...streak }, true),
          };
        });
        const { userId, earnedBadgeIds } = get();
        if (userId) {
          for (const badgeId of earnedBadgeIds.filter((id) => !before.includes(id))) {
            void awardBadge(userId, badgeId);
          }
        }
      };

      return {
        language: null,
        streak: 0,
        lastActiveDate: null,
        moduleProgress: {},
        earnedBadgeIds: [],
        badgeAnnouncements: [],
        badgeReplayId: null,
        studentName: null,
        certificates: {},
        lastLesson: null,
        dailyPractice: null,
        askedQuestions: [],
        practiceTopicCursor: 0,
        practiceStats: { daysCompleted: 0, answered: 0, correct: 0 },
        reminderEnabled: null,
        userId: null,

        quizAnswers: {},
        cluesPicked: [],
        cluesChecked: false,

        setLanguage: (lang) => {
          set({ language: lang });
          i18n.changeLanguage(lang);
        },

        setUserId: (userId) => set({ userId }),

        hydrateRemoteState: (remote) =>
          set((state) => {
            const moduleProgress = mergeModuleProgress(state.moduleProgress, remote.moduleProgress);
            const earnedBadgeIds = mergeBadgeIds(state.earnedBadgeIds, remote.badgeIds);
            // Earned elsewhere or earlier, so nothing is announced.
            return {
              moduleProgress,
              ...withEarnedBadges({ ...state, moduleProgress, earnedBadgeIds }, false),
            };
          }),

        toggleClue: (id) => {
          if (get().cluesChecked) return;
          const picked = get().cluesPicked;
          set({
            cluesPicked: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id],
          });
        },
        checkClues: () => set({ cluesChecked: true }),
        resetLesson: () => set({ cluesPicked: [], cluesChecked: false }),

        answerQuestion: (index, optionIndex) => {
          if (get().quizAnswers[index] !== undefined) return;
          set({ quizAnswers: { ...get().quizAnswers, [index]: optionIndex } });
        },
        resetQuiz: () => set({ quizAnswers: {} }),

        setStudentName: (name) => {
          const result = validateCertificateName(name);
          if (result.ok) set({ studentName: result.name });
        },

        completeModule: (moduleId, badgeId, scorePct) => {
          applyProgress((state) => {
            const newBadge = badgeId !== undefined && !state.earnedBadgeIds.includes(badgeId);
            const celebrate =
              newBadge && getBadge(badgeId) !== undefined && !state.badgeAnnouncements.includes(badgeId);
            return {
              moduleProgress: { ...state.moduleProgress, [moduleId]: 100 },
              certificates:
                typeof scorePct === 'number' && hasCertificate(moduleId)
                  ? {
                      ...state.certificates,
                      [moduleId]: issueCertificate(state.certificates[moduleId], {
                        moduleId,
                        scorePct,
                        language: state.language ?? 'en',
                      }),
                    }
                  : state.certificates,
              earnedBadgeIds: newBadge ? [...state.earnedBadgeIds, badgeId] : state.earnedBadgeIds,
              badgeAnnouncements: celebrate ? [...state.badgeAnnouncements, badgeId] : state.badgeAnnouncements,
            };
          });

          const { userId } = get();
          if (userId) {
            void upsertModuleProgress(userId, moduleId, 100);
          }
        },

        completeLesson: (moduleId, lessonN) => {
          const pct = lessonProgressPct(moduleId, lessonN);
          if (pct === null) return;
          const previous = get().moduleProgress[moduleId] ?? 0;
          applyProgress((state) => ({
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: Math.max(state.moduleProgress[moduleId] ?? 0, pct),
            },
          }));

          const { userId } = get();
          if (userId && pct > previous) {
            void upsertModuleProgress(userId, moduleId, pct);
          }
        },

        setLastLesson: (moduleId, lessonN) => {
          const mod = getModule(moduleId);
          if (!mod || !Number.isInteger(lessonN) || lessonN < 1 || lessonN > mod.lessonCount) return;
          set({ lastLesson: { moduleId, lessonN } });
        },

        startDailyPractice: (questions, now = new Date()) => {
          if (questions.length === 0) return;
          set((state) => ({
            dailyPractice: {
              date: toLocalDateKey(now),
              language: state.language ?? 'en',
              questions,
              answers: {},
            },
            askedQuestions: [
              ...state.askedQuestions,
              ...questions.map((q) => ({
                topic: q.topicId,
                text: q.text,
                ...(q.id ? { id: q.id } : {}),
              })),
            ],
            practiceTopicCursor: state.practiceTopicCursor + DAILY_QUESTION_COUNT,
          }));
        },

        answerDailyQuestion: (index, optionIndex, now = new Date()) => {
          const practice = get().dailyPractice;
          const question = practice?.questions[index];
          if (!practice || !question || practice.answers[index] !== undefined) return;
          if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return;

          const answers = { ...practice.answers, [index]: optionIndex };
          const finished = practice.questions.every((_, i) => answers[i] !== undefined);
          applyProgress(
            (state) => ({
              dailyPractice: { ...practice, answers },
              practiceStats: {
                daysCompleted: state.practiceStats.daysCompleted + (finished ? 1 : 0),
                answered: state.practiceStats.answered + 1,
                correct: state.practiceStats.correct + (optionIndex === question.correct ? 1 : 0),
              },
            }),
            finished ? now : undefined,
          );
        },

        setReminderEnabled: (enabled) => set({ reminderEnabled: enabled }),

        replayBadge: (badgeId) => {
          if (get().earnedBadgeIds.includes(badgeId) && getBadge(badgeId)) set({ badgeReplayId: badgeId });
        },
        closeBadgeReplay: () => set({ badgeReplayId: null }),

        dismissBadgeAnnouncement: () =>
          set((state) => ({
            badgeAnnouncements: state.badgeAnnouncements.slice(1),
          })),
      };
    },
    {
      name: 'cyber-aware-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Saves from before version 1 may still hold the first build's demo progress (bug #8). Their
      // streak counted days the app was opened; it now counts finished daily practice, so it restarts.
      migrate: (persisted, version) =>
        version < 1
          ? {
              ...removeUnearnedProgress(persisted as Partial<AppState>),
              streak: 0,
              lastActiveDate: null,
            }
          : (persisted as Partial<AppState>),
      partialize: (state) => ({
        language: state.language,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        moduleProgress: state.moduleProgress,
        earnedBadgeIds: state.earnedBadgeIds,
        studentName: state.studentName,
        certificates: state.certificates,
        lastLesson: state.lastLesson,
        dailyPractice: state.dailyPractice,
        askedQuestions: state.askedQuestions,
        practiceTopicCursor: state.practiceTopicCursor,
        practiceStats: state.practiceStats,
        reminderEnabled: state.reminderEnabled,
      }),
      // A save from before a badge existed may already have earned it: award those without a pop-up.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<AppState>) };
        return { ...merged, ...withEarnedBadges(merged, false) };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    },
  ),
);
