import { getModule, MODULES } from '@/data/modules';

describe('MODULES', () => {
  it('has exactly 3 modules: POPIA, Online Scams, Digital Privacy', () => {
    expect(MODULES.map((m) => m.id)).toEqual(['01', '02', '03']);
  });

  it('gives POPIA (01) 3 lessons, matching its 3 sourced topics', () => {
    const mod = getModule('01');
    expect(mod?.title).toBe('POPIA & Your Personal Data');
    expect(mod?.lessonCount).toBe(3);
  });

  it('gives the Online Scams module (02) 9 lessons, matching its 9 source topics', () => {
    const mod = getModule('02');
    expect(mod?.title).toBe('Online Scams');
    expect(mod?.lessonCount).toBe(9);
  });

  it('gives Digital Privacy (03) 2 lessons, matching its 2 sourced topics', () => {
    const mod = getModule('03');
    expect(mod?.title).toBe('Digital Privacy');
    expect(mod?.lessonCount).toBe(2);
  });

  it('no longer resolves the retired placeholder/Cybercrimes Act module ids', () => {
    // 04/05 were retired when module 02 became Online Scams; the old module 03 (Cybercrimes Act)
    // was dropped entirely when its real data (03) became Digital Privacy instead.
    expect(getModule('04')).toBeUndefined();
    expect(getModule('05')).toBeUndefined();
  });
});

describe('getModule', () => {
  it('returns undefined for an unknown module id instead of throwing', () => {
    expect(getModule('99')).toBeUndefined();
  });
});
