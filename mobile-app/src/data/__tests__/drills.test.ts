import { DRILLS, getDrills } from '@/data/drills';

describe('getDrills', () => {
  it('returns the original English examples for English and when no language is given', () => {
    expect(getDrills()).toBe(DRILLS);
    expect(getDrills('en')).toBe(DRILLS);
  });

  it.each(['zu', 'nso', 'ts'] as const)('returns the same three examples in %s', (lang) => {
    const drills = getDrills(lang);
    expect(drills).toHaveLength(DRILLS.length);
    drills.forEach((drill, i) => {
      expect(drill.channel).toBe(DRILLS[i].channel);
      // The right answer must never change with the language.
      expect(drill.isScam).toBe(DRILLS[i].isScam);
      expect(drill.body).not.toBe(DRILLS[i].body);
      expect(drill.explain).not.toBe(DRILLS[i].explain);
      expect(drill.body.trim()).toBe(drill.body);
      expect(drill.explain.length).toBeGreaterThan(0);
    });
  });

  it.each(['zu', 'nso', 'ts'] as const)('keeps the details a student must judge unchanged in %s', (lang) => {
    const [sars, family, university] = getDrills(lang);
    expect(sars.body).toContain('sars-refund-claim.net/za');
    expect(sars.body).toContain('R7 214,00');
    expect(sars.explain).toContain('sars.gov.za');
    expect(family.from).toBe('+27 72 118 4406');
    expect(family.body).toContain('R900');
    expect(university.from).toBe('no-reply@up.ac.za');
  });
});
