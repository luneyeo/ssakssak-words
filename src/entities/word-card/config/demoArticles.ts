import { TITLE_LENGTH } from "@/entities/word-card/model/constants";
import type { CardSet, PartOfSpeech } from "@/entities/word-card/model/types";
import type { GeneratedCard } from "@/ai/types";

export type DemoArticle = {
  label: string;
  cardSet: CardSet;
};

type DemoCardRow = [
  word: string,
  lemma: string,
  partOfSpeech: PartOfSpeech,
  meaning: string,
  example: string,
  exampleTranslation: string,
];

type DemoSentence = {
  text: string;
  rows: DemoCardRow[];
};

// 카드의 context가 원문과 어긋나지 않도록, 문장과 그 문장의 카드를 한곳에서 관리한다
function createDemoArticle(id: string, label: string, sentences: DemoSentence[]): DemoArticle {
  const sourceText = sentences.map(({ text }) => text).join(" ");
  const cards = sentences.flatMap(({ text, rows }) => rows.map((row) => toCard(row, text)));

  return {
    label,
    cardSet: {
      id,
      title: sourceText.slice(0, TITLE_LENGTH),
      language: "영어",
      sourceText,
      cards: cards.map((card, index) => ({ ...card, id: `${id}-${index + 1}` })),
      isDemo: true,
      createdAt: "2026-11-23T00:00:00.000Z",
    },
  };
}

function toCard(
  [word, lemma, partOfSpeech, meaning, example, exampleTranslation]: DemoCardRow,
  context: string,
): GeneratedCard {
  return { word, lemma, partOfSpeech, meaning, context, example, exampleTranslation };
}

const SHORT_SENTENCE = createDemoArticle("demo-short", "짧은 문장", [
  {
    text: "She finally gave up smoking after years of trying.",
    rows: [
      [
        "finally",
        "finally",
        "부사",
        "마침내",
        "We finally found the key.",
        "우리는 마침내 열쇠를 찾았어요.",
      ],
      [
        "gave up",
        "give up",
        "숙어",
        "끊다, 그만두다",
        "He gave up coffee last year.",
        "그는 작년에 커피를 끊었어요.",
      ],
      [
        "smoking",
        "smoking",
        "명사",
        "흡연",
        "Smoking is bad for your lungs.",
        "흡연은 폐에 해로워요.",
      ],
      [
        "years",
        "year",
        "명사",
        "해, 년",
        "They lived in Spain for three years.",
        "그들은 스페인에서 3년 동안 살았어요.",
      ],
      [
        "trying",
        "try",
        "동사",
        "노력하다, 시도하다",
        "Keep trying and you will improve.",
        "계속 노력하면 나아질 거예요.",
      ],
    ],
  },
]);

const IDIOM_STORY = createDemoArticle("demo-idiom", "숙어가 많은 글", [
  {
    text: "Last month, I came up with a plan to get in shape.",
    rows: [
      ["Last", "last", "형용사", "지난", "I met her last week.", "저는 지난주에 그녀를 만났어요."],
      [
        "month",
        "month",
        "명사",
        "달, 월",
        "The store opens next month.",
        "그 가게는 다음 달에 문을 열어요.",
      ],
      [
        "came up with",
        "come up with",
        "숙어",
        "생각해 내다",
        "She came up with a great idea.",
        "그녀는 멋진 아이디어를 생각해 냈어요.",
      ],
      ["plan", "plan", "명사", "계획", "Our plan is simple.", "우리의 계획은 단순해요."],
      [
        "get in shape",
        "get in shape",
        "숙어",
        "몸을 만들다",
        "I run every day to get in shape.",
        "저는 몸을 만들려고 매일 달려요.",
      ],
    ],
  },
  {
    text: "At first, I put off going to the gym because I was always tired.",
    rows: [
      [
        "At first",
        "at first",
        "숙어",
        "처음에는",
        "At first, the work seemed hard.",
        "처음에는 그 일이 어려워 보였어요.",
      ],
      [
        "put off",
        "put off",
        "숙어",
        "미루다",
        "Don't put off your homework.",
        "숙제를 미루지 마세요.",
      ],
      ["going", "go", "동사", "가다", "We are going to the beach.", "우리는 해변에 가고 있어요."],
      ["gym", "gym", "명사", "헬스장", "The gym closes at ten.", "그 헬스장은 10시에 문을 닫아요."],
      [
        "always",
        "always",
        "부사",
        "항상, 늘",
        "He always smiles at me.",
        "그는 항상 저에게 미소를 지어요.",
      ],
      ["tired", "tired", "형용사", "피곤한", "The children look tired.", "아이들이 피곤해 보여요."],
    ],
  },
  {
    text: "My roommate told me to hang in there and take things one step at a time.",
    rows: [
      [
        "roommate",
        "roommate",
        "명사",
        "룸메이트",
        "My roommate cooks very well.",
        "제 룸메이트는 요리를 아주 잘해요.",
      ],
      [
        "told",
        "tell",
        "동사",
        "말하다",
        "He told us to wait outside.",
        "그는 우리에게 밖에서 기다리라고 말했어요.",
      ],
      [
        "hang in there",
        "hang in there",
        "숙어",
        "포기하지 않고 버티다",
        "Hang in there! The exam is almost over.",
        "조금만 버텨요! 시험이 거의 끝났어요.",
      ],
      [
        "take things one step at a time",
        "take things one step at a time",
        "숙어",
        "차근차근 해 나가다",
        "After moving abroad, she decided to take things one step at a time.",
        "해외로 이사한 뒤, 그녀는 차근차근 해 나가기로 했어요.",
      ],
    ],
  },
  {
    text: "Little by little, I got used to waking up early.",
    rows: [
      [
        "Little by little",
        "little by little",
        "숙어",
        "조금씩",
        "Little by little, his English improved.",
        "조금씩 그의 영어가 늘었어요.",
      ],
      [
        "got used to",
        "get used to",
        "숙어",
        "~에 익숙해지다",
        "I got used to the cold weather.",
        "저는 추운 날씨에 익숙해졌어요.",
      ],
      [
        "waking up",
        "wake up",
        "숙어",
        "잠에서 깨다, 일어나다",
        "Waking up on Mondays is hard.",
        "월요일에 일어나는 건 힘들어요.",
      ],
      ["early", "early", "부사", "일찍", "The train arrived early.", "기차가 일찍 도착했어요."],
    ],
  },
  {
    text: "Now I look forward to every workout, and I no longer take for granted the simple joy of feeling healthy.",
    rows: [
      [
        "Now",
        "now",
        "부사",
        "이제",
        "Now we understand the problem.",
        "이제 우리는 그 문제를 이해해요.",
      ],
      [
        "look forward to",
        "look forward to",
        "숙어",
        "~을 기대하다",
        "I look forward to your reply.",
        "당신의 답장을 기대할게요.",
      ],
      ["every", "every", "형용사", "모든, 매", "Every seat was taken.", "모든 자리가 차 있었어요."],
      [
        "workout",
        "workout",
        "명사",
        "운동",
        "A short workout gives me energy.",
        "짧은 운동은 저에게 활력을 줘요.",
      ],
      [
        "no longer",
        "no longer",
        "숙어",
        "더 이상 ~ 않다",
        "She no longer lives here.",
        "그녀는 더 이상 여기에 살지 않아요.",
      ],
      [
        "take for granted",
        "take for granted",
        "숙어",
        "당연하게 여기다",
        "We often take for granted the people we love.",
        "우리는 종종 사랑하는 사람들을 당연하게 여겨요.",
      ],
      [
        "simple",
        "simple",
        "형용사",
        "소박한, 단순한",
        "They enjoy a simple life.",
        "그들은 소박한 삶을 즐겨요.",
      ],
      [
        "joy",
        "joy",
        "명사",
        "기쁨",
        "Her face was full of joy.",
        "그녀의 얼굴은 기쁨으로 가득했어요.",
      ],
      [
        "feeling",
        "feel",
        "동사",
        "느끼다",
        "I enjoy feeling the sun on my face.",
        "저는 얼굴에 햇살을 느끼는 것을 좋아해요.",
      ],
      [
        "healthy",
        "healthy",
        "형용사",
        "건강한",
        "Vegetables keep you healthy.",
        "채소는 건강을 지켜 줘요.",
      ],
    ],
  },
]);

const NEWS_PARAGRAPH = createDemoArticle("demo-news", "뉴스 한 단락", [
  {
    text: "City officials announced on Tuesday that a new bike-sharing program will launch next spring to reduce traffic congestion downtown.",
    rows: [
      [
        "City",
        "city",
        "명사",
        "시, 도시",
        "The city built a new park.",
        "시에서 새 공원을 지었어요.",
      ],
      [
        "officials",
        "official",
        "명사",
        "공무원, 당국자",
        "Officials closed the road after the storm.",
        "당국자들은 폭풍 후에 도로를 폐쇄했어요.",
      ],
      [
        "announced",
        "announce",
        "동사",
        "발표하다",
        "The company announced a new phone.",
        "그 회사는 새 휴대전화를 발표했어요.",
      ],
      ["new", "new", "형용사", "새로운", "I bought a new jacket.", "저는 새 재킷을 샀어요."],
      [
        "bike-sharing",
        "bike-sharing",
        "형용사",
        "자전거 공유의",
        "The bike-sharing system is easy to use.",
        "그 자전거 공유 시스템은 쓰기 쉬워요.",
      ],
      [
        "program",
        "program",
        "명사",
        "사업, 프로그램",
        "The school started a reading program.",
        "그 학교는 독서 프로그램을 시작했어요.",
      ],
      [
        "launch",
        "launch",
        "동사",
        "시작되다",
        "The online store will launch in May.",
        "그 온라인 상점은 5월에 시작될 거예요.",
      ],
      ["next", "next", "형용사", "다음의", "See you next week.", "다음 주에 만나요."],
      ["spring", "spring", "명사", "봄", "Flowers bloom in spring.", "봄에는 꽃이 피어요."],
      [
        "reduce",
        "reduce",
        "동사",
        "줄이다",
        "We need to reduce waste.",
        "우리는 쓰레기를 줄여야 해요.",
      ],
      [
        "traffic",
        "traffic",
        "명사",
        "교통, 차량 통행",
        "Traffic is heavy this morning.",
        "오늘 아침은 교통량이 많아요.",
      ],
      [
        "congestion",
        "congestion",
        "명사",
        "혼잡, 정체",
        "The new bridge eased congestion.",
        "새 다리가 혼잡을 덜어 주었어요.",
      ],
      [
        "downtown",
        "downtown",
        "부사",
        "도심에서",
        "She works downtown.",
        "그녀는 도심에서 일해요.",
      ],
    ],
  },
  {
    text: "The program will initially offer five hundred electric bikes at forty stations, and residents can rent them through a mobile app.",
    rows: [
      [
        "initially",
        "initially",
        "부사",
        "처음에는",
        "The plan initially failed.",
        "그 계획은 처음에는 실패했어요.",
      ],
      [
        "offer",
        "offer",
        "동사",
        "제공하다",
        "Many hotels offer free breakfast.",
        "많은 호텔이 무료 아침 식사를 제공해요.",
      ],
      [
        "electric",
        "electric",
        "형용사",
        "전기의",
        "He drives an electric car.",
        "그는 전기차를 몰아요.",
      ],
      [
        "bikes",
        "bike",
        "명사",
        "자전거",
        "We rode our bikes to the lake.",
        "우리는 자전거를 타고 호수에 갔어요.",
      ],
      [
        "stations",
        "station",
        "명사",
        "대여소, 정거장",
        "There are charging stations on every floor.",
        "층마다 충전소가 있어요.",
      ],
      [
        "residents",
        "resident",
        "명사",
        "주민",
        "Residents complained about the noise.",
        "주민들은 소음에 대해 불평했어요.",
      ],
      [
        "rent",
        "rent",
        "동사",
        "빌리다",
        "You can rent a boat here.",
        "여기에서 배를 빌릴 수 있어요.",
      ],
      [
        "mobile",
        "mobile",
        "형용사",
        "모바일의",
        "Mobile games are popular with students.",
        "모바일 게임은 학생들에게 인기가 많아요.",
      ],
      [
        "app",
        "app",
        "명사",
        "앱",
        "This app helps me learn words.",
        "이 앱은 제가 단어를 배우도록 도와줘요.",
      ],
    ],
  },
  {
    text: "Supporters argue that the service could significantly cut air pollution, while critics worry about the cost of maintaining the bikes.",
    rows: [
      [
        "Supporters",
        "supporter",
        "명사",
        "지지자",
        "Supporters cheered for the team.",
        "지지자들은 그 팀을 응원했어요.",
      ],
      [
        "argue",
        "argue",
        "동사",
        "주장하다",
        "Some experts argue that sleep is the best medicine.",
        "일부 전문가는 잠이 가장 좋은 약이라고 주장해요.",
      ],
      [
        "service",
        "service",
        "명사",
        "서비스",
        "The delivery service is fast.",
        "그 배달 서비스는 빨라요.",
      ],
      [
        "significantly",
        "significantly",
        "부사",
        "상당히, 크게",
        "Prices rose significantly this year.",
        "올해 물가가 상당히 올랐어요.",
      ],
      [
        "cut",
        "cut",
        "동사",
        "줄이다",
        "The company cut its spending.",
        "그 회사는 지출을 줄였어요.",
      ],
      ["air", "air", "명사", "공기, 대기", "The mountain air is fresh.", "산 공기는 신선해요."],
      [
        "pollution",
        "pollution",
        "명사",
        "오염",
        "Pollution harms sea animals.",
        "오염은 바다 동물에게 해를 끼쳐요.",
      ],
      [
        "critics",
        "critic",
        "명사",
        "비판하는 사람",
        "Critics say the law is unfair.",
        "비판하는 사람들은 그 법이 불공평하다고 말해요.",
      ],
      [
        "worry",
        "worry",
        "동사",
        "걱정하다",
        "Parents worry about their children.",
        "부모는 자녀를 걱정해요.",
      ],
      [
        "cost",
        "cost",
        "명사",
        "비용",
        "The cost of living is high here.",
        "이곳은 생활비가 비싸요.",
      ],
      [
        "maintaining",
        "maintain",
        "동사",
        "유지·관리하다",
        "Maintaining an old house takes time.",
        "오래된 집을 관리하는 데는 시간이 들어요.",
      ],
    ],
  },
  {
    text: "According to a recent survey, nearly two-thirds of residents are in favor of the plan.",
    rows: [
      [
        "According to",
        "according to",
        "숙어",
        "~에 따르면",
        "According to the news, it will snow tonight.",
        "뉴스에 따르면 오늘 밤 눈이 올 거예요.",
      ],
      [
        "recent",
        "recent",
        "형용사",
        "최근의",
        "I like her recent work.",
        "저는 그녀의 최근 작품을 좋아해요.",
      ],
      [
        "survey",
        "survey",
        "명사",
        "설문 조사",
        "We did a survey of our customers.",
        "우리는 고객을 대상으로 설문 조사를 했어요.",
      ],
      ["nearly", "nearly", "부사", "거의", "The bottle is nearly empty.", "병이 거의 비었어요."],
      [
        "in favor of",
        "in favor of",
        "숙어",
        "~에 찬성하는",
        "Most members are in favor of the change.",
        "대부분의 회원이 그 변화에 찬성해요.",
      ],
      [
        "plan",
        "plan",
        "명사",
        "계획",
        "The team made a careful plan.",
        "그 팀은 신중한 계획을 세웠어요.",
      ],
    ],
  },
]);

export const DEMO_ARTICLES: DemoArticle[] = [SHORT_SENTENCE, IDIOM_STORY, NEWS_PARAGRAPH];
