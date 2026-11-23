import { splitByTargets } from "@/lib/text";

function findMatches(text: string, words: string[]) {
  const targets = words.map((word) => ({ id: word, word }));
  return splitByTargets(text, targets)
    .filter(({ targetId }) => targetId !== undefined)
    .map((segment) => segment.text);
}

describe("splitByTargets", () => {
  it("일치한 단어에 카드 id를 붙이고 나머지는 그대로 둔다", () => {
    expect(splitByTargets("He runs fast.", [{ id: "1", word: "runs" }])).toEqual([
      { text: "He " },
      { text: "runs", targetId: "1" },
      { text: " fast." },
    ]);
  });

  it("조각을 이어 붙이면 원문과 같다", () => {
    const text = "Last month,\n I came  up with a plan. A PLAN!";
    const targets = ["last", "came up with", "plan"].map((word) => ({ id: word, word }));
    const joined = splitByTargets(text, targets)
      .map((segment) => segment.text)
      .join("");
    expect(joined).toBe(text);
  });

  it("대소문자와 관계없이 나온 곳을 모두 찾는다", () => {
    expect(findMatches("Plan a plan.", ["plan"])).toEqual(["Plan", "plan"]);
  });

  it("다른 단어의 일부는 찾지 않는다", () => {
    expect(findMatches("The planet has planes, niños.", ["plan", "niño"])).toEqual([]);
  });

  it("숙어를 그 안의 단어보다 먼저 찾는다", () => {
    expect(findMatches("She gave up. He gave it.", ["gave", "gave up"])).toEqual([
      "gave up",
      "gave",
    ]);
  });

  it("숙어 사이에 줄바꿈이 있어도 찾는다", () => {
    expect(findMatches("She gave\nup.", ["gave up"])).toEqual(["gave\nup"]);
  });

  it("정규식 특수 문자가 든 단어도 글자 그대로 찾는다", () => {
    expect(findMatches("C++ (beta) costs $5. Cxx", ["C++", "(beta)"])).toEqual(["C++", "(beta)"]);
  });

  it("띄어쓰기가 없는 일본어에서도 찾는다", () => {
    expect(findMatches("今日は天気がいい。", ["天気"])).toEqual(["天気"]);
  });

  it("같은 단어가 여러 번 주어지면 먼저 나온 카드로 연결한다", () => {
    const targets = [
      { id: "first", word: "Left" },
      { id: "second", word: "left" },
    ];
    expect(splitByTargets("left", targets)).toEqual([{ text: "left", targetId: "first" }]);
  });

  it("찾을 단어가 없으면 원문 전체를 한 조각으로 돌려준다", () => {
    expect(splitByTargets("Hello", [])).toEqual([{ text: "Hello" }]);
    expect(splitByTargets("Hello", [{ id: "1", word: " " }])).toEqual([{ text: "Hello" }]);
    expect(splitByTargets("", [{ id: "1", word: "a" }])).toEqual([]);
  });
});
