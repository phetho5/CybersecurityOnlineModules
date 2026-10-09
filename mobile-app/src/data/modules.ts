export type ModuleDef = {
  id: string;
  title: string;
  lessonCount: number;
  minutes: number;
  /** A single video covering the whole module, shown on the module detail screen above the lesson list. */
  overviewVideoUrl?: string;
};

export const MODULES: ModuleDef[] = [
  { id: '01', title: 'POPIA & Your Personal Data', lessonCount: 3, minutes: 18 },
  {
    id: '02',
    title: 'Online Scams',
    lessonCount: 9,
    minutes: 54,
    overviewVideoUrl: 'https://rihrkegrzlmlllldbpfl.supabase.co/storage/v1/object/public/lesson-media/LESSON.mp4',
  },
  { id: '03', title: 'Digital Privacy', lessonCount: 2, minutes: 16 },
];

export function getModule(id: string): ModuleDef | undefined {
  return MODULES.find((m) => m.id === id);
}
