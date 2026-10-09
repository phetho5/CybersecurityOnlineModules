import type { LanguageCode } from '@/i18n';
import { DIGITAL_PRIVACY_NSO_AI, DIGITAL_PRIVACY_NSO_AI_QUIZ } from './digital-privacy-topics-nso-ai';
import { DIGITAL_PRIVACY_TS, DIGITAL_PRIVACY_TS_QUIZ } from './digital-privacy-topics-ts';
import { DIGITAL_PRIVACY_ZU, DIGITAL_PRIVACY_ZU_QUIZ } from './digital-privacy-topics-zu';
import type { Question } from './quiz';
import type { TopicContent, TopicQuizQuestion } from './topic-types';

// Sourced verbatim from the team's real POPIA and Digital Privacy Module PDFs (Sections 3 and 5 —
// Sections 1, 2 and 4 moved to the separate POPIA module). This file holds the English; the
// translations live in digital-privacy-topics-{zu,ts,nso-ai}.ts and are wired in below. Topic titles,
// sections and quiz answers are reproduced from the source, not invented; paragraphs are broken into
// bullet items for the shared TopicLesson layout without changing their wording.
export const DIGITAL_PRIVACY_TOPIC_CONTENT: TopicContent[] = [
  {
    n: 1,
    title: 'How Your Data Gets Misused',
    intro:
      'You now know what POPIA is and what rights it gives you. But knowing your rights is only useful if you can recognise when something is going wrong in the first place. Data misuse does not always look obvious. Sometimes it happens because of carelessness, and sometimes it is deliberate.',
    sections: [
      {
        heading: 'What Counts as Sensitive Personal Information?',
        body: 'POPIA calls this "special personal information" because misuse of it can cause serious harm. It includes:',
        items: [
          'Religious or philosophical beliefs',
          'Race or ethnic origin',
          'Trade union membership',
          'Political persuasion',
          'Health or sex life',
          'Biometric information such as fingerprints and facial recognition data',
          'Criminal behaviour',
        ],
      },
      {
        heading: 'Common Ways Students Unknowingly Share Personal Data',
        items: [
          'Online forms and sign-ups — many platforms ask for more than they actually need. Always ask whether the information requested is actually necessary for the service.',
          'Social media — your full name, location, place of study, workplace and daily routine can be pieced together from your posts. Cybercriminals use this to build profiles on potential victims.',
          'WhatsApp groups — university society, class and community groups often share ID numbers, student numbers, bank details and proof-of-payment screenshots. Once it’s in a group chat, you have no control over who screenshots or shares it further.',
          'Accepting terms and conditions without reading them — many apps’ T&Cs allow the company to share your data with third parties, use it for targeted advertising, or retain it even after you delete your account.',
          'Free public Wi-Fi — using unsecured Wi-Fi exposes your device and transmitted data to interception, including banking app or university portal credentials.',
          'Phishing links — fake messages or emails that look legitimate and trick you into entering your details on a fake website, often impersonating banks, SASSA, or university portals.',
        ],
      },
      {
        heading: 'What Do Data Breaches Look Like in Practice?',
        body: 'A data breach happens when personal information is accessed, disclosed, or lost without authorisation. Breaches can happen because of:',
        items: [
          'A company employee accidentally sending an email with personal data to the wrong person',
          'A database being left unsecured and publicly accessible online',
          'A cyberattack where criminals steal stored data',
          'A lost or stolen laptop or phone that was not password protected',
          'An insider threat where an employee deliberately leaks or sells data',
          'When a breach happens, the personal information involved can be used to open fraudulent bank accounts, apply for loans in your name, or impersonate you online.',
        ],
      },
      {
        heading: 'Real South African Examples',
        items: [
          'The Experian Breach (2020) — the personal information of approximately 24 million South Africans and 793 000 businesses was exposed after a fraudster posed as a legitimate client and requested the data. This showed that even large, trusted organisations are vulnerable.',
          'The SASSA SMS Scam — many grant recipients received fraudulent SMS messages claiming to be from SASSA, asking them to update their banking details by clicking a link or calling a number. People who responded had their accounts emptied.',
          'University Student Data Exposure — several South African universities have experienced incidents where student academic records and contact details were leaked, improperly handled, or shared with third parties without proper consent.',
        ],
      },
      {
        heading: 'What Went Wrong (Sipho’s WhatsApp Group Mistake)',
        items: [
          'Sipho shared sensitive documents in a group where he did not know all the members.',
          'His personal information was used by a criminal to build a convincing impersonation.',
          'He did not verify the caller’s identity through official university channels.',
        ],
      },
      {
        heading: 'What Sipho Should Have Done',
        items: [
          'Questioned why a student society needed his ID number and full registration documents.',
          'Never shared sensitive documents in a group chat.',
          'Ended the suspicious call and contacted the financial aid office directly using the official university website.',
        ],
      },
    ],
    example:
      'Scenario: The WhatsApp Group Mistake. Sipho is a second-year student at a South African university. He joins a WhatsApp group for a student society and is asked to send his student number, ID number, and proof of registration to confirm his membership. He sends the documents without thinking twice because everyone else in the group is doing the same. A few weeks later, Sipho receives a call from someone claiming to be from the university’s financial aid office. The caller already knows his student number and full name and asks him to confirm his banking details to process a bursary payment he was not expecting. Sipho, believing the caller is legitimate, provides his banking information. His account is emptied the next day.',
    keyTakeaway: 'Data misuse does not always look obvious. Sometimes it happens because of carelessness, and sometimes it is deliberate.',
  },
  {
    n: 2,
    title: 'Protecting Your Digital Privacy',
    intro:
      'Throughout this module you have learned what POPIA is, what rights it gives you, how data gets misused, and what organisations are legally required to do. This final topic brings everything together: the most practical thing you can do is take steps to actively protect your own digital privacy.',
    sections: [
      {
        heading: 'Practical Steps to Protect Your Personal Information',
        items: [
          'Think before you share — ask yourself: does this organisation actually need this information, is there a legitimate reason, and what could happen if it ended up in the wrong hands?',
          'Limit what you share on social media — your full date of birth, home address, phone number, and ID number should never appear on a public profile.',
          'Read privacy policies before accepting — scan for what is collected, whether it is shared with third parties, how long it is kept, and how to request deletion.',
          'Only download apps from trusted sources — use the official Google Play Store or Apple App Store, and check an app’s permissions before installing.',
          'Use strong and unique passwords — at least 12 characters, combining uppercase, lowercase, numbers and special characters. Consider a reputable password manager.',
          'Enable two-factor authentication — on your email, banking app, and any account with sensitive information.',
          'Be careful on public Wi-Fi — avoid sensitive accounts on unsecured networks, or use a VPN.',
          'Verify before you click — contact the organisation directly using a number or email from their official website, never from the message itself.',
          'Review app permissions regularly — revoke any permission an app does not need for its core function.',
          'Log out of shared devices — always log out completely, and clear browsing history and cached data where possible.',
        ],
      },
      {
        heading: 'Understanding What You Agree to When Accepting Terms and Conditions',
        items: [
          'Data sharing with third parties — many services include a clause allowing them to share your information with partners, affiliates, or service providers, sometimes for advertising.',
          'Retention of data after account deletion — some services keep your data for months or years after you delete your account, often phrased as "as long as necessary for business purposes".',
          'The right to change terms without notice — many services can update their terms at any time, with continued use counting as acceptance.',
        ],
      },
      {
        heading: 'Where to Report Concerns in South Africa',
        items: [
          'Step 1: Contact the organisation directly in writing, addressed to their Information Officer, and keep a copy of everything sent and received.',
          'Step 2: Contact the Information Regulator of South Africa — www.inforegulator.org.za, inforeg@justice.gov.za, JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001, telephone 010 023 5207.',
          'Step 3: Seek legal advice if the matter involves significant harm such as identity theft or financial loss. Legal Aid South Africa provides free legal assistance to qualifying individuals.',
        ],
      },
      {
        heading: 'Personal Privacy Audit Checklist',
        body: 'This is not submitted or graded. It is a tool to help you identify where you can improve your own digital privacy habits:',
        items: [
          'I use unique passwords for different accounts',
          'I have enabled 2FA on my email and banking apps',
          'I review app permissions on my phone regularly',
          'I avoid using public Wi-Fi for sensitive accounts',
          'I check the sender details before clicking links in messages',
          'I read or scan privacy policies before signing up',
          'I log out of shared or public computers after use',
          'I avoid sharing sensitive documents in group chats',
          'I know how to contact the Information Regulator if needed',
          'I know who the Information Officer is for services I use',
        ],
      },
    ],
    keyTakeaway: 'Small consistent changes make a big difference over time.',
  },
];

export const DIGITAL_PRIVACY_TOPIC_QUIZZES: TopicQuizQuestion[][] = [
  [
    {
      text: 'Zanele is in a university WhatsApp group where students are asked to share their ID numbers and proof of registration to join a campus society. What is the main risk in this situation?',
      options: [
        'WhatsApp does not support document sharing',
        'The university society does not have the right to collect this information',
        "Zanele's phone will be hacked immediately",
        'The documents will be deleted automatically',
      ],
      correct: 1,
    },
    {
      text: 'Which of the following best describes a phishing attack?',
      options: [
        'A criminal physically stealing your phone to access your personal information',
        'A company legally collecting your data through their app without informing you',
        'A fake message or website designed to trick you into providing your personal details',
        'A data breach caused by a company employee losing a laptop',
      ],
      correct: 2,
    },
    {
      text: 'In the Experian data breach of 2020, how did the criminal obtain the personal data of millions of South Africans?',
      options: [
        "By hacking into Experian's computer systems overnight",
        'By posing as a legitimate client and requesting the data',
        "By stealing physical files from Experian's offices",
        'By intercepting data sent over public Wi-Fi networks',
      ],
      correct: 1,
    },
  ],
  [
    {
      text: 'Which of the following is the most secure password?',
      options: ['Sipho1998', 'password123', 'UP@Student', 'Tr!angle92Blue#'],
      correct: 3,
    },
    {
      text: 'Thandi receives a WhatsApp message from what appears to be her bank, asking her to click a link and confirm her account details to avoid suspension. What should she do?',
      options: [
        'Click the link immediately to avoid her account being suspended',
        'Reply to the message with her account details',
        'Ignore the message and contact her bank directly using the number on their official website',
        'Forward the message to her family members to warn them',
      ],
      correct: 2,
    },
    {
      text: 'What does two-factor authentication do?',
      options: [
        'It creates two separate accounts for extra security',
        'It requires a second form of verification in addition to your password',
        'It doubles the length of your password automatically',
        'It blocks all login attempts from unknown devices permanently',
      ],
      correct: 1,
    },
    {
      text: 'A student notices that a flashlight app on their phone is requesting access to their contacts, microphone, and location. What should they do?',
      options: [
        'Grant all permissions because the app needs them to function properly',
        'Delete the app immediately without checking further',
        'Deny the unnecessary permissions and only allow what the app actually needs',
        'Report the app to their university IT department',
      ],
      correct: 2,
    },
    {
      text: 'Mpho wants to lodge a complaint about how a company handled his personal information. He already contacted the company but they did not respond. What is his next step?',
      options: [
        'Post about it on social media to warn others',
        'Accept that nothing can be done and move on',
        'Take the company to the High Court immediately',
        'Lodge a formal complaint with the Information Regulator of South Africa',
      ],
      correct: 3,
    },
    {
      text: 'Which of the following is a warning sign in a privacy policy?',
      options: [
        'The policy states how long your data will be kept',
        'The policy provides contact details for the Information Officer',
        'The policy says "we may share your data with selected partners from time to time" without specifying who',
        'The policy explains your right to request deletion of your information',
      ],
      correct: 2,
    },
    {
      text: 'Why should you avoid using the same password for multiple accounts?',
      options: [
        'Websites do not allow duplicate passwords across different platforms',
        'If one account is compromised, all accounts using the same password become vulnerable',
        'Passwords expire faster when they are reused',
        'Search engines track repeated passwords and flag them as suspicious',
      ],
      correct: 1,
    },
    {
      text: 'Lerato is using the free Wi-Fi at a shopping centre to check her banking app. What is the main risk?',
      options: [
        'Shopping centre Wi-Fi is too slow for banking apps to work properly',
        'Her bank may charge her extra fees for using public Wi-Fi',
        'Someone on the same network could potentially intercept her data',
        'Her phone battery will drain faster on public Wi-Fi',
      ],
      correct: 2,
    },
    {
      text: 'What should you do immediately after using a shared computer to access your university portal?',
      options: [
        'Restart the computer',
        'Change your university portal password from your phone',
        'Log out completely and clear the browsing history and cached data',
        'Nothing, the session will expire on its own',
      ],
      correct: 2,
    },
    {
      text: 'Which of the following best describes the purpose of POPIA as a whole?',
      options: [
        'To prevent South Africans from using the internet for personal activities',
        'To protect individuals by regulating how organisations collect, store, use, and share personal information',
        'To give the government access to all personal information stored by private companies',
        'To allow organisations to collect any information they need as long as they store it securely',
      ],
      correct: 1,
    },
  ],
];

// Translations, keyed by language and then topic number. isiZulu and Xitsonga are the team's own
// native-language notes, verbatim. Sepedi has no native source for this module and is AI-translated
// (digital-privacy-topics-nso-ai.ts) at the researcher's request. English lives in the arrays above,
// never in these maps.
export const DIGITAL_PRIVACY_TRANSLATED_CONTENT: Partial<Record<LanguageCode, TopicContent[]>> = {
  zu: DIGITAL_PRIVACY_ZU,
  nso: DIGITAL_PRIVACY_NSO_AI,
  ts: DIGITAL_PRIVACY_TS,
};

export const DIGITAL_PRIVACY_TRANSLATED_QUIZZES: Partial<Record<LanguageCode, Record<number, TopicQuizQuestion[]>>> = {
  zu: DIGITAL_PRIVACY_ZU_QUIZ,
  nso: DIGITAL_PRIVACY_NSO_AI_QUIZ,
  ts: DIGITAL_PRIVACY_TS_QUIZ,
};

/** The topic in `lang` where a translation exists, otherwise the English topic — never undefined for a valid `n`. */
export function getDigitalPrivacyTopicContent(n: number, lang: LanguageCode = 'en'): TopicContent | undefined {
  const english = DIGITAL_PRIVACY_TOPIC_CONTENT.find((t) => t.n === n);
  if (!english) return undefined;
  return DIGITAL_PRIVACY_TRANSLATED_CONTENT[lang]?.find((t) => t.n === n) ?? english;
}

/** The knowledge check in `lang` where a translation exists, otherwise the English one. */
export function getDigitalPrivacyTopicQuiz(n: number, lang: LanguageCode = 'en'): TopicQuizQuestion[] | undefined {
  if (!(n >= 1 && n <= DIGITAL_PRIVACY_TOPIC_QUIZZES.length)) return undefined;
  return DIGITAL_PRIVACY_TRANSLATED_QUIZZES[lang]?.[n] ?? DIGITAL_PRIVACY_TOPIC_QUIZZES[n - 1];
}

/**
 * The topic 2 final assessment (Section 5's real 10-question, 7/10-to-pass exam), adapted into the
 * shape the shared scoreQuiz/result-screen pipeline expects. The source gives no per-question topic
 * label, so `area`/`topic` use the topic's own title rather than an invented per-question label.
 */
export function getDigitalPrivacyFinalAssessment(lang: LanguageCode = 'en'): Question[] {
  const quiz = getDigitalPrivacyTopicQuiz(2, lang) ?? [];
  const area = getDigitalPrivacyTopicContent(2, lang)?.title ?? 'Digital Privacy';
  return quiz.map((q) => ({
    topic: area,
    area,
    text: q.text,
    options: q.options,
    correct: q.correct,
    explain: '',
  }));
}
