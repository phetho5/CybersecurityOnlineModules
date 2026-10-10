export type StreakState = {
  /** Days in a row the student has opened the app, counting the last active day. */
  streak: number;
  /** The last calendar day (on the phone's own clock) the student was active, as YYYY-MM-DD. */
  lastActiveDate: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function toLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Day number of a YYYY-MM-DD key, or null if it isn't a real calendar date. */
function dayNumber(key: string | null): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? '');
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) return null;
  return Math.round(utc.getTime() / DAY_MS);
}

/**
 * The streak after the student is active at `now`: unchanged later the same day, one longer the
 * day after, and back to 1 after a missed day. A clock that has been set back leaves it alone.
 */
export function nextStreak(current: StreakState, now: Date = new Date()): StreakState {
  const today = toLocalDateKey(now);
  const saved = Number.isFinite(current.streak) && current.streak > 0 ? Math.floor(current.streak) : 0;
  const last = dayNumber(current.lastActiveDate);
  if (last === null) return { streak: 1, lastActiveDate: today };

  const gap = (dayNumber(today) as number) - last;
  if (gap < 0) return current;
  if (gap === 0) return saved >= 1 ? current : { streak: 1, lastActiveDate: today };
  return { streak: gap === 1 ? saved + 1 : 1, lastActiveDate: today };
}

/**
 * The streak to show the student at `now`: the saved one while it can still be kept going (today
 * or the day after it was last added to), and 0 once a whole day has been missed.
 */
export function currentStreak(current: StreakState, now: Date = new Date()): number {
  const last = dayNumber(current.lastActiveDate);
  if (last === null || !Number.isFinite(current.streak) || current.streak < 1) return 0;
  const gap = (dayNumber(toLocalDateKey(now)) as number) - last;
  return gap > 1 ? 0 : Math.floor(current.streak);
}

/** Midday on the calendar day a YYYY-MM-DD key names, or now if the key is not a real date. */
export function dateFromKey(key: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  return match && dayNumber(key) !== null ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12) : new Date();
}
