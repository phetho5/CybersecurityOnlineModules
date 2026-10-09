import type { TopicContent, TopicQuizQuestion } from './topic-types';

// Xitsonga translation of the Digital Privacy module, reproduced verbatim from the team's own
// native-language notes ("Tsonga Notes/Section3_Xitsonga_POPIA" and "Section5_Xitsonga_POPIA" at the
// repo root) — not machine- or Claude-translated. Laid out to mirror the English topics in
// digital-privacy-topics.ts section for section. Quiz answers are the ones the notes themselves mark
// (in bold) as correct.
export const DIGITAL_PRIVACY_TS: TopicContent[] = [
  {
    n: 1,
    title: 'Ndlela leyi Datha ya Wena yi Tirhisiwaka hi ndlela yo Biha ha Yona',
    intro:
      'Sweswi wa swi tiva leswaku POPIA i yini ni leswaku yi ku nyika timfanelo tihi. Kambe ku tiva timfanelo ta wena swi pfuna ntsena loko u kota ku xiya loko ku ri ni swilo leswi fambaka ximatsi ku sungula. Xiyenge lexi xi kongomisa eku ku pfuneni ku twisisa leswaku datha ya xihundla entiyisweni yi tirhisisiwa ku biha hi ndlela yihi eku tirheni, hi ku tirhisa swikombiso leswi fambisanaka ni vutomi bya wena tanihi xichudeni xa laha Afrika Dzonga. Ku tirhisa datha hi ndlela yo biha a swi tshameli ku vonaka erivaleni. Mikarhi yin’wana swi humelela hikwalaho ka vusopfa. Mikarhi yin’wana swi endliwa hi vomu. Naswona mikarhi yin’wana u nyikela vuxokoxoko bya wena handle ko xiya leswaku u pfumelelana na yini.',
    sections: [
      {
        heading: 'I Yini lexi Hlayiwaka tanihi Vuxokoxoko bya Xihundla byo Ntswongo (Sensitive Personal Information)?',
        body: 'POPIA yi endla njhambaniso exikarhi ka vuxokoxoko bya xihundla bya ntolovelo ni lexi yi xi vitanaka vuxokoxoko bya xihundla byo hlawuleka. Vuxokoxoko bya xihundla byo hlawuleka byi katsa xiyimo xale henhla xa nsirhelelo hikuva ku byi tirhisa hi ndlela yo biha swi nga vanga vuhava lebyikulu. Vuxokoxoko bya xihundla byo hlawuleka byi katsa:',
        items: [
          'Vupfumeri bya vukhongeri kumbe bya filosofi',
          'Rixaka kumbe masungulo ya rixaka',
          'Vuxirho bya nhlangano wa vatirhi',
          'Ku voyamela eka swa tipolitiki',
          'Rihanyo kumbe vutomi bya masangu',
          'Vuxokoxoko bya bayometriki byo fana ni mfungho wa tintiho ni datha yo tiva xikandza',
          'Mahanyelo ya vugevenga',
        ],
      },
      {
        heading: 'Tindlela to Toloveleka Leti Swichudeni swi Avelanaka Datha ya Xihundla hi Tona Handle ko Tiva',
        items: [
          'Tifomo ta le ka inthanete ni ku tsarisa — Nkarhi wun’wana ni wun’wana loko u endla akhawunti eka webusayiti kumbe xitirhisiwa (app), u nyikela vuxokoxoko bya xihundla. Tipulatifomo to tala ti kombela swilo swo tala ku tlula leswi entiyisweni va swi lavaka. Mikarhi hinkwayo tivutise loko vuxokoxoko lebyi kombeliwaka byi ri bya nkoka hakunene eka vukorhokeri lebyi u tsariselaka byona.',
          'Ti-Social media — Tipurofayili ta wena ta ti-social media ti na nhlayo yikulu ya vuxokoxoko bya xihundla. Vito ra wena leri heleleke, ndhawu, ndhawu ya dyondzo, ndhawu ya ntirho, xiyimo xa vuxaka, ni swiendlo swa wena swa siku ni siku swi nga hlanganisiwa swin’we ku suka eka swiposti swa wena ni vuxokoxoko bya purofayili. Swigevenga swa le ka inthanete swi tirhisa vuxokoxoko bya social media lebyi kumekaka erivaleni ku aka tipurofayili ta vanhu lava nga vaka swiganga vamatshwa va nga si endla minhlaselo leyi kongomisiweke.',
          'Mitlawa ya WhatsApp — Leswi swi tolovelekile ngopfu eka swichudeni swa laha Afrika Dzonga. Mitlawa ya mimfumo ya tiyunivhesiti, mitlawa ya makilasi, ni mitlawa ya nhlangano eka WhatsApp hakanyingi yi avelana tinomboro ta ID, tinomboro ta swichudeni, vuxokoxoko bya akhawunti ya bangi, ni swikrini (screenshots) swa vumbhoni bya ku hakelela. Loko vuxokoxoko byebyo byi ri encatini ya ntlawa, a wu na vulawuri eka leswaku i mani a endlaka sikrinixoti ya xona kumbe ku byi avelana emahlweni.',
          'Ku amukela swipimelo ni swiyimo handle ko swi hlaya — Vanhu vo tala va thepa eka "Ndza pfumela" (I agree) handle ko hlaya leswi va pfumelelanaka na swona. Swipimelo ni swiyimo swo tala swa ti-app swi katsa swiyenge leswi pfumelelaka khamphani ku avelana datha ya wena ni matlhelo ya vunharhu, ku tirhisa vuxokoxoko bya wena ku navetisa loku kongomisiweke, kumbe ku hlayisa datha ya wena hambiloko u sula akhawunti ya wena.',
          'Wi-Fi ya mahala ya mani na mani — Ku tirhisa Wi-Fi ya mani na mani leyi nga sirhelelekangiki swi paluxa xitirhisiwa xa wena ni datha leyi u yi rhumelaka eka ku katsakanyiwa loku nga vaka kona. Loko u nghena eka app ya wena ya bangi kumbe phothala ya yunivhesiti eka Wi-Fi leyi nga sirhelelekangiki, vuxokoxoko bya wena byo nghena byi nga kumiwa hi un’wana loyi a nga eka netiweke yoleyo.',
          'Tilinki ta xifisingi (Phishing links) — Vuxisi bya Phishing byi katsa ku ku rhumelela rungula ra vuxisi kumbe imeyili leyi langutekaka yi ri ntiyiso naswona yi ku xisaka leswaku u nghenisa vuxokoxoko bya wena bya xihundla eka webusayiti ya vuxisi. Leswi swi tolovelekile ngopfu eAfrika Dzonga naswona hakanyingi swi tiendla ku fana ni tibangi, SASSA, kumbe tiphothala ta yunivhesiti.',
        ],
      },
      {
        heading: 'Xana Ku Tluriwa ka Ndzindzakhombo ka Datha swi Languteka Njhani eku Tirheni?',
        body: 'Ku tluriwa ka nawu ka datha swi humelela loko vuxokoxoko bya xihundla byi fikeleliwa, byi paluxiwa, kumbe byi lahleka handle ka mpfumelelo. Ku tluriwa ku nga humelela hikwalaho ka:',
        items: [
          'Mutirhi wa khamphani loyi a rhumelaka imeyili leyi nga ni datha ya xihundla eka munhu la hoxeke hi xihoxo',
          'Databezi leyi siyiwaka yi nga sirhelelekanga naswona yi kumeka erivaleni eka inthanete',
          'Nhlaselo wa le ka inthanete (cyberattack) laha swigevenga swi yivaka datha leyi hlayisiweke',
          'Xikhompyuta (laptop) kumbe riqingho leri lahlekeke kumbe ri yiviwile leri a ri nga sirheleriwanga hi phaswede',
          'Nxungeto wa le ndzeni laha mutirhi hi vomu a humesaka kumbe a xavisaka datha',
          'Loko ku tluriwa nawu swi humelela, vuxokoxoko bya xihundla lebyi katsiwaka byi nga tirhisiwa ku pfula tiakhawunti ta bangi ta vuxisi, ku endla xikombelo xa swikweleti hi vito ra wena, kumbe ku tiendla wena eka inthanete.',
        ],
      },
      {
        heading: 'Swikombiso swa Xiviri swa le Afrika Dzonga',
        items: [
          'Ku Tluriwa ka Experian (2020) — Hi 2020, Experian yi langutani na ku tluriwa laha vuxokoxoko bya xihundla bya kwalomu ka 24 wa timiliyoni ta Maafrika Dzonga ni mabindzu ya 793 000 byi nga paluxiwa. Datha a yi katsa tinomboro ta vutitivisi, vuxokoxoko byo tihlanganisa, ni vuxokoxoko bya mintirho. Muxisi a a ti endlile khlayente ya ntiyiso naswona a kombela datha. Leswi swi kombisile leswaku hambi ku ri tinhlangano letikulu, leti tshembiwaka ti fikeleleka ku hlaseriwa.',
          'Vuxisi bya SASSA SMS — Vamukeli vo tala va swibasari swa Afrika Dzonga va amukerile marungula ya SMS ya vuxisi lawa va vaka ya huma eka SASSA, va komberiwa ku pfuxeta vuxokoxoko bya vona bya bangi hi ku thepa linki kumbe ku ba nomboro. Vanhu lava hlamuleke va nyikele vuxokoxoko bya vona bya tibangi eka swigevenga leswi endzhaku swi phyameke tiakhawunti ta vona.',
          'Ku Paluxiwa ka Datha ya Xichudeni xa Yunivhesiti — Tiyunivhesiti to hlaya ta laha Afrika Dzonga ti ve na swiendlakalo laha datha ya swichudeni, ku katsa na tirhekhodo ta tidyondzo na vuxokoxoko byo tihlanganisa bya xihundla, yi paluxiweke kumbe ku khomiwa hi ndlela leyi nga fanelekiki. Eka swiyimo swin’wana, vuxokoxoko bya swichudeni byi avelaniwile na matlhelo man’wana handle ko landzela maendlelo yo pfumela lawa faneleke.',
        ],
      },
      {
        heading: 'I yini lexi fambeke ximatsi',
        items: [
          'Sipho u avelane tidokhumente ta xihundla eka ntlawa laha a a nga va tivi swirho hinkwaswo',
          'Vuxokoxoko bya yena bya xihundla byi tirhisiwile hi xigevenga ku aka xiyimo xo n’wi vumbela xo khorwisa',
          'A nga tiyisisanga vutivi bya mubi wa riqingho hi ku tirhisa tichanele ta ximfumo ta yunivhesiti',
        ],
      },
      {
        heading: 'Leswi Sipho a a fanele a swi endlile',
        items: [
          'Ku vutisisa leswaku hikwalaho ka yini sosayiti ya xichudeni yi lava nomboro ya yena ya ID na tidokhumente leti heleleke ta ku tsarisa',
          'A a nga fanelanga a avelana tidokhumente ta xihundla eka bulo ra ntlawa',
          'Ku tsema riqingho leri ro solisa naswona a tihlanganisa ni hofisi ya mfuneti wa timali hi ku kongoma hi ku tirhisa webusayiti ya ximfumo ya yunivhesiti',
        ],
      },
    ],
    example:
      'Xiyimo: Xihoxo xa Ntlawa wa WhatsApp. Sipho i xichudeni xa lembe ra vumbirhi eka yunivhesiti ya laha Afrika Dzonga. U joyina ntlawa wa WhatsApp wa sosayiti ya swichudeni naswona u komberiwa ku rhumela nomboro ya yena ya xichudeni, nomboro ya ID, na vumbhoni byo tsarisa ku tiyisisa vuxirho bya yena. U rhumela tidokhumente handle ko ehleketa kambirhi hikuva un’wana ni un’wana entlaweni u endla leswi fanaka. Endzhaku ka mavhiki ma nga ri mangani, Sipho u amukela riqingho ro huma eka un’wana loyi a tivulaka leswaku u huma eofisini ya mpfuno wa swa timali ya yunivhesiti. Mubi wa riqingho se wa yi tiva nomboro ya yena ya xichudeni ni vito leri heleleke naswona u n’wi kombela ku tiyisisa vuxokoxoko bya yena bya bangi ku hlela hakelo ya basari leyi a a nga yi langutelanga. Sipho, hi ku tshemba leswaku mubi wa riqingho i wa ntiyiso, u nyikela vuxokoxoko bya yena bya bangi. Akhawunti ya yena yi phyamiwa hi siku leri tlhandlamaka.',
    keyTakeaway:
      'Ku tirhisa datha hi ndlela yo biha a swi tshameli ku vonaka erivaleni. Mikarhi yin’wana swi humelela hikwalaho ka vusopfa. Mikarhi yin’wana swi endliwa hi vomu.',
  },
  {
    n: 2,
    title: 'Ku Sirhelela Vuhlayiseki bya wena bya Dijitali',
    intro:
      'Eka mojulu lowu hinkwawo u dyondzile leswaku POPIA i yini, yi ku nyika timfanelo tihi, datha yi tirhisiwa njhani hi ndlela yo biha, ni leswaku i yini leswi tinhlangano ti bohekaka ku swi endla hi ku ya hi nawu. Xiyenge lexi xo hetelela xi hlanganisa hinkwaswo ku suka eka tlhelo ra wena eka mhaka leyi. Ku tiva timfanelo ta wena ni ku twisisa nawu i swa nkoka, kambe nchumu lowu pfunaka ngopfu lowu u nga wu endlaka i ku teka magoza yo sirhelela vuhlayiseki bya wena bya dijitali hi ku gingiriteka.',
    sections: [
      {
        heading: 'Magoza lama Pfunaka ku Sirhelela Vuxokoxoko bya wena bya Xihundla',
        items: [
          'Ehleketa u nga si avelana — U nga si tata fomo yin’wana ni yin’wana, ku tsarisa eka vukorhokeri byin’wana ni byin’wana, kumbe ku avelana dokhumente eka bulo ra ntlawa, tivutise swivutiso swinharhu: Xana nhlangano lowu wu fanele wu va ni vuxokoxoko lebyi hakunene? Xana ku na xivangelo lexi twalaka lexi endlaka va xi kombela? Ku nga humelela yini loko vuxokoxoko lebyi byi wela emavokweni yo biha?',
          'Pima leswi u swi avelanaka eka ti-social media — Kambisisa tipurofayili ta wena ta social media naswona u susa vuxokoxoko byin’wana ni byin’wana lebyi nga lavekiki leswaku byi voniwa hi vanhu hinkwavo. Siku ra wena ro velekiwa leri heleleke, adirese ya le kaya, nomboro ya riqingho, ni nomboro ya ID a swi fanelanga swi humelela eka purofayili ya mani na mani.',
          'Hlaya tipholisi ta vuxihundla u nga si pfumela — A wu boheki ku hlaya rito rin’wana ni rin’wana, kambe u fanele u hlaya pholisi ya vuxihundla hi ku hatlisa ku vona vuxokoxoko lebyi hlengeletiwaka, loko byi ta avelaniwa ni matlhelo ya vunharhu, byi hlayisiwa nkarhi wo tanihi kwihi, ni ndlela leyi u nga kombelaka ku suriwa ka byona ha yona.',
          'Layisha ntsena ti-app eka swihlovo leswi tshembekaka — Layisha ti-app ntsena eka xitolo xa ximfumo xa Google Play Store kumbe Apple App Store. U nga si nghenisa app, kamba timpfumelelo ta yona. Loko app yo olova ya tochi yi kombela mfikelelo eka vuxokoxoko bya wena byo tihlanganisa, ndhawu ya wena, ni mayikrofoni ya wena, ku na lexi fambaka ximatsi.',
          'Tirhisa tiphaswede to tiya naswona to hlawuleka — Phaswede yo tiya yi na maletere ya 12 ku ya henhla naswona yi hlanganisa maletere lamakulu ni lamatsongo, tinomboro, ni swihlawulekisi (special characters). Papalata ku tirhisa vito ra wena, siku ro velekiwa, kumbe nomboro ya xichudeni tanihi phaswede. Loko u swi kuma swi tika ku tsundzuka tiphaswede to tala, tirhisa mufambisi wa tiphaswede (password manager) la tshembekaka.',
          'Pfumelela xitiyisiso xa swiphemu swimbirhi (2FA) — Xitiyisiso xa swiphemu swimbirhi xi engetela xiyenge xin’wana xa nsirhelelo eka tiakhawunti ta wena. Hambiloko un’wana a kuma phaswede ya wena, a nge koti ku fikelela akhawunti ya wena handle ka xivumbeko xa vumbirhi xa ntiyisiso. Pfumelela 2FA eka imeyili ya wena, app ya bangi, ni akhawunti yin’wana ni yin’wana leyi nga ni vuxokoxoko bya xihundla.',
          'Tivonele eka Wi-Fi ya mani na mani — Papalata ku nghena eka tiakhawunti ta xihundla to fana ni app ya wena ya bangi, phothala ya yunivhesiti, kumbe imeyili eka tinetiweke ta Wi-Fi ta mani na mani leti nga sirhelelekangiki. Loko swi boha leswaku u tirhisa Wi-Fi ya mani na mani, anakanyisisa hi ku tirhisa VPN, leyi sirhelelaka datha ya wena ya inthanete naswona swi endla leswaku swi tika eka van’wana eka netiweke yoleyo ku tekela datha ya wena.',
          'Tiyisisa u nga si thepa (click) — Loko u amukela SMS leyi u nga yi langutelangiki, imeyili, kumbe rungula ra WhatsApp leri ku kombelaka ku thepa linki kumbe ku pfuxeta vuxokoxoko bya wena, yima u tiyisisa u nga si endla nchumu. Tihlanganise na nhlangano hi ku kongoma hi ku tirhisa nomboro ya riqingho kumbe adirese ya imeyili leyi nga eka webusayiti ya vona ya ximfumo, ku nga ri eka rungula rero hi roxe.',
          'Kambisisa timpfumelelo ta app nkarhi na nkarhi — Endzhaku ka tin’hweti ti nga ri tingani, kambisisa ti-app eka riqingho ra wena naswona u vona leswaku yihi na yihi yi na timpfumelelo tihi. Susa timpfumelelo tihi na tihi leti app yi nga ti laviki eka ntirho wa yona wa xisekelo. Eka Android, yana eka Settings kutani Privacy kutani Permission Manager. Eka iPhone, yana eka Settings kutani Privacy and Security.',
          'Tihumesa (Log out) eka switirhisiwa leswi avelaniwaka — Loko u nghena eka phothala ya wena ya yunivhesiti, imeyili, kumbe akhawunti yin’wana ni yin’wana ya xihundla eka khompyuta leyi avelaniwaka kumbe ya mani na mani, mikarhi hinkwayo tihumese hi ku hetiseka loko u hetile. U nga pfali ntsena tabu ya xihlawulisi (browser). Sula matimu yo hlaya (browsing history) ni datha leyi hlayisiweke (cached data) loko swi koteka.',
        ],
      },
      {
        heading: 'Ku Twisisa Leswi U Pfumelelanaka Na Swona Loko U Amukela Swipimelo Ni Swiyimo',
        items: [
          'Ku avelana datha ni matlhelo ya vunharhu — Vukorhokeri byo tala byi katsa xiyenge lexi va pfumelelaka ku avelana vuxokoxoko bya wena bya xihundla ni vatirhisani, vaendli, kumbe vaphakeri va vukorhokeri. Mikarhi yin’wana leswi i swa nawu, kambe mikarhi yin’wana swi vula leswaku vuxokoxoko bya wena bya xavisiwa hi swikongomelo swo navetisa.',
          'Ku hlayisiwa ka datha endzhaku ko sula akhawunti — Vukorhokeri byin’wana byi hlayisa datha ya wena ku ringana tin’hweti kumbe hambi malembe endzhaku ka loko u sula akhawunti ya wena. Swipimelo ni swiyimo swi nga ha vula ntsena leswaku datha yi hlayisiwa "hi nkarhi wo leha lowu lavekaka eka swikongomelo swa bindzu", leswi nga vulaka xin’wana ni xin’wana.',
          'Mfanelo yo cinca swipimelo handle ka xitiviso — Vukorhokeri byo tala byi katsa xiyenge lexi vulaka leswaku va nga pfuxeta swipimelo ni swiyimo swa vona nkarhi wihi na wihi naswona ku hambeta u tirhisa vukorhokeri ku vumba ku amukela ka wena swipimelo leswintshwa.',
        ],
      },
      {
        heading: 'Laha U Nga Vikaka Kona Swivilelo eAfrika Dzonga',
        items: [
          'Goza 1: Tihlanganise na nhlangano hi ku kongoma. Tsala xivilelo xa wena hi ku tsala naswona u xi rhumela eka Mutirhela-vuxokoxoko wa nhlangano. Hlayisa khopi ya hinkwaswo leswi u swi rhumelaka ni ku swi amukela.',
          'Goza 2: Tihlanganise na Mulawuri wa Vuxokoxoko wa Afrika Dzonga: Webusayiti: www.inforegulator.org.za; Imeyili: inforeg@justice.gov.za; Adirese ya xiviri: JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001; Riqingho: 010 023 5207',
          'Goza 3: Lava xitsundzuxo xa nawu loko mhaka yi katsa ku onhiwa lokukulu ko fana ni ku yiviwa ka vutitivisi kumbe ku lahlekelwa hi timali. Legal Aid South Africa yi nyikela mpfuno wa nawu wa mahala eka vanhu lava fanelekaka.',
        ],
      },
      {
        heading: 'Nxaxamelo wo Kamba Vuhlayiseki bya Xihundla xa Munhu',
        body: 'Hetisisa nxaxamelo lowu landzelaka hi ku tshembeka eka wena n’wini. Leswi a swi rhumeriwi kumbe ku kamberiwa (graded). I xitirhisiwa xo ku pfuna ku vona laha u nga antswisaka kona mikhuva ya wena ya vuhlayiseki bya dijitali.',
        items: [
          'Ndzi tirhisa tiphaswede to hlawuleka eka tiakhawunti to hambana',
          'Ndzi pfumelele 2FA eka ti-app ta mina ta imeyili ni ta bangi',
          'Ndzi kambisisa timpfumelelo ta app eka riqingho ra mina nkarhi na nkarhi',
          'Ndzi papalata ku tirhisa Wi-Fi ya mani na mani eka tiakhawunti ta xihundla',
          'Ndzi kamba vuxokoxoko bya murhumi ndzi nga si thepa tilinki eka marungula',
          'Ndzi hlaya tipholisi ta vuxihundla ndzi nga si tsarisa',
          'Ndzi tihumesa (log out) eka tikhompyuta leti avelaniwaka kumbe ta mani na mani endzhaku ko tirhisa',
          'Ndzi papalata ku avelana tidokhumente ta xihundla eka mibulo ya ntlawa',
          'Ndza tiva ndlela yo tihlanganisa ni Mulawuri wa Vuxokoxoko loko swi laveka',
          'Ndza tiva leswaku Mutirhela-vuxokoxoko i mani eka vukorhokeri lebyi ndzi byi tirhisaka',
        ],
      },
    ],
    keyTakeaway: 'Ku cinca kutsongo loku hambetaka ku endla ku hambana lokukulu hi ku famba ka nkarhi.',
  },
];

export const DIGITAL_PRIVACY_TS_QUIZ: Record<number, TopicQuizQuestion[]> = {
  1: [
    {
      text: 'Zanele u le ka ntlawa wa WhatsApp wa yunivhesiti laha swichudeni swi komberiwaka ku avelana tinomboro ta vona ta ID ni vumbhoni byo tsarisa ku joyina nhlangano wa khamphasi. Hi rihi khombo rikulu eka xiyimo lexi?',
      options: [
        'WhatsApp a yi seketeli ku avelana tidokhumente',
        'Nhlangano wa yunivhesiti a wu na mfanelo yo hlengeleta vuxokoxoko lebyi',
        'Riqingho ra Zanele ri ta hwekiwa xikan’we-kan’we',
        'Tidokhumente ti ta suriwa hi toxe',
      ],
      correct: 1,
    },
    {
      text: 'Hi xihi eka leswi landzelaka lexi hlamuselaka kahle nhlaselo wa vuxisi (phishing)?',
      options: [
        'Xigevenga xi yiva riqingho ra wena hi nyama ku fikelela vuxokoxoko bya wena bya xihundla',
        'Khamphani leyi hlengeletaka datha ya wena hi nawu hi ku tirhisa app ya vona handle ko ku tivisa',
        'Rungula ra vuxisi kumbe webusayiti leyi endleriweke ku ku xisa leswaku u nyika vuxokoxoko bya wena bya xihundla',
        'Ku tluriwa ka datha loku vangiweke hi mutirhi wa khamphani la lahlekelweke hi xikhompyuta',
      ],
      correct: 2,
    },
    {
      text: 'Eka ku tluriwa ka datha ya Experian ka 2020, xana xigevenga xi kume njhani datha ya xihundla ya timiliyoni ta Maafrika Dzonga?',
      options: [
        'Hi ku nghenelela hi vuhwengi (hacking) eka tisisiteme ta tikhompyuta ta Experian vusiku hinkwabyo',
        'Hi ku tiendla khlayente ya ntiyiso naswona xi kombela datha',
        'Hi ku yiva tifayili ta xiviri eka tihofisi ta Experian',
        'Hi ku nghenelela datha leyi rhumeriweke eka tinetiweke ta Wi-Fi ta mani na mani',
      ],
      correct: 1,
    },
  ],
  2: [
    {
      text: 'Hi yihi phaswede leyi sirhelelekeke ngopfu eka leti landzelaka?',
      options: ['Sipho1998', 'password123', 'UP@Student', 'Tr!angle92Blue#'],
      correct: 3,
    },
    {
      text: 'Thandi u amukela rungula ra WhatsApp leri vonakaka ri huma eka bangi ya yena, ri n’wi kombela ku thepa linki ni ku tiyisisa vuxokoxoko bya akhawunti ya yena ku papalata ku yimisiwa. U fanele ku endla yini?',
      options: [
        'Ku thepa linki xikan’we-kan’we ku papalata leswaku akhawunti ya yena yi yimisiwa',
        'Ku hlamula rungula hi vuxokoxoko bya akhawunti ya yena',
        'Ku ba hi makatla rungula kutani a tihlanganisa ni bangi ya yena hi ku kongoma hi ku tirhisa nomboro leyi nga eka webusayiti ya vona ya ximfumo',
        'Ku hundzisela rungula eka swirho swa ndyangu wa yena ku va lemukisa',
      ],
      correct: 2,
    },
    {
      text: 'Xana xitiyisiso xa swiphemu swimbirhi (two-factor authentication) xi endla yini?',
      options: [
        'Xi tumbuluxa tiakhawunti timbirhi to hambana eka nsirhelelo lowu engetelekeke',
        'Xi lava xivumbeko xa vumbirhi xa ntiyisiso ku engetela eka phaswede ya wena',
        'Xi andzisa vulehi bya phaswede ya wena kambirhi hi xoxe',
        'Xi pfalela matshalatshala hinkwawo yo nghena ku suka eka switirhisiwa leswi nga tiviwiki hilaha ku nga heriki',
      ],
      correct: 1,
    },
    {
      text: 'Xichudeni xi xiya leswaku app ya tochi (flashlight) eka riqingho ra xona yi kombela mfikelelo eka vuxokoxoko bya xona byo tihlanganisa, mayikrofoni, ni ndhawu. Va fanele ku endla yini?',
      options: [
        'Ku pfumelela timpfumelelo hinkwato hikuva app yi ti lava leswaku yi tirha kahle',
        'Ku sula app xikan’we-kan’we handle ko kamba swin’wana',
        'Ku ala timpfumelelo leti nga lavekiki naswona u pfumelela ntsena leswi app yi swi lavaka hakunene',
        'Ku vika app eka ndzawulo ya IT ya yunivhesiti ya vona',
      ],
      correct: 2,
    },
    {
      text: 'Mpho u lava ku nghenisa xivilelo mayelana ni ndlela leyi khamphani yi khomeke vuxokoxoko bya yena bya xihundla ha yona. U se a tihlanganisile na khamphani kambe a va hlamulanga. Hi rihi goza ra yena leri landzelaka?',
      options: [
        'Ku posta hi swona eka ti-social media ku lemukisa van’wana',
        'Ku amukela leswaku a ku na lexi nga endliwaka ivi a ya emahlweni ni vutomi',
        'Ku yisa khamphani eka Huvo leyi Tlakukeke (High Court) xikan’we-kan’we',
        'Ku nghenisa xivilelo xa ximfumo eka Mulawuri wa Vuxokoxoko wa Afrika Dzonga',
      ],
      correct: 3,
    },
    {
      text: 'Hi xihi eka leswi landzelaka lexi nga xikombiso xa lemukiso eka pholisi ya vuxihundla?',
      options: [
        'Pholisi yi vula leswaku datha ya wena yi ta hlayisiwa nkarhi wo tanihi kwihi',
        'Pholisi yi nyikela vuxokoxoko byo tihlanganisa bya Mutirhela-vuxokoxoko',
        'Pholisi yi ri "hi nga ha avelana datha ya wena ni vatirhisani lava hlawuriweke nkarhi na nkarhi" handle ko vula hi ku kongoma leswaku i vamani',
        'Pholisi yi hlamusela mfanelo ya wena yo kombela ku suriwa ka vuxokoxoko bya wena',
      ],
      correct: 2,
    },
    {
      text: 'Hikwalaho ka yini u fanele u papalata ku tirhisa phaswede leyi fanaka eka tiakhawunti to hlaya?',
      options: [
        'Tiwebusayiti a ti pfumeleli tiphaswede leti phindhiweke eka tipulatifomo to hambana',
        'Loko akhawunti yin’we yi kumiwa, tiakhawunti hinkwato leti tirhisaka phaswede yoleyo yi fanaka ti va ekhombyeni',
        'Tiphaswede ti hela nkarhi (expire) hi ku hatlisa loko ti tlhela ti tirhisiwa',
        'Tinjhini to lavisisa ti landzelela tiphaswede leti phindhiweke ni ku ti fungha tanihi leti solisekaka',
      ],
      correct: 1,
    },
    {
      text: 'Lerato u tirhisa Wi-Fi ya mahala eka khamphasi yo xavela (shopping centre) ku kamba app ya yena ya bangi. Hi rihi khombo lerikulu?',
      options: [
        'Wi-Fi ya khamphasi yo xavela yi nonoka ngopfu leswaku ti-app ta tibangi ti tirha kahle',
        'Bangi ya yena yi nga ha n’wi hakerisa mali leyi engetelekeke hikwalaho ko tirhisa Wi-Fi ya mani na mani',
        'Un’wana eka netiweke leyi fanaka a nga ha tekela datha ya yena',
        'Betri ya riqingho ra yena yi ta hela hi ku hatlisa eka Wi-Fi ya mani na mani',
      ],
      correct: 2,
    },
    {
      text: 'U fanele ku endla yini xikan’we-kan’we endzhaku ko tirhisa khompyuta leyi avelaniwaka ku nghena eka phothala ya wena ya yunivhesiti?',
      options: [
        'Ku tlhela u lumeka khompyuta',
        'Ku cinca phaswede ya wena ya phothala ya yunivhesiti hi ku tirhisa riqingho ra wena',
        'Ku tihumesa hi ku hetiseka ni ku sula matimu yo hlaya ni datha leyi hlayisiweke',
        'Ku nga endli nchumu, nkarhi (session) wu ta hela hi woxe',
      ],
      correct: 2,
    },
    {
      text: 'Hi xihi eka leswi landzelaka lexi hlamuselaka kahle xikongomelo xa POPIA hi ku angarhela?',
      options: [
        'Ku sivela Maafrika Dzonga ku tirhisa inthanete eka migingiriko ya munhu hi xiyenge',
        'Ku sirhelela vanhu hi ku lawula ndlela leyi tinhlangano ti hlengeletaka, ku hlayisa, ku tirhisa, ni ku avelana vuxokoxoko bya xihundla ha yona',
        'Ku nyika hulumendhe mfikelelo eka vuxokoxoko hinkwabyo bya xihundla lebyi hlayisiweke hi tikhamphani ta phurayivhete',
        'Ku pfumelela tinhlangano ku hlengeleta vuxokoxoko byin’wana ni byin’wana lebyi va byi lavaka ntsendze loko va byi hlayisa hi ndlela yo sirheleleka',
      ],
      correct: 1,
    },
  ],
};
