import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import { countWords } from "@/entities/word-card/model/countWords";

describe("countWords", () => {
  it("모든 세트의 카드 수를 더한다", () => {
    const cardSets = DEMO_ARTICLES.map(({ cardSet }) => cardSet);
    const expected = cardSets.map(({ cards }) => cards.length).reduce((a, b) => a + b, 0);

    expect(countWords(cardSets)).toBe(expected);
  });

  it("세트가 없으면 0을 돌려준다", () => {
    expect(countWords([])).toBe(0);
  });
});
