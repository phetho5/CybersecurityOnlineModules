import type { TopicContent, TopicQuizQuestion } from './topic-types';

// Xitsonga translation of the POPIA module, reproduced verbatim from the team's own native-language
// notes ("Tsonga Notes/Section2_Xitsonga_POPIA" and "Section4_Xitsonga_POPIA" at the repo root) —
// not machine- or Claude-translated. Laid out to mirror the English topics in popia-topics.ts
// section for section. Quiz answers are the ones the notes themselves mark (in bold) as correct.
//
// Topic 1 (Section 1, "What is POPIA?") is deliberately absent from this file: no Xitsonga source
// was supplied for it — the file named Section1 in that folder is Sepedi. It is AI-translated and
// kept apart in popia-topics-ts-ai.ts so the two never mix.
export const POPIA_TS: TopicContent[] = [
  {
    n: 2,
    title: 'Timfanelo ta Wena tanihi Nhloko-mhaka ya Datha',
    intro:
      'Leswi sweswi u twisisaka leswaku POPIA i yini ni leswaku yi tirha eka vamani, i swa nkoka ku tiva leswaku entiyisweni POPIA yi ku nyika yini. Tanihi nhloko-mhaka ya datha, a wu pfumali matimba. POPIA yi ku nyika timfanelo to kongoma leti u nga ti tirhisaka nkarhi wun’wana ni wun’wana loko nhlangano wu hlengeleta kumbe wu tirhisa vuxokoxoko bya wena bya xihundla.',
    sections: [
      {
        heading: 'Timfanelo ta Wena ta 8 Ehansi ka POPIA',
        items: [
          'Mfanelo ya 1: Mfanelo yo Tivisiwa — Loko nhlangano wihi na wihi wu nga si hlengeleta vuxokoxoko bya wena bya xihundla, wu fanele ku ku tivisa. Va fanele ku ku byela leswaku i vamani, hikwalaho ka yini va hlengeleta vuxokoxoko bya wena, leswaku ku byi nyika swi endliwa hi ku tirhandzela kumbe swa boha, ni leswaku ku ta humelela yini loko u hlawula ku nga byi nyiki.',
          'Mfanelo ya 2: Mfanelo ya Mfikelelo eka Vuxokoxoko bya Wena — U na mfanelo yo vutisa nhlangano wihi na wihi leswaku hi byihi vuxokoxoko bya xihundla lebyi va nga na byona hi wena. Va boheka ku ku nyika nhlamuselo ya vuxokoxoko lebyi va nga na byona, xikan’we ni ku ku byela leswaku i mani la nga na mfikelelo eka byona. Leswi mikarhi yin’wana swi vuriwa Xikombelo xa Mfikelelo xa Nhloko-mhaka (Subject Access Request).',
          'Mfanelo ya 3: Mfanelo yo Lulamisa kumbe ku Sula Vuxokoxoko bya Wena — Loko nhlangano wu hlayisile vuxokoxoko bya wena bya xihundla lebyi hoxeke, lebyi hundzeriweke hi nkarhi, lebyi nga helelangiki, kumbe lebyi hambukisaka, u na mfanelo yo kombela leswaku byi lulamisiwa kumbe ku suriwa. Nhlangano wu fanele ku hlamula xikombelo xa wena naswona a wu nge endli onge a wu xi voni.',
          'Mfanelo ya 4: Mfanelo yo Alela ku Hleriwa/Ku Tirhisiwa — U na mfanelo yo alela nhlangano ku hlela vuxokoxoko bya wena bya xihundla eka swiyimo swo karhi, ngopfu-ngopfu loko va byi tirhisa eka vuxavisi byo kongoma kumbe loko ku hleriwa loku ku ku vanga swiphiqo. Loko u alela, nhlangano wu fanele ku tshika ku tirhisa vuxokoxoko bya wena eka xikongomelo xexo.',
          'Mfanelo ya 5: Mfanelo yo nga Xaviseriwi kumbe ku Avelaniwa Vuxokoxoko bya Wena Handle ka Mpfumelelo — Nhlangano a wu nge xavisi kumbe ku avelana vuxokoxoko bya wena bya xihundla eka ntlawa wa vunharhu handle ka vutivi ni mpfumelelo wa wena, handle ka loko ku ri ni xisekelo xa nawu xo endla tano. Leyi i yin’wana ya timfanelo leti tluriwaka ngopfu, hilaha swi voniwaka hakona eka milandzu laha datha yi hundzisiwaka exikarhi ka tikhamphani hikwalaho ka swikongomelo swa vuxavisi.',
          'Mfanelo ya 6: Mfanelo yo Tiva hi ku Tluriwa ka Ndzindzakhombo eka Datha — Loko nhlangano wu langutana ni ku tluriwa ka nsirhelelo naswona vuxokoxoko bya wena bya xihundla byi paluxiwile kumbe ku fikeleliwa handle ka mpfumelelo, va boheka hi nawu ku ku tivisa wena xikan’we na Mulawuri wa Vuxokoxoko hi ku hatlisa hi ndlela leyi faneleke.',
          'Mfanelo ya 7: Mfanelo yo Nghenisa Xivilelo — Loko u tshemba leswaku nhlangano wu tlurile timfanelo ta wena ehansi ka POPIA, u na mfanelo yo nghenisa xivilelo xa ximfumo eka Mulawuri wa Vuxokoxoko wa Afrika Dzonga. Mulawuri u na matimba yo lavisisa xivilelo ni ku teka magoza ku lwisana ni nhlangano loko ku tiyisisiwa ku tluriwa ka nawu.',
          'Mfanelo ya 8: Mfanelo yo Susa Mpfumelelo — Loko eku sunguleni u nyikile nhlangano mpfumelelo wo tirhisa vuxokoxoko bya wena bya xihundla kutani u cinca mianakanyo ya wena, u na mfanelo yo susa mpfumelelo wolowo nkarhi wihi na wihi. Loko u susa mpfumelelo, nhlangano wu fanele ku tshika ku hlela vuxokoxoko bya wena eka xikongomelo lexi u nga pfumela eka xona ku sunguleni.',
        ],
      },
      {
        heading: 'Ku Humelela Yini Loko Timfanelo ta Wena ti Tluriwa?',
        items: [
          'Loko nhlangano wu honisa xikombelo xa wena xo fikelela, ku lulamisa, kumbe ku sula vuxokoxoko bya wena, kumbe loko va avelana datha ya wena handle ka mpfumelelo, a wu boheki ku amukela sweswo. Xo sungula, tihlanganise na nhlangano hi ku kongoma u tsala xikombelo xa wena. Leswi swi endla rhekhodo ya xikombelo xa wena. Loko va nga ha hlamuli kumbe va ala ku teka magoza, u nga nghenisa xivilelo eka Mulawuri wa Vuxokoxoko.',
          'Tinhlangano leti kumiwaka ti ri ni nandzu wo tlula POPIA ti nga langutana ni fhayini yo fika eka 10 wa timiliyoni ta Tirhandi kumbe ku pfaleriwa khotso ku fika malembe ya 10, swi titshege hi vukulu bya nandzu.',
        ],
      },
    ],
    activity: {
      prompt:
        'Xiyimo xo Khomekana: Vona Ku Tluriwa ka Timfanelo\n\nLerato i xichudeni xa lembe ra vunharhu eka yunivhesiti ya laha Afrika Dzonga. U layishile xitirhisiwa xa bajete u nghenisa vito ra yena, adirese ya imeyili ya xichudeni, ni vuxokoxoko bya tibangi ta yena ku pima matirhiselo ya timali. A nga si tshama a amukela xitiviso xin’wana ni xin’wana malunghana ni ndlela leyi datha ya yena yi nga ta tirhisiwa ha yona. Endzhaku ka n’hweti, u sungule ku amukela tiqingho to huma eka khamphani ya swikweleti leyi a nga si tshamaka a tihlanganisa na yona. Loko a ba riqingho eka nomboro ya nseketelo ya xitirhisiwa ku vutisa leswaku xana datha ya yena a yi avelaniwile xana, va n’wi byele leswaku va nge n’wi nyiki vuxokoxoko byebyo nakambe naswona hikuva a amukerile swipimelo na swiyimo, u pfumelelane na hinkwaswo.\n\nHi tihi timfanelo ta Lerato leti ti nga vaka ti tluriwile? Xana xitirhisiwa (app) a xi fanele xi endlile yini xi nga si hlengeleta vuxokoxoko bya tibangi ta yena? I magoza wahi lawa Lerato a nga ma tekaka sweswi?',
      feedback:
        'Ku tiva timfanelo leti swi vula leswaku u nga swi vona loko ti tluriwa naswona wa tiva magoza lawa u nga ma tekaka loko sweswo swi humelela.',
    },
    keyTakeaway: 'Tanihi nhloko-mhaka ya datha, a wu pfumali matimba.',
  },
  {
    n: 3,
    title: 'Leswi Tinhlangano Ti Faneleke Ti Swi Endla Ehansi ka POPIA',
    intro:
      'Eka swiyenge leswi nga hundza u dyondzile leswaku POPIA i yini, yi ku nyika timfanelo tihi, ni ndlela leyi datha ya xihundla yi tirhisiwaka hi ndlela yo biha ha yona. Xiyenge lexi xi hundzisela mianakanyo eka tlhelo lerin’wana ra vuxaka: tinhlangano leti hlengeletaka ni ku tirhisa datha ya wena. POPIA yi veka swibopho leswi nga erivaleni swa nawu eka nhlangano wun’wana ni wun’wana lowu khomaka vuxokoxoko bya xihundla. Ku twisisa leswi tinhlangano ti faneleke ku swi endla swi ku pfuna ku xiya loko ti nga endli kahle naswona swi ku nyika ntshembo wo ti vutisa.',
    sections: [
      {
        heading: 'Swipimelo swa 8 swa ku Hlela ka Nawu ka Vuxokoxoko bya Xihundla',
        items: [
          'Xipimelo 1: Vutihlamuleri — Ntlawa wa vutihlamuleri wu fanele ku tiyisisa leswaku swipimelo hinkwaswo swa ku hlela hi nawu swa fikeleliwa. Va na vutihlamuleri bya hinkwaswo leswi humelelaka eka vuxokoxoko bya xihundla lebyi va byi hlengeletaka, ku katsa na leswi vafambisi va vona va swi endlaka hi byona ematshan’weni ya vona.',
          'Xipimelo 2: Xipimelo xa ku Hlela — Vuxokoxoko bya xihundla byi nga hlengeletiwa ni ku hleriwa ntsena hikwalaho ka xikongomelo xo kongoma xa nawu. Ku hleriwa ku fanele ku ringanela, ku fambisana, naswona ku nga hundzi mpimo mayelana ni xikongomelo. Xikombiso, app yo rhumela swakudya yi lava adirese ya wena ku rhumela swakudya. A yi lavi nomboro ya wena ya ID kumbe vuxokoxoko bya ntirho wa wena.',
          'Xipimelo 3: Ku Kongomisiwa ka Xikongomelo — Nhlangano wu fanele ku va erivaleni naswona wu rhangela hi xikongomelo xo kongoma lexi vuxokoxoko bya wena bya xihundla byi hlengeletiwelaka xona. Va fanele nakambe ku tiyisisa leswaku vuxokoxoko bya wena a byi hlayisiwi nkarhi wo leha ku tlula lowu lavekaka ku fikelela xikongomelo xexo.',
          'Xipimelo 4: Xipimelo xa ku Hlela ka le Mapehlweni — Loko nhlangano wu lava ku tirhisa vuxokoxoko bya wena bya xihundla eka xikongomelo xin’wana xo hambana ni lexi a byi hlengeletiwela xona ku sunguleni, xikongomelo xexo xintshwa xi fanele ku fambisana ni xikongomelo xo sungula. Va nge hlengeleti datha ya wena hikwalaho ka xivangelo xin’we kutani endzhaku va yi tirhisa exihundleni eka nchumu wo hambana hi ku helela.',
          'Xipimelo 5: Xiyimo xa Vuxokoxoko — Nhlangano wu ni vutihlamuleri byo tiyisisa leswaku vuxokoxoko bya xihundla lebyi va nga na byona hi wena byi lulamile, byi helele, naswona byi fambisana ni nkarhi (up to date). Va nge hlayisi vuxokoxoko lebyi hoxeke hi wena va ri karhi va swi tiva.',
          'Xipimelo 6: Ku va Erivaleni — Tinhlangano ti fanele ku va erivaleni mayelana ni migingiriko ya tona yo hlela vuxokoxoko. Ti fanele ku va ni pholisi ya vuxihundla leyi hlamuselaka kahle leswaku hi byihi vuxokoxoko lebyi ti byi hlengeletaka, hikwalaho ka yini ti byi hlengeleta, ti byi hlayisa nkarhi wo tanihi kwihi, naswona ti avelana na mani.',
          'Xipimelo 7: Tindlela to Sirhelela — Ntlawa wa vutihlamuleri wu fanele ku veka magoza lama faneleke ya xithekiniki ni ya nhlangano ku sirhelela vuxokoxoko bya wena bya xihundla eka ku lahleka, ku onhaka, mfikelelo lowu nga pfumeleriwangiki, ni ku hleriwa loku nga riki ka nawu. Leswi swi katsa nkhaviso (encryption), tisevha to sirheleleka, vulawuri bya mfikelelo, ni ndzetelo wa vatirhi.',
          'Xipimelo 8: Ku Nghenelela ka Nhloko-mhaka ya Datha — Tinhlangano ti fanele ku ku nyika vuswikoti byo tirhisa timfanelo ta wena tanihi nhloko-mhaka ya datha. Ti fanele ti va na endlelo ra wena ro kombela mfikelelo eka vuxokoxoko bya wena, ku kombela milulamiso, kumbe ku kombela ku suriwa.',
        ],
      },
      {
        heading: 'Leswi Tiyunivhesiti ni Ti-App Ti Faneleke Ku Swi Endla Ti Nga Si Hlengeleta Datha ya Wena',
        items: [
          'Ti fanele ti kuma xikongomelo xa nawu — Nhlangano wun’wana ni wun’wana wu fanele ku va ni xivangelo lexi nga erivaleni ni xa nawu eka vuxokoxoko byin’wana ni byin’wana lebyi wu byi kombelaka eka wena.',
          'Ti fanele ti ku tivisa — Ti nga si hlengeleta vuxokoxoko bya wena, ti fanele ti ku tivisa leswaku i vamani, i vuxokoxoko byihi lebyi ti byi hlengeletaka, hikwalaho ka yini ti byi hlengeleta, leswaku swa boha kumbe i ku tirhandzela, ni leswaku i mani un’wana loyi a nga vaka ni mfikelelo eka byona.',
          'Ti fanele ti kuma mpfumelelo laha swi lavekaka kona — Hakanyingi, tinhlangano ti fanele ku kuma mpfumelelo wa wena ti nga si hlela vuxokoxoko bya wena bya xihundla. Mpfumelelo lowu wu fanele wu nyikiwa hi ntshunxeko, wu kongoma, naswona wu ri ni vutivi (informed).',
          'Ti fanele ti thola Mutirhela-vuxokoxoko (Information Officer) — Nhlangano wun’wana ni wun’wana lowu hlelaka vuxokoxoko bya xihundla wu boheka ku thola Mutirhela-vuxokoxoko loyi a nga ni vutihlamuleri byo tiyisisa ku landzeleriwa ka POPIA.',
        ],
      },
      {
        heading: 'Ndlela yo Hlaya Pholisi ya Vuxihundla',
        body: 'Pholisi ya vuxihundla i tsalwa leri nhlangano wu ri humesaka ku hlamusela ndlela leyi va khomaka vuxokoxoko bya wena bya xihundla ha yona. Hi leswi pholisi ya vuxihundla leyi faneleke yi faneleke ku katsa swona:',
        items: [
          'Vito leri heleleke ni vuxokoxoko byo tihlanganisa bya nhlangano',
          'Hi byihi vuxokoxoko bya xihundla lebyi hlengeletiwaka naswona hikwalaho ka yini',
          'Xisekelo xa nawu xo hlengeleta ni ku hlela vuxokoxoko bya wena',
          'Vuxokoxoko bya wena byi ta hlayisiwa nkarhi wo tanihi kwihi',
          'I mani loyi vuxokoxoko bya wena byi avelaniwaka na yena naswona ehansi ka swiyimo swihi',
          'Vuxokoxoko bya wena byi sirheleriwa njhani',
          'Ndlela leyi u nga tirhisaka timfanelo ta wena tanihi nhloko-mhaka ya datha ha yona',
          'Vuxokoxoko byo tihlanganisa bya Mutirhela-vuxokoxoko',
        ],
      },
      {
        heading: 'Ndlela yo Vika ku Tluriwa ka POPIA eka Mulawuri wa Vuxokoxoko',
        items: [
          'Goza 1: Tihlanganise na nhlangano hi ku tsala naswona u hlamusela xiphiqo lexi. Va nyike nkarhi lowu faneleke wo hlamula. Hlayisa rhekhodo ya mabhulo hinkwawo.',
          'Goza 2: Loko nhlangano wu nga hlamuli, nghenisa xivilelo xa ximfumo eka Mulawuri wa Vuxokoxoko eka www.inforegulator.org.za.',
          'Goza 3: Mulawuri u ta kamba naswona a nga ha sungula ndzavisiso wa ximfumo. Va ni matimba yo boha tinhlangano ku landzelela nawu ni ku tlhandleka swigwevo.',
          'Swigwevo leswi tinhlangano ti langutanaka na swona hikwalaho ko tlula POPIA: Tifhayini ta vulawuri to fika eka R10 wa timiliyoni. Ku tengiwa ka vugevenga loku nga vangaka ku pfaleriwa khotso ku fika eka 10 wa malembe. Ku onhiwa ka ndhuma hikwalaho ka switiviso swa mani na mani swo sindzisa nawu.',
        ],
      },
    ],
    example:
      'Xikotso xa Pholisi ya Vuxihundla xa A: "Hi hlengeleta vito ra wena, adirese ya imeyili, ni nomboro ya riqingho loko u tsarisa eka pulatifomo ya hina. Vuxokoxoko lebyi byi tirhiseriwa ntsena ku tumbuluxa ni ku fambisa akhawunti ya wena ni ku ku rhumelela switiviso leswi fambisanaka ni vukorhokeri. A hi xavisi kumbe ku avelana vuxokoxoko bya wena ni matlhelo ya vunharhu handle ka mpfumelelo wa wena lowu nga erivaleni. Vuxokoxoko bya wena byi hlayisiwa hi ndlela yo sirheleleka naswona byi ta suriwa endzeni ka 30 wa masiku ya ku pfalariwa ka akhawunti. U nga tihlanganisa na Mutirhela-vuxokoxoko wa hina eka privacy@company.co.za ku kombela mfikelelo, ku lulamisiwa, kumbe ku suriwa ka vuxokoxoko bya wena bya xihundla. U na mfanelo yo nghenisa xivilelo eka Mulawuri wa Vuxokoxoko wa Afrika Dzonga loko u nga enerisekanga hi ndlela leyi hi khomaka datha ya wena ha yona."\n\nXikotso xa Pholisi ya Vuxihundla xa B: "Hi ku tirhisa vukorhokeri bya hina u pfumelelana ni pholisi ya hina ya vuxihundla. Hi hlengeleta vuxokoxoko ha wena ku antswisa ntokoto wa wena. Hi nga ha avelana vuxokoxoko lebyi ni vatirhisani va hina ni vasunguri nkarhi na nkarhi. Hi hlayisa mfanelo yo pfuxeta pholisi leyi nkarhi wihi na wihi. Eka swivutiso, tihlanganise na hina hi ku tirhisa app."',
    activity: {
      prompt: 'Ntirho wa Nxaxamelo: Xiya Pholisi ya Vuxihundla yo Landzelela Nawu',
      options: ['Xikotso xa A', 'Xikotso xa B'],
      correctIndex: 0,
      feedback:
        'Xikotso xa A xi landzelela nawu. Xi vula hi ku kongoma leswaku ku hlengeletiwa yini, hikwalaho ka yini, xi hlayisiwa nkarhi wo tanihi kwihi, u nga tihlanganisa na mani, naswona u nga ti tirhisa njhani timfanelo ta wena. Xikotso xa B a xi landzeleli nawu. Xi tirhisa ririmi leri nga riki erivaleni malunghana ni ku avelana na "vatirhisani ni vasunguri", a xi vuli hi ku kongoma leswaku hi byihi vuxokoxoko lebyi hlengeletiwaka kumbe hikwalaho ka yini, a xi nyiki nkarhi wo hlayisa vuxokoxoko, a xi nyiki vuxokoxoko byo tihlanganisa na Mutirhela-vuxokoxoko, naswona xi hlayisa mfanelo yo cinca pholisi handle ka xitiviso.',
    },
    keyTakeaway:
      'Ku twisisa leswi tinhlangano ti faneleke ku swi endla swi ku pfuna ku xiya loko ti nga endli kahle naswona swi ku nyika ntshembo wo ti vutisa.',
  },
];

export const POPIA_TS_QUIZ: Record<number, TopicQuizQuestion[]> = {
  2: [
    {
      text: 'Thabo u layixile xitirhisiwa xo xava naswona endzhakunyana a kuma leswaku xitirhisiwa xi avelane nomboro ya yena ya riqingho na adirese ya le kaya ni khamphani ya vuxavisi handle ko n’wi byela. Hi yihi mfanelo ya POPIA leyi tluriweke hi ku kongoma ngopfu?',
      options: [
        'Mfanelo yo lulamisa kumbe ku sula vuxokoxoko',
        'Mfanelo yo nghenisa xivilelo',
        'Mfanelo yo nga xaviseriwi kumbe ku avelana vuxokoxoko bya wena handle ka mpfumelelo',
        'Mfanelo yo susa mpfumelelo',
      ],
      correct: 2,
    },
    {
      text: 'Nomsa u tihlanganisile na khamphani leyi enkarhini lowu nga hundza a xaveke swiambalo eka yona eka inthanete, naswona u va komberile ku sula vuxokoxoko hinkwabyo bya xihundla lebyi va byi hlayiseke mayelana na yena. Khamphani yi honisile xikombelo xa yena ku ringana mavhiki manharhu. Hi yihi mfanelo leyi khamphani yi yi tlulaka?',
      options: [
        'Mfanelo yo tivisiwa',
        'Mfanelo yo lulamisa kumbe ku sula vuxokoxoko bya wena',
        'Mfanelo yo tiva hi ku tluriwa ka ndzindzakhombo eka datha',
        'Mfanelo yo alela ku hleriwa',
      ],
      correct: 1,
    },
    {
      text: 'Xichudeni xa yunivhesiti xi tshuburile leswaku pulatifomo ya le ka inthanete leyi va yi tirhisaka eka tiasayimende yi langutanile na ku tluriwa ka nsirhelelo n’hweti leyi nga hundza, kambe a va si tshama va tivisiwa. Hi yihi mfanelo leyi nga tluriwa?',
      options: [
        'Mfanelo yo susa mpfumelelo',
        'Mfanelo ya mfikelelo eka vuxokoxoko bya wena',
        'Mfanelo yo alela ku hleriwa',
        'Mfanelo yo tiva hi ku tluriwa ka ndzindzakhombo eka datha',
      ],
      correct: 3,
    },
  ],
  3: [
    {
      text: 'App ya le riqinghweni yi hlengeleta datha ya ndhawu ya wena nkarhi wun’wana ni wun’wana loko u yi pfula, hambileswi app yi nyikaka ntsena swiviko swa maxele swa doroba ra wena. Hi xihi eka swipimelo swa 8 swa POPIA lexi leswi swi nga vaka swi xi tlula?',
      options: ['Vutihlamuleri', 'Xipimelo xa ku Hlela', 'Tindlela to Sirhelela', 'Ku va Erivaleni'],
      correct: 1,
    },
    {
      text: 'Mandla u lava ku tiva leswaku hi byihi vuxokoxoko bya xihundla lebyi khamphani yi nga na byona hi yena. U fanele ku tihlanganisa na mani endzeni ka nhlangano?',
      options: ['CEO wa khamphani', 'Ndzawulo ya vuxavisi ya khamphani', 'Mutirhela-vuxokoxoko', 'Mulawuri wa Vuxokoxoko'],
      correct: 2,
    },
    {
      text: 'Pholisi ya vuxihundla ya nhlangano yi ri: "Hi nga ha avelana vuxokoxoko bya wena ni vatirhisani lava hlawuriweke nkarhi na nkarhi hikwalaho ka swikongomelo swa bindzu." Hikwalaho ka yini xitatimende lexi xi ri na xiphiqo ehansi ka POPIA?',
      options: [
        'Tinhlangano a ti pfumeleriwangi ku avelana vuxokoxoko bya xihundla ni ntlawa wihi na wihi wa vunharhu',
        'Xitatimende xi lehe ngopfu naswona xi fanele ku katsakanyiwa',
        'Xitatimende a xi le rivaleni naswona a xi vuli hi ku kongoma leswaku vatirhisani i vamani kumbe xikongomelo xo avelana',
        'Tipholisi ta vuxihundla a ti lavi ku boxa ngopfu ta ku avelana na matlhelo ya vunharhu nikatsongo',
      ],
      correct: 2,
    },
  ],
};
