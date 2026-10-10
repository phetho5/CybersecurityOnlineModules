import { validateCertificateName } from '@/lib/certificate';

/** The saved name if it is usable, otherwise null. Saved data can be damaged, so anything but a valid name counts as none. */
export function readStudentName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const result = validateCertificateName(value);
  return result.ok ? result.name : null;
}

/** The first word of the name: what Home greets the student by, so a full name doesn't crowd the header. */
export function firstName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.trim().split(/\s+/)[0] || null;
}

/** The greeting with the student's first name after it, or the greeting alone when there is no usable name. */
export function personalGreeting(greeting: string, studentName: unknown): string {
  const name = firstName(readStudentName(studentName));
  return name ? `${greeting}, ${name}` : greeting;
}
