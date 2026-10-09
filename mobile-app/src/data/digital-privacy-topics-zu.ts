import type { TopicContent, TopicQuizQuestion } from './topic-types';

// isiZulu translation of the Digital Privacy module, reproduced verbatim from the team's own
// native-language notes ("Zulu Notes/Isigaba3…" and "Isigaba5…" at the repo root) — not machine- or
// Claude-translated. Laid out to mirror the English topics in digital-privacy-topics.ts section for
// section. Quiz answers are the ones the notes themselves mark as correct.
//
// One mechanical repair: in the notes' heading "Izindlela Ezijwayelekile Abafundi Ababelana Ngazo
// Nge……wane Ngaphandle Kokwazi", six letters of one word were typed in Cyrillic (м-и-н-и-н-г). They
// are transliterated letter for letter to Latin ("mining"), giving "Ngeminingwane". That is probably
// a typo for "Ngemininingwane" (the spelling used everywhere else in the notes), but correcting the
// spelling is the translator's call, not ours — confirm with them before changing it.
export const DIGITAL_PRIVACY_ZU: TopicContent[] = [
  {
    n: 1,
    title: 'Isetshenziswa Kanjani Kabi Imininingwane Yakho',
    intro:
      'Manje usuyazi ukuthi iyini i-POPIA nokuthi ikunika maphi amalungelo. Kodwa ukwazi amalungelo akho kuba wusizo kuphela uma ukwazi ukubona lapho kukhona okungahambi kahle kwasekuqaleni. Lesi sigaba sigxile ekukusizeni ukuthi uqonde ukuthi imininingwane yomuntu isetshenziswa kabi kanjani empilweni yangempela, nezibonelo ezithinta impilo yakho njengomfundi waseNingizimu Afrika. Ukusetshenziswa kabi kwemininingwane akubonakali njalo ngokusobala. Kwesinye isikhathi kwenzeka ngenxa yobudedengu. Kwesinye isikhathi kusuke kwenziwe ngamabomu. Futhi kwesinye isikhathi unikeza imininingwane yakho ngaphandle kokuqaphela ukuthi uvumelana nani.',
    sections: [
      {
        heading: 'Yini Ethathwa Njengemininingwane Yomuntu Siqu Ebucayi?',
        body: 'I-POPIA yenza umehluko phakathi kwemininingwane yomuntu evamile kanye nalokho ekubiza ngokuthi imininingwane yomuntu siqu ekhethekile. Imininingwane yomuntu siqu ekhethekile ithwala izinga eliphakeme lokuvikelwa ngoba ukusetshenziswa kabi kwayo kungadala umonakalo omkhulu. Imininingwane yomuntu siqu ekhethekile ihlanganisa:',
        items: [
          'Izinkolelo zezenkolo noma zefilosofi',
          'Ubuhlanga noma imvelaphi',
          'Ubulungu benyunyana yabasebenzi',
          'Inkolelo yezepolitiki',
          'EzeMpilo noma impilo yocansi',
          'Imininingwane yebhayomethrikhi njengezigxivizo zeminwe kanye nokubonwa kobuso',
          'Ukuziphatha kobugebengu',
        ],
      },
      {
        heading: 'Izindlela Ezijwayelekile Abafundi Ababelana Ngazo Ngeminingwane Ngaphandle Kokwazi',
        items: [
          'Amafomu aku-inthanethi nokubhalisa — Njalo lapho udala i-akhawunti kuwebhusayithi noma kuhlelo lokusebenza, unikeza imininingwane yomuntu siqu. Izinkundla eziningi zicela okungaphezu kwalokho ezikudinga ngempela. Zibuze njalo ukuthi ngabe imininingwane ecelwayo iyadingeka yini ngempela kwinsizakalo obhalisela yona.',
          'Izinkundla zokuxhumana — Amaphrofayili akho ezinkundleni zokuxhumana aqukethe inqwaba yemininingwane yomuntu. Amagama akho aphelele, indawo ohlala kuyo, indawo yokufunda, indawo yokusebenza, isimo sobudlelwano, kanye nendlela yakho yokuphila yansuku zonke kungahlanganiswa ndawonye kusukela kokuthunyelwe kwakho kanye nemininingwane yephrofayili. Izigebengu zaku-inthanethi zisebenzisa imininingwane etholakala esidlangalaleni ezinkundleni zokuxhumana ukwakha amaphrofayili ezisulu ezizihlosile ngaphambi kokuqala ukuhlasela okuqondisiwe.',
          'Amaqembu e-WhatsApp — Lokhu kujwayelekile kakhulu kubafundi baseNingizimu Afrika. Amaqembu ezinhlangano zenyuvesi, amaqembu amakilasi, namaqembu omphakathi ku-WhatsApp avame ukwabelana ngezinombolo zikamazisi, izinombolo zabafundi, imininingwane yasebhange, nezithombe zobufakazi bokukhokha. Uma leyo mininingwane isikwingxoxo yeqembu, awusakwazi ukulawula ukuthi ubani oyithwebulayo noma oyithumela kwabanye.',
          'Ukwamukela imigomo nemibandela ngaphandle kokuyifunda — Abantu abaningi bacindezela u-"Ngiyavuma" ngaphandle kokufunda ukuthi bavumelana nani. Imigomo nemibandela eminingi yezinhlelo zokusebenza ihlanganisa imishwana evumela inkampani ukuthi yabelane ngemininingwane yakho nezinkampani zangaphandle, isebenzise imininingwane yakho ukukukhangisela okuqondiwe, noma igcine imininingwane yakho ngisho nangemva kokuba ususile i-akhawunti yakho.',
          'I-Wi-Fi yomphakathi yamahhala — Ukusebenzisa i-Wi-Fi yomphakathi engavikelekile kubeka ucingo lwakho nemininingwane oyithumelayo engozini yokunqakwa. Uma ungena kuhlelo lwakho lwasebhange noma kwingosi yenyuvesi usebenzisa i-Wi-Fi engavikelekile, imininingwane yakho yokungena ingathathwa ngumuntu okuleyo nethiwekhi.',
          'Izixhumanisi zokweba imininingwane (Phishing) — I-Phishing ihlanganisa ukuthunyelelwa umyalezo mbumbulu noma i-imeyili ebukeka isemthethweni kanti ikukhohlisa ukuthi ufake imininingwane yakho yomuntu siqu kwiwebhusayithi engamanga. Lezi zinto zijwayelekile kakhulu eNingizimu Afrika kanti zivame ukuzenza amabhange, i-SASSA, noma izingosi zenyuvesi.',
        ],
      },
      {
        heading: 'Kubukeka Kanjani Ukuvuza Kwemininingwane Empilweni Yangempela?',
        body: 'Ukuvuza kwemininingwane kwenzeka lapho imininingwane yomuntu ifinyelelwa, idalulwa, noma ilahleka ngaphandle kwemvume. Ukuvuza kungenzeka ngenxa yalokhu:',
        items: [
          'Isisebenzi senkampani sithumela ngephutha i-imeyili enemininingwane yomuntu kumuntu ongafanele.',
          'Indawo yokugcina imininingwane ishiywa ingavikelekile futhi ifinyeleleka kuwo wonke umuntu ku-inthanethi.',
          'Ukuhlaselwa nge-inthanethi lapho izigebengu zintshontsha imininingwane egciniwe.',
          'Ikhompyutha ephathwayo noma ucingo olulahlekile noma oluntshontshiwe olubelungavikelwe nge-phasiwedi.',
          'Usongo lwangaphakathi lapho isisebenzi sidalula noma sithengisa imininingwane ngamabomu.',
          'Uma kwenzeka ukuvuza, imininingwane yomuntu ehilelekile ingasetshenziswa ukuvula ama-akhawunti asebhange omgunyathi, ukufaka izicelo zemalimboleko ngegama lakho, noma ukuzenza wena ku-inthanethi.',
        ],
      },
      {
        heading: 'Izibonelo Zangempela ZaseNingizimu Afrika',
        items: [
          'Ukuvuza Kwemininingwane kwa-Experian (2020) — Ngo-2020, i-Experian yaba nokuvuza kwemininingwane lapho imininingwane yomuntu siqu yabantu baseNingizimu Afrika ababalelwa ezigidini ezingama-24 kanye namabhizinisi angama-793 000 yadalulwa. Imininingwane yayihlanganisa izinombolo zikamazisi, imininingwane yokuxhumana, nolwazi lokuqashwa. Umkhwabanisi wayezenze ikhasimende elisemthethweni wacela imininingwane. Lokhu kukhombisa ukuthi ngisho nezinhlangano ezinkulu nezithembekile ziyathinteka.',
          'Umkhonyovu wama-SMS we-SASSA — Abantu abaningi abathola isibonelelo eNingizimu Afrika bathola imiyalezo ye-SMS yomgunyathi ethi ivela kwa-SASSA, ebacela ukuthi babuyekeze imininingwane yabo yasebhange ngokuchofoza isixhumanisi noma ngokushayela inombolo ethile. Abantu abaphendulile banikeza izigebengu imininingwane yabo yasebhange ezabe sezithatha yonke imali kuma-akhawunti abo.',
          'Ukudalulwa Kwemininingwane Yabafundi Basenyuvesi — Amanyuvesi amaningana aseNingizimu Afrika abe nezigameko lapho imininingwane yabafundi, ehlanganisa amarekhodi ezifundo nemininingwane yokuxhumana, yavuza noma yaphathwa ngendlela engafanele. Kwezinye izimo, imininingwane yabafundi yabelwa nezinkampani zangaphandle ngaphandle kokuthi kulandelwe izinqubo ezifanele zemvume.',
        ],
      },
      {
        heading: 'Okungahambanga kahle',
        items: [
          'USipho wabelane ngemiqulu ebucayi eqenjini lapho abengabazi khona bonke amalungu.',
          'Imininingwane yakhe yasetshenziswa yisigebengu ukwakha ukuzenza yena ngendlela ekholisayo.',
          'Akazange aqinisekise ubuqiniso boshayayo esebenzisa izindlela ezisemthethweni zenyuvesi.',
        ],
      },
      {
        heading: 'Okwakumele uSipho akwenze',
        items: [
          'Ukubuza ukuthi kungani inhlangano yabafundi idinga ikhophi kamazisi nemiqulu ephelele yokubhalisa.',
          'Angalokothi abelane ngemiqulu ebucayi kwingxoxo yeqembu.',
          'Ukuvala ucingo olusolisayo axhumane nehhovisi losizo lwezimali ngqo esebenzisa iwebhusayithi esemthethweni yenyuvesi.',
        ],
      },
    ],
    example:
      'Isimo: Iphutha Leqembu Le-WhatsApp. USipho ungumfundi wonyaka wesibili enyuvesi yaseNingizimu Afrika. Ujoyina iqembu le-WhatsApp lenhlangano yabafundi kanti ucelwa ukuthi athumele inombolo yakhe yomfundi, inombolo kamazisi, nobufakazi bokubhalisa ukuqinisekisa ubulungu bakhe. Uthumela imiqulu ngaphandle kokucabanga kabili ngoba wonke umuntu kulelo qembu wenza okufanayo. Emasontweni ambalwa kamuva, uSipho uthola ucingo oluvela kumuntu othi uvela ehhovisi losizo lwezimali lenyuvesi. Oshayayo useyayazi inombolo yakhe yomfundi namagama aphelele futhi umcela ukuthi aqinisekise imininingwane yakhe yasebhange ukuze kufakwe imali yomfundaze abengayilindele. USipho, ekholelwa ukuthi oshayayo usemthethweni, unikeza imininingwane yakhe yasebhange. I-akhawunti yakhe ishiywa ingenalutho ngakusasa.',
    keyTakeaway:
      'Ukusetshenziswa kabi kwemininingwane akubonakali njalo ngokusobala. Kwesinye isikhathi kwenzeka ngenxa yobudedengu. Kwesinye isikhathi kusuke kwenziwe ngamabomu.',
  },
  {
    n: 2,
    title: 'Ukuvikela Ubumfihlo Bakho Bedijithali',
    intro:
      'Kuyo yonke le mojuli ufunde ukuthi iyini i-POPIA, ikunika maphi amalungelo, imininingwane isetshenziswa kabi kanjani, nokuthi izinhlangano zidingeka ukuba zenzeni ngokomthetho. Lesi sigaba sokugcina sihlanganisa konke kanyekanye kusuka ohlangothini lwakho. Ukwazi amalungelo akho nokuqonda umthetho kubalulekile, kodwa into ewusizo kakhulu ongayenza wukuthatha izinyathelo zokuvikela ubumfihlo bakho bedijithali ngokuzikhandla.',
    sections: [
      {
        heading: 'Izinyathelo Eziwusizo Zokuvikela Imininingwane Yakho Yomuntu Siqu',
        items: [
          'Cabanga ngaphambi kokwabelana — Ngaphambi kokugcwalisa noma yiliphi ifomu, ukubhalisela noma iyiphi insizakalo, noma ukwabelana nganoma yimuphi umqulu engxoxweni yeqembu, zibuze imibuzo emithathu: Ngabe le nhlangano iyayidinga ngempela le mininingwane? Sinesizathu esizwakalayo yini ecelwa ngaso? Kungenzekani uma le mininingwane iwela ezandleni ezingalungile?',
          'Khawulela lokho owabelana ngakho ezinkundleni zokuxhumana — Buyekeza amaphrofayili akho ezinkundleni zokuxhumana futhi ususe noma yiluphi ulwazi olungadingekile ukuba lubonakale emphakathini. Usuku lwakho lokuzalwa oluphelele, ikheli lasekhaya, inombolo yocingo, kanye nenombolo kamazisi akufanele neze kuvele kuphrofayili yomphakathi.',
          'Funda izinqubomgomo zobumfihlo ngaphambi kokuvuma — Akudingeki ukuthi ufunde igama ngalinye, kodwa okungenani kufanele ubhekisise inqubomgomo yobumfihlo ukuthi yiluphi ulwazi oluqoqwayo, noma luzokwabelwa nezinkampani zangaphandle, lugcinwa isikhathi esingakanani, nokuthi ungasicela kanjani ukuthi lususwe.',
          'Landa izinhlelo zokusebenza emithonjeni ethembekile kuphela — Landa izinhlelo zokusebenza kuphela ku-Google Play Store noma ku-Apple App Store okusemthethweni. Ngaphambi kokufaka uhlelo, hlola izimvume zalo. Uma uhlelo lokusebenza olulula lwethoshi lucela ukufinyelela koxhumana nabo, indawo okuyo, nemakrofoni yakho, kukhona okungahambi kahle.',
          'Sebenzisa amaphasiwedi aqinile nahlukile — Iphasiwedi eqinile inobude bezinhlamvu eziyishumi nambili okungenani futhi ihlanganisa ofeleba noosonhlamvukazi, izinombolo, nezimpawu ezikhethekile. Gwema ukusebenzisa igama lakho, usuku lokuzalwa, noma inombolo yomfundi njengephasiwedi. Uma ukuthola kunzima ukukhumbula amaphasiwedi amaningi, sebenzisa umphathi wamaphasiwedi othembekile.',
          'Vula ukuqinisekisa okuzinyathelo-zimbili (2FA) — Ukuqinisekisa okuzinyathelo-zimbili kunikeza isivikelo esengeziwe kuma-akhawunti akho. Noma ngabe othile uthola iphasiwedi yakho, ngeke akwazi ukufinyelela i-akhawunti yakho ngaphandle kwendlela yesibili yokuqinisekisa. Vula i-2FA kwi-imeyili yakho, kuhlelo lwasebhange, nakunoma iyiphi enye i-akhawunti equkethe imininingwane ebucayi.',
          'Qaphela kwi-Wi-Fi yomphakathi — Gwema ukufinyelela kuma-akhawunti abucayi njengohlelo lwakho lwasebhange, ingosi yenyuvesi, noma i-imeyili kumanethiwekhi e-Wi-Fi yomphakathi engavikelekile. Uma kumele usebenzise i-Wi-Fi yomphakathi, cabanga ukusebenzisa i-VPN, ebethela ukuxhumana kwakho kwe-inthanethi futhi yenze kube nzima kwabanye abakuleyo nethiwekhi ukunqaka imininingwane yakho.',
          'Qinisekisa ngaphambi kokuchofoza — Uma uthola i-SMS, i-imeyili, noma umlayezo we-WhatsApp ongalindelekile okucela ukuthi uchofoze isixhumanisi noma ubuyekeze imininingwane yakho, yima futhi uqinisekise ngaphambi kokwenza noma yini. Xhumana nenhlangano ngqo usebenzisa inombolo yocingo noma ikheli le-imeyili elitholakala kuwebhusayithi yayo esemthethweni, hhayi emlayezweni ngokwawo.',
          'Buyekeza izimvume zohlelo lokusebenza njalo — Njalo ngemva kwezinyanga ezimbalwa, hamba kuzinhlelo zokusebenza ocingweni lwakho futhi ubuyekeze ukuthi izimvume zohlelo ngalunye ziyini. Hoxisa noma yiziphi izimvume uhlelo lokusebenza elingazidingi emsebenzini walo oyinhloko. Ku-Android, iya kokuthi Izilungiselelo bese uya kuBumfihlo bese uya kuMphathi Wemvume. Ku-iPhone, iya kokuthi Izilungiselelo bese uya kuBumfihlo Nokuvikeleka.',
          'Phuma kumadivayisi okwabelwana ngawo — Uma uke wangena kwingosi yakho yenyuvesi, i-imeyili, noma iyiphi i-akhawunti yomuntu siqu kwikhompyutha okwabelwana ngayo noma yomphakathi, hlala uphuma ngokuphelele uma usuqedile. Ungamane uvale ithebhu yesiphequluli. Sula umlando wokuphequlula nemininingwane egciniwe uma kungenzeka.',
        ],
      },
      {
        heading: 'Ukuqonda Ukuthi Uvumelana Nani Uma Wamukela Imigomo Nemibandela',
        items: [
          'Ukwabelana ngemininingwane nezinkampani zangaphandle — Izinsizakalo eziningi zifaka isigatshana esizivumela ukuthi zabelane ngemininingwane yakho yomuntu siqu nabalingani bazo noma abahlinzeki besevisi. Kwesinye isikhathi lokhu kusemthethweni, kodwa kwesinye isikhathi kusho ukuthi imininingwane yakho iyadayiswa ngenjongo yokukhangisa.',
          'Ukugcinwa kwemininingwane ngemuva kokususa i-akhawunti — Ezinye izinsizakalo zigcina imininingwane yakho izinyanga noma iminyaka ngemuva kokususa i-akhawunti yakho. Imigomo nemibandela ingamane ithi imininingwane igcinwa "isikhathi eside njengoba kudingeka ngenhloso yebhizinisi", okungasho cishe noma yini.',
          'Ilungelo lokushintsha imigomo ngaphandle kwesaziso — Izinsizakalo eziningi zihlanganisa isigatshana esisho ukuthi zingabuyekeza imigomo nemibandela yazo noma nini nokuthi ukuqhubeka kokusebenzisa kwakho isevisi kusho ukuthi uyamukela imigomo emisha.',
        ],
      },
      {
        heading: 'Indawo Ongabika Kuyo Ukukhathazeka ENingizimu Afrika',
        items: [
          'Isinyathelo 1: Xhumana nenhlangano ngqo. Bhala ukukhathazeka kwakho phansi ukuthumele kwiSikhulu Semininingwane senhlangano. Gcina ikhophi yakho konke okuthumelayo nokutholayo.',
          'Isinyathelo 2: Xhumana noMlawuli Wemininingwane waseNingizimu Afrika: Iwebhusayithi: www.inforegulator.org.za; I-imeyili: inforeg@justice.gov.za; Ikheli lendawo: JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001; Ucingo: 010 023 5207',
          'Isinyathelo 3: Funa iseluleko sezomthetho uma udaba luhilela umonakalo omkhulu njengokuntshontshwa kobunikazi noma ukulahlekelwa yimali. Abakwa-Legal Aid South Africa banikeza usizo lwezomthetho lwamahhala kubantu abafanelekayo.',
        ],
      },
      {
        heading: 'Uhlu Lwamakhizane Lokuhlola Ubumfihlo Bomuntu Siqu',
        body: 'Gcwalisa lolu hlu lwamakhizane olulandelayo ngokwethembeka ngokwakho. Lokhu akuthunyelwa futhi akumakwa. Kuyithuluzi lokukusiza ubone ukuthi ungayithuthukisa kuphi imikhuba yakho yobumfihlo bedijithali.',
        items: [
          'Ngisebenzisa amaphasiwedi ahlukile kuma-akhawunti ahlukene',
          'Ngivule i-2FA kwi-imeyili yami nezinhlelo zami zasebhange',
          'Ngibuyekeza izimvume zohlelo lokusebenza ocingweni lwami njalo',
          'Ngigwema ukusebenzisa i-Wi-Fi yomphakathi kuma-akhawunti abucayi',
          'Ngihlola imininingwane yomthumeli ngaphambi kokuchofoza izixhumanisi emilayezweni',
          'Ngifunda noma ngibhekisise izinqubomgomo zobumfihlo ngaphambi kokubhalisa',
          'Ngiyaphuma kumakhompyutha okwabelwana ngawo noma omphakathi ngemuva kokuwasebenzisa',
          'Ngigwema ukwabelana ngemiqulu ebucayi ezingxoxweni zamaqembu',
          'Ngiyakwazi ukuxhumana noMlawuli Wemininingwane uma kudingeka',
          'Ngiyamazi ukuthi ubani iSikhulu Semininingwane kuzinsizakalo engizisebenzisayo',
        ],
      },
    ],
    keyTakeaway: 'Izinguquko ezincane ezenziwa ngokungaguquguquki zenza umehluko omkhulu ngokuhamba kwesikhathi.',
  },
];

export const DIGITAL_PRIVACY_ZU_QUIZ: Record<number, TopicQuizQuestion[]> = {
  1: [
    {
      text: 'UZanele ukwiqembu le-WhatsApp laseNyuvesi lapho abafundi becelwa khona ukuthi babelane ngezinombolo zabo zikamazisi nobufakazi bokubhalisa ukuze bajoyine inhlangano yasekhampasi. Iyiphi ingozi enkulu kulesi simo?',
      options: [
        'I-WhatsApp ayikusekeli ukwabelana ngemiqulu.',
        'Inhlangano yenyuvesi ayinalo ilungelo lokuqoqa le mininingwane.',
        'Ucingo lukaZanele luzodunwa ngokushesha.',
        'Imiqulu izosuswa ngokuzenzakalelayo.',
      ],
      correct: 1,
    },
    {
      text: 'Yikuphi kulokhu okulandelayo okuchaza kangcono ukuhlasela kokweba imininingwane (phishing attack)?',
      options: [
        'Isigebengu esintshontsha ucingo lwakho ngokweqiniso ukufinyelela imininingwane yakho yomuntu siqu.',
        'Inkampani eqoqa imininingwane yakho ngokusemthethweni ngohlelo lwayo lokusebenza ngaphandle kokukwazisa.',
        'Umlayezo ongamanga noma iwebhusayithi edizayinelwe ukukukhohlisa ukuthi unikeze imininingwane yakho yomuntu siqu.',
        'Ukuvuza kwemininingwane okubangelwa isisebenzi senkampani esilahlekelwa yikhompyutha ephathwayo.',
      ],
      correct: 2,
    },
    {
      text: 'Ekuvuzeni kwemininingwane kwa-Experian kwango-2020, isigebengu sayithola kanjani imininingwane yomuntu siqu yabantu baseNingizimu Afrika abayizigidi?',
      options: [
        'Ngokuduna izinhlelo zekhompyutha ze-Experian ubusuku bonke.',
        'Ngokuzenza ikhasimende elisemthethweni sacele imininingwane.',
        'Ngokuntshontsha amafayela ngesandla emahhovisi e-Experian.',
        'Ngokunqaka imininingwane ethunyelwe kumanethiwekhi e-Wi-Fi yomphakathi.',
      ],
      correct: 1,
    },
  ],
  2: [
    {
      text: 'Iyiphi kulawa amaphasiwedi ephephe kakhulu?',
      options: ['Sipho1998', 'password123', 'UP@Student', 'Tr!angle92Blue#'],
      correct: 3,
    },
    {
      text: 'UThandi uthola umlayezo we-WhatsApp obukeka sengathi uvela ebhange lakhe, umcela ukuthi achofoze isixhumanisi aqinisekise imininingwane ye-akhawunti yakhe ukuze agweme ukumiswa. Kumele enzeni?',
      options: [
        'Achofoze isixhumanisi ngokushesha ukuze agweme ukuthi i-akhawunti yakhe imiswe.',
        'Aphendule umlayezo ngemininingwane ye-akhawunti yakhe.',
        'Azibe umlayezo futhi axhumane nebhange lakhe ngqo esebenzisa inombolo ekuwebhusayithi yabo esemthethweni.',
        'Adlulisele umlayezo kumalungu omndeni wakhe ukuze abaxwayise.',
      ],
      correct: 2,
    },
    {
      text: 'Ukwenza ntoni ukuqinisekisa okuzinyathelo-zimbili (two-factor authentication)?',
      options: [
        'Kudala ama-akhawunti amabili ahlukene ukuze kube nokuvikeleka okwengeziwe.',
        'Kudinga indlela yesibili yokuqinisekisa ngaphezu kwephasiwedi yakho.',
        'Kuphinda kabili ubude bephasiwedi yakho ngokuzenzakalelayo.',
        'Kuvimba yonke imizamo yokungena evela kumadivayisi angaziwa unomphela.',
      ],
      correct: 1,
    },
    {
      text: 'Umfundi uqaphela ukuthi uhlelo lokusebenza lwethoshi (flashlight app) ocingweni lwakhe lucela ukufinyelela koxhumana nabo, kumakrofoni, nasendaweni yakhe. Kumele enzeni?',
      options: [
        'Anikeze zonke izimvume ngoba uhlelo lokusebenza luyazidinga ukuze lusebenze kahle.',
        'Asuse uhlelo lokusebenza ngokushesha ngaphandle kokuhlola kabanzi.',
        'Anqabe izimvume ezingadingekile futhi avumele kuphela lokho okudingwa uhlelo lokusebenza ngempela.',
        'Abike uhlelo lokusebenza emnyangweni we-IT wenyuvesi yakhe.',
      ],
      correct: 2,
    },
    {
      text: 'UMpho ufuna ukufaka isikhalazo mayelana nendlela inkampani ephathe ngayo imininingwane yakhe yomuntu siqu. Uke waxhumana nenkampani kodwa ayizange iphendule. Siyini isinyathelo sakhe esilandelayo?',
      options: [
        'Ukubhala ngakho ezinkundleni zokuxhumana ukuze axwayise abanye.',
        'Ukwamukela ukuthi akukho okungenziwa bese edlulela phambili.',
        'Ukuyisa inkampani eNkantolo ePhakeme ngokushesha.',
        'Ukufaka isikhalazo esisemthethweni kuMlawuli Wemininingwane waseNingizimu Afrika.',
      ],
      correct: 3,
    },
    {
      text: 'Yikuphi kulokhu okulandelayo okuluphawu oluyisixwayiso kwenqubomgomo yobumfihlo?',
      options: [
        'Inqubomgomo isho ukuthi imininingwane yakho izogcinwa isikhathi esingakanani.',
        'Inqubomgomo ihlinzeka ngemininingwane yokuxhumana yeSikhulu Semininingwane.',
        'Inqubomgomo ithi "singabelana ngemininingwane yakho nabalingani esibakhethile ngezikhathi ezithile" ngaphandle kokusho ukuthi obani.',
        'Inqubomgomo ichaza ilungelo lakho lokucela ukuthi imininingwane yakho isuswe.',
      ],
      correct: 2,
    },
    {
      text: 'Kungani kufanele ugweme ukusebenzisa iphasiwedi efanayo kuma-akhawunti amaningi?',
      options: [
        'Amawebhusayithi awawavumeli amaphasiwedi ayimpinda kuzinkundla ezingafani.',
        'Uma i-akhawunti eyodwa ihlaselwa, wonke ama-akhawunti asebenzisa iphasiwedi efanayo aba sengozi.',
        'Amaphasiwedi aphelelwa isikhathi ngokushesha uma esetshenziswa kabusha.',
        'Izinjini zokusesha zilandelela amaphasiwedi aphindaphindiwe futhi ziwamake njengasolisayo.',
      ],
      correct: 1,
    },
    {
      text: 'ULerato usebenzisa i-Wi-Fi yamahhala edolobheni ukuze ahlole uhlelo lwakhe lwasebhange. Iyiphi ingozi enkulu kakhulu?',
      options: [
        'I-Wi-Fi yedolobha ihamba kancane kakhulu ukuthi izinhlelo zasebhange zisebenze kahle.',
        'Ibhange lakhe lingamkhokhisa izimali ezengeziwe ngokusebenzisa i-Wi-Fi yomphakathi.',
        'Othile okuleyo nethiwekhi angakwazi ukunqaka imininingwane yakhe.',
        'Ibhethri yocingo lwakhe izophela ngokushesha kwi-Wi-Fi yomphakathi.',
      ],
      correct: 2,
    },
    {
      text: 'Yini okufanele uyenze ngokushesha ngemva kokusebenzisa ikhompyutha okwabelwana ngayo ukufinyelela ingosi yakho yenyuvesi?',
      options: [
        'Qala kabusha ikhompyutha.',
        'Shintsha iphasiwedi yengosi yakho yenyuvesi ngocingo lwakho.',
        'Phuma ngokuphelele bese usula umlando wokuphequlula nemininingwane egciniwe.',
        'Ungenzi lutho, iseshini izophelelwa yisikhathi ngokwayo.',
      ],
      correct: 2,
    },
    {
      text: 'Yikuphi kulokhu okulandelayo okuchaza kangcono injongo ye-POPIA iyonke?',
      options: [
        'Ukuvimbela abantu baseNingizimu Afrika ekusebenziseni i-inthanethi emisebenzini yomuntu siqu.',
        'Ukuvikela abantu ngakulawula indlela izinhlangano eziqoqa, ezigcina, ezisebenzisa, nezabelana ngayo ngemininingwane yomuntu siqu.',
        'Ukunikeza uhulumeni ukufinyelela kuyo yonke imininingwane yomuntu siqu egcinwe yizinkampani ezizimele.',
        'Ukuvumela izinhlangano ukuba ziqoqe noma yiluphi ulwazi eziludingayo inqobo nje uma zizolugcina ngokuphepha.',
      ],
      correct: 1,
    },
  ],
};
