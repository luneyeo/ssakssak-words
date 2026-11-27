import { compareLanguages } from "@/entities/word-card/model/compareLanguages";

describe("compareLanguages", () => {
  it("언어 선택 목록과 같은 순서로 정렬한다", () => {
    expect(["독일어", "영어", "일본어"].toSorted(compareLanguages)).toEqual([
      "영어",
      "일본어",
      "독일어",
    ]);
  });

  it("목록에 없는 언어는 맨 뒤로 보낸다", () => {
    expect(["프랑스어", "독일어", "영어"].toSorted(compareLanguages)).toEqual([
      "영어",
      "독일어",
      "프랑스어",
    ]);
  });
});
