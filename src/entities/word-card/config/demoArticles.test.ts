import { MAX_TEXT_LENGTH } from "@/entities/word-card/model/constants";
import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import { cardSetSchema } from "@/entities/word-card/model/schema";
import { MAX_WORDS } from "@/ai/postprocess";

function findWordIndex(text: string, word: string): number {
  return text.search(new RegExp(`(?<![\\p{L}-])${word}(?![\\p{L}-])`, "u"));
}

it("예시 글은 3개이고 카드 세트 id와 카드 id가 겹치지 않는다", () => {
  const setIds = DEMO_ARTICLES.map(({ cardSet }) => cardSet.id);
  const cardIds = DEMO_ARTICLES.flatMap(({ cardSet }) => cardSet.cards.map(({ id }) => id));

  expect(DEMO_ARTICLES).toHaveLength(3);
  expect(new Set(setIds).size).toBe(setIds.length);
  expect(new Set(cardIds).size).toBe(cardIds.length);
});

describe.each(DEMO_ARTICLES)("예시 글: $label", ({ cardSet }) => {
  const { cards, sourceText } = cardSet;

  it("CardSet 스키마를 통과하고 데모로 표시되어 있다", () => {
    expect(cardSetSchema.safeParse(cardSet).error).toBeUndefined();
    expect(cardSet.isDemo).toBe(true);
  });

  it("글자 수와 카드 수 제한을 지킨다", () => {
    expect(sourceText.length).toBeLessThanOrEqual(MAX_TEXT_LENGTH);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThanOrEqual(MAX_WORDS);
  });

  it("context는 원문에 그대로 있고 단어를 포함한다", () => {
    const invalidCards = cards.filter(
      ({ context, word }) => !sourceText.includes(context) || findWordIndex(context, word) === -1,
    );
    expect(invalidCards).toEqual([]);
  });

  it("lemma가 중복되지 않는다", () => {
    const lemmas = cards.map(({ lemma }) => lemma.toLowerCase());
    expect(new Set(lemmas).size).toBe(lemmas.length);
  });

  it("원문에 처음 등장한 순서대로 정렬되어 있다", () => {
    const positions = cards.map(({ word }) => findWordIndex(sourceText, word));
    expect(positions).toEqual(positions.toSorted((a, b) => a - b));
    expect(new Set(positions).size).toBe(positions.length);
  });

  it("예문은 원문과 다르고 배우는 단어를 담고 있다", () => {
    const invalidCards = cards.filter(({ example, word, lemma }) => {
      const lowered = example.toLowerCase();
      const hasWord = [word, lemma].some(
        (form) => findWordIndex(lowered, form.toLowerCase()) !== -1,
      );
      return sourceText.includes(example) || !hasWord;
    });
    expect(invalidCards).toEqual([]);
  });
});
