import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import { ALL_LANGUAGES, createTabItems } from "@/widgets/saved-card-sets/model/useLanguageFilter";

const [SHORT] = DEMO_ARTICLES.map(({ cardSet }) => cardSet);

function withLanguage(id: string, language: string) {
  return { ...SHORT, id, language };
}

describe("createTabItems", () => {
  it("전체 탭과 저장한 언어별 세트 수를 언어 선택 목록 순서로 만든다", () => {
    const cardSets = [
      withLanguage("a", "독일어"),
      withLanguage("b", "영어"),
      withLanguage("c", "영어"),
    ];

    expect(createTabItems(cardSets)).toEqual([
      { value: ALL_LANGUAGES, label: "전체", count: 3 },
      { value: "영어", label: "영어", count: 2 },
      { value: "독일어", label: "독일어", count: 1 },
    ]);
  });

  it("세트가 없으면 전체 탭만 만든다", () => {
    expect(createTabItems([])).toEqual([{ value: ALL_LANGUAGES, label: "전체", count: 0 }]);
  });
});
