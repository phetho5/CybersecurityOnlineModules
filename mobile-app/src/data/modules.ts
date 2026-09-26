export type ModuleDef = {
  id: string;
  title: string;
  lessonCount: number;
  minutes: number;
};

export const MODULES: ModuleDef[] = [
  { id: '01', title: 'POPIA & Your Personal Data', lessonCount: 4, minutes: 25 },
  { id: '02', title: 'WhatsApp Scams in South Africa', lessonCount: 5, minutes: 30 },
  { id: '03', title: 'SMS & Delivery Scams', lessonCount: 4, minutes: 20 },
  { id: '04', title: 'Email Phishing at University', lessonCount: 6, minutes: 35 },
  { id: '05', title: 'The Cybercrimes Act', lessonCount: 3, minutes: 18 },
];

export function getModule(id: string): ModuleDef | undefined {
  return MODULES.find((m) => m.id === id);
}
