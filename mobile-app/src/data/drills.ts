import type { LanguageCode } from '@/i18n';

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

// AI-TRANSLATED — NOT A NATIVE-SPEAKER SOURCE.
// The three examples above, translated by Claude on 2026-10-09 at the researcher's request so the
// saved examples match the language the rest of the app is in. The team's own native-language notes
// translate their example scam messages too, so these follow that precedent. Not yet reviewed by a
// native speaker. Only the wording changes: the channel, the sender details, the web address, the
// amounts and whether each message is a scam are identical to the English, and must stay that way
// because a student's saved answers are stored by position.
const TRANSLATED_DRILLS: Partial<Record<LanguageCode, Drill[]>> = {
  zu: [
    {
      channel: 'SMS',
      from: 'Ikhodi emfushane engaziwa',
      body: 'I-SARS: Imali yakho yentela ebuyiselwayo engu-R7 214,00 isilungile. Yifune kungakapheli amahora angama-24: sars-refund-claim.net/za',
      isScam: true,
      explain: 'I-SARS ayilokothi ithumele izixhumanisi zokubuyiselwa imali nge-SMS, futhi le webhusayithi akuyona i-sars.gov.za.',
    },
    {
      channel: 'WhatsApp',
      from: '+27 72 118 4406',
      body: 'Sawubona ma, ngiwise ucingo lwami. Le yinombolo yami entsha. Ungangithumelela u-R900 kule akhawunti? Ngizokuchazela kamuva.',
      isScam: true,
      explain:
        'Lona umkhonyovu ojwayelekile wokuzenza ilungu lomndeni. Shayela inombolo endala, noma ubuze into eyaziwa nguye kuphela.',
    },
    {
      channel: 'Email',
      from: 'no-reply@up.ac.za',
      body: 'Iphasiwedi yakho ye-UP iphelelwa yisikhathi ezinsukwini ezi-5. Yishintshe engosini ojwayele ukuyisebenzisa — le imeyili ayinazo izixhumanisi.',
      isScam: false,
      explain:
        'Ikheli lilungile futhi, okubaluleke kakhulu, asikho isixhumanisi sokuchofoza. Izaziso ezisemthethweni zikuthumela engosini osuvele uyazi.',
    },
  ],
  nso: [
    {
      channel: 'SMS',
      from: 'Khoutu ye kopana ye e sa tsebjego',
      body: 'SARS: Tšhelete ya gago ya motšhelo ye e bušetšwago ya R7 214,00 e lokile. E tšee mo diiring tše 24: sars-refund-claim.net/za',
      isScam: true,
      explain: 'SARS ga e ke e romela dilinki tša go bušetša tšhelete ka SMS, ebile weposaete ye ga se sars.gov.za.',
    },
    {
      channel: 'WhatsApp',
      from: '+27 72 118 4406',
      body: 'Dumela mma, ke wišitše founo ya ka. Ye ke nomoro ya ka ye mpsha. O ka nthomela R900 akhaonteng ye? Ke tla go hlalosetša ka morago.',
      isScam: true,
      explain:
        'Bjo ke bofora bjo bo tlwaelegilego bja go itira leloko la lapa. Leletša nomoro ya kgale, goba o botšiše selo seo se tsebjago ke yena fela.',
    },
    {
      channel: 'Email',
      from: 'no-reply@up.ac.za',
      body: 'Phasewete ya gago ya UP e tla felelwa ke nako mo matšatšing a 5. E fetoše phothaleng yeo o e šomišago ka mehla — imeile ye ga e na dilinki.',
      isScam: false,
      explain:
        'Aterese e nepagetše, gomme sa bohlokwa kudu, ga go na linki ya go kgotla. Ditsebišo tša nnete di go romela phothaleng yeo o šetšego o e tseba.',
    },
  ],
  ts: [
    {
      channel: 'SMS',
      from: 'Khodi yo koma leyi nga tiviwiki',
      body: 'SARS: Mali ya wena ya xibalo leyi tlheriseriwaka ya R7 214,00 yi lunghekile. Yi teke ku nga si hela tiawara ta 24: sars-refund-claim.net/za',
      isScam: true,
      explain: 'SARS a yi rhumeli tilinki ta ku tlherisela mali hi SMS, naswona webusayiti leyi a hi sars.gov.za.',
    },
    {
      channel: 'WhatsApp',
      from: '+27 72 118 4406',
      body: 'Avuxeni mhani, ndzi wisile riqingho ra mina. Leyi i nomboro ya mina leyintshwa. Xana u nga ndzi rhumela R900 eka akhawunti leyi? Ndzi ta ku hlamusela endzhaku.',
      isScam: true,
      explain:
        'Lebyi i vuxisi lebyi tolovelekeke byo tiendla xirho xa ndyangu. Ba riqingho eka nomboro ya khale, kumbe u vutisa nchumu lowu tiviwaka hi yena ntsena.',
    },
    {
      channel: 'Email',
      from: 'no-reply@up.ac.za',
      body: 'Phaswede ya wena ya UP yi ta hela nkarhi hi masiku ya 5. Yi cince eka phothala leyi u tolovelaka ku yi tirhisa — imeyili leyi a yi na tilinki.',
      isScam: false,
      explain:
        'Adirese yi lulamile, naswona xa nkoka swinene, a ku na linki yo thepa. Switiviso swa ntiyiso swi ku rhumela eka phothala leyi u yi tivaka khale.',
    },
  ],
};

/** The saved practice examples in `lang`, falling back to the English originals. */
export function getDrills(lang: LanguageCode = 'en'): Drill[] {
  return TRANSLATED_DRILLS[lang] ?? DRILLS;
}
