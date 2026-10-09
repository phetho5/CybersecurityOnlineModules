import type { TopicContent, TopicQuizQuestion } from './topic-types';

// isiZulu translation of the POPIA module, reproduced verbatim from the team's own native-language
// notes ("Zulu Notes/Isigaba1…", "Isigaba2…" and "Isigaba4…" at the repo root) — not machine- or
// Claude-translated. Laid out to mirror the English topics in popia-topics.ts section for section.
// Quiz answers are the ones the notes themselves mark as correct.
export const POPIA_ZU: TopicContent[] = [
  {
    n: 1,
    title: 'Yini i-POPIA?',
    intro:
      'Nsuku zonke wabelana ngeMininingwane yakho yomuntu siqu ku-inthanethi ngaphandle nokucabanga. Ugcwalisa inombolo yakho yomfundi ukuze ungene ku-portal yeyunivesithi, ufake inombolo yakho yocingo ukuze ubhalise ku-app, futhi wabelana nendawo yakho uma u-oda ukudla. Kodwa wake wama ukubuza ukuthi ubani onokufikelela kulolo lwazi, benzani ngalo, futhi bayavunyelwa yini ukwenza lokho? ENingizimu Afrika, kukhona umthetho owenziwa ikakhulukazi ukuphendula lezo mibuzo nakukuvikela. Umthetho lowo ubizwa nge-POPIA.',
    sections: [
      {
        heading: 'I-POPIA Isho Ukuthini?',
        items: [
          'I-POPIA isho i-Protection of Personal Information Act — umthetho wokuvikela imininingwane yomuntu siqu. Ibizwa nangokuthi uMthetho wezi-4 wango-2013, okuwunyaka lapho usayinwa nguMongameli waseNingizimu Afrika. Nokho, waqala ukusebenza ngokugcwele mhla zingama-1 Julayi 2021, okuwumhla lapho izinhlangano ebezidingeka khona ngokomthetho ukuba zithobele lo mthetho.',
          'Ngaphambi kokuba i-POPIA ikhona, kwakunokuklindwa okuncane kwezomthetho kubantu baseNingizimu Afrika mayelana nokuthi izinhlangano zibutha, zigcina futhi zabelana kanjani ngeMininingwane yabo yomuntu siqu. Izinhlangano zazingaqoqa imininingwane yakho ngaphandle kokuziphendulela. I-POPIA ilishintshile lokho.',
        ],
      },
      {
        heading: 'Ngani iNingizimu Afrika Yalidinga Lo Mthetho?',
        items: [
          '1. Imininingwane yomuntu siqu yayisetshenziswa kabi — Abantu babenamukela amakholi nemiyalezo yokukhangisa engacelwanga evela ezikhungwini abangakaze basebenzi nazo. Ezinye izimo, imininingwane yabo yathengiswa noma yabelwa ngaphandle kolwazi lwabo noma imvume yabo.',
          '2. Ukuvuza kwemininingwane kwakwanda — Njengoba abantu abaningi baseNingizimu Afrika baqala ukusebenzisa i-inthanethi kwezamabhange, izinto-zokuthenga, nokuxhumana, inani leMininingwane yomuntu siqu egcinwa ngokwedijithali lakhula ngokushesha. Ngaphandle kokuklindwa kwezomthetho okufanele, le mininingwane yayisengozini yokwebiwa nokudalulwa.',
          '3. INingizimu Afrika kwakudingeka ihambe nemikhakha yomhlaba ekuvikele imininingwane — Amazwe afana nawo e-European Union ayesenamithetho eqinile yokuvikela imininingwane, efana ne-GDPR. I-POPIA ibeka iNingizimu Afrika emzileni wemikhakha yamazwe omhlaba, okuyinto ebalulekile nangamabhizinisi asebenza phakathi kwemikhawulo yamazwe.',
          '4. Abantu babengenandlela esemthethweni yokubamba izinhlangano zibe necala — Ngaphambi kwe-POPIA, uma inkampani ingenakho kahle imininingwane yakho yomuntu siqu, kwakungekho inqubo yezomthetho ecacile owayengazilandela noma izinhlaka owayezibika kuzo. I-POPIA yasungula uMlawuli Wemininingwane waseNingizimu Afrika ikakhulukazi ukubhekana nalokhu.',
        ],
      },
      {
        heading: 'I-POPIA Isebenzela Bani?',
        items: [
          'Abantu Ngabanye — Noma yimuphi umuntu ozimele obutha noma ocubungula imininingwane yomuntu siqu yabanye abantu, isibonelo umuntu osebenzisa ibhizinisi elincane futhi egcina uhlu lwemininingwane yamakhasimende, uphansi kwe-POPIA.',
          'Izinhlangano Zizimele — Lokhu kuhlanganisa amabhizinisi, izinkampani, izinhlangano ezingenzeli inzuzo, nanoma yimuphi umuntu ozimele obhekana neMininingwane yomuntu siqu njengengxenye yemisebenzi yazo. Lokhu kuhlanganisa konke kusuka ebhange lakho kuze kufike kuhlelo lokusebenza ocingweni lwakho.',
          'Uhulumeni Nezinhlaka Zomphakathi — Amasebe kahulumeni, izifunda, nezinhlaka zikahulumeni nazo kufanele zihlonipha i-POPIA uma zicubungula imininingwane yomuntu siqu lwezakhamuzi zaseNingizimu Afrika.',
          'Qaphela: I-POPIA isebenza lapho imininingwane yomuntu siqu icubungulwa ngaphakathi eNingizimu Afrika. Uma inkampani yasemazweni aphesheya icubungula imininingwane yezakhamuzi zaseNingizimu Afrika isebenzisa izinsiza ezikhona eNingizimu Afrika, i-POPIA ingasebenzela nazo.',
        ],
      },
      {
        heading: 'Amagama Abalulekile Adingeka Ukuwazi',
        items: [
          'Imininingwane Yomuntu Siqu (Personal Information) — Lokhu kubhekisela kunoma yiluphi ulwazi olungasetshenziswa ukukhombisa umuntu othile. Lokhu kuhlanganisa izinto ezicacile njengegama lakho eligcwele, inombolo ye-ID, nenombolo yocingo, kodwa kuhlanganisa nezinto ezingacaci kanje imininingwane yendawo yakho, ikheli lakho le-IP, imikhuba yakho yokuphequlula i-inthanethi, imininingwane yakho yebhayomethrikhi njengezigxivizo zeminwe, ngisho nemibono yakho noma imibono uma ingaboshwa kuwe.',
          'Umnikazi Wemininingwane (Data Subject) — Lona ngumuntu olwazi lwakhe imininingwane yomuntu siqu iqoqwa noma icubungulwa. Njengomfundi, wena ungumnikazi wemininingwane lapho iyunivesithi yakho ibutha amarekhodi akho ezemfundo, lapho i-app igcina imininingwane yakho yokungena, noma lapho isitolo se-inthanethi sigcina ikheli lakho lokudliswa.',
          'Iqembu Elibhekelele (Responsible Party) — Lona ngumuntu noma izinhlangano ezinquma ukuthi kungani nokuthi kanjani imininingwane yomuntu siqu izocubungulwa. Isibonelo, iyunivesithi yakho iyiqembu elibhekelele ngoba inquma ukuthi yiluphi ulwazi lomfundi oluqoqwa nokwenza ngalo. Iqembu elibhekelele lithwala ithuba elikhulu lezomthetho ngaphansi kwe-POPIA.',
          'Ocubungulayo (Operator) — Ocubungulayo ngumuntu noma izinhlangano ezicubungula imininingwane yomuntu siqu egameni leqembu elibhekelele. Isibonelo, uma iyunivesithi yakho isebenzisa isevisi yamafu senkampani yesithathu ukugcina amarekhodi abafundi, leyo sevisi yamafu ingocubungulayo. Ocubungulayo kufanele alandele imiyalo yeqembu elibhekelele futhi naye uboshwe yimibophezelo ye-POPIA.',
          'Ukucubungula (Processing) — Leli igama elibanzi elisamboza cishe yonke into eyenziwa ngeMininingwane yomuntu siqu. Kuhlanganisa ukukubutha, ukukugcina, ukukabelana ngalo, ukukusebenzisa, ukukususa, ngisho nokukubuka nje. Uma wenza noma yini ngeMininingwane yomuntu siqu yabanye, uyakucubungula.',
          'UMlawuli Wemininingwane (Information Regulator) — Leli yizinhlaka ezikhululekile zasungulelwa i-POPIA ukubheka ukuhlonishwa komthetho. Uma ukholelwa ukuthi imininingwane yakho yomuntu siqu iphathe kabi, unelungelo lokufaka isikhalo kuMlawuli Wemininingwane. Unamandla okuphenya izinhlangano futhi afake izijeziso ngokwephulwa kwe-POPIA.',
        ],
      },
    ],
    example:
      'Cabanga ukuthi ubhalisa ku-platform entsha yezokuthenga kwi-inthanethi usebenzisa igama lakho, ikheli le-imeyili, inombolo yocingo, nekheli lakho lasekhaya. Ngemva kwamaviki ambalwa, uqala ukuthola imiyalezo ye-SMS yokukhangisa evela ezikhungwini ozinazo ozingakaze uzisebenzise futhi amakholi avela kubantu abasebenzisa ukukukhangisela izinto. Okungenzeka kwenzeka ukuthi i-platform yezokuthenga yathengisa noma yabelana ngeMininingwane yakho yoxhumano namabhizinisi angaphandle ngaphandle kwemvume yakho. Ngaphansi kwe-POPIA, lokhu ukwephuka komthetho. Wena, njengomnikazi wemininingwane, awuvumelanga ukuba imininingwane yakho iwelwe izinjongo zokukhangisa. I-platform yezokuthenga, njengequembu elibhekelele, kwakukhona ithuba layo lomthetho lokuvikela imininingwane yakho futhi ilisebenzise kuphela ngenhloso eyelele.',
    keyTakeaway: 'Yilona kanye uhlobo lwesimo i-POPIA eyenzelwe ukunqanda futhi ikunike indlela yokuphendula.',
  },
  {
    n: 2,
    title: 'Amalungelo Akho Njengomnikazi Wemininingwane',
    intro:
      'Manje njengoba usuqonda ukuthi iyini i-POPIA nokuthi isebenza kubani, kubalulekile ukwazi ukuthi i-POPIA ikunika maphi ngempela amalungelo. Njengomnikazi wemininingwane, awuphelelwe amandla. I-POPIA ikunikeza amalungelo athile ongawasebenzisa noma nini lapho izinhlangano ziqoqa noma zisebenzisa imininingwane yakho yomuntu siqu.',
    sections: [
      {
        heading: 'Amalungelo Akho Ayi-8 Ngaphansi Kwe-POPIA',
        items: [
          'Ilungelo 1: Ilungelo Lokwaziswa — Ngaphambi kokuba noma iyiphi inhlangano iqoqe imininingwane yakho yomuntu siqu, kufanele ikwazise. Kudingeka ikutshele ukuthi ingobani, kungani iqoqa imininingwane yakho, ukuthi ukuyinikeza lokho kuwukuzithandela noma kuyimpoqo yini, nokuthi kuzokwenzekani uma ukhetha ukungayinikezi.',
          'Ilungelo 2: Ilungelo Lokufinyelela Imininingwane Yakho — Unelungelo lokubuza noma iyiphi inhlangano ukuthi iyiphi imininingwane yakho yomuntu siqu enayo ngawe. Kufanele ikunike incazelo yemininingwane enayo, kanye nokukutshela ukuthi ubani oke wakwazi ukuyibona. Lolu wuhlobo lwesicelo kwesinye isikhathi olubizwa nge-Subject Access Request.',
          'Ilungelo 3: Ilungelo Lokulungisa Noma Lokususa Imininingwane Yakho — Uma inhlangano inemininingwane yakho yomuntu siqu engalungile, ephelelwe yisikhathi, engaphelele, noma edukisayo, unelungelo lokucela ukuba ilungiswe noma isuswe. Inhlangano kufanele isiphendule isicelo sakho futhi ayikwazi ukumane isizibe nje.',
          'Ilungelo 4: Ilungelo Lokuphikisa Ukucutshungulwa — Unelungelo lokuphikisa inhlangano ukuthi icubungule imininingwane yakho yomuntu siqu ezimeni ezithile, ikakhulukazi lapho iyisebenzisela ukumaketha okuqondile noma lapho ukucutshungulwa kwayo kukudalela umonakalo. Uma usuphikisile, inhlangano kufanele iyeke ukusebenzisa imininingwane yakho kuleyo nhloso.',
          'Ilungelo 5: Ilungelo Lokungathengiswa Noma Kwabelwane Ngemininingwane Yakho Ngaphandle Kwemvume — Inhlangano ayikwazi ukuthengisa noma ukwabelana ngemininingwane yakho yomuntu siqu nomuntu wesithathu ngaphandle kolwazi lwakho nemvume yakho, ngaphandle uma kunesisekelo somthetho sokwenza lokho. Leli ngelinye lamalungelo elivame ukwephulwa kakhulu, njengoba kubonwa ezimweni lapho imininingwane idluliswa phakathi kwezinkampani ngenhloso yokukhangisa.',
          'Ilungelo 6: Ilungelo Lokwazi Mayelana Nokuvuza Kwemininingwane — Uma inhlangano ihlangabezana nokugqekezwa kwezokuphepha futhi imininingwane yakho yomuntu siqu yadalulwa noma yafinyelelwa ngaphandle kwemvume, iphoqelekile ngokomthetho ukuba ikwazise wena kanye noMlawuli Wemininingwane ngokushesha okukhulu. Unelungelo lokwazi lapho imininingwane yakho igqekeziwe ukuze uthathe izinyathelo.',
          'Ilungelo 7: Ilungelo Lokufaka Isikhalazo — Uma ukholwa ukuthi inhlangano yephule amalungelo akho ngaphansi kwe-POPIA, unelungelo lokufaka isikhalazo esisemthethweni kuMlawuli Wemininingwane waseNingizimu Afrika. UMlawuli unamandla okuphenya isikhalazo futhi athathe izinyathelo ngokumelene nenhlangano uma ukwephulwa komthetho kufakazelwa.',
          'Ilungelo 8: Ilungelo Lokuhoxisa Imvume — Uma phambilini wanika inhlangano imvume yokusebenzisa imininingwane yakho yomuntu siqu bese ushintsha umqondo wakho, unelungelo lokuhoxisa leyo mvume noma nini. Uma usuyihoxisile imvume, inhlangano kufanele iyeke ukucubungula imininingwane yakho ngenhloso owavuma ngayo ekuqaleni.',
        ],
      },
      {
        heading: 'Kwenzekani Lapho Amalungelo Akho Ephulwa?',
        items: [
          'Uma inhlangano iziba isicelo sakho sokufinyelela, sokulungisa, noma sokususa imininingwane yakho, noma yabelana ngemininingwane yakho ngaphandle kwemvume, awudingi ukukwamukela lokho. Okokuqala, xhumana nenhlangano ngqo bese ubhala isicelo sakho phansi. Lokhu kwakha irekhodi lesicelo sakho. Uma ingaphenduli noma inqaba ukwenza okuthile, ungafaka isikhalazo kuMlawuli Wemininingwane.',
          'Izinhlangano ezitholakala zinecala lokwephula i-POPIA zingabhekana nezinhlawulo ezifinyelela ku-R10 miliyoni noma ukuboshwa iminyaka efinyelela kwayi-10, kuye ngobukhulu becala.',
        ],
      },
    ],
    activity: {
      prompt:
        'Isimo Sokuhlanganyela: Thola Ukwephulwa Kwamalungelo\n\nULerato ungumfundi wonyaka wesithathu enyuvesi yaseNingizimu Afrika. Ulande uhlelo lokusebenza lokuhlela isabelomali wafaka igama lakhe, ikheli le-imeyili lesitshudeni, kanye nemininingwane yasebhange ukuze alandelele izindleko zakhe. Akazange athole saziso mayelana nokuthi imininingwane yakhe izosetshenziswa kanjani. Ngemva kwenyanga, waqala ukuthola izingcingo ezivela enkampanini yemalimboleko ayengakaze axhumane nayo. Lapho eshayela ucingo usizo lwalolu hlelo lokusebenza ebuza ukuthi imininingwane yakhe yabelwe abanye yini, bamtshela ukuthi ngeke bamnike lolo lwazi nokuthi ngokwamukela imigomo nemibandela, ubevumelene nayo yonke into.\n\nYimaphi amalungelo kaLerato okungenzeka ukuthi aphuliwe? Ithini into obekufanele lolu hlelo lokusebenza luyenze ngaphambi kokuqoqa imininingwane yakhe yasebhange? Yiziphi izinyathelo uLerato angazithatha manje?',
      feedback:
        'Ukwazi lawa malungelo kusho ukuthi ungakwazi ukubona lapho ephulwa khona futhi wazi nezinyathelo okufanele uzithathe lapho lokho kwenzeka.',
    },
    keyTakeaway: 'Njengomnikazi wemininingwane, awuphelelwe amandla.',
  },
  {
    n: 3,
    title: 'Okumele Kwenziwe Yizinhlangano Ngaphansi Kwe-POPIA',
    intro:
      'Ezigabeni ezedlule ufunde ukuthi iyini i-POPIA, ukuthi ikunikeza maphi amalungelo, nokuthi imininingwane yomuntu isetshenziswa kanjani kabi. Lesi sigaba sigxila kolunye uhlangothi lobudlelwano: izinhlangano eziqoqa futhi zisebenzise imininingwane yakho. I-POPIA ibeka izibopho zomthetho ezicacile kuyo yonke inhlangano ephatha imininingwane yomuntu. Ukuqonda lokho okumele kwenziwe yizinhlangano kukusiza ukuthi ubone lapho zenza khona amaphutha futhi kukunikeze ukuzethemba kokuzenza ziziphendulele.',
    sections: [
      {
        heading: 'Imibandela Eyi-8 Yokucubungula Imininingwane Ngokusemthethweni',
        items: [
          'Umbandela 1: Ukuziphendulela (Accountability) — Iqembu elibhekelele kumele liqinisekise ukuthi yonke imibandela yokucubungula okusemthethweni iyahlangatshezwa. Liziphendulela ngakho konke okwenzekayo kwimininingwane eliyiqoqayo, kuhlanganise nalokho abasebenzisi (abacubungulayo) abakwenzayo ngayo egameni lalo.',
          'Umbandela 2: Umkhawulo Wokucubungula (Processing Limitation) — Imininingwane yomuntu ingaqoqwa futhi icubungulwe kuphela ngenhloso ecacile nesemthethweni. Ukucubungula kumele kwanele, kuhambisane, futhi kungabi yihaba mayelana nenhloso. Isibonelo, uhlelo lokusebenza lokuletha ukudla ludinga ikheli lakho ukuze lulethe ukudla. Aludingi inombolo yakho kamazisi noma imininingwane yokuqashwa.',
          'Umbandela 3: Ukucaciswa Kwenhloso (Purpose Specification) — Inhlangano kumele icacise ngokusobala inhloso ethile imininingwane yakho eqoqelwa yona. Kumele futhi baqinisekise ukuthi imininingwane yakho ayigcinwa isikhathi esingaphezu kwesidingekayo ukufinyelela leyo nhloso.',
          'Umbandela 4: Umkhawulo Owengeziwe Wokucubungula (Further Processing Limitation) — Uma inhlangano ifuna ukusebenzisa imininingwane yakho ngenhloso eyehlukile kuleyo eyaqoqelwa yona ekuqaleni, leyo nhloso entsha kumele ihambisane nenhloso yokuqala. Abakwazi ukuqoqa imininingwane yakho ngesizathu esisodwa bese beyisebenzisela into eyehluke ngokuphelele ngasese.',
          'Umbandela 5: Ikhwalithi Yemininingwane (Information Quality) — Inhlangano inesibopho sokuqinisekisa ukuthi imininingwane yakho abanayo inembile, iphelele, futhi isesikhathini. Abakwazi ukugcina ngamabomu imininingwane engalungile ngawe.',
          'Umbandela 6: Ukuvuleleka (Openness) — Izinhlangano kumele zibe sobala mayelana nemisebenzi yazo yokucubungula imininingwane. Kumele zibe nenqubomgomo yobumfihlo echaza ngokucacile ukuthi yiphi imininingwane eziyiqoqayo, isizathu sokuqoqa, ukuthi ziyigcina isikhathi esingakanani, nokuthi zabelana nobani ngayo.',
          'Umbandela 7: Izivikelo Zezokuphepha (Security Safeguards) — Iqembu elibhekelele kumele libeke izindlela zobuchwepheshe nezenhlangano ezifanele ukuvikela imininingwane yakho ngokumelene nokulahleka, umonakalo, ukufinyelela okungagunyaziwe, nokucubungula okungemthetho. Lokhu kubandakanya ukubethela (encryption), amaseva aphephile, izilawuli zokufinyelela, nokuqeqeshwa kwabasebenzi.',
          'Umbandela 8: Ukubamba Iqhaza Komnikazi Wemininingwane (Data Subject Participation) — Izinhlangano kumele zikunikeze ikhono lokusebenzisa amalungelo akho njengomnikazi wemininingwane. Kumele zibe nenqubo ukuze ucele ukufinyelela kwimininingwane yakho, ucele ukulungiswa, noma ucele ukususwa.',
        ],
      },
      {
        heading: 'Okumele Kwenziwe Amanyuvesi Nezinhlelo Zokusebenza Ngaphambi Kokuqoqa Imininingwane Yakho',
        items: [
          'Kumele zihlonze inhloso esemthethweni — Yonke inhlangano kumele ibe nesizathu esicacile nesizwakalayo sayo yonke imininingwane eyicelayo kuwe.',
          'Kumele zikwazise — Ngaphambi kokuqoqa imininingwane yakho, kumele zikwazise ukuthi zingobani, iyiphi imininingwane eziyiqoqayo, ukuthi ziyiqoqelani, nokuthi kuwukuzithandela noma kuyimpoqo yini, nokuthi obani abanye abangase babe nokufinyelela kuyo.',
          'Kumele zithole imvume lapho kudingeka khona — Ezimweni eziningi, izinhlangano kumele zithole imvume yakho ngaphambi kokucubungula imininingwane yakho. Le mvume kumele inikezwe ngokukhululeka, iqondiswe ngokukhethekile, futhi inikezwe unolwazi.',
          'Kumele ziqoke Isikhulu Semininingwane — Yonke inhlangano ecubungula imininingwane yomuntu kudingeka iqoke Isikhulu Semininingwane esinesibopho sokuqinisekisa ukuthotshelwa kwe-POPIA.',
        ],
      },
      {
        heading: 'Indlela Yokufunda Inqubomgomo Yobumfihlo',
        body: 'Inqubomgomo yobumfihlo ingumbhalo oshicilelwa yinhlangano echaza ukuthi iyiphatha kanjani imininingwane yakho yomuntu siqu. Nakhu okufanele kuqukethwe inqubomgomo yobumfihlo efanele:',
        items: [
          'Amagama aphelele nemininingwane yokuxhumana yenhlangano.',
          'Imininingwane yomuntu eqoqwayo nesizathu sokuqoqwa kwayo.',
          'Isisekelo somthetho sokuqoqa nokucubungula imininingwane yakho.',
          'Ukuthi imininingwane yakho izogcinwa isikhathi esingakanani.',
          'Obani imininingwane yakho eyabelwa bona nangaphansi kwaziphi izimo.',
          'Imininingwane yakho ivikelwe kanjani.',
          'Ungawasebenzisa kanjani amalungelo akho njengomnikazi wemininingwane.',
          'Imininingwane yokuxhumana yeSikhulu Semininingwane.',
        ],
      },
      {
        heading: 'Indlela Yokubika Ukwephulwa Kwe-POPIA KuMlawuli Wemininingwane',
        items: [
          'Isinyathelo 1: Xhumana nenhlangano ngokubhala phansi uchaze inkinga. Banike ithuba elizwakalayo lokuphendula. Gcina irekhodi lalo lonke ukuxhumana kwenu.',
          'Isinyathelo 2: Uma inhlangano ingaphenduli, faka isikhalazo esisemthethweni kuMlawuli Wemininingwane ku-www.inforegulator.org.za.',
          'Isinyathelo 3: UMlawuli uzokuhlola futhi angaqala uphenyo olusemthethweni. Banamandla okuphoqa izinhlangano ukuthi zithobele futhi bakhiphe izinhlawulo.',
          'Izinhlawulo izinhlangano ezibhekana nazo ngokwephula i-POPIA: Izinhlawulo zokuphatha ezifika ku-R10 miliyoni. Ukushushiswa ngobugebengu okungaholela ekuboshweni iminyaka engafika kwayi-10. Umonakalo wesithunzi ovela kuzaziso zokugcizelela umthetho zomphakathi.',
        ],
      },
    ],
    example:
      'Ingcaphuno Yanqubomgomo Yobumfihlo A: "Siqoqa igama lakho, ikheli le-imeyili, nenombolo yocingo uma ubhalisa endaweni yethu. Le mininingwane isetshenziselwa kuphela ukudala nokuphatha i-akhawunti yakho nokukuthumelela izaziso ezihlobene nensizakalo. Asithengisi noma sabelane ngemininingwane yakho nezinkampani zangaphandle ngaphandle kwemvume yakho ecacile. Imininingwane yakho igcinwa ngokuphepha futhi izosuswa kungakapheli izinsuku ezingama-30 kuvalwe i-akhawunti. Ungaxhumana neSikhulu Semininingwane wethu ku-privacy@company.co.za ukuze ucele ukufinyelela, ukulungiswa, noma ukusulwa kwemininingwane yakho yomuntu siqu. Unelungelo lokufaka isikhalazo kuMlawuli Wemininingwane waseNingizimu Afrika uma unganelisekile ngendlela esiphatha ngayo imininingwane yakho."\n\nIngcaphuno Yanqubomgomo Yobumfihlo B: "Ngokusebenzisa izinsizakalo zethu uvumelana nenqubomgomo yethu yobumfihlo. Siqoqa imininingwane ngawe ukuthuthukisa ulwazi lwakho. Singabelana ngale mininingwane nabalingani bethu nezinhlaka esixhumene nazo ngezikhathi ezithile. Sinelungelo lokubuyekeza le nqubomgomo noma nini. Ukuze uthole imibuzo, xhumana nathi ngokusebenzisa uhlelo lokusebenza."',
    activity: {
      prompt: 'Umsebenzi Wohlu Lwamakhizane: Thola Inqubomgomo Yobumfihlo Ethobelayo',
      options: ['Ingcaphuno A', 'Ingcaphuno B'],
      correctIndex: 0,
      feedback:
        'Ingcaphuno A iyathobela. Isho ngokucacile ukuthi yini eqoqwayo, kungani, igcinwa isikhathi esingakanani, ubani okufanele kuxhunyanwe naye, nokuthi uwasebenzisa kanjani amalungelo akho. Ingcaphuno B ayithobeli. Isebenzisa ulimi olungacacile ngokwabelana "nabalingani nezinhlaka", ayisho ukuthi yimiphi imininingwane eqoqwayo noma kungani, ayinikezi isikhathi sokugcina, ayinikezi imininingwane yokuxhumana yeSikhulu Semininingwane, futhi igcina ilungelo lokushintsha inqubomgomo ngaphandle kwesaziso.',
    },
    keyTakeaway:
      'Ukuqonda lokho okumele kwenziwe yizinhlangano kukusiza ukuthi ubone lapho zenza khona amaphutha futhi kukunikeze ukuzethemba kokuzenza ziziphendulele.',
  },
];

export const POPIA_ZU_QUIZ: Record<number, TopicQuizQuestion[]> = {
  1: [
    {
      text: 'I-POPIA isho ukuthini?',
      options: [
        'Protection of Private Information Act',
        'Protection of Personal Information Act',
        'Prevention of Personal Information Abuse',
        'Privacy of Personal and Individual Affairs',
      ],
      correct: 1,
    },
    {
      text: 'Umfundi ubhalisa ku-app yokudliswa kokudla esebenzisa igama lakhe, inombolo yocingo, nekheli. Ngemva kweziinsuku ezintathu bathola amakholi okukhangisa evela ezikhungwini zomshwalense abangakaze baxhumane nazo. Yiliphi igama elisemthethweni we-POPIA elibhekisela kahle kumfundi mayelana nemininingwane yakhe yomuntu siqu?',
      options: ['Iqembu Elibhekelele', 'Ocubungulayo', 'Umnikazi Wemininingwane', 'UMlawuli Wemininingwane'],
      correct: 2,
    },
    {
      text: 'I-POPIA yaqala ukusebenza ngokugcwele ngomthetho eNingizimu Afrika ngomhla muni?',
      options: ['Mhla zi-4 Ephreli 2013', 'Mhla zi-1 Julayi 2020', 'Mhla zi-1 Julayi 2021', 'Mhla zi-1 Januwari 2022'],
      correct: 2,
    },
  ],
  2: [
    {
      text: 'UThabo ulande uhlelo lokusebenza lokuthenga kwathi kamuva wathola ukuthi lolu hlelo lwabelane ngenombolo yakhe yocingo nekheli lasekhaya nenkampani yokukhangisa ngaphandle kokumtshela. Iliphi ilungelo le-POPIA elephulwe kakhulu lapha?',
      options: [
        'Ilungelo lokulungisa noma lokususa imininingwane',
        'Ilungelo lokufaka isikhalazo',
        'Ilungelo lokungathengiswa noma ukwabelwana ngemininingwane ngaphandle kwemvume',
        'Ilungelo lokuhoxisa imvume',
      ],
      correct: 2,
    },
    {
      text: 'UNomsa waxhumana nenkampani ayethenge kuyona izingubo ku-inthanethi wacela ukuba basuse yonke imininingwane yakhe yomuntu siqu ababeyigcinile. Inkampani iyizibile isicelo sakhe amasonto amathathu. Iliphi ilungelo elephulwa yile nkampani?',
      options: [
        'Ilungelo lokwaziswa',
        'Ilungelo lokulungisa noma lokususa imininingwane yakho',
        'Ilungelo lokwazi mayelana nokuvuza kwemininingwane',
        'Ilungelo lokuphikisa ukucutshungulwa',
      ],
      correct: 1,
    },
    {
      text: 'Umfundi wenyuvesi uthola ukuthi inkundla ye-inthanethi abayisebenzisela izabelo ihlangabezane nokugqekezwa kwezokuphepha ngenyanga edlule, kodwa abazange baziswe. Iliphi ilungelo elephuliwe?',
      options: [
        'Ilungelo lokuhoxisa imvume',
        'Ilungelo lokufinyelela imininingwane yakho',
        'Ilungelo lokuphikisa ukucutshungulwa',
        'Ilungelo lokwazi mayelana nokuvuza kwemininingwane',
      ],
      correct: 3,
    },
  ],
  3: [
    {
      text: 'Uhlelo lokusebenza lweselula luqoqa imininingwane yendawo yakho njalo uma ulivula, yize uhlelo lokusebenza luhlinzeka kuphela ngezibuyekezo zesimo sezulu zedolobha lakho. Yimuphi kule mibandela engu-8 ye-POPIA okungenzeka uhlelo lokusebenza luyiphula kakhulu?',
      options: [
        'Ukuziphendulela (Accountability)',
        'Umkhawulo Wokucubungula (Processing Limitation)',
        'Izivikelo Zezokuphepha (Security Safeguards)',
        'Ukuvuleleka (Openness)',
      ],
      correct: 1,
    },
    {
      text: 'UMandla ufuna ukuthola ukuthi yimiphi imininingwane yakhe yomuntu siqu ephethwe yinkampani. Ubani ngaphakathi enhlanganweni okufanele axhumane naye?',
      options: [
        'Isikhulu Esiphezulu (CEO) senkampani',
        'Umnyango wezokumaketha wenkampani',
        'Isikhulu Semininingwane (Information Officer)',
        'UMlawuli Wemininingwane (Information Regulator)',
      ],
      correct: 2,
    },
    {
      text: 'Inqubomgomo yobumfihlo yenhlangano ithi: "Singabelana ngemininingwane yakho nabalingani esibakhethile ngezikhathi ezithile ngezinhloso zebhizinisi." Kungani lesi sitatimende siyinselele ngaphansi kwe-POPIA?',
      options: [
        'Izinhlangano azikaze zivunyelwe ukwabelana ngemininingwane yomuntu nanoma iyiphi inkampani yangaphandle.',
        'Isitatimende side kakhulu futhi kufanele sifinyezwe.',
        'Isitatimende asicacile futhi asisho ukuthi obani abalingani noma injongo yokwabelana.',
        'Izinqubomgomo zobumfihlo azidingi ukubalula nhlobo ukwabelana ngezinkampani zangaphandle.',
      ],
      correct: 2,
    },
  ],
};
