import type { TopicContent, TopicQuizQuestion } from './topic-types';

// AI-TRANSLATED — NOT A NATIVE-SPEAKER SOURCE.
// Sepedi for POPIA topics 2 and 3, translated by Claude from the English topics in popia-topics.ts
// on 2026-10-09 at the researcher's explicit request, because no Sepedi notes exist for these
// sections. This is a deliberate, user-authorised exception to the project's "do not invent
// translations" rule; it has not been reviewed by a Sepedi speaker. Translated for meaning in
// context rather than word for word, reusing the terminology of the team's own native Sepedi notes
// for topic 1 (popia-topics-nso.ts) and of the Sepedi Online Scams module. Replace with
// native-speaker text when it becomes available. Facts, figures and quiz answers are unchanged
// from the English.
export const POPIA_NSO_AI: TopicContent[] = [
  {
    n: 2,
    title: 'Ditokelo tša Gago bjalo ka Mong wa Datha',
    intro:
      'Bjale ka ge o kwešiša gore POPIA ke eng le gore e šoma go bomang, go bohlokwa go tseba gore POPIA e go fa eng ka nnete. Bjalo ka mong wa datha, ga o hloke maatla. POPIA e go fa ditokelo tše di itšego tšeo o ka di šomišago nako efe goba efe ge mokgatlo o kgoboketša goba o šomiša tshedimošo ya gago.',
    sections: [
      {
        heading: 'Ditokelo tša Gago tše 8 ka Tlase ga POPIA',
        items: [
          'Tokelo ya 1: Tokelo ya go Tsebišwa — Pele mokgatlo ofe goba ofe o kgoboketša tshedimošo ya gago, o swanetše go go botša gore ke bomang, ke ka baka la eng ba e kgoboketša, na o a gapeletšega go e fa goba o e fa ka boithatelo, le gore go tla direga eng ge o sa e fe.',
          'Tokelo ya 2: Tokelo ya go Fihlelela Tshedimošo ya Gago — O ka kgopela mokgatlo ofe goba ofe gore o go botše gore o swere tshedimošo efe ka wena, le gore ke bomang bao ba kilego ba e fihlelela (se se bitšwa Subject Access Request).',
          'Tokelo ya 3: Tokelo ya go Phošolla goba go Phumula Tshedimošo ya Gago — Ge tshedimošo yeo ba e swerego ka wena e fošagetše, e tšofetše, e sa felela goba e aroša, o ka kgopela gore e phošollwe goba e phumulwe.',
          'Tokelo ya 4: Tokelo ya go Ganetša Tshepedišo — O ka gana ge tshedimošo ya gago e šomišetšwa papatšo ye e lebišitšwego thwii go wena, goba ge tshepedišo yeo e go gobatša. Ka morago ga fao mokgatlo o swanetše go emiša.',
          'Tokelo ya 5: Tokelo ya gore Tshedimošo ya Gago e se Rekišwe goba ya Abelanwa Ntle le Tumelelo — Mokgatlo ga o a swanela go rekiša goba go abelana ka tshedimošo ya gago le motho wa boraro o sa tsebe ebile o sa dumela, ntle le ge go na le lebaka la molao la go dira bjalo.',
          'Tokelo ya 6: Tokelo ya go Tseba ka Tlolo ya Tšhireletšo ya Datha — Ge tshedimošo ya gago e pepentšhitšwe ka lebaka la tlolo ya tšhireletšo, wena le Molaodi wa Tshedimošo le swanetše go tsebišwa ka pela ka mo go kgonegago.',
          'Tokelo ya 7: Tokelo ya go Tsenya Ngongorego — O ka tsenya ngongorego ya semmušo go Molaodi wa Tshedimošo wa Afrika Borwa ge o dumela gore ditokelo tša gago di gatakilwe.',
          'Tokelo ya 8: Tokelo ya go Gogela Tumelelo Morago — O ka gogela morago tumelelo yeo o kilego wa e fa nako efe goba efe; ka morago ga fao mokgatlo o swanetše go emiša go šomiša tshedimošo ya gago bakeng sa morero woo.',
        ],
      },
      {
        heading: 'Go Direga Eng ge Ditokelo tša Gago di Gatakwa?',
        items: [
          'Sa mathomo, ikgokaganye le mokgatlo thwii gomme o ngwale kgopelo ya gago fase gore go be le bohlatse bja yona. Ge ba sa arabe goba ba gana go dira selo, o ka tsenya ngongorego go Molaodi wa Tshedimošo.',
          'Mekgatlo yeo e hwetšwago e le molato wa go tlola POPIA e ka fiwa kotlo ya tšhelete ya go fihla go R10 milione goba kgolego ya go fihla go mengwaga ye 10, go ya ka bogolo bja molato.',
        ],
      },
    ],
    activity: {
      prompt:
        'Tiragalo ya go Ithuta: Lemoga Tlolo ya Ditokelo\n\nLerato ke moithuti wa ngwaga wa boraro yunibesithing ye nngwe ya Afrika Borwa. O tsentše tirišo (app) ya go beakanya tšhelete mogaleng wa gagwe, gomme a tsenya leina la gagwe, aterese ya imeile ya baithuti le dintlha tša gagwe tša panka gore a kgone go latela ditshenyagalelo tša gagwe. Ga se a ka a tsebišwa gore datha ya gagwe e tlo šomišwa bjang. Kgwedi ka morago, a thoma go amogela megala go tšwa go khamphani ya dikadimo yeo a sa kago a ikgokaganya le yona. Ge a leletša ba thekgo ya tirišo yeo go botšiša ge e ba datha ya gagwe e abelanwe le ba bangwe, ba mmotša gore ba ka se mo fe tshedimošo yeo, le gore ka go amogela mabaka le dipeelano o dumetše tšohle.\n\nKe ditokelo dife tša Lerato tšeo go ka bago di gatakilwe? Tirišo yeo e be e swanetše go dira eng pele e kgoboketša dintlha tša gagwe tša panka? Lerato a ka tšea magato afe bjale?',
      feedback:
        'Go tseba ditokelo tše go ra gore o ka lemoga ge di gatakwa, gomme o tseba magato ao o swanetšego go a tšea ge seo se direga.',
    },
    keyTakeaway: 'Bjalo ka mong wa datha, ga o hloke maatla.',
  },
  {
    n: 3,
    title: 'Seo Mekgatlo e Swanetšego go se Dira',
    intro:
      'Dithutong tše di fetilego o ithutile gore POPIA ke eng, e go fa ditokelo dife, le gore datha ya motho e šomišwa gampe bjang. Thuto ye e lebelela mekgatlo yeo e kgoboketšago le go šomiša datha ya gago. Ge o kwešiša seo mekgatlo e swanetšego go se dira, o kgona go lemoga ge e palelwa, gomme o ba le sebete sa go e botšiša gore e ikarabele.',
    sections: [
      {
        heading: 'Dipeelano tše 8 tša go Sepediša Tshedimošo ya Motho ka Molao',
        items: [
          'Peelano ya 1: Boikarabelo (Accountability) — Motho yo a nago le maikarabelo o swanetše go kgonthiša gore dipeelano ka moka tša tshepedišo ya molao di a phethwa, go akaretšwa le seo basepediši ba gagwe ba se dirago legatong la gagwe.',
          'Peelano ya 2: Go Lekanyetša Tshepedišo (Processing Limitation) — Tshedimošo ya motho e ka kgoboketšwa le go sepedišwa fela bakeng sa morero wo o itšego wa molao, gomme e swanetše go ba ye e lekanego, ye e nyalelanago le morero woo, e sa fete tekanyo.',
          'Peelano ya 3: Go Hlalosa Morero (Purpose Specification) — Mokgatlo o swanetše go bolela pepeneneng go tloga mathomong gore ke ka baka la eng tshedimošo ya gago e kgoboketšwa, gomme wa se e boloke nako ye telele go feta ye e hlokegago.',
          'Peelano ya 4: Go Lekanyetša Tshepedišo ye Nngwe (Further Processing Limitation) — Ge datha ya gago e nyakwa go šomišetšwa morero o moswa, morero woo o swanetše go sepelelana le wa mathomo wo e kgobokeleditšwego wona.',
          'Peelano ya 5: Boleng bja Tshedimošo (Information Quality) — Mokgatlo o swanetše go kgonthiša gore tshedimošo yeo o e swerego ka wena e nepagetše, e feletše ebile e sepelelana le nako.',
          'Peelano ya 6: Pepeneneng (Openness) — Mekgatlo e swanetše go ba le pholisi ya sephiri ye e hlalosago gore e kgoboketša eng, ka baka la eng, e e boloka nako ye kaakang, le gore e e abelana le bomang.',
          'Peelano ya 7: Dišireletši tša Polokego (Security Safeguards) — Go swanetše go ba le magato a maleba a theknolotši le a mokgatlo (go khouta datha (encryption), diseba tše di bolokegilego, taolo ya phihlelelo, le tlwaetšo ya bašomi) go šireletša tshedimošo ya gago.',
          'Peelano ya 8: Go Kgatha Tema ga Mong wa Datha (Data Subject Participation) — Mekgatlo e swanetše go go fa tsela ya go fihlelela, go phošolla goba go phumula tshedimošo ya gago.',
        ],
      },
      {
        heading: 'Seo Diyunibesithi le Ditirišo (Apps) di Swanetšego go se Dira Pele di Kgoboketša Datha ya Gago',
        items: [
          'Di swanetše go ba le morero wa molao bakeng sa tshedimošo ye nngwe le ye nngwe yeo di e kgopelago.',
          'Di swanetše go go tsebiša gore ke bomang, di kgoboketša eng, ka baka la eng, na o a gapeletšega go e fa, le gore ke mang yo mongwe yo a ka e fihlelelago.',
          'Di swanetše go hwetša tumelelo ya gago moo e nyakegago: tumelelo ye e fiwago ka bolokologi, ye e lebanego le selo se se itšego, gomme o e fa o tseba seo o se dumelago.',
          'Di swanetše go thwala Mohlankedi wa Tshedimošo (Information Officer) yo a nago le maikarabelo a go kgonthiša gore POPIA e a obamelwa.',
        ],
      },
      {
        heading: 'Tsela ya go Bala Pholisi ya Sephiri',
        body: 'Pholisi ya sephiri ye e lokilego e swanetše go ba le:',
        items: [
          'Leina ka botlalo le dintlha tša boikgokaganyo tša mokgatlo',
          'Gore go kgoboketšwa tshedimošo efe ya motho, le gore ke ka baka la eng',
          'Lebaka la molao la go kgoboketša le go sepediša tshedimošo ya gago',
          'Gore tshedimošo ya gago e tla bolokwa nako ye kaakang',
          'Gore tshedimošo ya gago e abelanwa le bomang, le gore ke maemong afe',
          'Kamoo tshedimošo ya gago e šireletšwago ka gona',
          'Kamoo o ka šomišago ditokelo tša gago bjalo ka mong wa datha',
          'Dintlha tša boikgokaganyo tša Mohlankedi wa Tshedimošo',
        ],
      },
      {
        heading: 'Tsela ya go Bega Tlolo ya POPIA go Molaodi wa Tshedimošo',
        items: [
          'Mogato wa 1: Ngwalela mokgatlo, o hlaloše bothata, gomme o boloke rekhoto ya dipoledišano ka moka.',
          'Mogato wa 2: Ge mokgatlo o sa arabe, tsenya ngongorego ya semmušo go Molaodi wa Tshedimošo go www.inforegulator.org.za.',
          'Mogato wa 3: Molaodi o tla e sekaseka, gomme a ka thoma nyakišišo ya semmušo. O na le maatla a go gapeletša mekgatlo go obamela molao le go e fa dikotlo tša go fihla go R10 milione goba kgolego ya go fihla go mengwaga ye 10.',
        ],
      },
    ],
    example:
      'Karolwana ya Pholisi ya Sephiri ya A: "Re kgoboketša leina la gago, aterese ya imeile le nomoro ya mogala ge o ingwadiša polateforomong ya rena. Tshedimošo ye e šomišwa fela go bula le go laola akhaonte ya gago, le go go romela ditsebišo tše di amanago le tirelo. Ga re rekiše goba go abelana ka tshedimošo ya gago le batho ba boraro ntle le tumelelo ya gago ye e kwagalago. Tshedimošo ya gago e bolokwa ka polokego gomme e tla phumulwa mo matšatšing a 30 ka morago ga ge akhaonte e tswaletšwe. O ka ikgokaganya le Mohlankedi wa rena wa Tshedimošo go privacy@company.co.za go kgopela go fihlelela, go phošolla goba go phumula tshedimošo ya gago. O na le tokelo ya go tsenya ngongorego go Molaodi wa Tshedimošo wa Afrika Borwa ge o sa kgotsofala ka tsela yeo re swarago datha ya gago ka yona."\n\nKarolwana ya Pholisi ya Sephiri ya B: "Ka go šomiša ditirelo tša rena o dumelelana le pholisi ya rena ya sephiri. Re kgoboketša tshedimošo ka wena gore re kaonafatše maitemogelo a gago. Nako le nako re ka abelana ka tshedimošo ye le balekane ba rena le dikhamphani tše re šomišanago le tšona. Re na le tokelo ya go fetoša pholisi ye nako efe goba efe. Ge o na le dipotšišo, ikgokaganye le rena ka tirišo (app)."',
    activity: {
      prompt:
        'Mošomo wa Lenaneo la Tekolo: Lemoga Pholisi ya Sephiri ye e Obamelago Molao — ke karolwana efe ya tše di lego ka godimo ye e obamelago POPIA?',
      options: ['Karolwana ya A', 'Karolwana ya B'],
      correctIndex: 0,
      feedback:
        'Karolwana ya A e obamela molao. E bolela gabotse gore go kgoboketšwa eng, ka baka la eng, e bolokwa nako ye kaakang, o ka ikgokaganya le mang, le gore o šomiša ditokelo tša gago bjang. Karolwana ya B ga e obamele molao. E šomiša polelo ye e sa kwagalego ka go abelana le "balekane le dikhamphani tše re šomišanago le tšona", ga e bolele gore go kgoboketšwa tshedimošo efe goba ka baka la eng, ga e fe nako ya polokelo, ga e fe dintlha tša boikgokaganyo tša Mohlankedi wa Tshedimošo, gomme e ipolokela tokelo ya go fetoša pholisi ntle le tsebišo.',
    },
    keyTakeaway:
      'Ge o kwešiša seo mekgatlo e swanetšego go se dira, o kgona go lemoga ge e palelwa, gomme o ba le sebete sa go e botšiša gore e ikarabele.',
  },
];

export const POPIA_NSO_AI_QUIZ: Record<number, TopicQuizQuestion[]> = {
  2: [
    {
      text: 'Thabo o tsentše tirišo (app) ya go reka mogaleng wa gagwe, gomme ka morago a lemoga gore tirišo yeo e abelane ka nomoro ya gagwe ya mogala le aterese ya gae le khamphani ya papatšo e sa mmotše. Ke tokelo efe ya POPIA yeo e gatakilwego thwii?',
      options: [
        'Tokelo ya go phošolla goba go phumula tshedimošo',
        'Tokelo ya go tsenya ngongorego',
        'Tokelo ya gore tshedimošo e se rekišwe goba ya abelanwa ntle le tumelelo',
        'Tokelo ya go gogela tumelelo morago',
      ],
      correct: 2,
    },
    {
      text: 'Nomsa o ikgokagantše le khamphani yeo a kilego a reka diaparo go yona inthaneteng, a e kgopela gore e phumule tshedimošo ka moka yeo e e bolokilego ka yena. Khamphani e hlokomologile kgopelo ya gagwe dibeke tše tharo. Khamphani e gataka tokelo efe?',
      options: [
        'Tokelo ya go tsebišwa',
        'Tokelo ya go phošolla goba go phumula tshedimošo ya gago',
        'Tokelo ya go tseba ka tlolo ya tšhireletšo ya datha',
        'Tokelo ya go ganetša tshepedišo',
      ],
      correct: 1,
    },
    {
      text: 'Moithuti wa yunibesithi o lemoga gore polateforomo ya inthanete yeo a e šomišetšago mešomo ya sekolo e bile le tlolo ya tšhireletšo kgweding ye e fetilego, eupša ga se a ka a tsebišwa. Ke tokelo efe yeo e gatakilwego?',
      options: [
        'Tokelo ya go gogela tumelelo morago',
        'Tokelo ya go fihlelela tshedimošo ya gago',
        'Tokelo ya go ganetša tshepedišo',
        'Tokelo ya go tseba ka tlolo ya tšhireletšo ya datha',
      ],
      correct: 3,
    },
  ],
  3: [
    {
      text: 'Tirišo (app) ya mogala e kgoboketša datha ya lefelo la gago nako le nako ge o e bula, le ge e go fa fela dipego tša boemo bja leratadima tša toropo ya geno. Go dipeelano tše 8 tša POPIA, ke efe yeo se se e tlolago kudu?',
      options: [
        'Boikarabelo (Accountability)',
        'Go Lekanyetša Tshepedišo (Processing Limitation)',
        'Dišireletši tša Polokego (Security Safeguards)',
        'Pepeneneng (Openness)',
      ],
      correct: 1,
    },
    {
      text: 'Mandla o nyaka go tseba gore khamphani e swere tshedimošo efe ka yena. O swanetše go ikgokaganya le mang ka gare ga mokgatlo woo?',
      options: [
        'Molaodi-phethiši (CEO) wa khamphani',
        'Lefapha la papatšo la khamphani',
        'Mohlankedi wa Tshedimošo (Information Officer)',
        'Molaodi wa Tshedimošo (Information Regulator)',
      ],
      correct: 2,
    },
    {
      text: 'Pholisi ya sephiri ya mokgatlo e re: "Nako le nako re ka abelana ka tshedimošo ya gago le balekane bao re ba kgethilego bakeng sa merero ya kgwebo." Ke ka baka la eng polelo ye e le bothata ka tlase ga POPIA?',
      options: [
        'Mekgatlo ga e a dumelelwa le gatee go abelana ka tshedimošo ya motho le motho wa boraro',
        'Polelo ye e telele kudu gomme e swanetše go khutsofatšwa',
        'Polelo ye ga e kwagale, ebile ga e bolele gore balekane bao ke bomang goba morero wa go abelana ke ofe',
        'Dipholisi tša sephiri ga di hloke go bolela selo ka go abelana le batho ba boraro',
      ],
      correct: 2,
    },
  ],
};
