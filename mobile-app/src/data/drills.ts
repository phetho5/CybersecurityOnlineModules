export type Drill = {
  channel: 'SMS' | 'WhatsApp' | 'Email';
  from: string;
  body: string;
  isScam: boolean;
  explain: string;
};

export const DRILLS: Drill[] = [
  {
    channel: 'SMS',
    from: 'Unknown short code',
    body: 'SARS: Your tax refund of R7 214,00 is ready. Claim within 24h: sars-refund-claim.net/za',
    isScam: true,
    explain: 'SARS never sends refund links by SMS, and the domain is not sars.gov.za.',
  },
  {
    channel: 'WhatsApp',
    from: '+27 72 118 4406',
    body:
      'Hi mom, I dropped my phone. This is my new number. Can you send R900 to this account, I will explain later.',
    isScam: true,
    explain:
      'The classic family-impersonation scam. Phone the old number, or ask something only they would know.',
  },
  {
    channel: 'Email',
    from: 'no-reply@up.ac.za',
    body: 'Your UP password expires in 5 days. Change it from the portal you normally use — this mail contains no links.',
    isScam: false,
    explain:
      'Correct domain and, crucially, no link to click. Legitimate notices send you to a portal you already know.',
  },
];
