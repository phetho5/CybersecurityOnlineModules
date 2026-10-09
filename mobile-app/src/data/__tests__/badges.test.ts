import { BADGES, MODULE_BADGE_ID } from '@/data/badges';

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
});
