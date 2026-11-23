import {
  cardSetSchema,
  generateCardsRequestSchema,
  generatedCardSchema,
  wordCardSchema,
} from "@/features/word-card/schema";
import type { CardSet, WordCard } from "@/features/word-card/types";

const CARD: WordCard = {
  id: "card-1",
  word: "gave up",
  lemma: "give up",
  meaning: "끊다",
  partOfSpeech: "숙어",
  context: "She gave up smoking.",
  example: "He gave up coffee.",
  exampleTranslation: "그는 커피를 끊었어요.",
};

const CARD_SET: CardSet = {
  id: "set-1",
  title: "She gave up smoking.",
  language: "영어",
  sourceText: "She gave up smoking.",
  cards: [CARD],
  isDemo: false,
  createdAt: "2026-11-23T00:00:00.000Z",
};

describe("generatedCardSchema", () => {
  it.each(["명사", "동사", "형용사", "부사", "숙어", "기타"])("품사 %s를 허용한다", (value) => {
    expect(generatedCardSchema.safeParse({ ...CARD, partOfSpeech: value }).success).toBe(true);
  });

  it("목록에 없는 품사는 거부한다", () => {
    expect(generatedCardSchema.safeParse({ ...CARD, partOfSpeech: "대명사" }).success).toBe(false);
  });

  it.each(["word", "lemma", "meaning", "context", "example", "exampleTranslation"])(
    "%s가 비어 있거나 없으면 거부한다",
    (field) => {
      expect(generatedCardSchema.safeParse({ ...CARD, [field]: "" }).success).toBe(false);
      expect(generatedCardSchema.safeParse({ ...CARD, [field]: undefined }).success).toBe(false);
    },
  );

  it("id는 서버 응답에 남기지 않는다", () => {
    expect(generatedCardSchema.parse(CARD)).not.toHaveProperty("id");
  });
});

describe("wordCardSchema", () => {
  it("level은 있어도 없어도 된다", () => {
    expect(wordCardSchema.parse(CARD)).toEqual(CARD);
    expect(wordCardSchema.parse({ ...CARD, level: "B1" })).toEqual({ ...CARD, level: "B1" });
  });

  it("id가 없으면 거부한다", () => {
    expect(wordCardSchema.safeParse({ ...CARD, id: undefined }).success).toBe(false);
  });
});

describe("cardSetSchema", () => {
  it("올바른 카드 세트를 허용한다", () => {
    expect(cardSetSchema.parse(CARD_SET)).toEqual(CARD_SET);
  });

  it("createdAt이 ISO 문자열이 아니면 거부한다", () => {
    expect(cardSetSchema.safeParse({ ...CARD_SET, createdAt: "어제" }).success).toBe(false);
  });
});

describe("generateCardsRequestSchema", () => {
  it("앞뒤 공백을 제거한다", () => {
    expect(generateCardsRequestSchema.parse({ text: "  Hi there. \n", language: "영어" })).toEqual({
      text: "Hi there.",
      language: "영어",
    });
  });

  it.each([
    ["빈 글", { text: "   ", language: "영어" }],
    ["지원하지 않는 언어", { text: "Hola", language: "스페인어" }],
    ["문자열이 아닌 글", { text: 1, language: "영어" }],
    ["빈 요청", null],
  ])("%s은(는) 거부한다", (_, body) => {
    expect(generateCardsRequestSchema.safeParse(body).success).toBe(false);
  });
});
