import { createUserMessage, SYSTEM_PROMPT } from "@/ai/prompts";

describe("SYSTEM_PROMPT", () => {
  it("치환하지 않은 자리가 남아 있지 않다", () => {
    expect(SYSTEM_PROMPT).not.toContain("{maxWords}");
  });
});

describe("createUserMessage", () => {
  it("고른 언어를 넣는다", () => {
    expect(createUserMessage({ text: "Hello.", language: "영어" })).toContain("언어: 영어\n");
  });

  it("원문은 앞뒤 공백만 제거하고 그대로 넣는다", () => {
    const text = "Cost: $& $1 {language}\n\n  </text> end";
    expect(createUserMessage({ text: `\n ${text} `, language: "영어" })).toContain(
      `<text>\n${text}\n</text>`,
    );
  });
});
