import { MAX_WORDS, postprocessCards } from "@/ai/postprocess";
import type { GeneratedCard } from "@/ai/types";

function createCard(overrides: Partial<GeneratedCard> = {}): GeneratedCard {
  return {
    word: "runs",
    lemma: "run",
    meaning: "달리다",
    partOfSpeech: "동사",
    context: "He runs.",
    example: "Dogs run fast.",
    exampleTranslation: "개는 빨리 달려요.",
    ...overrides,
  };
}

describe("postprocessCards", () => {
  it("올바른 응답을 순서대로 돌려준다", () => {
    const cards = [createCard(), createCard({ word: "happy", lemma: "happy" })];
    expect(postprocessCards({ cards })).toEqual(cards);
  });

  it("카드가 없는 응답도 허용한다", () => {
    expect(postprocessCards({ cards: [] })).toEqual([]);
  });

  it("lemma가 같으면 대소문자와 관계없이 처음 카드만 남긴다", () => {
    const first = createCard();
    const duplicate = createCard({ word: "ran", lemma: "Run" });
    expect(postprocessCards({ cards: [first, duplicate] })).toEqual([first]);
  });

  it("중복을 제거한 뒤 앞에서부터 최대 개수만 남긴다", () => {
    const uniqueCards = Array.from({ length: MAX_WORDS + 1 }, (_, index) =>
      createCard({ lemma: `lemma-${index}` }),
    );
    const cards = [uniqueCards[0], ...uniqueCards];
    expect(postprocessCards({ cards })).toEqual(uniqueCards.slice(0, MAX_WORDS));
  });

  it.each([
    ["객체가 아닌 응답", "not json"],
    ["cards가 없는 응답", {}],
    ["필드가 빠진 카드", { cards: [{ word: "run" }] }],
  ])("%s이면 PARSE_ERROR를 던진다", (_, response) => {
    expect(() => postprocessCards(response)).toThrow(
      expect.objectContaining({ code: "PARSE_ERROR" }),
    );
  });
});
