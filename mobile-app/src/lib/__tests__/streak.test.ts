import { currentStreak, nextStreak, toLocalDateKey } from '@/lib/streak';

const day = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

describe('toLocalDateKey', () => {
  it('writes the phone’s own calendar day as YYYY-MM-DD, zero-padded', () => {
    expect(toLocalDateKey(day(2026, 3, 5))).toBe('2026-03-05');
    expect(toLocalDateKey(day(2026, 10, 10, 23))).toBe('2026-10-10');
  });
});

describe('nextStreak', () => {
  it('starts a brand-new student at day 1 the first time they open the app', () => {
    expect(nextStreak({ streak: 0, lastActiveDate: null }, day(2026, 10, 10))).toEqual({
      streak: 1,
      lastActiveDate: '2026-10-10',
    });
  });

  it('does not count the same day twice, however many times the app is opened', () => {
    const state = { streak: 3, lastActiveDate: '2026-10-10' };
    expect(nextStreak(state, day(2026, 10, 10, 1))).toEqual(state);
    expect(nextStreak(state, day(2026, 10, 10, 23))).toEqual(state);
  });

  it('adds a day when the student comes back the very next day', () => {
    expect(nextStreak({ streak: 3, lastActiveDate: '2026-10-10' }, day(2026, 10, 11))).toEqual({
      streak: 4,
      lastActiveDate: '2026-10-11',
    });
  });

  it('counts late last night and early this morning as two days in a row', () => {
    const first = nextStreak({ streak: 0, lastActiveDate: null }, day(2026, 10, 10, 23));
    expect(nextStreak(first, day(2026, 10, 11, 0))).toEqual({ streak: 2, lastActiveDate: '2026-10-11' });
  });

  it('carries on across the end of a month and the end of a year', () => {
    expect(nextStreak({ streak: 5, lastActiveDate: '2026-10-31' }, day(2026, 11, 1)).streak).toBe(6);
    expect(nextStreak({ streak: 5, lastActiveDate: '2026-12-31' }, day(2027, 1, 1)).streak).toBe(6);
    expect(nextStreak({ streak: 5, lastActiveDate: '2028-02-28' }, day(2028, 2, 29)).streak).toBe(6);
  });

  it('starts again at day 1 after a missed day', () => {
    expect(nextStreak({ streak: 9, lastActiveDate: '2026-10-08' }, day(2026, 10, 10))).toEqual({
      streak: 1,
      lastActiveDate: '2026-10-10',
    });
  });

  it('reaches 7 after seven days in a row', () => {
    let state = { streak: 0, lastActiveDate: null as string | null };
    for (let d = 1; d <= 7; d++) state = nextStreak(state, day(2026, 10, d));
    expect(state.streak).toBe(7);
  });

  it('leaves the streak alone if the phone’s clock has been set back, rather than wiping it', () => {
    const state = { streak: 4, lastActiveDate: '2026-10-10' };
    expect(nextStreak(state, day(2026, 10, 7))).toEqual(state);
  });

  it('starts at day 1 when the saved date is missing or unreadable', () => {
    for (const lastActiveDate of ['', 'yesterday', '2026-13-45', '10/10/2026']) {
      expect(nextStreak({ streak: 6, lastActiveDate }, day(2026, 10, 10))).toEqual({
        streak: 1,
        lastActiveDate: '2026-10-10',
      });
    }
  });

  it('treats a damaged saved count (negative, fractional, not a number) as no streak', () => {
    for (const streak of [-3, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(nextStreak({ streak, lastActiveDate: '2026-10-09' }, day(2026, 10, 10)).streak).toBe(1);
    }
    expect(nextStreak({ streak: 2.7, lastActiveDate: '2026-10-09' }, day(2026, 10, 10)).streak).toBe(3);
  });

  it('shows at least day 1 for a student active today whose saved count was zero', () => {
    expect(nextStreak({ streak: 0, lastActiveDate: '2026-10-10' }, day(2026, 10, 10)).streak).toBe(1);
  });
});

describe('currentStreak (what the student is shown today)', () => {
  const at = (d: number) => new Date(2026, 9, d, 9);

  it('shows the saved streak on the day it was last added to', () => {
    expect(currentStreak({ streak: 4, lastActiveDate: '2026-10-05' }, at(5))).toBe(4);
  });

  it('still shows it the next day, while there is time left to keep it going', () => {
    expect(currentStreak({ streak: 4, lastActiveDate: '2026-10-05' }, at(6))).toBe(4);
  });

  it('shows 0 once a whole day has been missed, without waiting for the next practice', () => {
    expect(currentStreak({ streak: 4, lastActiveDate: '2026-10-05' }, at(7))).toBe(0);
    expect(currentStreak({ streak: 4, lastActiveDate: '2026-10-05' }, at(20))).toBe(0);
  });

  it('shows 0 for a student who has never practised, and for a damaged save', () => {
    expect(currentStreak({ streak: 0, lastActiveDate: null }, at(5))).toBe(0);
    expect(currentStreak({ streak: 12, lastActiveDate: null }, at(5))).toBe(0);
    expect(currentStreak({ streak: Number.NaN, lastActiveDate: '2026-10-05' }, at(5))).toBe(0);
    expect(currentStreak({ streak: 3, lastActiveDate: 'not-a-date' }, at(5))).toBe(0);
  });

  it('leaves the streak showing if the phone clock is set back', () => {
    expect(currentStreak({ streak: 4, lastActiveDate: '2026-10-05' }, at(2))).toBe(4);
  });
});
