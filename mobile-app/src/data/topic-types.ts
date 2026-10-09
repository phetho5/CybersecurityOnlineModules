export type TopicSection = {
  heading: string;
  /** An optional lead sentence shown before the bullet/numbered list. */
  body?: string;
  items: string[];
};

export type TopicActivity = {
  prompt: string;
  /** The lettered choices as given in the source, shown verbatim. Absent for open/procedural activities. */
  options?: string[];
  /**
   * Index into `options` for the correct choice. Only ever set when the source text explicitly
   * named the correct choice — never inferred. Activities without that are ungraded reflection
   * content instead of a guessed answer.
   */
  correctIndex?: number;
  feedback: string;
};

export type TopicScenario = {
  label: string;
  text: string;
  tasks: string[];
};

export type TopicContent = {
  n: number;
  title: string;
  intro: string;
  sections: TopicSection[];
  /** A worked example/scenario from the source, where one exists. */
  example?: string;
  /**
   * A real interactive/discussion exercise from the source (labelled "Activity", "Interactive
   * Scenario", "Checklist Activity", etc.). Absent when the source's Part A has no such exercise
   * for this topic — never fabricated to fill the slot.
   */
  activity?: TopicActivity;
  /** Capstone-style topics only — scenarios replace a single example + activity. */
  scenarios?: TopicScenario[];
  /** Capstone-style topics only — closing reflection prompts. */
  reflection?: string[];
  keyTakeaway: string;
};

export type TopicQuizQuestion = {
  text: string;
  options: string[];
  correct: number;
};
