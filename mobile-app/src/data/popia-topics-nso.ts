import type { TopicContent, TopicQuizQuestion } from './topic-types';

// Sepedi translation of POPIA topic 1 only, reproduced verbatim from the team's own native-language
// notes — not machine- or Claude-translated. The source is "Tsonga Notes/Section1_POPIA_Sepedi.docx"
// at the repo root: filed under Tsonga, but written in Sepedi. Topics 2 and 3 have no native Sepedi
// source; they are AI-translated and kept apart in popia-topics-nso-ai.ts so the two never mix.
//
// Unlike the isiZulu and Xitsonga notes, this file does not mark the correct quiz answers. Its
// options are in the same A-D order as the English source, so `correct` is the English answer key.
export const POPIA_NSO: TopicContent[] = [
  {
    n: 1,
    title: 'POPIA ke eng?',
    intro:
      'Letšatši le lengwe le le lengwe o abelana ka tshedimošo ya gago inthaneteng ntle le go nagana ka yona. O tlatša nomoro ya gago ya moithuti go tsena phothaleng ya yunibesithi, o tsenya nomoro ya gago ya mogala go ngwadišetša tirišo (app), gomme o abelana ka lefelo la gago ge o otara dijo. Eupša na o kile wa emanyana go ipotšiša gore ke mang a nago le tumelelo ya go fihlelela tshedimošo yeo, ba dira eng ka yona, le gore na ba dumeletšwe go dira bjalo? Ka Afrika Borwa, go na le molao wo o hlamilwego ka go lebanya go araba dipotšišo tšeo le go go šireletša. Molao woo o bitšwa POPIA.',
    sections: [
      {
        heading: 'POPIA e emela eng?',
        items: [
          'POPIA e emela Molao wa Tšhireletšo ya Tshedimošo ya Motho (Protection of Personal Information Act). O tsebja gape bjalo ka Molao wa 4 wa 2013, e lego ngwaga wo o saenetšwego go ba molao ke Mopresidente wa Afrika Borwa. Le ge go le bjalo, o thomile go šoma ka botlalo ka la 1 Julae 2021, e lego letšatši leo mekgatlo e bego e gapeletšega ka molao go o obamela.',
          'Pele POPIA e eba gona, go be go na le tšhireletšo e nnyane kudu ya molao go ma-Afrika Borwa ge go tliwa go gore tshedimošo ya bona e kgoboketšwa bjang, e bolokwa bjang, le go abelwana bjang. Mekgatlo e be e kgona go kgoboketša datha ya gago ntle le boikarabelo bjo bontši. POPIA e fetotše seo.',
        ],
      },
      {
        heading: 'Ke ka baka la eng Afrika Borwa e be e hloka Molao wo?',
        items: [
          '1. Tshedimošo ya motho e be e sa šomišwe gabotse — Batho ba be ba amogela megala le melaetša ya papatšo e sa nyakegego go tšwa go dikhamphani tšeo ba sa kago ba šoma le tšona. Maemong a mantši, dintlha tša bona tša boikgokaganyo di be di rekišitšwe goba di abelanwe ntle le tsebo goba tumelelo ya bona.',
          '2. Ditlolo tša thekgo ya datha di be di oketšega — Ge ma-Afrika Borwa a mantši a fetela inthaneteng go dira tša panka, go reka, le poledišano, tekanyo ya datha ya motho e bolokwago ka dijithale e ile ya gola ka lebelo. Ntle le ditšhireletšo tša maleba tša molao, datha ye e be e le kotsing ya go utswiwa le go pepentšhwa.',
          '3. Afrika Borwa e be e hloka go ikamahanya le maemo a lefase a tšhireletšo ya datha — Dinaga tše bjalo ka tša Kopano ya Yuropa (European Union) di be di šetše di na le melao e tiilego ya tšhireletšo ya datha, ye bjalo ka GDPR. POPIA e bea Afrika Borwa maemong a swanago le a maemo a boditšhabatšhaba, e lego se bohlokwa gape go dikgwebo tšeo di šomago go tshela mellwane.',
          '4. Batho ba be ba sena mokgwa wa semmuso wa go dira gore mekgatlo e ikarabele — Pele ga POPIA, ge khamphani e swara tshedimošo ya gago gampe, go be go sena tshepedišo e kgethegilego ya molao yeo o ka e latelago goba mokgatlo ofe goba ofe wo o ka o begelago ngongorego. POPIA e hlotše Molaodi wa Tshedimošo (Information Regulator) wa Afrika Borwa ka go lebanya go laola se.',
        ],
      },
      {
        heading: 'POPIA e šoma go mang?',
        items: [
          'Batho ka bomong — Motho ofe goba ofe wa praebete yo a kgoboketšago goba a šomang ka tshedimošo ya batho ba bangwe, go fa mohlala motho yo a swerego kgwebo e nnyane gomme a boloka lenaneo la dintlha tša bareki, o swanetše go obamela POPIA.',
          'Mekgatlo ya Praebete — Se se akaretša dikgwebo, dikhamphani, mekgatlo yeo e sa dirego poelo, le mokgatlo ofe goba ofe wa praebete wo o swarago tshedimošo ya batho bjalo ka karolo ya mešomo ya ona. Se se akaretša sengwe le sengwe go tloga pankeng ya gago go ya go tirišo (app) ya mogala wa gago.',
          'Mmušo le Mekgatlo ya Setšhaba — Dikgoro tša mmušo, bommasepala, le diinstitušene tša mmušo le tšona di swanetše go obamela POPIA ge di šoma ka tshedimošo ya baagi ba Afrika Borwa.',
          'Tlhokomediso e bohlokwa: POPIA e a šoma ge tshedimošo ya motho e sepedišwa ka gare ga Afrika Borwa. Ge khamphani ya dinaga dišele e šoma ka datha ya badudi ba Afrika Borwa e šomiša didirišwa tše di lego mo Afrika Borwa, POPIA e ka šoma le go bona.',
        ],
      },
      {
        heading: 'Mareo a Bohlokwa ao O Hlokago go a Tseba',
        items: [
          'Tshedimošo ya Motho (Personal Information) — Se se ra tshedimošo efe goba efe yeo e ka šomišwago go hlaya motho yo a itšego. Se se akaretša dilo tše di bonagalago bjalo ka leina la gago ka botlalo, nomoro ya boitsebišo (ID), le nomoro ya mogala, eupša gape se akaretša dilo tše di sa bonagalego kudu bjalo ka datha ya lefelo la gago, aterese ya gago ya IP, mekgwa ya gago ya go phetla inthaneteng, datha ya gago ya biometriki bjalo ka menwana, le dikgopolo goba dipono tša gago ge eba di ka kgokaganywa le wena.',
          'Mong wa Datha (Data Subject) — Yo ke motho yo tshedimošo ya gagwe e kgoboketšwago goba e sepedišwago. Bjalo ka moithuti, o mong wa datha ge yunibesithi ya gago e kgoboketša direkoto tša gago tša thuto, ge tirišo (app) e boloka dintlha tša gago tša go tsena, goba ge lebenkele la inthanete le boloka aterese ya gago ya thebolelo.',
          'Motho Yo a Nago le Maikarabelo (Responsible Party) — Yo ke motho goba mokgatlo wo o tšeago sephetho sa gore ke ka baka la eng le gona bjang tshedimošo ya motho e tlago go sepedišwa. Mohlala, yunibesithi ya gago ke motho yo a nago le maikarabelo gobane e tšea sephetho sa gore ke tshedimošo efe ya moithuti ye e swanetšego go kgoboketšwa le gore e tla dira eng ka yona. Motho yo a nago le maikarabelo o rwala boikarabelo bjo bogolo bja molao ka tlase ga POPIA.',
          'Mošomi/Mosepediši (Operator) — Mosepediši ke motho goba mokgatlo wo o sepedišago tshedimošo legatong la motho yo a nago le maikarabelo. Mohlala, ge yunibesithi ya gago e šomiša tirelo ya leru ya batho ba boraro go boloka direkoto tša baithuti, tirelo yeo ya leru ke mosepediši. Mosepediši o swanetše go latela ditaelo tša motho yo a nago le maikarabelo gomme o tlemilwe ke maikarabelo a POPIA.',
          'Tshepedišo (Processing) — Le ke lereo le lephara leo le akaretšago mo e nyakilego go ba tšohle tše di dirwago ka tshedimošo ya motho. Le akaretša go e kgoboketša, go e boloka, go e abelana, go e šomiša, go e phumula le gona go e lebelela. Ge o dira selo le ge e le sefe ka tshedimošo ya motho yo mongwe, o a e sepediša.',
          'Molaodi wa Tshedimošo (Information Regulator) — Wo ke mokgatlo o ikemetšego wo o hlomilwego ke POPIA go hlokomela go obamelwa ga molao. Ge eba o dumela gore tshedimošo ya gago e swerwe gampe, o na le tshwanelo ya go tsenya ngongorego go Molaodi wa Tshedimošo. Ba na le maatla a go nyakišiša mekgatlo le go gapeletša dikotlo bakeng sa ditlolo tša POPIA.',
        ],
      },
    ],
    example:
      'A re re o ingwadiša go polateforomo e mpsha ya go reka inthaneteng o šomiša leina la gago, aterese ya imeile, nomoro ya mogala le aterese ya gae. Dibeke tše mmalwa ka morago, o thoma go amogela melaetša ya dipapatšo ya SMS go tšwa go dikhamphani tšeo o sa kago wa di kwa le megala go tšwa go batho ba leka go go rekišetša dilo. Se se ka bago se diregile ke gore polateforomo ya go reka e rekišitše goba e abelane ka dintlha tša gago tša boikgokaganyo le dikgwebo tše dingwe ntle le tumelelo ya gago. Ka tlase ga POPIA, ye ke tlolo ya molao. Wena, bjalo ka mong wa datha, ga se wa dumela gore tshedimošo ya gago e abelanwe bakeng sa maikemišetšo a papatšo. Polateforomo ya go reka, bjalo ka motho yo a nago le maikarabelo, e be e na le boikarabelo bja molao bja go šireletša tshedimošo ya gago le go e šomišetša fela maikemišetšo ao e kgobokeleditšwego ona.',
    keyTakeaway: 'Se ke yona mofuta wa boemo bjo POPIA e hlametšwego go bo thibela le go go fa mokgwa wa go tšea magato.',
  },
];

export const POPIA_NSO_QUIZ: Record<number, TopicQuizQuestion[]> = {
  1: [
    {
      text: 'POPIA e emela eng?',
      options: [
        'Molao wa Tšhireletšo ya Tshedimošo ya Praebete (Protection of Private Information Act)',
        'Molao wa Tšhireletšo ya Tshedimošo ya Motho (Protection of Personal Information Act)',
        'Thibelo ya Tlhekefetšo ya Tshedimošo ya Motho (Prevention of Personal Information Abuse)',
        'Sephiri sa Merero ya Motho le ka Bomong (Privacy of Personal and Individual Affairs)',
      ],
      correct: 1,
    },
    {
      text: 'Moithuti o ingwadiša go tirišo (app) ya thebolelo ya dijo a šomiša leina, nomoro ya mogala, le aterese ya gagwe. Matšatši a mararo ka morago o amogela megala ya dipapatšo go tšwa go khamphani ya inšorense yeo a sa kago a ikgokaganya le yona. Ke lereo lefe leo le hlalosago moithuti gabotse mabapi le tshedimošo ya gagwe?',
      options: [
        'Motho Yo a Nago le Maikarabelo (Responsible Party)',
        'Mošomi/Mosepediši (Operator)',
        'Mong wa Datha (Data Subject)',
        'Molaodi wa Tshedimošo (Information Regulator)',
      ],
      correct: 2,
    },
    {
      text: 'POPIA e thomile go šoma ka botlalo ka molao mo Afrika Borwa ka letšatšikgwedi lefe?',
      options: ['4 Aporele 2013', '1 Julae 2020', '1 Julae 2021', '1 Janaware 2022'],
      correct: 2,
    },
  ],
};
