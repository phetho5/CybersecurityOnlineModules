import { firstName, personalGreeting, readStudentName } from '@/lib/student-name';

describe('readStudentName — the saved name, or nothing', () => {
  it('returns a saved name as it is', () => {
    expect(readStudentName('Thandi Nkosi')).toBe('Thandi Nkosi');
  });

  it('tidies stray spaces in a saved name', () => {
    expect(readStudentName('  Thandi   Nkosi ')).toBe('Thandi Nkosi');
  });

  it.each([null, undefined, '', '    '])('treats %p as no name', (value) => {
    expect(readStudentName(value)).toBeNull();
  });

  it.each([42, {}, [], true])('treats a damaged saved value (%p) as no name instead of crashing', (value) => {
    expect(readStudentName(value)).toBeNull();
  });

  it('treats a saved name that breaks the rules (one letter, or far too long) as no name', () => {
    expect(readStudentName('T')).toBeNull();
    expect(readStudentName('a'.repeat(200))).toBeNull();
  });
});

describe('firstName — what Home greets the student by', () => {
  it('takes the first word of a full name', () => {
    expect(firstName('Thandi Nkosi')).toBe('Thandi');
  });

  it('keeps a single name whole', () => {
    expect(firstName('Thandi')).toBe('Thandi');
  });

  it('keeps a double-barrelled first name together', () => {
    expect(firstName('Mary-Jane van der Merwe')).toBe('Mary-Jane');
  });

  it('ignores spaces in front of the name', () => {
    expect(firstName('   Sipho  Dlamini')).toBe('Sipho');
  });

  it.each([null, undefined, '', '   ', 42])('gives nothing for %p', (value) => {
    expect(firstName(value)).toBeNull();
  });
});

describe('personalGreeting', () => {
  it('adds the first name after the greeting', () => {
    expect(personalGreeting('Good afternoon', 'Thandi Nkosi')).toBe('Good afternoon, Thandi');
    expect(personalGreeting('Sawubona', 'Sipho')).toBe('Sawubona, Sipho');
  });

  it.each([null, undefined, '', '  ', 42])('leaves the greeting alone when the name is %p', (value) => {
    expect(personalGreeting('Thobela', value)).toBe('Thobela');
  });
});
