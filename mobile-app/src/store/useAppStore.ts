import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { type LanguageCode } from '@/i18n';

type ModuleProgress = Record<string, number>;

type AppState = {
  language: LanguageCode | null;
  streak: number;
  moduleProgress: ModuleProgress;
  earnedBadgeIds: string[];

  quizAnswers: Record<number, number>;
  cluesPicked: string[];
  cluesChecked: boolean;
  drillPicks: Record<number, 'scam' | 'safe'>;

  setLanguage: (lang: LanguageCode) => void;
  toggleClue: (id: string) => void;
  checkClues: () => void;
  resetLesson: () => void;
  answerQuestion: (index: number, optionIndex: number) => void;
  resetQuiz: () => void;
  completeModule: (moduleId: string, badgeId?: string) => void;
  answerDrill: (index: number, pick: 'scam' | 'safe') => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: null,
      streak: 12,
      moduleProgress: { '01': 60, '02': 40, '03': 0, '04': 0, '05': 0 },
      earnedBadgeIds: ['scam-spotter', 'popia-aware'],

      quizAnswers: {},
      cluesPicked: [],
      cluesChecked: false,
      drillPicks: {},

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },

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

      completeModule: (moduleId, badgeId) =>
        set((state) => ({
          moduleProgress: { ...state.moduleProgress, [moduleId]: 100 },
          earnedBadgeIds:
            badgeId && !state.earnedBadgeIds.includes(badgeId)
              ? [...state.earnedBadgeIds, badgeId]
              : state.earnedBadgeIds,
        })),

      answerDrill: (index, pick) => {
        if (get().drillPicks[index] !== undefined) return;
        set({ drillPicks: { ...get().drillPicks, [index]: pick } });
      },
    }),
    {
      name: 'cyber-aware-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        streak: state.streak,
        moduleProgress: state.moduleProgress,
        earnedBadgeIds: state.earnedBadgeIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
