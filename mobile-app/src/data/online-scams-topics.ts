import type { LanguageCode } from '@/i18n';
import type { Question } from './quiz';
import type { TopicActivity, TopicContent, TopicQuizQuestion, TopicScenario, TopicSection } from './topic-types';

export type { TopicActivity, TopicContent, TopicQuizQuestion, TopicScenario, TopicSection };

const EN: TopicContent[] = [
  {
    n: 1,
    title: 'Introduction to Online Scams',
    intro:
      'Online scams are deceptive activities designed to trick people into giving away money, personal information, account credentials, or access to digital accounts. Scammers use WhatsApp, SMS and email to make fraudulent messages appear legitimate.',
    sections: [
      {
        heading: 'What Is an Online Scam?',
        body: 'An online scam occurs when someone deliberately uses deception through a digital platform to persuade another person to take an action that benefits the scammer.',
        items: [
          'Sending money.',
          'Sharing personal information.',
          'Revealing passwords, PINs or OTPs.',
          'Clicking a malicious or suspicious link.',
          'Downloading an unsafe attachment.',
          'Providing access to an online account.',
        ],
      },
      {
        heading: 'How Do Online Scams Work?',
        items: [
          'Attract attention.',
          'Build trust.',
          'Create pressure.',
          'Request an action.',
          'Benefit from the response.',
        ],
      },
      {
        heading: 'Why Do People Fall for Scams?',
        items: [
          'Trust the apparent sender.',
          'Fear losing money or account access.',
          'Become excited about a reward.',
          'Feel pressured by an urgent deadline.',
          'Are curious about a message.',
          'Believe the message is from an authority or trusted organisation.',
        ],
      },
    ],
    example:
      'STUDENT FUNDING NOTICE: URGENT: Your student allowance has been approved. Confirm your banking details within 30 minutes to avoid cancellation. Click here to continue.',
    activity: {
      prompt:
        'Activity: Spot the Scam — what makes the example above suspicious? Unexpected financial benefit, urgent deadline, request for personal/financial information, a link requiring immediate action.',
      feedback:
        'An unexpected financial offer combined with urgency and a request for information should be independently verified before action is taken.',
    },
    keyTakeaway: 'STOP → THINK → VERIFY',
  },
  {
    n: 2,
    title: 'WhatsApp Scams',
    intro:
      'WhatsApp is widely used for personal, academic and social communication. This familiarity can be exploited by scammers who impersonate people or organisations.',
    sections: [
      {
        heading: 'Common Types',
        items: [
          'Impersonation of friends, family, lecturers or organisations.',
          'Fake jobs, bursaries, competitions or rewards.',
          'Suspicious links.',
          'Emergency money requests.',
          'Requests for passwords, PINs or OTPs.',
        ],
      },
      {
        heading: 'Warning Signs',
        items: [
          'Unexpected requests',
          'Urgent language',
          'Requests for money',
          'Requests for sensitive information',
          'Suspicious links',
          'Unusual sender behaviour',
          'Unexpected rewards',
          'Impersonation',
        ],
      },
    ],
    example:
      "Hey, it's me. I lost my phone and I'm using this number temporarily. Please send me R800 urgently. I'll pay you back tonight.",
    activity: {
      prompt: 'Interactive Activity — what should you do?',
      options: [
        'Send money.',
        'Ask for banking details.',
        'Contact your friend through a trusted channel.',
        'Forward the message.',
      ],
      feedback:
        'A familiar name or profile picture does not prove identity. Verify unexpected requests independently.',
    },
    keyTakeaway: 'Trust the person only after you verify the request.',
  },
  {
    n: 3,
    title: 'SMS Scams',
    intro:
      'SMS scams use text messages to persuade recipients to take unsafe actions. They may appear to come from banks, delivery companies, mobile providers, government organisations or other trusted services.',
    sections: [
      {
        heading: 'Common Types',
        items: ['Fake banking alerts', 'Fake delivery messages', 'Fake rewards', 'Fake account warnings'],
      },
      {
        heading: 'Warning Signs',
        items: [
          'Unexpected messages',
          'Urgent deadlines',
          'Suspicious links',
          'Requests for personal/banking information',
          'Unexpected payments',
          'Threats of account closure',
          'Offers too good to be true',
        ],
      },
    ],
    example: 'URGENT! Your bank account will be blocked today. Confirm your account now: [link]',
    activity: {
      prompt: 'Interactive Activity — identify the warning signs in the example above.',
      feedback:
        'The message creates urgency, claims to represent a financial institution and directs the user to a link. Verify through an official channel instead.',
    },
    keyTakeaway: 'Never allow an SMS to pressure you into an immediate financial or account decision.',
  },
  {
    n: 4,
    title: 'Email Scams',
    intro:
      'Email scams attempt to deceive users through fraudulent emails. They may imitate banks, universities, employers, online stores or other organisations.',
    sections: [
      {
        heading: 'What to Examine',
        items: ['Sender address', 'Subject line', 'Message content', 'Links', 'Attachments', 'Requests'],
      },
      {
        heading: 'Warning Signs',
        items: [
          'Unexpected sender',
          'Urgent/threatening subject',
          'Credential request',
          'Suspicious links',
          'Unexpected attachments',
          'Unusual request',
        ],
      },
    ],
    example:
      'Subject: "URGENT – University Account Suspension"\n\n"Your university account will be suspended today. Click the link below and confirm your password."',
    activity: {
      prompt: 'Interactive Activity — identify the sender, request, urgency, link and credential request.',
      feedback:
        'The email uses fear and urgency to encourage disclosure of credentials. Do not provide passwords through unexpected email requests; verify through an official channel.',
    },
    keyTakeaway: 'Do not trust an email simply because it looks professional. Examine the sender, request, links and context.',
  },
  {
    n: 5,
    title: 'How Scammers Manipulate Victims',
    intro: 'Scammers use social engineering and psychological manipulation to influence how people make decisions.',
    sections: [
      {
        heading: 'Common Manipulation Techniques',
        items: [
          'Urgency – creates pressure and reduces time for verification.',
          'Fear – threatens a negative consequence.',
          'Authority – impersonates a trusted authority.',
          'Reward – uses excitement or financial incentive.',
          'Curiosity – encourages clicking to discover something.',
          'Trust and familiarity – impersonates someone the victim knows.',
        ],
      },
    ],
    example: 'Your student account will be cancelled today unless you verify your information immediately.',
    activity: {
      prompt: 'Activity: Identify the Manipulation Technique',
      options: ['Reward', 'Fear and urgency', 'Curiosity', 'Entertainment'],
      correctIndex: 1,
      feedback: 'The message uses fear of cancellation and urgency to pressure the recipient.',
    },
    keyTakeaway: 'Scammers often manipulate emotions before asking victims to take an unsafe action.',
  },
  {
    n: 6,
    title: 'Investigating a Suspicious Message',
    intro: 'Recognising that a message feels suspicious is useful, but students also need a systematic way to investigate it.',
    sections: [
      {
        heading: 'A Practical Investigation Process',
        items: [
          'STOP – Do not immediately click, reply, pay or provide information.',
          'CHECK THE SENDER – Ask who sent it, whether it is expected and whether impersonation is possible.',
          'EXAMINE THE REQUEST – Identify what the sender wants and whether money or sensitive information is requested.',
          'CHECK THE DETAILS – Examine links, addresses, attachments, sender information and unusual language.',
          'IDENTIFY WARNING SIGNS – Look for urgency, threats, rewards, impersonation and other indicators.',
          'IDENTIFY MANIPULATION – Ask what the message is trying to make you feel.',
          'VERIFY – Use an independent trusted source.',
          'DECIDE – Choose the safest action: ignore/delete, report, contact the legitimate organisation, secure an account or seek assistance.',
        ],
      },
    ],
    example: 'URGENT: Your university account has been suspended. Click here within 15 minutes to restore access.',
    activity: {
      prompt: 'Activity: Investigate This Message',
      feedback:
        'The message contains urgency, impersonation and a request to click a link. Independently verify the claim rather than clicking the provided link.',
    },
    keyTakeaway: 'Don’t simply ask "Does this look real?" Ask "Can I verify that it is real?"',
  },
  {
    n: 7,
    title: 'AI-Assisted Scam Investigation',
    intro:
      'AI can assist in analysing suspicious digital communications. However, AI should not be treated as an infallible authority. In this module, AI is proposed as a learning assistant: its purpose is to help students understand indicators and reasoning, not simply label a message.',
    sections: [
      {
        heading: 'What Can the Student Submit?',
        items: ['Pasted WhatsApp messages', 'SMS text', 'Email content', 'Screenshots', 'Other suspicious digital communication'],
      },
      {
        heading: 'How the AI-Assisted Investigation Works',
        items: [
          'Student submits the suspicious communication.',
          'Student makes an initial judgement and explains why.',
          'AI analyses the content.',
          'System identifies potential indicators such as urgency, impersonation, suspicious links, financial requests, sensitive-information requests and manipulative language.',
          'AI explains the indicators.',
          'Student compares their reasoning with the feedback.',
          'Student receives a new scenario to apply what they learned.',
        ],
      },
      {
        heading: 'AI Limitations',
        items: [
          'AI can make mistakes.',
          'A "safe" classification does not guarantee safety.',
          'A "suspicious" classification does not automatically prove fraud.',
          'Important decisions should be independently verified.',
          'AI output is assistance, not definitive proof.',
        ],
      },
      {
        heading: 'Privacy and Safe Submission',
        body: 'Where possible, identifying information should be removed before submission. Never submit:',
        items: ['Passwords', 'OTPs', 'Banking details', 'Identity numbers', 'Private conversations', 'Unnecessary personal information'],
      },
    ],
    example:
      'URGENT! Your student funding has been suspended. Verify your account within 30 minutes using this link.\n\nUrgency – a 30-minute deadline. Impersonation – claims to represent a student funding organisation. Suspicious link – directs the student to a link rather than an independently verified official website.',
    activity: {
      prompt:
        'Activity: Investigate With AI — make your own assessment, identify at least two warning signs, submit the content to the AI-assisted tool, compare your assessment with the AI analysis, identify something you noticed and something you initially missed, then complete a new scenario.',
      feedback: 'Use AI to support your investigation, not to replace your judgement.',
    },
    keyTakeaway: 'Use AI to support your investigation, not to replace your judgement.',
  },
  {
    n: 8,
    title: 'Responding to an Online Scam',
    intro:
      'Identifying a scam is only one part of staying safe. Students also need to know what to do when they encounter a suspicious message or realise that they may have interacted with a scam.',
    sections: [
      {
        heading: 'If You Receive a Suspicious Message — Do Not',
        items: [
          'Click suspicious links.',
          'Download unexpected attachments.',
          'Send money.',
          'Provide passwords or OTPs.',
          'Continue communicating with the scammer unnecessarily.',
        ],
      },
      {
        heading: 'If You Receive a Suspicious Message — Do',
        items: [
          'Stop and assess the message.',
          'Verify the information independently.',
          'Report suspicious content where appropriate.',
          'Delete or block the sender where appropriate.',
        ],
      },
      {
        heading: 'If You Have Already Responded',
        items: [
          'Stop further communication.',
          'Secure affected accounts.',
          'Change compromised credentials.',
          'Contact the relevant organisation through an official channel.',
          'Monitor accounts for suspicious activity.',
          'Report the incident through appropriate channels.',
          'Seek assistance if money or sensitive information has been lost.',
        ],
      },
    ],
    example:
      'You clicked a suspicious link and entered your login credentials. You now realise that the message may have been a scam.',
    activity: {
      prompt: 'Activity: What Would You Do?',
      options: [
        'Ignore it.',
        'Continue communicating with the sender.',
        'Secure the account and contact the legitimate organisation through an official channel.',
        'Forward the link.',
      ],
      correctIndex: 2,
      feedback:
        'Acting quickly can reduce further harm. Secure the account and contact the legitimate organisation through an independently verified channel.',
    },
    keyTakeaway: "If you think you have been scammed, don't hide it or ignore it. Act quickly to reduce potential harm.",
  },
  {
    n: 9,
    title: 'Apply and Test Your Knowledge',
    intro:
      'The final section allows students to apply what they have learned to unfamiliar situations. The purpose is to determine whether students can identify, investigate and respond to suspicious communications.',
    sections: [],
    activity: { prompt: '', feedback: '' },
    scenarios: [
      {
        label: 'WhatsApp',
        text: "Hi, I'm from your university's student support office. Your R3,000 emergency payment has been approved. Send your banking details now so we can process it.",
        tasks: [
          'Identify warning signs.',
          'Identify the manipulation technique.',
          'Decide whether it is suspicious.',
          'Explain your reasoning.',
          'Select the safest response.',
        ],
      },
      {
        label: 'SMS',
        text: 'URGENT: Your parcel is being returned today. Pay R20 delivery fee here: [link].',
        tasks: ['Investigate the message using the process from Topic 6.'],
      },
      {
        label: 'Email',
        text: 'Subject: "Final Warning – Account Suspension"\n\n"Your university account will be disabled within 24 hours. Click here and provide your password to prevent suspension."',
        tasks: ['Examine the sender, request, urgency, link and potential manipulation.'],
      },
      {
        label: 'AI-Assisted Investigation',
        text: '',
        tasks: [
          'Make your own judgement.',
          'Identify warning signs.',
          'Explain your reasoning.',
          'Submit the example to the AI-assisted investigation tool.',
          'Review the AI explanation.',
          'Compare your initial judgement with AI feedback.',
          'Make a final decision.',
        ],
      },
    ],
    reflection: [
      'What warning sign did you identify first?',
      'Did the AI identify any indicators that you missed?',
      'What will you do differently when you receive a suspicious message in the future?',
    ],
    keyTakeaway: 'RECOGNISE → INVESTIGATE → DECIDE → RESPOND',
  },
];

const ZU: TopicContent[] = [
  {
    n: 1,
    title: 'Isingeniso Semikhonyovu Ye-inthanethi',
    intro:
      'Imikhonyovu ye-inthanethi yizenzo zokukhohlisa ezenzelwe ukukhohlisa abantu ukuze banikeze imali, ulwazi lomuntu siqu, imininingwane yokungena kuma-akhawunti, noma ukufinyelela kuma-akhawunti edijithali. Abakhonyovu basebenzisa i-WhatsApp, i-SMS ne-Email ukuze imiyalezo yabo yenkohliso ibonakale ithembekile.',
    sections: [
      {
        heading: 'Uyini Umkhonyovu We-inthanethi?',
        body: 'Umkhonyovu we-inthanethi wenzeka lapho umuntu esebenzisa ngamabomu inkohliso ngeplathifomu yedijithali ukuze ancenge omunye umuntu ukuthi enze isenzo esizuzisa umkhonyovu.',
        items: [
          'Ukuthumela imali.',
          'Ukwabelana ngolwazi lomuntu siqu.',
          'Ukuveza amaphasiwedi, ama-PIN noma ama-OTP.',
          'Ukuchofoza isixhumanisi esiyingozi noma esisolisa.',
          'Ukudawuniloda okunamathiselwe okungaphephile.',
          'Ukunikeza ukufinyelela ku-akhawunti ye-inthanethi.',
        ],
      },
      {
        heading: 'Isebenza Kanjani Imikhonyovu Ye-inthanethi?',
        items: [
          'Ukuheha ukunaka.',
          'Ukwakha ukwethenjwa.',
          'Ukudala ingcindezi.',
          'Ukucela isenzo.',
          'Ukuzuza empendulweni.',
        ],
      },
      {
        heading: 'Kungani Abantu Bewela Emikhonyovwini?',
        items: [
          'Bethemba umthumeli obonakalayo.',
          'Besaba ukulahlekelwa yimali noma ukufinyelela ku-akhawunti.',
          'Bajabula ngomklomelo.',
          'Bazizwa becindezelwe umnqamulajuqu ophuthumayo.',
          'Banentshisekelo ngomyalezo.',
          'Bakholelwa ukuthi umyalezo uvela esiphathimandleni noma enhlanganweni ethembekile.',
        ],
      },
    ],
    example:
      'ISAZISO SOXHASO LOMFUNDI: OKUPHUTHUMAYO: Isibonelelo sakho somfundi sivunyelwe. Qinisekisa imininingwane yakho yasebhange kungakapheli imizuzu engama-30 ukuze ugweme ukukhanselwa. Chofoza lapha ukuze uqhubeke.',
    activity: {
      prompt:
        'Umsebenzi: Bona Umkhonyovu — yini eyenza lo mlayezo ongenhla usole? Inzuzo yezimali engalindelekile, umnqamulajuqu ophuthumayo, isicelo solwazi lomuntu siqu/lwezimali, isixhumanisi esidinga isenzo esisheshayo.',
      feedback:
        'Ukunikezwa kwemali okungalindelekile okuhambisana nokuphuthuma nesicelo solwazi kufanele kuqinisekiswe ngokuzimela ngaphambi kokuthatha isenzo.',
    },
    keyTakeaway: 'STOP → THINK → VERIFY',
  },
  {
    n: 2,
    title: 'Imikhonyovu Ye-WhatsApp',
    intro:
      'I-WhatsApp isetshenziswa kakhulu ekuxhumaneni komuntu siqu, kwezemfundo nakwezenhlalo. Lokhu kujwayeleka kungasetshenziswa kabi abakhonyovu abazenza abantu noma izinhlangano.',
    sections: [
      {
        heading: 'Izinhlobo Ezivamile',
        items: [
          'Ukuzenza abangani, umndeni, abafundisi noma izinhlangano.',
          'Imisebenzi, imifundaze, imiqhudelwano noma imiklomelo mbumbulu.',
          'Izixhumanisi ezisolisa.',
          'Izicelo zemali yezimo eziphuthumayo.',
          'Izicelo zamaphasiwedi, ama-PIN noma ama-OTP.',
        ],
      },
      {
        heading: 'Izimpawu Zexwayiso',
        items: [
          'Izicelo ezingalindelekile',
          'Ulimi oluphuthumayo',
          'Izicelo zemali',
          'Izicelo zolwazi olubucayi',
          'Izixhumanisi ezisolisa',
          'Ukuziphatha komthumeli okungajwayelekile',
          'Imiklomelo engalindelekile',
          'Ukuzenza omunye umuntu',
        ],
      },
    ],
    example:
      'Sawubona, yimina. Ngilahlekelwe yifoni yami futhi ngisebenzisa le nombolo okwesikhashana. Ngicela ungithumelele u-R800 ngokuphuthumayo. Ngizokukhokhela namhlanje ebusuku.',
    activity: {
      prompt: 'Umsebenzi Osebenzisanayo — kufanele wenzeni?',
      options: [
        'Thumela imali.',
        'Cela imininingwane yasebhange.',
        'Xhumana nomngani wakho ngesiteshi esithembekile.',
        'Dlulisela umyalezo.',
      ],
      feedback:
        'Igama elijwayelekile noma isithombe sephrofayela akufakazeli ubuwena. Qinisekisa izicelo ezingalindelekile ngokuzimela.',
    },
    keyTakeaway: 'Themba umuntu kuphela ngemva kokuqinisekisa isicelo.',
  },
  {
    n: 3,
    title: 'Imikhonyovu Ye-SMS',
    intro:
      'Imikhonyovu ye-SMS isebenzisa imiyalezo yombhalo ukuncenga abamukeli ukuthi benze izenzo ezingaphephile. Ingase ibonakale ivela emabhange, ezinkampanini zokulethwa kwezimpahla, kubahlinzeki bamaselula, ezinhlanganweni zikahulumeni noma kwezinye izinsizakalo ezethembekile.',
    sections: [
      {
        heading: 'Izinhlobo Ezivamile',
        items: ['Izaziso zasebhange mbumbulu', 'Imiyalezo yokulethwa mbumbulu', 'Imiklomelo mbumbulu', 'Izexwayiso ze-akhawunti mbumbulu'],
      },
      {
        heading: 'Izimpawu Zexwayiso',
        items: [
          'Imiyalezo engalindelekile',
          'Iminqamulajuqu ephuthumayo',
          'Izixhumanisi ezisolisa',
          'Izicelo zolwazi lomuntu siqu/lwasebhange',
          'Izinkokhelo ezingalindelekile',
          'Izinsongo zokuvalwa kwe-akhawunti',
          'Okunikezwayo okuhle kakhulu ukuba kube yiqiniso',
        ],
      },
    ],
    example: 'OKUPHUTHUMAYO! I-akhawunti yakho yasebhange izovinjelwa namuhla. Qinisekisa i-akhawunti yakho manje: [link]',
    activity: {
      prompt: 'Umsebenzi Osebenzisanayo — khomba izimpawu zexwayiso emlayezweni ongenhla.',
      feedback:
        'Umyalezo udala ukuphuthuma, uthi umele isikhungo sezimali futhi uqondisa umsebenzisi esixhumanisini. Qinisekisa ngesiteshi esisemthethweni kunalokho.',
    },
    keyTakeaway: 'Ungalokothi uvumele i-SMS ikucindezele ukuthi wenze isinqumo sezimali noma se-akhawunti ngokushesha.',
  },
  {
    n: 4,
    title: 'Imikhonyovu Ye-Email',
    intro:
      'Imikhonyovu ye-Email izama ukukhohlisa abasebenzisi ngama-email enkohliso. Ingase ilingise amabhange, amanyuvesi, abaqashi, izitolo ze-inthanethi noma ezinye izinhlangano.',
    sections: [
      {
        heading: 'Okufanele Ukuhlolwe',
        items: ['Ikheli lomthumeli', 'Umugqa wesihloko', 'Okuqukethwe komyalezo', 'Izixhumanisi', 'Okunamathiselwe', 'Izicelo'],
      },
      {
        heading: 'Izimpawu Zexwayiso',
        items: [
          'Umthumeli ongalindelekile',
          'Isihloko esiphuthumayo/esisongelayo',
          'Isicelo semininingwane yokungena',
          'Izixhumanisi ezisolisa',
          'Okunamathiselwe okungalindelekile',
          'Isicelo esingajwayelekile',
        ],
      },
    ],
    example:
      'Isihloko: "OKUPHUTHUMAYO – Ukumiswa Kwe-akhawunti Yenyuvesi"\n\n"I-akhawunti yakho yenyuvesi izomiswa namuhla. Chofoza isixhumanisi esingezansi bese uqinisekisa iphasiwedi yakho."',
    activity: {
      prompt: 'Umsebenzi Osebenzisanayo — khomba umthumeli, isicelo, ukuphuthuma, isixhumanisi nesicelo semininingwane yokungena.',
      feedback:
        'I-email isebenzisa ukwesaba nokuphuthuma ukukhuthaza ukuvezwa kwemininingwane yokungena. Unganikezi amaphasiwedi ngezicelo ze-email ezingalindelekile; qinisekisa ngesiteshi esisemthethweni.',
    },
    keyTakeaway: 'Ungathembi i-email ngoba nje ibukeka isezingeni lobungcweti. Hlola umthumeli, isicelo, izixhumanisi nomongo.',
  },
  {
    n: 5,
    title: 'Indlela Abakhonyovu Abalawula Ngayo Izisulu',
    intro: 'Abakhonyovu basebenzisa i-social engineering nokulawula kwengqondo ukuze bathonye indlela abantu abenza ngayo izinqumo.',
    sections: [
      {
        heading: 'Amasu Avamile Okulawula',
        items: [
          'Ukuphuthuma – kudala ingcindezi futhi kunciphisa isikhathi sokuqinisekisa.',
          'Ukwesaba – kusongela umphumela omubi.',
          'Igunya – ukuzenza isiphathimandla esithembekile.',
          'Umklomelo – kusebenzisa injabulo noma isikhuthazo sezimali.',
          'Ilukuluku – kukhuthaza ukuchofoza ukuze uthole okuthile.',
          'Ukwethenjwa nokujwayeleka – ukuzenza umuntu isisulu esimaziyo.',
        ],
      },
    ],
    example: 'I-akhawunti yakho yomfundi izokhanselwa namuhla ngaphandle uma uqinisekisa imininingwane yakho ngokushesha.',
    activity: {
      prompt: 'Umsebenzi: Khomba Isu Lokulawula',
      options: ['Umklomelo', 'Ukwesaba nokuphuthuma', 'Ilukuluku', 'Ezokuzijabulisa'],
      correctIndex: 1,
      feedback: 'Umyalezo usebenzisa ukwesaba ukukhanselwa nokuphuthuma ukuze ucindezele umamukeli.',
    },
    keyTakeaway: 'Abakhonyovu bavame ukulawula imizwa ngaphambi kokucela izisulu ukuthi zenze isenzo esingaphephile.',
  },
  {
    n: 6,
    title: 'Ukuhlola Umyalezo Osolisayo',
    intro: 'Ukubona ukuthi umyalezo uzwakala usolisa kuyasiza, kodwa abafundi badinga nendlela ehlelekile yokuwuhlola.',
    sections: [
      {
        heading: 'Inqubo Esebenzayo Yokuhlola',
        items: [
          'YIMA – Ungachofozi, ungaphenduli, ungakhokhi noma unikeze ulwazi ngokushesha.',
          'HLOLA UMTHUMELI – Buza ukuthi uthunyelwe ubani, ukuthi ubulindelekile yini nokuthi ukuzenza omunye umuntu kungenzeka yini.',
          'HLOLA ISICELO – Khomba ukuthi umthumeli ufunani nokuthi imali noma ulwazi olubucayi kuyacelwa yini.',
          'HLOLA IMININININGWANE – Hlola izixhumanisi, amakheli, okunamathiselwe, ulwazi lomthumeli nolimi olungajwayelekile.',
          'KHOMBA IZIMPAWU ZEXWAYISO – Bheka ukuphuthuma, izinsongo, imiklomelo, ukuzenza omunye umuntu nezinye izinkomba.',
          'KHOMBA UKULAWULA – Buza ukuthi umyalezo uzama ukukwenza uzizwe kanjani.',
          'QINISEKISA – Sebenzisa umthombo ozimele nothembekile.',
          'NQUMA – Khetha isenzo esiphephe kakhulu: ukungawunaki/ukuwususa, ukubika, ukuxhumana nenhlangano esemthethweni, ukuvikela i-akhawunti noma ukufuna usizo.',
        ],
      },
    ],
    example: 'OKUPHUTHUMAYO: I-akhawunti yakho yenyuvesi imisiwe. Chofoza lapha kungakapheli imizuzu eyi-15 ukuze ubuyisele ukufinyelela.',
    activity: {
      prompt: 'Umsebenzi: Hlola Lo Myalezo',
      feedback:
        'Umyalezo uqukethe ukuphuthuma, ukuzenza omunye umuntu nesicelo sokuchofoza isixhumanisi. Qinisekisa lesi simangalo ngokuzimela kunokuchofoza isixhumanisi esinikeziwe.',
    },
    keyTakeaway: 'Ungabuzi nje ukuthi "Ingabe lokhu kubukeka kuyiqiniso?" Buza ukuthi "Ngingakuqinisekisa yini ukuthi kuyiqiniso?"',
  },
  {
    n: 7,
    title: 'Ukuhlola Umkhonyovu Ngosizo lwe-AI',
    intro:
      'I-AI ingasiza ekuhlaziyeni ukuxhumana kwedijithali okusolisayo. Nokho, i-AI akufanele ithathwe njengegunya elingaphuthi. Kule mojuli, i-AI iphakamiswa njengomsizi wokufunda: inhloso yayo ukusiza abafundi baqonde izinkomba nokucabanga, hhayi ukumaka umyalezo nje kuphela.',
    sections: [
      {
        heading: 'Yini Umfundi Angayithumela?',
        items: ['Imiyalezo ye-WhatsApp enamathiselwe', 'Umbhalo we-SMS', 'Okuqukethwe kwe-Email', 'Ama-screenshot', 'Okunye ukuxhumana kwedijithali okusolisayo'],
      },
      {
        heading: 'Indlela Ukuhlola Ngosizo lwe-AI Okusebenza Ngayo',
        items: [
          'Umfundi uthumela ukuxhumana okusolisayo.',
          'Umfundi wenza isinqumo sokuqala futhi achaze ukuthi kungani.',
          'I-AI ihlaziya okuqukethwe.',
          'Uhlelo lukhomba izinkomba ezingaba khona ezifana nokuphuthuma, ukuzenza omunye umuntu, izixhumanisi ezisolisa, izicelo zemali, izicelo zolwazi olubucayi nolimi olukhohlisayo.',
          'I-AI ichaza izinkomba.',
          'Umfundi uqhathanisa ukucabanga kwakhe nempendulo.',
          'Umfundi uthola isimo esisha ukuze asebenzise akufundile.',
        ],
      },
      {
        heading: 'Imikhawulo ye-AI',
        items: [
          'I-AI ingenza amaphutha.',
          'Ukuhlukaniswa ngokuthi "kuphephile" akuqinisekisi ukuphepha.',
          'Ukuhlukaniswa ngokuthi "kuyasolisa" akufakazeli ngokuzenzakalelayo ubugebengu.',
          'Izinqumo ezibalulekile kufanele ziqinisekiswe ngokuzimela.',
          'Umphumela we-AI uyusizo, akuwona ubufakazi bokugcina.',
        ],
      },
      {
        heading: 'Ubumfihlo Nokuthumela Ngokuphepha',
        body: 'Lapho kungenzeka, ulwazi olukhomba umuntu kufanele lususwe ngaphambi kokuthumela. Ungalokothi uthumele:',
        items: ['Amaphasiwedi', 'Ama-OTP', 'Imininingwane yasebhange', 'Izinombolo zikamazisi', 'Izingxoxo eziyimfihlo', 'Ulwazi lomuntu siqu olungadingekile'],
      },
    ],
    example:
      'OKUPHUTHUMAYO! Uxhaso lwakho lomfundi lumisiwe. Qinisekisa i-akhawunti yakho kungakapheli imizuzu engama-30 usebenzisa lesi sixhumanisi.\n\nUkuphuthuma – umnqamulajuqu wemizuzu engama-30. Ukuzenza omunye umuntu – uthi umele inhlangano yoxhaso lwabafundi. Isixhumanisi esisolisa – siqondisa umfundi esixhumanisini kunesayithi elisemthethweni eliqinisekiswe ngokuzimela.',
    activity: {
      prompt:
        'Umsebenzi: Hlola nge-AI — yenza ukuhlola kwakho, khomba okungenani izimpawu ezimbili zexwayiso, thumela okuqukethwe ethuluzini elisizwa yi-AI, qhathanisa ukuhlola kwakho nokuhlaziya kwe-AI, khomba okuthile okuqaphelile nokuthile owakuphuthelwa ekuqaleni, bese uqedela isimo esisha.',
      feedback: 'Sebenzisa i-AI ukusekela ukuhlola kwakho, hhayi ukubuyisela ukwahlulela kwakho.',
    },
    keyTakeaway: 'Sebenzisa i-AI ukusekela ukuhlola kwakho, hhayi ukubuyisela ukwahlulela kwakho.',
  },
  {
    n: 8,
    title: 'Ukuphendula Kumkhonyovu We-inthanethi',
    intro:
      'Ukukhomba umkhonyovu kuyisigaba esisodwa kuphela sokuhlala uphephile. Abafundi badinga nokwazi ukuthi benzeni lapho behlangabezana nomyalezo osolisayo noma bebona ukuthi kungenzeka baxhumane nomkhonyovu.',
    sections: [
      {
        heading: 'Uma Uthola Umyalezo Osolisayo — Ungakwenzi Lokhu',
        items: [
          'Ukuchofoza izixhumanisi ezisolisa.',
          'Ukudawuniloda okunamathiselwe okungalindelekile.',
          'Ukuthumela imali.',
          'Ukunikeza amaphasiwedi noma ama-OTP.',
          'Ukuqhubeka nokuxhumana nomkhonyovu ngokungadingekile.',
        ],
      },
      {
        heading: 'Uma Uthola Umyalezo Osolisayo — Yenza Lokhu',
        items: [
          'Yima bese uhlola umyalezo.',
          'Qinisekisa ulwazi ngokuzimela.',
          'Bika okuqukethwe okusolisayo lapho kufanele.',
          'Susa noma uvimbe umthumeli lapho kufanele.',
        ],
      },
      {
        heading: 'Uma Usuphendulile Kakade',
        items: [
          'Yeka ukuxhumana okwengeziwe.',
          'Vikela ama-akhawunti athintekile.',
          'Shintsha imininingwane yokungena ebonakele.',
          'Xhumana nenhlangano efanele ngesiteshi esisemthethweni.',
          'Qapha ama-akhawunti ukuze ubone umsebenzi osolisayo.',
          'Bika isigameko ngeziteshi ezifanele.',
          'Funa usizo uma imali noma ulwazi olubucayi lulahlekile.',
        ],
      },
    ],
    example: 'Uchofoze isixhumanisi esisolisa futhi wafaka imininingwane yakho yokungena. Manje uyabona ukuthi umyalezo kungenzeka ubuwumkhonyovu.',
    activity: {
      prompt: 'Umsebenzi: Ubungenzani?',
      options: [
        'Ungakunaki.',
        'Qhubeka nokuxhumana nomthumeli.',
        'Vikela i-akhawunti bese uxhumana nenhlangano esemthethweni ngesiteshi esisemthethweni.',
        'Dlulisela isixhumanisi kwabanye.',
      ],
      correctIndex: 2,
      feedback:
        'Ukwenza ngokushesha kunganciphisa umonakalo owengeziwe. Vikela i-akhawunti bese uxhumana nenhlangano esemthethweni ngesiteshi esiqinisekiswe ngokuzimela.',
    },
    keyTakeaway: 'Uma ucabanga ukuthi ukhonjwe umkhonyovu, ungakufihli noma ungakunaki. Thatha isenzo ngokushesha ukuze unciphise umonakalo ongaba khona.',
  },
  {
    n: 9,
    title: 'Sebenzisa Futhi Uhlole Ulwazi Lwakho',
    intro:
      'Ingxenye yokugcina ivumela abafundi ukuthi basebenzise abakufundile ezimeni abangazijwayele. Inhloso ukuthola ukuthi abafundi bangakwazi yini ukukhomba, ukuhlola nokuphendula ekuxhumaneni okusolisayo.',
    sections: [],
    activity: { prompt: '', feedback: '' },
    scenarios: [
      {
        label: 'WhatsApp',
        text: 'Sawubona, ngivela ehhovisi lokweseka abafundi lenyuvesi yakho. Inkokhelo yakho ephuthumayo engu-R3,000 ivunyelwe. Thumela imininingwane yakho yasebhange manje ukuze siyicubungule.',
        tasks: [
          'Khomba izimpawu zexwayiso.',
          'Khomba isu lokulawula.',
          'Nquma ukuthi kuyasolisa yini.',
          'Chaza ukucabanga kwakho.',
          'Khetha impendulo ephephe kakhulu.',
        ],
      },
      {
        label: 'SMS',
        text: 'OKUPHUTHUMAYO: Iphasela lakho liyabuyiselwa namuhla. Khokha imali yokulethwa engu-R20 lapha: [link].',
        tasks: ['Hlola umyalezo usebenzisa inqubo evela kuSihloko 6.'],
      },
      {
        label: 'Email',
        text: 'Isihloko: "Isexwayiso Sokugcina – Ukumiswa Kwe-akhawunti"\n\n"I-akhawunti yakho yenyuvesi izokhutshazwa kungakapheli amahora angama-24. Chofoza lapha bese unikeza iphasiwedi yakho ukuze uvimbele ukumiswa."',
        tasks: ['Hlola umthumeli, isicelo, ukuphuthuma, isixhumanisi nokulawula okungenzeka.'],
      },
      {
        label: 'Ukuhlola Ngosizo lwe-AI',
        text: '',
        tasks: [
          'Yenza ukwahlulela kwakho.',
          'Khomba izimpawu zexwayiso.',
          'Chaza ukucabanga kwakho.',
          'Thumela isibonelo ethuluzini lokuhlola elisizwa yi-AI.',
          'Buyekeza incazelo ye-AI.',
          'Qhathanisa ukwahlulela kwakho kokuqala nempendulo ye-AI.',
          'Yenza isinqumo sokugcina.',
        ],
      },
    ],
    reflection: [
      'Yisiphi isimpawu sexwayiso osikhombe kuqala?',
      'Ingabe i-AI ikhombile noma yiziphi izinkomba oziphuthelwe?',
      'Yini ozoyenza ngokuhlukile uma uthola umyalezo osolisayo esikhathini esizayo?',
    ],
    keyTakeaway: 'BONA → HLOLA → NQUMA → PHENDULA',
  },
];

const NSO: TopicContent[] = [
  {
    n: 1,
    title: 'Matseno go Bofora bja Inthaneteng',
    intro:
      'Bofora bja inthaneteng ke mediro ya bofora ye e hlametšwego go fora batho gore ba nee tšhelete, tshedimošo ya bona, dintlha tša go tsena akhaonteng, goba phihlelelo go diakhaonte tša dijithale. Bafori ba diriša WhatsApp, SMS le email go dira gore melaetša ya bofora e bonagale e le ya nnete.',
    sections: [
      {
        heading: 'Bofora bja Inthaneteng ke Eng?',
        body: 'Bofora bja inthaneteng bo direga ge motho a diriša bofora ka boomo ka sefala sa dijithale go kgodiša motho yo mongwe gore a dire tiro ye e holago mofori.',
        items: [
          'Go romela tšhelete.',
          'Go abelana tshedimošo ya motho.',
          'Go utolla diphasewete, PINs goba OTPs.',
          'Go kgotla linki ye kotsi goba ye e belaetšago.',
          'Go taonelouta sekgomaretšwa se se sa bolokegago.',
          'Go fa phihlelelo go akhaonte ya inthaneteng.',
        ],
      },
      {
        heading: 'Bofora bja Inthaneteng bo Šoma Bjang?',
        items: ['Go gogela šedi.', 'Go aga tshepo.', 'Go hlola kgatelelo.', 'Go kgopela tiro.', 'Go holega karabong.'],
      },
      {
        heading: "Ke ka Baka La'ng Batho ba Wela Boforeng?",
        items: [
          'Ba tshepa moromedi yo a bonagalago.',
          'Ba boifa go lahlegelwa ke tšhelete goba phihlelelo ya akhaonte.',
          'Ba thabišwa ke moputso.',
          'Ba ikwa ba gateletšwe ke nako ya tšhoganetšo.',
          'Ba nyaka go tseba ka molaetša.',
          'Ba dumela gore molaetša o tšwa go bolaodi goba mokgatlo wo o tshepagalago.',
        ],
      },
    ],
    example:
      'TSEBIŠO YA THEKGO YA DITŠHELETE YA MOITHUTI: KA POTLAKO: Tšhelete ya gago ya moithuti e dumeletšwe. Netefatša dintlha tša gago tša panka ka metsotso ye 30 go efoga go phumolwa. Kgotla mo go tšwela pele.',
    activity: {
      prompt:
        'Mošongwana: Lemoga Bofora — ke eng seo se dirago gore molaetša wa ka godimo o belaetše? Kholego ya tšhelete ye e sa letelwago, nako ya tšhoganetšo, kgopelo ya tshedimošo ya motho/ya ditšhelete, linki ye e nyakago tiro ya ka pela.',
      feedback:
        'Tlhahiso ya tšhelete ye e sa letelwago ye e kopantšwego le tšhoganetšo le kgopelo ya tshedimošo e swanetše go netefatšwa ka boikemelo pele go dirwa tiro.',
    },
    keyTakeaway: 'EMA → NAGANA → NETEFATŠA',
  },
  {
    n: 2,
    title: 'Bofora bja WhatsApp',
    intro:
      'WhatsApp e dirišwa kudu bakeng sa kgokagano ya motho ka noši, ya dithuto le ya leago. Go tlwaelega mo go ka dirišwa gampe ke bafori bao ba itirago batho goba mekgatlo.',
    sections: [
      {
        heading: 'Mehuta ye e Tlwaelegilego',
        items: [
          'Go itira bagwera, ba lapa, bafahloši goba mekgatlo.',
          'Mešomo ya maaka, dibasari, diphadišano goba meputso.',
          'Dilinki tše di belaetšago.',
          'Dikgopelo tša tšhelete tša tšhoganetšo.',
          'Dikgopelo tša diphasewete, PINs goba OTPs.',
        ],
      },
      {
        heading: 'Matshwao a Temošo',
        items: [
          'Dikgopelo tše di sa letelwago',
          'Polelo ya tšhoganetšo',
          'Dikgopelo tša tšhelete',
          'Dikgopelo tša tshedimošo ye bohlokwa',
          'Dilinki tše di belaetšago',
          'Boitshwaro bjo bo sa tlwaelegago bja moromedi',
          'Meputso ye e sa letelwago',
          'Go itira motho yo mongwe',
        ],
      },
    ],
    example: 'Hei, ke nna. Ke lahlegetšwe ke founo gomme ke diriša nomoro ye ka nakwana. Hle nthomele R800 ka potlako. Ke tla go lefa bošegong bjo.',
    activity: {
      prompt: 'Mošongwana wa Tirišano — o swanetše go dira eng?',
      options: [
        'Romela tšhelete.',
        'Kgopela dintlha tša panka.',
        'Ikgokaganye le mogwera wa gago ka kanale ye e tshepagalago.',
        'Fetišetša molaetša pele.',
      ],
      feedback: 'Leina leo o le tlwaetšego goba seswantšho sa profaele ga di hlatsele boitsebišo. Netefatša dikgopelo tše di sa letelwago ka boikemelo.',
    },
    keyTakeaway: 'Tshepa motho fela ka morago ga gore o netefatše kgopelo.',
  },
  {
    n: 3,
    title: 'Bofora bja SMS',
    intro:
      'Bofora bja SMS bo diriša melaetša ya sengwalwa go kgodiša baamogedi go dira ditiro tše di sa bolokegago. Bo ka bonagala bo tšwa dipankeng, dikhamphaning tša thomelo, bafani ba diselefouno, mekgatlong ya mmušo goba ditirelong tše dingwe tše di tshepagalago.',
    sections: [
      {
        heading: 'Mehuta ye e Tlwaelegilego',
        items: ['Ditemošo tša panka tša maaka', 'Melaetša ya thomelo ya maaka', 'Meputso ya maaka', 'Ditemošo tša akhaonte tša maaka'],
      },
      {
        heading: 'Matshwao a Temošo',
        items: [
          'Melaetša ye e sa letelwago',
          'Dinako tša tšhoganetšo',
          'Dilinki tše di belaetšago',
          'Dikgopelo tša tshedimošo ya motho/ya panka',
          'Ditefo tše di sa letelwago',
          'Ditšhošetšo tša go tswalelwa ga akhaonte',
          'Ditlhahiso tše dibotse kudu go ka ba nnete',
        ],
      },
    ],
    example: 'KA POTLAKO! Akhaonte ya gago ya panka e tla thibelwa lehono. Netefatša akhaonte ya gago bjale: [link]',
    activity: {
      prompt: 'Mošongwana wa Tirišano — hlaola matshwao a temošo molaetšeng wa ka godimo.',
      feedback:
        'Molaetša o hlola tšhoganetšo, o bolela gore o emela setheo sa ditšhelete gomme o iša modiriši go linki. Netefatša ka kanale ya semmušo go e na le moo.',
    },
    keyTakeaway: 'Le ka mohla o se dumelele SMS go go gatelela go dira sephetho sa tšhelete goba sa akhaonte ka pela.',
  },
  {
    n: 4,
    title: 'Bofora bja Email',
    intro:
      'Bofora bja email bo leka go fora badiriši ka di-email tša bofora. Bo ka ekiša dipanka, diyunibesithi, bengmešomo, mabenkele a inthaneteng goba mekgatlo ye mengwe.',
    sections: [
      {
        heading: 'Seo o Swanetšego go se Lekola',
        items: ['Aterese ya moromedi', 'Mothaladi wa sehlogo', 'Diteng tša molaetša', 'Dilinki', 'Dikgomaretšwa', 'Dikgopelo'],
      },
      {
        heading: 'Matshwao a Temošo',
        items: [
          'Moromedi yo a sa letelwago',
          'Sehlogo sa tšhoganetšo/sa tšhošetšo',
          'Kgopelo ya dintlha tša go tsena',
          'Dilinki tše di belaetšago',
          'Dikgomaretšwa tše di sa letelwago',
          'Kgopelo ye e sa tlwaelegago',
        ],
      },
    ],
    example:
      'Sehlogo: "KA POTLAKO – Go Emišwa ga Akhaonte ya Yunibesithi"\n\n"Akhaonte ya gago ya yunibesithi e tla emišwa lehono. Kgotla linki ye e lego ka tlase gomme o netefatše phasewete ya gago."',
    activity: {
      prompt: 'Mošongwana wa Tirišano — hlaola moromedi, kgopelo, tšhoganetšo, linki le kgopelo ya dintlha tša go tsena.',
      feedback:
        'Email e diriša poifo le tšhoganetšo go hlohleletša go utollwa ga dintlha tša go tsena. O se nee diphasewete ka dikgopelo tša email tše di sa letelwago; netefatša ka kanale ya semmušo.',
    },
    keyTakeaway: 'O se tshepe email feela ka gobane e bonagala e le ya profešenale. Lekola moromedi, kgopelo, dilinki le seemo.',
  },
  {
    n: 5,
    title: 'Kamoo Bafori ba Laolago Bahlaselwa',
    intro: 'Bafori ba diriša social engineering le taolo ya monagano go huetša kamoo batho ba dirago diphetho ka gona.',
    sections: [
      {
        heading: 'Mekgwa ye e Tlwaelegilego ya Taolo',
        items: [
          'Tšhoganetšo – e hlola kgatelelo gomme e fokotša nako ya netefatšo.',
          'Poifo – e tšhošetša ka ditlamorago tše mpe.',
          'Bolaodi – e itira bolaodi bjo bo tshepagalago.',
          'Moputso – e diriša lethabo goba kgoketšo ya tšhelete.',
          'Tšhomišo ya kgahlego – e hlohleletša go kgotla go hwetša se sengwe.',
          'Tshepo le go tlwaelana – e itira motho yo mohlaselwa a mo tsebago.',
        ],
      },
    ],
    example: 'Akhaonte ya gago ya moithuti e tla phumolwa lehono ntle le ge o netefatša tshedimošo ya gago ka pela.',
    activity: {
      prompt: 'Mošongwana: Hlaola Mokgwa wa Taolo',
      options: ['Moputso', 'Poifo le tšhoganetšo', 'Tšhomišo ya kgahlego', 'Boithabišo'],
      correctIndex: 1,
      feedback: 'Molaetša o diriša poifo ya go phumolwa le tšhoganetšo go gatelela moamogedi.',
    },
    keyTakeaway: 'Bafori gantši ba laola maikutlo pele ba kgopela bahlaselwa go dira tiro ye e sa bolokegago.',
  },
  {
    n: 6,
    title: 'Go Nyakišiša Molaetša wo o Belaetšago',
    intro: 'Go lemoga gore molaetša o bonagala o belaetša go na le mohola, eupša baithuti ba hloka gape mokgwa wa thulaganyo wa go o nyakišiša.',
    sections: [
      {
        heading: 'Tshepedišo ya Nyakišišo ya Tirišo',
        items: [
          'EMA – O se kgotle, wa araba, wa lefa goba wa nea tshedimošo ka pela.',
          "LEKOLA MOROMEDI – Botšiša gore ke mang yo a o rometšego, ge e ba o letetšwe le ge e ba go itira motho yo mongwe go ka kgonega.",
          'LEKOLA KGOPELO – Hlaola seo moromedi a se nyakago le ge e ba go kgopelwa tšhelete goba tshedimošo ye bohlokwa.',
          'LEKOLA DINTLHA – Lekola dilinki, diaterese, dikgomaretšwa, tshedimošo ya moromedi le polelo ye e sa tlwaelegago.',
          'HLAOLA MATSHWAO A TEMOŠO – Lebelela tšhoganetšo, ditšhošetšo, meputso, go itira le ditšhupetšo tše dingwe.',
          'HLAOLA TAOLO – Botšiša gore molaetša o leka go go dira gore o ikwe bjang.',
          'NETEFATŠA – Diriša mothopo wo o ikemetšego wo o tshepagalago.',
          'DIRELA SEPHETHO – Kgetha tiro ye e bolokegilego kudu: hlokomologa/phumola, bega, ikgokaganye le mokgatlo wa nnete, šireletša akhaonte goba nyaka thušo.',
        ],
      },
    ],
    example: 'KA POTLAKO: Akhaonte ya gago ya yunibesithi e emišitšwe. Kgotla mo ka metsotso ye 15 go bušetša phihlelelo.',
    activity: {
      prompt: 'Mošongwana: Nyakišiša Molaetša wo',
      feedback:
        'Molaetša o na le tšhoganetšo, go itira le kgopelo ya go kgotla linki. Netefatša polelo ka boikemelo go e na le go kgotla linki ye e filwego.',
    },
    keyTakeaway: 'O se botšiše feela "Na se se bonagala e le sa nnete?" Botšiša "Na nka netefatša gore ke sa nnete?"',
  },
  {
    n: 7,
    title: 'Nyakišišo ya Bofora ye e Thušwago ke AI',
    intro:
      'AI e ka thuša go sekaseka dikgokagano tša dijithale tše di belaetšago. Le ge go le bjalo, AI ga se ya swanela go tšewa bjalo ka bolaodi bjo bo sa fošego. Mojuleng wo, AI e šišinywa bjalo ka mothuši wa go ithuta: morero wa yona ke go thuša baithuti go kwešiša ditšhupetšo le mabaka, e sego feela go bea molaetša sehlopheng.',
    sections: [
      {
        heading: 'Moithuti a ka Romela Eng?',
        items: ['Melaetša ya WhatsApp ye e kgomareditšwego', 'Sengwalwa sa SMS', 'Diteng tša email', 'Diswantšho tša skrine', 'Kgokagano ye nngwe ya dijithale ye e belaetšago'],
      },
      {
        heading: 'Kamoo Nyakišišo ye e Thušwago ke AI e Šomago ka Gona',
        items: [
          'Moithuti o romela kgokagano ye e belaetšago.',
          'Moithuti o dira kahlolo ya mathomo gomme o hlalosa lebaka.',
          'AI e sekaseka diteng.',
          'Sisteme e hlaola ditšhupetšo tše di ka bago gona tše bjalo ka tšhoganetšo, go itira, dilinki tše di belaetšago, dikgopelo tša tšhelete, dikgopelo tša tshedimošo ye bohlokwa le polelo ya taolo.',
          'AI e hlalosa ditšhupetšo.',
          'Moithuti o bapetša mabaka a gagwe le poeletšo.',
          'Moithuti o amogela seemo se sefsa go diriša seo a ithutilego sona.',
        ],
      },
      {
        heading: 'Mellwane ya AI',
        items: [
          'AI e ka dira diphošo.',
          'Sehlopha sa "bolokegile" ga se netefatše polokego.',
          'Sehlopha sa "belaetša" ga se hlatsele bofora ka boiketlo.',
          'Diphetho tše bohlokwa di swanetše go netefatšwa ka boikemelo.',
          'Sephetho sa AI ke thušo, e sego bohlatse bja makgaolakgang.',
        ],
      },
      {
        heading: 'Boporaebete le Thomelo ye e Bolokegilego',
        body: 'Moo go kgonegago, tshedimošo ya go hlaola motho e swanetše go tlošwa pele ga thomelo. O se ke wa romela:',
        items: ['Diphasewete', 'OTPs', 'Dintlha tša panka', 'Dinomoro tša boitsebišo', 'Dipoledišano tša poraebete', 'Tshedimošo ya motho ye e sa hlokagalego'],
      },
    ],
    example:
      'KA POTLAKO! Thekgo ya gago ya ditšhelete ya moithuti e emišitšwe. Netefatša akhaonte ya gago ka metsotso ye 30 o diriša linki ye.\n\nTšhoganetšo – nako ya metsotso ye 30. Go itira – e bolela gore e emela mokgatlo wa thekgo ya ditšhelete ya baithuti. Linki ye e belaetšago – e iša moithuti go linki go e na le wepsaete ya semmušo ye e netefaditšwego ka boikemelo.',
    activity: {
      prompt:
        'Mošongwana: Nyakišiša ka AI — dira tekolo ya gago, hlaola bonnyane matshwao a mabedi a temošo, romela diteng go sedirišwa se se thušwago ke AI, bapetša tekolo ya gago le tshekatsheko ya AI, hlaola selo seo o se lemogilego le seo o se hlokomologilego mathomong, gomme o fetše seemo se sefsa.',
      feedback: 'Diriša AI go thekga nyakišišo ya gago, e sego go tšeela kahlolo ya gago legato.',
    },
    keyTakeaway: 'Diriša AI go thekga nyakišišo ya gago, e sego go tšeela kahlolo ya gago legato.',
  },
  {
    n: 8,
    title: 'Go Arabela Bofora bja Inthaneteng',
    intro:
      'Go hlaola bofora ke karolo e tee feela ya go dula o bolokegile. Baithuti ba hloka gape go tseba seo ba swanetšego go se dira ge ba kopana le molaetša wo o belaetšago goba ge ba lemoga gore ba ka be ba šomišane le bofora.',
    sections: [
      {
        heading: 'Ge o Amogela Molaetša wo o Belaetšago — O se ke wa',
        items: [
          'Kgotla dilinki tše di belaetšago.',
          'Taonelouta dikgomaretšwa tše di sa letelwago.',
          'Romela tšhelete.',
          'Nea diphasewete goba OTPs.',
          'Tšwela pele go bolela le mofori ntle le lebaka.',
        ],
      },
      {
        heading: 'Ge o Amogela Molaetša wo o Belaetšago — Dira',
        items: ['Ema gomme o lekole molaetša.', 'Netefatša tshedimošo ka boikemelo.', 'Bega diteng tše di belaetšago moo go swanetšego.', 'Phumola goba thibela moromedi moo go swanetšego.'],
      },
      {
        heading: 'Ge o Šetše o Arabile',
        items: [
          'Emiša kgokagano ye nngwe.',
          'Šireletša diakhaonte tše di amegilego.',
          'Fetoša dintlha tša go tsena tše di senyegilego.',
          'Ikgokaganye le mokgatlo wo o amegago ka kanale ya semmušo.',
          'Lebelela diakhaonte bakeng sa mediro ye e belaetšago.',
          'Bega tiragalo ka dikanale tše di swanetšego.',
          'Nyaka thušo ge tšhelete goba tshedimošo ye bohlokwa e lahlegile.',
        ],
      },
    ],
    example: 'O kgotlile linki ye e belaetšago gomme wa tsenya dintlha tša gago tša go tsena. Bjale o lemoga gore molaetša o ka be e le bofora.',
    activity: {
      prompt: 'Mošongwana: O be o tla Dira Eng?',
      options: [
        'O e hlokomologe.',
        'Tšwela pele go bolela le moromedi.',
        'Šireletša akhaonte gomme o ikgokaganye le mokgatlo wa nnete ka kanale ya semmušo.',
        'Fetišetša linki pele.',
      ],
      correctIndex: 2,
      feedback:
        'Go dira ka pela go ka fokotša kotsi ye nngwe. Šireletša akhaonte gomme o ikgokaganye le mokgatlo wa nnete ka kanale ye e netefaditšwego ka boikemelo.',
    },
    keyTakeaway: 'Ge o nagana gore o forilwe, o se e fihle goba wa e hlokomologa. Dira ka pela go fokotša kotsi ye e ka bago gona.',
  },
  {
    n: 9,
    title: 'Diriša le go Leka Tsebo ya Gago',
    intro:
      'Karolo ya mafelelo e dumelela baithuti go diriša seo ba ithutilego sona maemong ao ba sa a tlwaelang. Morero ke go bona ge e ba baithuti ba ka hlaola, ba nyakišiša le go arabela dikgokagano tše di belaetšago.',
    sections: [],
    activity: { prompt: '', feedback: '' },
    scenarios: [
      {
        label: 'WhatsApp',
        text: 'Dumela, ke tšwa ofising ya thekgo ya baithuti ya yunibesithi ya gago. Tefo ya gago ya tšhoganetšo ya R3,000 e dumeletšwe. Romela dintlha tša gago tša panka bjale gore re e sepetše.',
        tasks: [
          'Hlaola matshwao a temošo.',
          'Hlaola mokgwa wa taolo.',
          'Dira sephetho ge e ba go belaetša.',
          'Hlalosa mabaka a gago.',
          'Kgetha karabelo ye e bolokegilego kudu.',
        ],
      },
      {
        label: 'SMS',
        text: 'KA POTLAKO: Sephuthelwana sa gago se bušetšwa lehono. Lefa tefo ya thomelo ya R20 mo: [link].',
        tasks: ['Nyakišiša molaetša o diriša tshepedišo ya Sehlogo 6.'],
      },
      {
        label: 'Email',
        text: 'Sehlogo: "Temošo ya Mafelelo – Go Emišwa ga Akhaonte"\n\n"Akhaonte ya gago ya yunibesithi e tla šitišwa ka diiri tše 24. Kgotla mo gomme o nee phasewete ya gago go thibela go emišwa."',
        tasks: ['Lekola moromedi, kgopelo, tšhoganetšo, linki le taolo ye e ka bago gona.'],
      },
      {
        label: 'Nyakišišo ye e Thušwago ke AI',
        text: '',
        tasks: [
          'Dira kahlolo ya gago.',
          'Hlaola matshwao a temošo.',
          'Hlalosa mabaka a gago.',
          'Romela mohlala go sedirišwa sa nyakišišo ye e thušwago ke AI.',
          'Sekaseka tlhaloso ya AI.',
          'Bapetša kahlolo ya gago ya mathomo le poeletšo ya AI.',
          'Dira sephetho sa mafelelo.',
        ],
      },
    ],
    reflection: [
      'Ke leswao lefe la temošo leo o le hlaotšego pele?',
      'Na AI e hlaotše ditšhupetšo tše o di hlokometšego?',
      'O tla dira eng ka tsela ye e fapanego ge o amogela molaetša wo o belaetšago nakong e tlago?',
    ],
    keyTakeaway: 'LEMOGA → NYAKIŠIŠA → DIRA SEPHETHO → ARABELA',
  },
];

const TS: TopicContent[] = [
  {
    n: 1,
    title: 'Manghenelo eka Vukanganyisi bya le ka Inthanete',
    intro:
      'Vukanganyisi bya le ka inthanete i mintirho ya vuxisi leyi endleriweke ku kanganyisa vanhu leswaku va nyikela mali, vuxokoxoko bya munhu, vuxokoxoko byo nghena eka akhawunti, kumbe mfikelelo eka tiakhawunti ta xidijitali. Vakanganyisi va tirhisa WhatsApp, SMS na email ku endla leswaku mahungu ya vuxisi ma vonaka ma ri ya xiviri.',
    sections: [
      {
        heading: 'Xana Vukanganyisi bya le ka Inthanete i yini?',
        body: "Vukanganyisi bya le ka inthanete byi humelela loko munhu a tirhisa vuxisi hi vomu hi ku tirhisa pulatifomo ya xidijitali ku khorwisa munhu un'wana leswaku a endla xiendlo lexi vuyerisaka mukanganyisi.",
        items: [
          'Ku rhumela mali.',
          'Ku avelana vuxokoxoko bya munhu.',
          'Ku paluxa tiphaswedi, ti-PIN kumbe ti-OTP.',
          'Ku tikhoma link leyi nga ni khombo kumbe leyi kanakanisaka.',
          'Ku dawuniloda attachment leyi nga hlayisekangiki.',
          'Ku nyika mfikelelo eka akhawunti ya le inthaneteni.',
        ],
      },
      {
        heading: 'Xana Vukanganyisi bya le ka Inthanete byi tirha ku yini?',
        items: ['Ku koka nyingiso.', 'Ku aka ku tshemba.', 'Ku vanga ntshikelelo.', 'Ku kombela xiendlo.', 'Ku vuyeriwa hi nhlamulo.'],
      },
      {
        heading: 'Hikokwalaho ka yini vanhu va wela eka vukanganyisi?',
        items: [
          'Va tshemba murhumeri loyi a vonakaka.',
          'Ku chava ku lahlekeriwa hi mali kumbe mfikelelo wa akhawunti.',
          'Ku tsaka ngopfu hi hakelo kumbe sagwadi.',
          'Ku titwa va tshikileriwa hi nkarhi wa xihatla.',
          'Va navela ku tiva leswi nga eka rungula.',
          'Va tshemba leswaku rungula ri huma eka vulawuri kumbe nhlangano lowu tshembekaka.',
        ],
      },
    ],
    example:
      'XITIVISO XA MALI YA VADYONDZI: XA XIHATLA: Mali ya wena ya mudyondzi yi pfumeleriwile. Tiyisisa vuxokoxoko bya bangi ya wena eka 30 wa timinete ku papalata ku herisiwa. Click laha ku ya mahlweni.',
    activity: {
      prompt:
        'Ntirho: Kuma Scam — hi yini lexi endlaka rungula leri nga henhla ri kanakanisa? Vuyelo bya mali byo nga languteriwangiki, nkarhi wa xihatla, xikombelo xa vuxokoxoko bya munhu/mali, link leyi lavaka xiendlo xa xihatla.',
      feedback:
        'Nyiko ya mali leyi nga languteriwangiki leyi fambisanaka ni xihatla na xikombelo xa vuxokoxoko yi fanele ku tiyisisiwa hi ndlela leyi tiyimeleke yi nga si endliwa.',
    },
    keyTakeaway: 'YIMA → EHLEKETA → TIYISISA',
  },
  {
    n: 2,
    title: 'Vukanganyisi bya WhatsApp',
    intro:
      "WhatsApp yi tirhisiwa ngopfu eka mbulavurisano wa munhu hi xiyexe, wa dyondzo na wa ntshamisano. Ku tolovelana loku ku nga tirhisiwa hi vakanganyisi lava tiendlaka vanhu kumbe minhlangano.",
    sections: [
      {
        heading: 'Tinxaka Leti Tolovelekeke',
        items: [
          'Ku tiendla vanghana, ndyangu, valeteri kumbe minhlangano.',
          'Mintirho ya vuxisi, tibasari, mimphikizano kumbe masagwadi.',
          'Tilinki leti kanakanisaka.',
          'Swikombelo swa mali swa xihatla.',
          'Swikombelo swa tiphaswedi, ti-PIN kumbe ti-OTP.',
        ],
      },
      {
        heading: 'Swikombiso swa Xilemukiso',
        items: [
          'Swikombelo leswi nga languteriwangiki',
          'Ririmi ra xihatla',
          'Swikombelo swa mali',
          'Swikombelo swa vuxokoxoko bya nkoka',
          'Tilinki leti kanakanisaka',
          'Matikhomelo ya murhumeri lama nga tolovelekangiki',
          'Masagwadi lama nga languteriwangiki',
          "Ku tiendla munhu un'wana",
        ],
      },
    ],
    example:
      "Hey, hi mina. Foni ya mina yi lahlekile naswona ndzi tirhisa nomboro leyi swa nkarhi. Ndza kombela ndzi rhumele R800 hi xihatla. Ndza ku tlherisela namadyambu.",
    activity: {
      prompt: 'Ntirho wo Tirhisana — u fanele u endla yini?',
      options: ['Rhumela mali.', 'Kombela vuxokoxoko bya bangi.', 'Vulavula ni munghana wa wena hi ndlela leyi trusted.', 'Forward rungula.'],
      feedback: "Vito leri tolovelekeke kumbe xifaniso xa profile a swi tiyisi vutitivisi. Tiyisisa swikombelo leswi nga languteriwangiki hi ndlela leyi tiyimeleke.",
    },
    keyTakeaway: 'Tshemba munhu ntsena endzhaku ka loko u tiyisisile xikombelo.',
  },
  {
    n: 3,
    title: 'Vukanganyisi bya SMS',
    intro:
      'Vukanganyisi bya SMS byi tirhisa marungula ya text ku khorwisa vaamukeri ku endla swiendlo leswi nga hlayisekangiki. Byi nga vonaka byi huma eka tibangi, tikhamphani ta delivery, vaphakeri va mobile, minhlangano ya mfumo kumbe vukorhokeri byin’wana byo trusted.',
    sections: [
      {
        heading: 'Tinxaka Leti Tolovelekeke',
        items: ['Switiviso swa bangi swa vuxisi', 'Marungula ya delivery ya vuxisi', 'Masagwadi ya vuxisi', 'Swilemukiso swa akhawunti swa vuxisi'],
      },
      {
        heading: 'Swikombiso swa Xilemukiso',
        items: [
          'Marungula lama nga languteriwangiki',
          'Minkarhi ya xihatla',
          'Tilinki leti kanakanisaka',
          'Swikombelo swa vuxokoxoko bya munhu/bangi',
          'Tihakelo leti nga languteriwangiki',
          'Mitsundzuxo ya ku pfala akhawunti',
          'Tinyiko leti vonakaka ti antswa ngopfu ku va ta xiviri',
        ],
      },
    ],
    example: 'XA XIHATLA! Akhawunti ya wena ya bangi yi ta pfariwa namuntlha. Tiyisisa akhawunti ya wena sweswi: [link]',
    activity: {
      prompt: 'Ntirho wo Tirhisana — vona swikombiso swa xilemukiso eka rungula leri nga henhla.',
      feedback:
        'Rungula ri vanga xihatla, ri vula leswaku ri yimela vandla ra timali naswona ri kongomisa mutirhisi eka link. Tiyisisa hi ndlela ya ximfumo ematshan’weni ya swona.',
    },
    keyTakeaway: 'U nga tshuki u pfumelela SMS yi ku tshikilela ku endla xiboho xa xihatla xa mali kumbe akhawunti.',
  },
  {
    n: 4,
    title: 'Vukanganyisi bya Email',
    intro:
      "Vukanganyisi bya email byi ringeta ku kanganyisa vatirhisi hi ti-email ta vuxisi. Byi nga tekelela tibangi, tiyunivhesiti, vathori, switolo swa le ka inthanete kumbe minhlangano yin'wana.",
    sections: [
      {
        heading: 'Leswi u Faneleke u Swi Kambisisa',
        items: ['Adirese ya murhumeri', 'Nhlokomhaka ya rungula', 'Vundzeni bya rungula', 'Tilinki', 'Tiattachment', 'Swikombelo'],
      },
      {
        heading: 'Swikombiso swa Xilemukiso',
        items: [
          'Murhumeri loyi a nga languteriwangiki',
          'Nhlokomhaka ya xihatla/yo chavisa',
          'Xikombelo xa vuxokoxoko byo nghena',
          'Tilinki leti kanakanisaka',
          'Tiattachment leti nga languteriwangiki',
          'Xikombelo lexi nga tolovelekangiki',
        ],
      },
    ],
    example:
      'Subject: "XA XIHATLA – Ku yimisiwa ka Akhawunti ya Yunivhesiti"\n\n"Akhawunti ya wena ya yunivhesiti yi ta yimisiwa namuntlha. Click link leyi nga laha hansi u tiyisisa phaswedi ya wena."',
    activity: {
      prompt: 'Ntirho wo Tirhisana — vona murhumeri, xikombelo, xihatla, link na xikombelo xa vuxokoxoko byo nghena.',
      feedback:
        'Email yi tirhisa ku chava na xihatla ku khutaza ku paluxiwa ka vuxokoxoko byo nghena. U nga nyiki tiphaswedi hi swikombelo swa email leswi nga languteriwangiki; tiyisisa hi ndlela ya ximfumo.',
    },
    keyTakeaway: 'U nga tshembi email ntsena hikuva yi languteka yi ri ya xiphurofexinali. Kambisisa murhumeri, xikombelo, tilinki na xiyimo.',
  },
  {
    n: 5,
    title: 'Ndlela leyi Vakanganyisi va Lawulaka ha yona Vahlaselwa',
    intro: 'Vakanganyisi va tirhisa social engineering na ku lawula miehleketo ku kucetela ndlela leyi vanhu va tekaka swiboho ha yona.',
    sections: [
      {
        heading: 'Tindlela leti Tolovelekeke to Lawula',
        items: [
          'Xihatla – xi vanga ntshikelelo naswona xi hunguta nkarhi wo tiyisisa.',
          'Ku chava – ku xungeta vuyelo byo biha.',
          'Vulawuri – ku tiendla vulawuri byo trusted.',
          'Sagwadi – ku tirhisa ntsako kumbe nkucetelo wa mali.',
          "Ku navela ku tiva – ku khutaza ku click leswaku u kuma swin'wana.",
          'Ku tshemba na ku tolovelana – ku tiendla munhu loyi muhlaselwa a n’wi tivaka.',
        ],
      },
    ],
    example: 'Akhawunti ya wena ya mudyondzi yi ta herisiwa namuntlha loko u nga tiyisisi vuxokoxoko bya wena hi xihatla.',
    activity: {
      prompt: 'Ntirho: Vona Thekiniki yo Lawula',
      options: ['Sagwadi', 'Ku chava na xihatla', 'Ku navela ku tiva', 'Vuhungasi'],
      correctIndex: 1,
      feedback: 'Rungula ri tirhisa ku chava ku herisiwa na xihatla ku tshikilela muamukeri.',
    },
    keyTakeaway: 'Vakanganyisi va tala ku lawula mintlhaveko va nga si kombela vahlaselwa ku endla xiendlo lexi nga hlayisekangiki.',
  },
  {
    n: 6,
    title: 'Ku Fambisa Vulavisisi bya Rungula leri Kanakanisaka',
    intro: 'Ku lemuka leswaku rungula ri vonaka ri kanakanisa swa pfuna, kambe vadyondzi va tlhela va lava ndlela leyi hlelekileke yo ri lavisisa.',
    sections: [
      {
        heading: 'Endlelo ra Vulavisisi leri Tirhekaka',
        items: [
          'YIMA – U nga hatli u click, hlamula, hakela kumbe nyika vuxokoxoko.',
          "KAMBELA MURHUMERI – Vutisa leswaku i mani loyi a ri rhumeleke, loko ri languteriwile, naswona loko ku tiendla munhu un'wana swi koteka.",
          'KAMBELA XIKOMBELO – Vona leswi murhumeri a swi lavaka na loko ku komberiwa mali kumbe vuxokoxoko bya nkoka.',
          'KAMBELA VUXOKOXOKO – Kambisisa tilinki, tiadirese, tiattachment, vuxokoxoko bya murhumeri na ririmi leri nga tolovelekangiki.',
          "VONA SWIKOMBISO SWA XILEMUKISO – Languta xihatla, mixungeto, masagwadi, ku tiendla munhu un'wana na swikombiso swin'wana.",
          'VONA KU LAWULA – Vutisa leswaku rungula ri ringeta ku ku endla u titwa yini.',
          'TIYISISA – Tirhisa xihlovo lexi trusted lexi tiyimeleke.',
          'TEKA XIBOHO – Hlawula xiendlo lexi hlayisekeke: honisa/susa, vika, tihlanganise ni nhlangano wa xiviri, hlayisa akhawunti kumbe lava mpfuno.',
        ],
      },
    ],
    example: 'XA XIHATLA: Akhawunti ya wena ya yunivhesiti yi yimisiwile. Click laha eka 15 wa timinete ku vuyisa mfikelelo.',
    activity: {
      prompt: 'Ntirho: Lavisisa Rungula leri',
      feedback:
        'Rungula ri ni xihatla, ku tiendla munhu un’wana na xikombelo xo click link. Tiyisisa xiviko hi ndlela leyi tiyimeleke ematshan’weni yo click link leyi nyikiweke.',
    },
    keyTakeaway: 'U nga vutisi ntsena "Xana leswi swi languteka swi ri swa xiviri?" Vutisa "Xana ndzi nga tiyisisa leswaku i swa xiviri?"',
  },
  {
    n: 7,
    title: 'Vulavisisi bya Scam hi Mpfuno wa AI',
    intro:
      'AI yi nga pfuna ku xopaxopa mbulavurisano wa xidijitali lowu kanakanisaka. Kambe AI a yi fanelanga ku tekiwa tani hi vulawuri lexi nga endliki swihoxo. Eka modili leyi, AI yi ringanyetiwa tani hi mupfuni wa ku dyondza: xikongomelo xa yona i ku pfuna vadyondzi ku twisisa swikombiso na ku ehleketa, ku nga ri ku fungha rungula ntsena.',
    sections: [
      {
        heading: 'Xana Mudyondzi a nga Rhumela yini?',
        items: ['Marungula ya WhatsApp lama kopiwaka', 'Text ya SMS', 'Vundzeni bya email', 'Swifaniso swa screen', "Mbulavurisano wun'wana wa xidijitali lowu kanakanisaka"],
      },
      {
        heading: 'Ndlela leyi Vulavisisi bya Mpfuno wa AI byi Tirhaka ha yona',
        items: [
          'Mudyondzi u rhumela mbulavurisano lowu kanakanisaka.',
          'Mudyondzi u endla xiboho xo sungula naswona u hlamusela xivangelo.',
          'AI yi xopaxopa vundzeni.',
          "Sisiteme yi vona swikombiso leswi nga kotekaka swo fana ni xihatla, ku tiendla munhu un'wana, tilinki leti kanakanisaka, swikombelo swa mali, swikombelo swa vuxokoxoko bya nkoka na ririmi ro lawula.",
          'AI yi hlamusela swikombiso.',
          'Mudyondzi u pimanisa ku ehleketa ka yena ni nhlamulo.',
          'Mudyondzi u amukela xiyimo lexintshwa ku tirhisa leswi a swi dyondzeke.',
        ],
      },
      {
        heading: 'Swipimelo swa AI',
        items: [
          'AI yi nga endla swihoxo.',
          'Ku funghiwa tani hi "ku hlayisekile" a swi tiyisi vuhlayiseki.',
          'Ku funghiwa tani hi "ku kanakanisa" a swi vuli leswaku vuxisi byi tiyile hi ku tisungulela.',
          'Swiboho swa nkoka swi fanele ku tiyisisiwa hi ndlela leyi tiyimeleke.',
          'Vuyelo bya AI i mpfuno, ku nga ri vumbhoni byo hetelela.',
        ],
      },
      {
        heading: 'Vusirheleri bya Vuxokoxoko na ku Rhumela hi Vuhlayiseki',
        body: 'Loko swi koteka, vuxokoxoko byo tivisa munhu byi fanele ku susiwa byi nga si rhumeriwa. U nga tshuki u rhumela:',
        items: ['Tiphaswedi', 'Ti-OTP', 'Vuxokoxoko bya bangi', 'Tinomboro ta vutitivisi', 'Mbulavurisano wa xihundla', 'Vuxokoxoko bya munhu byo nga lavekiki'],
      },
    ],
    example:
      'XA XIHATLA! Mali ya wena ya mudyondzi yi yimisiwile. Tiyisisa akhawunti ya wena eka 30 wa timinete hi ku tirhisa link leyi.\n\nXihatla – nkarhi wa 30 wa timinete. Ku tiendla munhu un’wana – ku vula leswaku ku yimela nhlangano wa mali ya vadyondzi. Link leyi kanakanisaka – yi kongomisa mudyondzi eka link ematshan’weni ya website ya ximfumo leyi tiyisisiweke hi ndlela leyi tiyimeleke.',
    activity: {
      prompt:
        "Ntirho: Lavisisa hi AI — endla nxopaxopo wa wena, vona swikombiso swa xilemukiso swimbirhi kumbe kufuura, rhumela vundzeni eka xitirhisiwa lexi pfuniwaka hi AI, pimanisa nxopaxopo wa wena ni nxopaxopo wa AI, vona leswi u swi lemukeke na leswi u swi kayiveke eku sunguleni, kutani u hetisa xiyimo lexintshwa.",
      feedback: 'Tirhisa AI ku seketela vulavisisi bya wena, ku nga ri ku siva ku avanyisa ka wena.',
    },
    keyTakeaway: 'Tirhisa AI ku seketela vulavisisi bya wena, ku nga ri ku siva ku avanyisa ka wena.',
  },
  {
    n: 8,
    title: 'Ku Hlamula eka Scam ya le Inthaneteni',
    intro:
      'Ku vona scam i xiyenge xin’we ntsena xa ku va u hlayisekile. Vadyondzi va tlhela va lava ku tiva leswi va faneleke ku swi endla loko va hlangana ni rungula leri kanakanisaka kumbe va lemuka leswaku va nga ha va va tirhisane ni scam.',
    sections: [
      {
        heading: 'Loko U Amukela Rungula leri Kanakanisaka — U nga Endli Leswi',
        items: [
          'Ku click tilinki leti kanakanisaka.',
          'Ku dawuniloda tiattachment leti nga languteriwangiki.',
          'Ku rhumela mali.',
          'Ku nyika tiphaswedi kumbe ti-OTP.',
          'Ku ya mahlweni u bula ni mukanganyisi loko swi nga laveki.',
        ],
      },
      {
        heading: 'Loko U Amukela Rungula leri Kanakanisaka — Endla Leswi',
        items: ['Yima u kambisisa rungula.', 'Tiyisisa vuxokoxoko hi ndlela leyi tiyimeleke.', 'Vika vundzeni byo kanakanisa laha swi faneleke.', 'Susa kumbe blocka murhumeri laha swi faneleke.'],
      },
      {
        heading: 'Loko Se U Hlamurile',
        items: [
          "Yimisa mbulavurisano wun'wana.",
          'Hlayisa tiakhawunti leti khumbekeke.',
          'Cinca vuxokoxoko byo nghena leswi kavanyetiweke.',
          'Tihlanganise ni nhlangano lowu faneleke hi ndlela ya ximfumo.',
          'Langutisisa tiakhawunti ku kuma migingiriko yo kanakanisa.',
          'Vika xiendleko hi tindlela leti faneleke.',
          'Lava mpfuno loko mali kumbe vuxokoxoko bya nkoka byi lahlekile.',
        ],
      },
    ],
    example: 'U click link leyi kanakanisaka naswona u nghenise vuxokoxoko byo login. Sweswi wa lemuka leswaku rungula ri nga ha va ri ri scam.',
    activity: {
      prompt: 'Ntirho: A wu ta Endla yini?',
      options: [
        'Ri honise.',
        'Ya mahlweni u bula ni murhumeri.',
        'Hlayisa akhawunti naswona tihlanganise ni nhlangano wa xiviri hi ndlela ya ximfumo.',
        'Forward link.',
      ],
      correctIndex: 2,
      feedback:
        'Ku endla hi ku hatlisa ku nga hunguta khombo rin’wana. Hlayisa akhawunti naswona tihlanganise ni nhlangano wa xiviri hi ndlela leyi tiyisisiweke hi ndlela leyi tiyimeleke.',
    },
    keyTakeaway: 'Loko u ehleketa leswaku u kanganyisiwile, u nga swi fihli kumbe ku swi honisa. Endla hi ku hatlisa ku hunguta khombo leri nga kotekaka.',
  },
  {
    n: 9,
    title: 'Tirhisa na ku Kambela Vutivi bya Wena',
    intro:
      'Xiyenge xo hetelela xi pfumelela vadyondzi ku tirhisa leswi va swi dyondzeke eka swiyimo leswi va nga swi tiviki. Xikongomelo i ku vona loko vadyondzi va kota ku vona, ku lavisisa na ku hlamula eka mbulavurisano lowu kanakanisaka.',
    sections: [],
    activity: { prompt: '', feedback: '' },
    scenarios: [
      {
        label: 'WhatsApp',
        text: "Hi, ndzi huma ehofisini ya nseketelo wa vadyondzi ya yunivhesiti ya wena. Hakelo ya wena ya xihatla ya R3,000 yi pfumeleriwile. Rhumela vuxokoxoko bya bangi ya wena sweswi leswaku hi yi processa.",
        tasks: [
          'Vona swikombiso swa xilemukiso.',
          'Vona thekiniki yo lawula.',
          'Teka xiboho loko swi kanakanisa.',
          'Hlamusela ku ehleketa ka wena.',
          'Hlawula nhlamulo leyi hlayisekeke ngopfu.',
        ],
      },
      {
        label: 'SMS',
        text: 'XA XIHATLA: Phasela ra wena ri tlherisiwa namuntlha. Hakela R20 ya delivery fee laha: [link].',
        tasks: ['Lavisisa rungula hi ku tirhisa endlelo ra Nhlokomhaka 6.'],
      },
      {
        label: 'Email',
        text: 'Subject: "Xilemukiso xo Hetelela – Ku Yimisiwa ka Akhawunti"\n\n"Akhawunti ya wena ya yunivhesiti yi ta pfariwa eka 24 wa tiawara. Click laha u tlhela u nyika phaswedi ya wena ku sivela ku yimisiwa."',
        tasks: ['Kambisisa murhumeri, xikombelo, xihatla, link na ku lawula loku nga kotekaka.'],
      },
      {
        label: 'Vulavisisi bya Mpfuno wa AI',
        text: '',
        tasks: [
          'Endla ku avanyisa ka wena.',
          'Vona swikombiso swa xilemukiso.',
          'Hlamusela ku ehleketa ka wena.',
          'Rhumela xikombiso eka xitirhisiwa xa vulavisisi lexi pfuniwaka hi AI.',
          'Hlola nhlamuselo ya AI.',
          'Pimanisa ku avanyisa ka wena ko sungula ni nhlamulo ya AI.',
          'Endla xiboho xo hetelela.',
        ],
      },
    ],
    reflection: [
      'Hi xihi xikombiso xa xilemukiso lexi u xi voneke ro sungula?',
      'Xana AI yi vone swikombiso leswi u swi kayiveke?',
      'U ta endla yini hi ndlela leyi hambaneke loko u amukela rungula leri kanakanisaka enkarhini lowu taka?',
    ],
    keyTakeaway: 'LEMUKA → LAVISISA → TEKA XIBOHO → HLAMULA',
  },
];

export const TOPIC_CONTENT: Record<LanguageCode, TopicContent[]> = { en: EN, zu: ZU, nso: NSO, ts: TS };

const EN_QUIZ: TopicQuizQuestion[][] = [
  [
    {
      text: 'What is the main purpose of an online scam?',
      options: ['Provide cybersecurity education', "Deceive a person for the scammer's benefit", 'Improve online communication', 'Verify identity'],
      correct: 1,
    },
    {
      text: 'Which is a common characteristic?',
      options: ['Always spelling mistakes', 'Always unknown numbers', 'Urgency or pressure', 'Always identifiable by appearance'],
      correct: 2,
    },
    {
      text: 'Unexpected money offer + link. What first?',
      options: ['Click', 'Forward', 'Stop and verify independently', 'Provide details'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Which is a warning sign?',
      options: ['Unexpected request for money', 'Normal conversation', 'Verified announcement', 'Expected message'],
      correct: 0,
    },
    {
      text: 'Friend requests money from a new number. What do you do?',
      options: ['Send it', 'Verify through another trusted channel', 'Ask for OTP', 'Forward'],
      correct: 1,
    },
    {
      text: 'Why can impersonation scams work?',
      options: ['They exploit trust', 'Always contain malware', 'Require no communication', 'Only target businesses'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Unexpected banking SMS with a link?',
      options: ['Click', 'Reply', "Verify through the bank's official channel", 'Forward'],
      correct: 2,
    },
    {
      text: 'Which is a warning sign?',
      options: ['Unexpected account warning', 'Expected message', 'Verified notification', 'Ordinary conversation'],
      correct: 0,
    },
    {
      text: 'Why treat suspicious links carefully?',
      options: ['They may lead to fraudulent websites or unsafe actions', 'They always delete your phone', 'They cannot contain scams', 'They are always safe'],
      correct: 0,
    },
  ],
  [
    {
      text: 'What should you examine?',
      options: ['Sender information', 'Font size only', 'Paragraph count', 'Signature colour'],
      correct: 0,
    },
    {
      text: 'Email asks for your password. What do you do?',
      options: ['Provide it', 'Click', 'Verify independently and do not disclose it', 'Forward'],
      correct: 2,
    },
    {
      text: 'Which is suspicious?',
      options: ['Unexpected email + urgency + credential request', 'Expected email', 'Independently verified official information', 'Routine notification'],
      correct: 0,
    },
  ],
  [
    {
      text: '"Act within 10 minutes or lose your money."',
      options: ['Urgency', 'Curiosity', 'Trust', 'Reward'],
      correct: 0,
    },
    {
      text: 'Why impersonate trusted organisations?',
      options: ['To make communication appear credible', 'To provide customer service', 'To improve security', 'To teach users'],
      correct: 0,
    },
    {
      text: 'What is social engineering?',
      options: ['Manipulating people into actions that benefit an attacker', 'Hardware', 'Social media', 'Password manager'],
      correct: 0,
    },
  ],
  [
    {
      text: 'What should you do first?',
      options: ['Click', 'STOP and avoid immediate action', 'Send money', 'Reply'],
      correct: 1,
    },
    {
      text: 'Why independently verify?',
      options: ['The message may provide false contact information', 'Verification is unnecessary', 'Impersonation is impossible', 'Links are always trustworthy'],
      correct: 0,
    },
    {
      text: 'Safest sequence?',
      options: ['Click → provide → verify', 'Respond → pay → investigate', 'Stop → examine → identify → verify → decide', 'Forward → click → respond'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Primary educational purpose of the AI-assisted feature?',
      options: ['Make all decisions', 'Replace learning', 'Help students analyse suspicious communications and understand warning signs', 'Guarantee legitimacy'],
      correct: 2,
    },
    {
      text: 'Which should NOT be uploaded?',
      options: ['Fictional scam example', 'Message with sensitive banking information', 'Simulated SMS', 'Synthetic email'],
      correct: 1,
    },
    {
      text: 'Why not blindly trust AI?',
      options: ['AI can make mistakes', 'AI never analyses messages', 'AI cannot identify patterns', 'AI is always incorrect'],
      correct: 0,
    },
  ],
  [
    {
      text: 'After clicking a suspicious link and providing a password?',
      options: ['Do nothing', 'Secure the account and change the compromised password', 'Send the password to the sender', 'Forward the link'],
      correct: 1,
    },
    {
      text: 'How verify a suspicious banking message?',
      options: ['Link in the message', 'Number provided by sender', 'Independently obtained official channel', 'Another suspicious message'],
      correct: 2,
    },
    {
      text: 'Why report?',
      options: ['It can help organisations and relevant authorities respond', 'It guarantees arrest', 'Makes the message legitimate', 'Prevents all future scams'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Unexpected WhatsApp money offer + banking details. Safest response?',
      options: ['Provide details', 'Click', 'Independently verify before action', 'Forward'],
      correct: 2,
    },
    {
      text: 'Strongest reason to treat a message as suspicious?',
      options: ['Urgency + unexpected request + suspicious link', 'Normal conversation + expected sender', 'Official information independently verified', 'Routine notification'],
      correct: 0,
    },
    {
      text: 'Purpose of AI-assisted investigation?',
      options: ['Replace judgement', 'Guarantee every message is a scam', 'Support identification and understanding of potential indicators', 'Collect private messages'],
      correct: 2,
    },
    {
      text: 'Best process?',
      options: ['Click → respond → verify', 'Trust → act → investigate', 'Recognise → investigate → decide → respond', 'Ignore → forward → respond'],
      correct: 2,
    },
    {
      text: 'Unsure whether a suspicious message is legitimate?',
      options: [
        'Trust it because it looks professional',
        'Use the investigation process, independently verify and use AI assistance where appropriate',
        'Send money',
        'Give the sender an OTP',
      ],
      correct: 1,
    },
  ],
];

const ZU_QUIZ: TopicQuizQuestion[][] = [
  [
    {
      text: 'Iyini inhloso enkulu yomkhonyovu we-inthanethi?',
      options: ['Ukuhlinzeka ngemfundo yezokuphepha ku-inthanethi', 'Ukukhohlisa umuntu ukuze kuzuze umkhonyovu', 'Ukuthuthukisa ukuxhumana ku-inthanethi', 'Ukuqinisekisa ubuwena'],
      correct: 1,
    },
    {
      text: 'Yisiphi isici esivamile?',
      options: ['Njalo amaphutha esipelingi', 'Njalo izinombolo ezingaziwa', 'Ukuphuthuma noma ingcindezi', 'Njalo kuyabonakala ngokubukeka'],
      correct: 2,
    },
    {
      text: 'Ukunikezwa kwemali okungalindelekile + isixhumanisi. Yini yokuqala?',
      options: ['Chofoza', 'Dlulisela kwabanye', 'Yima bese uqinisekisa ngokuzimela', 'Nikeza imininingwane'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Yisiphi isimpawu sexwayiso?',
      options: ['Isicelo semali esingalindelekile', 'Ingxoxo evamile', 'Isimemezelo esiqinisekisiwe', 'Umyalezo olindelekile'],
      correct: 0,
    },
    {
      text: 'Umngani ucela imali ngenombolo entsha. Wenzani?',
      options: ['Yithumele', 'Qinisekisa ngesinye isiteshi esithembekile', 'Cela i-OTP', 'Dlulisela kwabanye'],
      correct: 1,
    },
    {
      text: 'Kungani imikhonyovu yokuzenza omunye umuntu ingasebenza?',
      options: ['Isebenzisa kabi ukwethenjwa', 'Njalo iqukethe i-malware', 'Ayidingi ukuxhumana', 'Iqondise amabhizinisi kuphela'],
      correct: 0,
    },
  ],
  [
    {
      text: 'I-SMS yasebhange engalindelekile enesixhumanisi?',
      options: ['Chofoza', 'Phendula', 'Qinisekisa ngesiteshi esisemthethweni sebhange', 'Dlulisela kwabanye'],
      correct: 2,
    },
    {
      text: 'Yisiphi isimpawu sexwayiso?',
      options: ['Isexwayiso se-akhawunti esingalindelekile', 'Umyalezo olindelekile', 'Isaziso esiqinisekisiwe', 'Ingxoxo evamile'],
      correct: 0,
    },
    {
      text: 'Kungani kufanele uphathe izixhumanisi ezisolisa ngokucophelela?',
      options: ['Zingaholela kumawebhusayithi enkohliso noma ezenzweni ezingaphephile', 'Njalo zisusa yonke into efonini yakho', 'Azikwazi ukuqukatha imikhonyovu', 'Njalo ziphephile'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Yini okufanele uyihlole?',
      options: ['Ulwazi lomthumeli', 'Usayizi wefonti kuphela', 'Inani lamapharagrafu', 'Umbala wesiginesha'],
      correct: 0,
    },
    {
      text: 'I-email icela iphasiwedi yakho. Wenzani?',
      options: ['Yihlinzeke', 'Chofoza', 'Qinisekisa ngokuzimela futhi ungayivezi', 'Dlulisela kwabanye'],
      correct: 2,
    },
    {
      text: 'Yikuphi okusolisa?',
      options: ['I-email engalindelekile + ukuphuthuma + isicelo semininingwane yokungena', 'I-email elindelekile', 'Ulwazi olusemthethweni oluqinisekiswe ngokuzimela', 'Isaziso esivamile'],
      correct: 0,
    },
  ],
  [
    {
      text: '"Thatha isenzo kungakapheli imizuzu eyi-10 noma ulahlekelwe yimali yakho."',
      options: ['Ukuphuthuma', 'Ilukuluku', 'Ukwethenjwa', 'Umklomelo'],
      correct: 0,
    },
    {
      text: 'Kungani bezishaya izinhlangano ezethembekile?',
      options: ['Ukwenza ukuxhumana kubonakale kuthembekile', 'Ukuhlinzeka ngesevisi yamakhasimende', 'Ukuthuthukisa ukuphepha', 'Ukufundisa abasebenzisi'],
      correct: 0,
    },
    {
      text: 'Iyini i-social engineering?',
      options: ['Ukulawula abantu ukuze benze izenzo ezizuzisa umhlaseli', 'Izingxenyekazi zekhompyutha', 'Izinkundla zokuxhumana', 'Isiphathi samaphasiwedi'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Yini okufanele uyenze kuqala?',
      options: ['Chofoza', 'YIMA futhi ugweme isenzo esisheshayo', 'Thumela imali', 'Phendula'],
      correct: 1,
    },
    {
      text: 'Kungani kufanele uqinisekise ngokuzimela?',
      options: ['Umyalezo ungase unikeze ulwazi lokuxhumana olungamanga', 'Ukuqinisekisa akudingekile', 'Ukuzenza omunye umuntu akunakwenzeka', 'Izixhumanisi zithembekile njalo'],
      correct: 0,
    },
    {
      text: 'Yikuphi ukulandelana okuphephe kakhulu?',
      options: ['Chofoza → nikeza → qinisekisa', 'Phendula → khokha → hlola', 'Yima → hlola → khomba → qinisekisa → nquma', 'Dlulisela kwabanye → chofoza → phendula'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Iyini inhloso yemfundo eyinhloko yesici esisizwa yi-AI?',
      options: ['Ukwenza zonke izinqumo', 'Ukubuyisela ukufunda', 'Ukusiza abafundi bahlaziye ukuxhumana okusolisayo futhi baqonde izimpawu zexwayiso', 'Ukuqinisekisa ukuba semthethweni'],
      correct: 2,
    },
    {
      text: 'Yikuphi OKUNGAFANELE kulayishwe?',
      options: ['Isibonelo somkhonyovu esiqanjiwe', 'Umyalezo onolwazi olubucayi lwasebhange', 'I-SMS elingisiwe', 'I-email yokwenziwa'],
      correct: 1,
    },
    {
      text: 'Kungani ungayethembi ngokungaboni i-AI?',
      options: ['I-AI ingenza amaphutha', 'I-AI ayihlaziyi imiyalezo', 'I-AI ayikwazi ukukhomba amaphethini', 'I-AI ihlale ingalungile'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Ngemva kokuchofoza isixhumanisi esisolisa nokunikeza iphasiwedi?',
      options: ['Ungenzi lutho', 'Vikela i-akhawunti bese ushintsha iphasiwedi ebonakele', 'Thumela iphasiwedi kumthumeli', 'Dlulisela isixhumanisi kwabanye'],
      correct: 1,
    },
    {
      text: 'Ungawuqinisekisa kanjani umyalezo wasebhange osolisayo?',
      options: ['Isixhumanisi esisemlayezweni', 'Inombolo enikezwe umthumeli', 'Isiteshi esisemthethweni esitholwe ngokuzimela', 'Omunye umyalezo osolisayo'],
      correct: 2,
    },
    {
      text: 'Kungani kubikwa?',
      options: ['Kungasiza izinhlangano neziphathimandla ezifanele ziphendule', 'Kuqinisekisa ukuboshwa', 'Kwenza umyalezo ube semthethweni', 'Kuvimbela yonke imikhonyovu yesikhathi esizayo'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Ukunikezwa kwemali okungalindelekile ku-WhatsApp + imininingwane yasebhange. Yimpendulo ephephe kakhulu?',
      options: ['Nikeza imininingwane', 'Chofoza', 'Qinisekisa ngokuzimela ngaphambi kwesenzo', 'Dlulisela kwabanye'],
      correct: 2,
    },
    {
      text: 'Isizathu esiqine kakhulu sokuphatha umyalezo njengosolisayo?',
      options: ['Ukuphuthuma + isicelo esingalindelekile + isixhumanisi esisolisa', 'Ingxoxo evamile + umthumeli olindelekile', 'Ulwazi olusemthethweni oluqinisekiswe ngokuzimela', 'Isaziso esivamile'],
      correct: 0,
    },
    {
      text: 'Inhloso yokuhlola ngosizo lwe-AI?',
      options: ['Ukubuyisela ukwahlulela', 'Ukuqinisekisa ukuthi yonke imiyalezo ingumkhonyovu', 'Ukusekela ukukhonjwa nokuqonda izinkomba ezingaba khona', 'Ukuqoqa imiyalezo yangasese'],
      correct: 2,
    },
    {
      text: 'Iyiphi inqubo engcono kakhulu?',
      options: ['Chofoza → phendula → qinisekisa', 'Themba → yenza → hlola', 'Bona → hlola → nquma → phendula', 'Unganaki → dlulisela kwabanye → phendula'],
      correct: 2,
    },
    {
      text: 'Awunasiqiniseko sokuthi umyalezo osolisayo usemthethweni yini?',
      options: [
        'Wethembe ngoba ubukeka usezingeni lobungcweti',
        'Sebenzisa inqubo yokuhlola, qinisekisa ngokuzimela futhi usebenzise usizo lwe-AI lapho kufanele',
        'Thumela imali',
        'Nikeza umthumeli i-OTP',
      ],
      correct: 1,
    },
  ],
];

const NSO_QUIZ: TopicQuizQuestion[][] = [
  [
    {
      text: 'Morero wo mogolo wa bofora bja inthaneteng ke eng?',
      options: ['Go fa thuto ya tšhireletšo ya saeba', "Go fora motho bakeng sa kholego ya mofori", 'Go kaonafatša kgokagano ya inthaneteng', 'Go netefatša boitsebišo'],
      correct: 1,
    },
    {
      text: 'Ke sefe seo e lego seka se se tlwaelegilego?',
      options: ['Diphošo tša mopeleto ka mehla', 'Dinomoro tše di sa tsebjwego ka mehla', 'Tšhoganetšo goba kgatelelo', 'Go tsebja ka ponagalo ka mehla'],
      correct: 2,
    },
    {
      text: 'Tlhahiso ya tšhelete ye e sa letelwago + linki. Sa pele ke eng?',
      options: ['Kgotla', 'Fetišetša pele', 'Ema gomme o netefatše ka boikemelo', 'Nea dintlha'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Ke sefe seo e lego leswao la temošo?',
      options: ['Kgopelo ya tšhelete ye e sa letelwago', 'Poledišano ye e tlwaelegilego', 'Tsebišo ye e netefaditšwego', 'Molaetša wo o letetšwego'],
      correct: 0,
    },
    {
      text: 'Mogwera o kgopela tšhelete go tšwa nomorong ye mpsha. O dira eng?',
      options: ['E romele', 'Netefatša ka kanale ye nngwe ye e tshepagalago', 'Kgopela OTP', 'Fetišetša pele'],
      correct: 1,
    },
    {
      text: "Ke ka baka la'ng bofora bja go itira bo ka šoma?",
      options: ['Bo diriša tshepo gampe', 'Ka mehla bo na le malware', 'Ga bo nyake kgokagano', 'Bo hlasela dikgwebo fela'],
      correct: 0,
    },
  ],
  [
    {
      text: 'SMS ya panka ye e sa letelwago ye e nago le linki?',
      options: ['Kgotla', 'Araba', 'Netefatša ka kanale ya semmušo ya panka', 'Fetišetša pele'],
      correct: 2,
    },
    {
      text: 'Ke sefe seo e lego leswao la temošo?',
      options: ['Temošo ya akhaonte ye e sa letelwago', 'Molaetša wo o letetšwego', 'Tsebišo ye e netefaditšwego', 'Poledišano ye e tlwaelegilego'],
      correct: 0,
    },
    {
      text: "Ke ka baka la'ng o swanetše go swara dilinki tše di belaetšago ka tlhokomelo?",
      options: ['Di ka iša go diwepsaete tša bofora goba ditiro tše di sa bolokegago', 'Di phumola founo ya gago ka mehla', 'Di ka se be le bofora', 'Di bolokegile ka mehla'],
      correct: 0,
    },
  ],
  [
    {
      text: 'O swanetše go lekola eng?',
      options: ['Tshedimošo ya moromedi', 'Bogolo bja fonte fela', 'Palo ya dirapa', 'Mmala wa mosaeno'],
      correct: 0,
    },
    {
      text: 'Email e kgopela phasewete ya gago. O dira eng?',
      options: ['E nee', 'Kgotla', 'Netefatša ka boikemelo gomme o se e utolle', 'Fetišetša pele'],
      correct: 2,
    },
    {
      text: 'Ke sefe se se belaetšago?',
      options: ['Email ye e sa letelwago + tšhoganetšo + kgopelo ya dintlha tša go tsena', 'Email ye e letetšwego', 'Tshedimošo ya semmušo ye e netefaditšwego ka boikemelo', 'Tsebišo ya tlwaelo'],
      correct: 0,
    },
  ],
  [
    {
      text: '"Dira ka metsotso ye 10 goba o lahlegelwe ke tšhelete ya gago."',
      options: ['Tšhoganetšo', 'Tšhomišo ya kgahlego', 'Tshepo', 'Moputso'],
      correct: 0,
    },
    {
      text: "Ke ka baka la'ng ba itira mekgatlo ye e tshepagalago?",
      options: ['Go dira gore kgokagano e bonagale e tshepagala', 'Go fa tirelo ya bareki', 'Go kaonafatša tšhireletšo', 'Go ruta badiriši'],
      correct: 0,
    },
    {
      text: 'Social engineering ke eng?',
      options: ['Go laola batho gore ba dire ditiro tše di holago mohlasedi', 'Hardware', 'Social media', 'Selaodi sa diphasewete'],
      correct: 0,
    },
  ],
  [
    {
      text: 'O swanetše go dira eng pele?',
      options: ['Kgotla', 'EMA gomme o efoge tiro ya ka pela', 'Romela tšhelete', 'Araba'],
      correct: 1,
    },
    {
      text: "Ke ka baka la'ng o netefatša ka boikemelo?",
      options: ['Molaetša o ka fa tshedimošo ya kgokagano ya maaka', 'Netefatšo ga e hlokagale', 'Go itira motho yo mongwe ga go kgonege', 'Dilinki di tshepagala ka mehla'],
      correct: 0,
    },
    {
      text: 'Tatelano ye e bolokegilego kudu?',
      options: ['Kgotla → nea → netefatša', 'Araba → lefa → nyakišiša', 'Ema → lekola → hlaola → netefatša → dira sephetho', 'Fetišetša pele → kgotla → araba'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Morero wo mogolo wa thuto wa karolo ye e thušwago ke AI?',
      options: ['Go dira diphetho ka moka', 'Go tšeela thuto legato', 'Go thuša baithuti go sekaseka dikgokagano tše di belaetšago le go kwešiša matshwao a temošo', 'Go netefatša gore ke ya nnete'],
      correct: 2,
    },
    {
      text: 'Ke sefe seo SE SA swanelago go taoneloutwa?',
      options: ['Mohlala wa bofora wa maitirelo', 'Molaetša wo o nago le tshedimošo ya panka ye bohlokwa', 'SMS ye e dirilwego bjalo ka mohlala', 'Email ya maitirelo'],
      correct: 1,
    },
    {
      text: "Ke ka baka la'ng o sa swanela go tshepa AI ka bofofu?",
      options: ['AI e ka dira diphošo', 'AI ga e ke e sekaseke melaetša', 'AI ga e kgone go hlaola dipaterone', 'AI e foša ka mehla'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Ka morago ga go kgotla linki ye e belaetšago le go fa phasewete?',
      options: ['O se dire selo', 'Šireletša akhaonte gomme o fetoše phasewete ye e senyegilego', 'Romela phasewete go moromedi', 'Fetišetša linki pele'],
      correct: 1,
    },
    {
      text: 'O netefatša bjang molaetša wa panka wo o belaetšago?',
      options: ['Linki ka molaetšeng', 'Nomoro ye e filwego ke moromedi', 'Kanale ya semmušo ye e hweditšwego ka boikemelo', 'Molaetša o mongwe wo o belaetšago'],
      correct: 2,
    },
    {
      text: "Ke ka baka la'ng o bega?",
      options: ['Go ka thuša mekgatlo le balaodi ba maleba go arabela', 'Go netefatša go swarwa', 'Go dira molaetša gore e be wa nnete', 'Go thibela bofora ka moka bja ka moso'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Tlhahiso ya tšhelete ya WhatsApp ye e sa letelwago + dintlha tša panka. Karabelo ye e bolokegilego kudu?',
      options: ['Nea dintlha', 'Kgotla', 'Netefatša ka boikemelo pele ga tiro', 'Fetišetša pele'],
      correct: 2,
    },
    {
      text: 'Lebaka le matla kudu la go swara molaetša bjalo ka wo o belaetšago?',
      options: ['Tšhoganetšo + kgopelo ye e sa letelwago + linki ye e belaetšago', 'Poledišano ya tlwaelo + moromedi yo a letetšwego', 'Tshedimošo ya semmušo ye e netefaditšwego ka boikemelo', 'Tsebišo ya tlwaelo'],
      correct: 0,
    },
    {
      text: 'Morero wa nyakišišo ye e thušwago ke AI?',
      options: ['Go tšeela kahlolo legato', 'Go netefatša gore molaetša wo mongwe le wo mongwe ke bofora', 'Go thekga go hlaola le go kwešiša ditšhupetšo tše di ka bago gona', 'Go kgoboketša melaetša ya poraebete'],
      correct: 2,
    },
    {
      text: 'Tshepedišo ye kaone?',
      options: ['Kgotla → araba → netefatša', 'Tshepa → dira → nyakišiša', 'Lemoga → nyakišiša → dira sephetho → arabela', 'Hlokomologa → fetišetša pele → araba'],
      correct: 2,
    },
    {
      text: 'Ga o na bonnete ge e ba molaetša wo o belaetšago ke wa nnete?',
      options: [
        'O tshepe ka gobane o bonagala e le wa profešenale',
        'Diriša tshepedišo ya nyakišišo, netefatša ka boikemelo gomme o diriše thušo ya AI moo go swanetšego',
        'Romela tšhelete',
        'Nea moromedi OTP',
      ],
      correct: 1,
    },
  ],
];

const TS_QUIZ: TopicQuizQuestion[][] = [
  [
    {
      text: 'Hi wihi xikongomelo lexikulu xa scam ya le inthaneteni?',
      options: ['Ku nyika dyondzo ya vuhlayiseki bya le ka inthanete', 'Ku kanganyisa munhu leswaku mukanganyisi a vuyeriwa', 'Ku antswisa mbulavurisano wa le inthaneteni', 'Ku tiyisisa vutitivisi'],
      correct: 1,
    },
    {
      text: 'Hi xihi xivumbeko lexi tolovelekeke?',
      options: ['Minkarhi hinkwayo swihoxo swa mapeletelo', 'Minkarhi hinkwayo tinomboro leti nga tiviwiki', 'Xihatla kumbe ntshikelelo', 'Minkarhi hinkwayo swi vonaka hi xivumbeko'],
      correct: 2,
    },
    {
      text: 'Nyiko ya mali yo nga languteriwangiki + link. U sungula hi yini?',
      options: ['Click', 'Forward', 'Yima u tlhela u tiyisisa hi ndlela leyi tiyimeleke', 'Nyika vuxokoxoko'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Hi xihi xikombiso xa xilemukiso?',
      options: ['Xikombelo xa mali lexi nga languteriwangiki', 'Mbulavurisano wa ntolovelo', 'Xitiviso lexi tiyisisiweke', 'Rungula leri languteriweke'],
      correct: 0,
    },
    {
      text: 'Munghana u kombela mali hi nomboro leyintshwa. U endla yini?',
      options: ['Yi rhumele', 'Tiyisisa hi ndlela yin’wana leyi trusted', 'Kombela OTP', 'Forward'],
      correct: 1,
    },
    {
      text: 'Hikokwalaho ka yini vukanganyisi byo tiendla munhu byi tirha?',
      options: ['Byi tirhisa ku tshemba', 'Minkarhi hinkwako byi ni malware', 'A byi lavi mbulavurisano', 'Byi kongomisa mabindzu ntsena'],
      correct: 0,
    },
  ],
  [
    {
      text: 'SMS ya bangi leyi nga languteriwangiki leyi nga ni link?',
      options: ['Click', 'Reply', 'Tiyisisa hi ndlela ya ximfumo ya bangi', 'Forward'],
      correct: 2,
    },
    {
      text: 'Hi xihi xikombiso xa xilemukiso?',
      options: ['Xilemukiso xa akhawunti lexi nga languteriwangiki', 'Rungula leri languteriweke', 'Xitiviso lexi tiyisisiweke', 'Mbulavurisano wa ntolovelo'],
      correct: 0,
    },
    {
      text: 'Hikokwalaho ka yini u fanele u khoma tilinki leti kanakanisaka hi vukheta?',
      options: ['Ti nga yisa eka tiwebsite ta vuxisi kumbe swiendlo leswi nga hlayisekangiki', 'Minkarhi hinkwako ti susa foni ya wena', 'A ti nge vi ni scams', 'Minkarhi hinkwako ti hlayisekile'],
      correct: 0,
    },
  ],
  [
    {
      text: 'U fanele u kambisisa yini?',
      options: ['Vuxokoxoko bya murhumeri', 'Sayizi ya font ntsena', 'Nhlayo ya tipharagrafu', 'Muhlovo wa signature'],
      correct: 0,
    },
    {
      text: 'Email yi kombela phaswedi ya wena. U endla yini?',
      options: ['Yi nyike', 'Click', 'Tiyisisa hi ndlela leyi tiyimeleke naswona u nga yi paluxi', 'Forward'],
      correct: 2,
    },
    {
      text: 'Hi xihi lexi kanakanisaka?',
      options: ['Email leyi nga languteriwangiki + xihatla + xikombelo xa vuxokoxoko byo nghena', 'Email leyi languteriweke', 'Vuxokoxoko bya ximfumo byi tiyisisiweke hi ndlela leyi tiyimeleke', 'Xitiviso xa ntolovelo'],
      correct: 0,
    },
  ],
  [
    {
      text: '"Endla eka 10 wa timinete kumbe u lahlekeriwa hi mali ya wena."',
      options: ['Xihatla', 'Ku navela ku tiva', 'Ku tshemba', 'Sagwadi'],
      correct: 0,
    },
    {
      text: 'Hikokwalaho ka yini va tiendla minhlangano leyi trusted?',
      options: ['Ku endla leswaku mbulavurisano wu vonaka wu khorwisa', 'Ku nyika vukorhokeri bya vaxavi', 'Ku antswisa vuhlayiseki', 'Ku dyondzisa vatirhisi'],
      correct: 0,
    },
    {
      text: 'Xana social engineering i yini?',
      options: ['Ku lawula vanhu leswaku va endla swiendlo leswi vuyerisaka muhlaseri', 'Hardware', 'Social media', 'Password manager'],
      correct: 0,
    },
  ],
  [
    {
      text: 'U fanele u endla yini ro sungula?',
      options: ['Click', 'YIMA naswona papalata xiendlo xa xihatla', 'Rhumela mali', 'Reply'],
      correct: 1,
    },
    {
      text: 'Hikokwalaho ka yini u tiyisisa hi ndlela leyi tiyimeleke?',
      options: ['Rungula ri nga nyika vuxokoxoko bya vuxisi byo tihlanganisa', 'Ku tiyisisa a swi laveki', 'Ku tiendla munhu un’wana a swi koteki', 'Tilinki minkarhi hinkwako ta trusted'],
      correct: 0,
    },
    {
      text: 'Nxaxamelo lowu hlayisekeke ngopfu?',
      options: ['Click → nyika → tiyisisa', 'Hlamula → hakela → lavisisa', 'Yima → kambisisa → vona → tiyisisa → teka xiboho', 'Forward → click → hlamula'],
      correct: 2,
    },
  ],
  [
    {
      text: 'Xikongomelo lexikulu xa dyondzo xa xivumbeko lexi pfuniwaka hi AI?',
      options: ['Ku endla swiboho hinkwako', 'Ku siva ku dyondza', 'Ku pfuna vadyondzi ku xopaxopa mbulavurisano lowu kanakanisaka na ku twisisa swikombiso swa xilemukiso', 'Ku tiyisisa vutshembeki'],
      correct: 2,
    },
    {
      text: 'Hi xihi lexi nga FANELANGIKI ku uploadiwa?',
      options: ['Xikombiso xa scam xa vutumbuluxi', 'Rungula leri nga ni vuxokoxoko bya bangi bya nkoka', 'SMS leyi fanisiweke', 'Email yo endliwa'],
      correct: 1,
    },
    {
      text: 'Hikokwalaho ka yini u nga fanelanga ku tshemba AI hi mahlo lama pfalekeke?',
      options: ['AI yi nga endla swihoxo', "AI a yi tshuki yi xopaxopa marungula", 'AI a yi koti ku vona tiphetheni', 'AI minkarhi hinkwako yi hoxile'],
      correct: 0,
    },
  ],
  [
    {
      text: 'Endzhaku ko click link leyi kanakanisaka u tlhela u nyika phaswedi?',
      options: ['U nga endli nanchumu', 'Hlayisa akhawunti naswona cinca phaswedi leyi kavanyetiweke', 'Rhumela phaswedi eka murhumeri', 'Forward link'],
      correct: 1,
    },
    {
      text: 'U tiyisisa ku yini rungula ra bangi leri kanakanisaka?',
      options: ['Link leyi nga eka rungula', 'Nomboro leyi nyikiweke hi murhumeri', 'Ndlela ya ximfumo leyi kumiweke hi ndlela leyi tiyimeleke', "Rungula rin'wana leri kanakanisaka"],
      correct: 2,
    },
    {
      text: 'Hikokwalaho ka yini u vika?',
      options: ['Swi nga pfuna minhlangano na valawuri lava faneleke ku hlamula', 'Swi tiyisisa ku khomiwa', 'Swi endla rungula ri va ra xiviri', 'Swi sivela scams hinkwato ta nkarhi lowu taka'],
      correct: 0,
    },
  ],
  [
    {
      text: "Nyiko ya mali ya WhatsApp yo nga languteriwangiki + vuxokoxoko bya bangi. Nhlamulo leyi hlayisekeke ngopfu?",
      options: ['Nyika vuxokoxoko', 'Click', 'Tiyisisa hi ndlela leyi tiyimeleke u nga si endla xiendlo', 'Forward'],
      correct: 2,
    },
    {
      text: 'Xivangelo xo kuatisa ngopfu ku khoma rungula tani hi leri kanakanisaka?',
      options: ['Xihatla + xikombelo lexi nga languteriwangiki + link leyi kanakanisaka', 'Mbulavurisano wa ntolovelo + murhumeri loyi a languteriweke', 'Vuxokoxoko bya ximfumo byi tiyisisiweke hi ndlela leyi tiyimeleke', 'Xitiviso xa ntolovelo'],
      correct: 0,
    },
    {
      text: 'Xikongomelo xa vulavisisi bya mpfuno wa AI?',
      options: ['Ku siva ku avanyisa', "Ku tiyisisa leswaku rungula rin'wana ni rin'wana i scam", 'Ku seketela ku vona na ku twisisa swikombiso leswi nga kotekaka', 'Ku hlengeleta marungula ya xihundla'],
      correct: 2,
    },
    {
      text: 'Endlelo lerinene ngopfu?',
      options: ['Click → hlamula → tiyisisa', 'Tshemba → endla → lavisisa', 'Lemuka → lavisisa → teka xiboho → hlamula', 'Honisa → forward → hlamula'],
      correct: 2,
    },
    {
      text: 'A wu tiyiseki loko rungula leri kanakanisaka ri ri ra xiviri?',
      options: [
        'Ri tshembe hikuva ri languteka ri ri ra xiphurofexinali',
        'Tirhisa endlelo ra vulavisisi, tiyisisa hi ndlela leyi tiyimeleke naswona tirhisa mpfuno wa AI laha swi faneleke',
        'Rhumela mali',
        'Nyika murhumeri OTP',
      ],
      correct: 1,
    },
  ],
];

export const TOPIC_QUIZZES: Record<LanguageCode, TopicQuizQuestion[][]> = { en: EN_QUIZ, zu: ZU_QUIZ, nso: NSO_QUIZ, ts: TS_QUIZ };

export function getTopicContent(lang: LanguageCode, n: number): TopicContent | undefined {
  const topics = TOPIC_CONTENT[lang] ?? TOPIC_CONTENT.en;
  return topics.find((t) => t.n === n);
}

export function getTopicQuiz(lang: LanguageCode, n: number): TopicQuizQuestion[] | undefined {
  if (n < 1 || n > 9) return undefined;
  const quizzes = TOPIC_QUIZZES[lang] ?? TOPIC_QUIZZES.en;
  return quizzes[n - 1];
}

/**
 * The topic 9 capstone knowledge check, adapted into the shape the shared `scoreQuiz`/result-screen
 * pipeline expects. The source gives no per-question topic label for these, so `area`/`topic` are
 * set to the capstone's own title rather than invented per-question labels.
 */
export function getCapstoneQuestions(lang: LanguageCode): Question[] {
  const quiz = getTopicQuiz(lang, 9) ?? [];
  const topic = getTopicContent(lang, 9);
  const area = topic?.title ?? 'Online Scams';
  return quiz.map((q) => ({
    topic: area,
    area,
    text: q.text,
    options: q.options,
    correct: q.correct,
    explain: '',
  }));
}
