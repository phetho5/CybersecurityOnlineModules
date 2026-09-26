export type Question = {
  topic: string;
  area: string;
  text: string;
  options: string[];
  correct: number;
  explain: string;
};

export const QUESTIONS: Question[] = [
  {
    topic: 'WhatsApp',
    area: 'Fake bank alerts',
    text: 'A "bank" WhatsApp asks you to confirm your identity. What may you never send?',
    options: ['Your full name', 'Your card PIN or OTP', 'Your branch city', 'Your account holder title'],
    correct: 1,
    explain:
      'No South African bank asks for a PIN or OTP on any channel. Sharing one voids most fraud claims.',
  },
  {
    topic: 'POPIA',
    area: 'POPIA & consent',
    text: 'A campus society sells its member list to a marketing firm without asking. Under POPIA this is…',
    options: [
      'Allowed if the list is public',
      'Allowed with a disclaimer',
      'Unlawful processing — no consent for that purpose',
      'Only a problem for companies',
    ],
    correct: 2,
    explain:
      'POPIA requires a lawful purpose and consent. Processing for a new purpose needs fresh consent, and you may complain to the Information Regulator.',
  },
  {
    topic: 'Delivery scams',
    area: 'Delivery & SMS scams',
    text: 'An SMS says your PEP parcel is held and needs R58 for re-delivery. Best first move?',
    options: [
      'Pay — it is a small amount',
      'Open the link to check the tracking',
      "Check the order in the retailer's own app",
      'Reply STOP',
    ],
    correct: 2,
    explain:
      'Go back to the source you trust. Re-delivery-fee SMSes are the most reported delivery scam in South Africa.',
  },
];

export const PASS_MARK = 70;
