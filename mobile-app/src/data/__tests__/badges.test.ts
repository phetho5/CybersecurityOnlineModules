import { BADGES, getBadge, MODULE_BADGE_ID } from '@/data/badges';

describe('BADGES', () => {
  it('no longer includes the retired Cybercrimes Act badge', () => {
    expect(BADGES.find((b) => b.id === 'cyber-law')).toBeUndefined();
  });

  it('renames the existing POPIA Aware badge to match the module that now actually gates it', () => {
    const badge = BADGES.find((b) => b.id === 'popia-aware');
    expect(badge).toBeDefined();
    expect(badge?.name).not.toBe('POPIA Aware');
  });

  it('defines every badge as not-yet-earned in the catalog (per-student state lives in the store)', () => {
    for (const badge of BADGES) {
      expect(badge.earned).toBe(false);
    }
  });

  it('holds exactly the six badges that have artwork', () => {
    expect(BADGES.map((b) => b.id).sort()).toEqual(
      ['cyber-graduate', 'first-steps', 'popia-aware', 'popia-basics', 'scam-spotter', 'streak-7'].sort()
    );
  });

  it('no longer includes the 30-Day Streak badge that nothing could award', () => {
    expect(BADGES.find((b) => b.id === 'streak-30')).toBeUndefined();
  });

  it('keeps the id students already hold for Digital Privacy Pro, and gives POPIA Aware its own', () => {
    expect(getBadge('popia-aware')?.name).toBe('Digital Privacy Pro');
    expect(getBadge('popia-basics')?.name).toBe('POPIA Aware');
  });

  it('gives every badge its own picture and a unique id and name', () => {
    for (const badge of BADGES) expect(badge.image).toBeTruthy();
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(new Set(BADGES.map((b) => b.name)).size).toBe(BADGES.length);
    expect(new Set(BADGES.map((b) => JSON.stringify(b.image))).size).toBe(BADGES.length);
  });
});

describe('getBadge', () => {
  it('finds a badge by id and returns nothing for an unknown or empty id', () => {
    expect(getBadge('scam-spotter')?.name).toBe('Scam Spotter');
    expect(getBadge('streak-30')).toBeUndefined();
    expect(getBadge('')).toBeUndefined();
    expect(getBadge(undefined)).toBeUndefined();
  });
});

describe('MODULE_BADGE_ID', () => {
  it('gates the Scam Spotter badge on Online Scams (02)', () => {
    expect(MODULE_BADGE_ID['02']).toBe('scam-spotter');
  });

  it('gates the renamed POPIA Aware badge on Digital Privacy (03), the module with the real final assessment', () => {
    expect(MODULE_BADGE_ID['03']).toBe('popia-aware');
  });

  it('gives POPIA (01) no badge — its source never authored a standalone final exam for it', () => {
    expect(MODULE_BADGE_ID['01']).toBeUndefined();
  });

  it('only points at badges that exist', () => {
    for (const id of Object.values(MODULE_BADGE_ID)) expect(getBadge(id)).toBeDefined();
  });
});
