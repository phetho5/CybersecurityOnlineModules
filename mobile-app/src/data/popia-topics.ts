import type { LanguageCode } from '@/i18n';
import { POPIA_NSO, POPIA_NSO_QUIZ } from './popia-topics-nso';
import { POPIA_NSO_AI, POPIA_NSO_AI_QUIZ } from './popia-topics-nso-ai';
import { POPIA_TS, POPIA_TS_QUIZ } from './popia-topics-ts';
import { POPIA_TS_AI, POPIA_TS_AI_QUIZ } from './popia-topics-ts-ai';
import { POPIA_ZU, POPIA_ZU_QUIZ } from './popia-topics-zu';
import type { TopicContent, TopicQuizQuestion } from './topic-types';

// Sourced verbatim from the team's real POPIA and Digital Privacy Module PDFs (Sections 1, 2 and 4 —
// Section 3 and 5 moved to the separate Digital Privacy module). This file holds the English; the
// translations live in popia-topics-{zu,nso,nso-ai,ts,ts-ai}.ts and are wired in below. Topic titles,
// sections and quiz answers are reproduced from the source, not invented; paragraphs are broken into
// bullet items for the shared TopicLesson layout without changing their wording.
export const POPIA_TOPIC_CONTENT: TopicContent[] = [
  {
    n: 1,
    title: 'What is POPIA?',
    intro:
      'Every day you share personal information online without even thinking about it. You fill in your student number to log into the university portal, you enter your phone number to register for an app, and you share your location when ordering food. In South Africa, there is a law that was specifically created to protect you: POPIA.',
    sections: [
      {
        heading: 'What Does POPIA Stand For?',
        items: [
          'POPIA stands for the Protection of Personal Information Act. It is also referred to as Act 4 of 2013, which is the year it was signed into law by the President of South Africa. However, it only came into full effect on 1 July 2021, which is the date from which organisations were legally required to comply with it.',
          'Before POPIA existed, there was very little legal protection for South Africans when it came to how their personal information was collected, stored, and shared. Organisations could gather your data with little accountability. POPIA changed that.',
        ],
      },
      {
        heading: 'Why Did South Africa Need This Law?',
        items: [
          '1. Personal information was being misused — People were receiving unsolicited marketing calls and messages from companies they had never dealt with. In many cases, their contact details had been sold or shared without their knowledge or consent.',
          '2. Data breaches were increasing — As more South Africans moved online for banking, shopping, and communication, the amount of personal data being stored digitally grew rapidly. Without proper legal protections, this data was vulnerable to theft and exposure.',
          '3. South Africa needed to align with global data protection standards — Countries like those in the European Union already had strong data protection laws, such as the GDPR. POPIA positions South Africa in line with these international standards.',
          '4. People had no formal way to hold organisations accountable — Before POPIA, if a company mishandled your personal information, there was no clear legal process to follow. POPIA created the Information Regulator of South Africa specifically to handle this.',
        ],
      },
      {
        heading: 'Who Does POPIA Apply To?',
        items: [
          'Individuals — Any private person who collects or processes the personal information of others, for example someone who runs a small business and keeps a list of customer details, is subject to POPIA.',
          'Private Organisations — This includes businesses, companies, non-profit organisations, and any other private entity that handles personal information as part of their operations.',
          'Government and Public Bodies — Government departments, municipalities, and state institutions are also required to comply with POPIA when they process the personal information of South African citizens.',
          'Important note: POPIA applies when personal information is processed inside South Africa. If a foreign company processes data of South African citizens using equipment located in South Africa, POPIA can apply to them as well.',
        ],
      },
      {
        heading: 'Key Terms You Need to Know',
        items: [
          'Personal Information — Any information that can be used to identify a specific person, including your name, ID number, location data, IP address, browsing habits and biometric data.',
          'Data Subject — The person whose personal information is being collected or processed. As a student, you are a data subject whenever your university or an app collects your details.',
          'Responsible Party — The person or organisation that decides why and how personal information will be processed, and carries the most legal responsibility under POPIA.',
          'Operator — A person or organisation that processes personal information on behalf of the responsible party, following its instructions.',
          'Processing — A broad term covering almost anything done with personal information: collecting, storing, sharing, using, deleting or even just viewing it.',
          'Information Regulator — The independent body established by POPIA to oversee compliance. You can lodge a complaint with them if your information is mishandled.',
        ],
      },
    ],
    example:
      'Imagine you sign up for a new online shopping platform using your name, email address, phone number, and home address. A few weeks later, you start receiving promotional SMS messages from companies you have never heard of and phone calls from people trying to sell you things. What likely happened is that the shopping platform sold or shared your contact details with other businesses without your permission. Under POPIA, this is a violation. You, as the data subject, did not consent to your information being shared for marketing purposes. The shopping platform, as the responsible party, had a legal obligation to protect your information and only use it for the purpose for which it was collected.',
    keyTakeaway: 'This is exactly the kind of situation POPIA was designed to prevent and to give you a way to act on.',
  },
  {
    n: 2,
    title: 'Your Rights as a Data Subject',
    intro:
      'Now that you understand what POPIA is and who it applies to, it is important to know what POPIA actually gives you. As a data subject, you are not powerless. POPIA grants you specific rights that you can exercise whenever an organisation collects or uses your personal information.',
    sections: [
      {
        heading: 'Your 8 Rights Under POPIA',
        items: [
          'Right 1: The Right to be Notified — Before any organisation collects your personal information, they must inform you who they are, why they are collecting it, whether it is voluntary or mandatory, and what happens if you don’t provide it.',
          'Right 2: The Right to Access Your Information — You can ask any organisation what personal information they hold about you, and who has had access to it (a Subject Access Request).',
          'Right 3: The Right to Correct or Delete Your Information — If information held about you is incorrect, outdated, incomplete or misleading, you can request it be corrected or deleted.',
          'Right 4: The Right to Object to Processing — You can object to processing used for direct marketing or that is causing you harm. The organisation must then stop.',
          'Right 5: The Right Not to Have Your Information Sold or Shared Without Consent — An organisation cannot sell or share your personal information with a third party without your knowledge and consent, unless there is a legal basis for doing so.',
          'Right 6: The Right to Know About a Data Breach — If your information is exposed in a security breach, you and the Information Regulator must be notified as soon as reasonably possible.',
          'Right 7: The Right to Lodge a Complaint — You can lodge a formal complaint with the Information Regulator of South Africa if you believe your rights were violated.',
          'Right 8: The Right to Withdraw Consent — You can withdraw previously given consent at any time; the organisation must then stop processing your information for that purpose.',
        ],
      },
      {
        heading: 'What Happens When Your Rights Are Violated?',
        items: [
          'First, contact the organisation directly and put your request in writing to create a record. If they still do not respond or refuse to act, you can lodge a complaint with the Information Regulator.',
          'Organisations found guilty of POPIA violations can face fines of up to R10 million or imprisonment of up to 10 years, depending on the severity of the offence.',
        ],
      },
    ],
    activity: {
      prompt:
        'Interactive Scenario: Spot the Rights Violation\n\nLerato is a third-year student at a South African university. She downloaded a budgeting app and entered her name, student email address, and banking details to track her expenses. She never received any notification about how her data would be used. A month later, she started receiving calls from a loan company she had never contacted. When she called the app’s support line to ask whether her data had been shared, they told her they could not give her that information and that by accepting the terms and conditions she had agreed to everything.\n\nWhich of Lerato’s rights were potentially violated? What should the app have done before collecting her banking details? What steps can Lerato take now?',
      feedback:
        'Knowing these rights means you can recognise when they are being violated and you know what steps to take when that happens.',
    },
    keyTakeaway: 'As a data subject, you are not powerless.',
  },
  {
    n: 3,
    title: 'What Organisations Must Do',
    intro:
      'In the previous topics you learned what POPIA is, what rights it gives you, and how personal data gets misused. This topic shifts the focus to the organisations that collect and use your data. Understanding what organisations are supposed to do helps you recognise when they are falling short and gives you the confidence to hold them accountable.',
    sections: [
      {
        heading: 'The 8 Conditions for Lawful Processing of Personal Information',
        items: [
          'Condition 1: Accountability — The responsible party must ensure all conditions for lawful processing are met, including what their operators do on their behalf.',
          'Condition 2: Processing Limitation — Personal information may only be collected and processed for a specific, lawful purpose, and must be adequate, relevant and not excessive.',
          'Condition 3: Purpose Specification — The organisation must be clear and upfront about why your information is collected, and not keep it longer than necessary.',
          'Condition 4: Further Processing Limitation — A new purpose for your data must be compatible with the original purpose it was collected for.',
          'Condition 5: Information Quality — The organisation must keep the personal information it holds about you accurate, complete and up to date.',
          'Condition 6: Openness — Organisations must have a privacy policy explaining what they collect, why, how long it is kept, and who it is shared with.',
          'Condition 7: Security Safeguards — Appropriate technical and organisational measures (encryption, secure servers, access controls, staff training) must protect your information.',
          'Condition 8: Data Subject Participation — Organisations must give you a way to access, correct or delete your information.',
        ],
      },
      {
        heading: 'What Universities and Apps Must Do Before Collecting Your Data',
        items: [
          'They must identify a lawful purpose for every piece of information requested.',
          'They must notify you of who they are, what they collect, why, whether it is mandatory, and who else might access it.',
          'They must obtain consent where required — freely given, specific, and informed.',
          'They must appoint an Information Officer responsible for ensuring POPIA compliance.',
        ],
      },
      {
        heading: 'How to Read a Privacy Policy',
        body: 'A proper privacy policy should contain:',
        items: [
          'The full name and contact details of the organisation',
          'What personal information is collected and why',
          'The legal basis for collecting and processing your information',
          'How long your information will be kept',
          'Who your information is shared with and under what circumstances',
          'How your information is protected',
          'How you can exercise your rights as a data subject',
          'Contact details for the Information Officer',
        ],
      },
      {
        heading: 'How to Report a POPIA Violation to the Information Regulator',
        items: [
          'Step 1: Contact the organisation in writing, explain the issue, and keep a record of all communication.',
          'Step 2: If the organisation does not respond, submit a formal complaint to the Information Regulator at www.inforegulator.org.za.',
          'Step 3: The Regulator will assess and may launch a formal investigation, with the power to compel compliance and impose penalties of up to R10 million or imprisonment of up to 10 years.',
        ],
      },
    ],
    example:
      'Privacy Policy Extract A: "We collect your name, email address, and phone number when you register on our platform. This information is used solely to create and manage your account and to send you service-related notifications. We do not sell or share your information with third parties without your explicit consent. Your information is stored securely and will be deleted within 30 days of account closure. You may contact our Information Officer at privacy@company.co.za to request access to, correction of, or deletion of your personal information. You have the right to lodge a complaint with the Information Regulator of South Africa if you are not satisfied with how we handle your data."\n\nPrivacy Policy Extract B: "By using our services you agree to our privacy policy. We collect information about you to improve your experience. We may share this information with our partners and affiliates from time to time. We reserve the right to update this policy at any time. For questions, contact us through the app."',
    activity: {
      prompt: 'Checklist Activity: Spot the Compliant Privacy Policy — which extract above is compliant with POPIA?',
      options: ['Extract A', 'Extract B'],
      correctIndex: 0,
      feedback:
        'Extract A is compliant. It clearly states what is collected, why, how long it is kept, who to contact, and how to exercise your rights. Extract B is non-compliant. It uses vague language about sharing with "partners and affiliates", does not specify what information is collected or why, gives no retention period, provides no Information Officer contact details, and reserves the right to change the policy without notice.',
    },
    keyTakeaway:
      'Understanding what organisations are supposed to do helps you recognise when they are falling short and gives you the confidence to hold them accountable.',
  },
];

export const POPIA_TOPIC_QUIZZES: TopicQuizQuestion[][] = [
  [
    {
      text: 'What does POPIA stand for?',
      options: [
        'Protection of Private Information Act',
        'Protection of Personal Information Act',
        'Prevention of Personal Information Abuse',
        'Privacy of Personal and Individual Affairs',
      ],
      correct: 1,
    },
    {
      text: 'A student registers on a food delivery app using their name, phone number, and address. Three days later they receive promotional calls from an insurance company they never contacted. Which term best describes the student in relation to their personal information?',
      options: ['Responsible Party', 'Operator', 'Data Subject', 'Information Regulator'],
      correct: 2,
    },
    {
      text: 'POPIA came into full legal effect in South Africa on which date?',
      options: ['4 April 2013', '1 July 2020', '1 July 2021', '1 January 2022'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Thabo downloaded a shopping app and later found out the app had shared his phone number and home address with a marketing company without telling him. Which POPIA right was most directly violated?',
      options: [
        'The right to correct or delete information',
        'The right to lodge a complaint',
        'The right not to have information sold or shared without consent',
        'The right to withdraw consent',
      ],
      correct: 2,
    },
    {
      text: 'Nomsa contacted a company she previously bought clothes from online and asked them to delete all the personal information they had stored about her. The company ignored her request for three weeks. What right is the company violating?',
      options: [
        'The right to be notified',
        'The right to correct or delete your information',
        'The right to know about a data breach',
        'The right to object to processing',
      ],
      correct: 1,
    },
    {
      text: 'A university student discovers that the online platform they use for assignments suffered a security breach last month, but they were never informed. Which right was violated?',
      options: [
        'The right to withdraw consent',
        'The right to access your information',
        'The right to object to processing',
        'The right to know about a data breach',
      ],
      correct: 3,
    },
  ],
  [
    {
      text: 'A mobile app collects your location data every time you open it, even though the app only provides weather updates for your city. Which of the 8 POPIA conditions does this most likely violate?',
      options: ['Accountability', 'Processing Limitation', 'Security Safeguards', 'Openness'],
      correct: 1,
    },
    {
      text: 'Mandla wants to find out what personal information a company holds about him. Who within the organisation should he contact?',
      options: ['The CEO of the company', "The company's marketing department", 'The Information Officer', 'The Information Regulator'],
      correct: 2,
    },
    {
      text: 'An organisation’s privacy policy states: "We may share your information with selected partners from time to time for business purposes." Why is this statement problematic under POPIA?',
      options: [
        'Organisations are never allowed to share personal information with any third party',
        'The statement is too long and should be summarised',
        'The statement is vague and does not specify who the partners are or the purpose of sharing',
        'Privacy policies do not need to mention third party sharing at all',
      ],
      correct: 2,
    },
  ],
];

// Translations, keyed by language and then topic number. The maps are typed as partial so a topic
// with no translation falls back to English rather than breaking. isiZulu is the team's own
// native-language notes, verbatim. Xitsonga topics 2 and 3 and Sepedi topic 1 are native notes too;
// Xitsonga topic 1 and Sepedi topics 2 and 3 are AI-translated (the *-ai.ts files) at the
// researcher's request, pending native-speaker review. English lives in the arrays above, never in
// these maps.
export const POPIA_TRANSLATED_CONTENT: Partial<Record<LanguageCode, TopicContent[]>> = {
  zu: POPIA_ZU,
  nso: [...POPIA_NSO, ...POPIA_NSO_AI],
  ts: [...POPIA_TS_AI, ...POPIA_TS],
};

export const POPIA_TRANSLATED_QUIZZES: Partial<Record<LanguageCode, Record<number, TopicQuizQuestion[]>>> = {
  zu: POPIA_ZU_QUIZ,
  nso: { ...POPIA_NSO_QUIZ, ...POPIA_NSO_AI_QUIZ },
  ts: { ...POPIA_TS_AI_QUIZ, ...POPIA_TS_QUIZ },
};

/** The topic in `lang` where a translation exists, otherwise the English topic — never undefined for a valid `n`. */
export function getPopiaTopicContent(n: number, lang: LanguageCode = 'en'): TopicContent | undefined {
  const english = POPIA_TOPIC_CONTENT.find((t) => t.n === n);
  if (!english) return undefined;
  return POPIA_TRANSLATED_CONTENT[lang]?.find((t) => t.n === n) ?? english;
}

/** The knowledge check in `lang` where a translation exists, otherwise the English one. */
export function getPopiaTopicQuiz(n: number, lang: LanguageCode = 'en'): TopicQuizQuestion[] | undefined {
  if (!(n >= 1 && n <= POPIA_TOPIC_QUIZZES.length)) return undefined;
  return POPIA_TRANSLATED_QUIZZES[lang]?.[n] ?? POPIA_TOPIC_QUIZZES[n - 1];
}
