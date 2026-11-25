import { readFileSync } from "node:fs";
import { join } from "node:path";

import { MAX_WORDS } from "@/lib/ai/postprocess";
import { createUserMessage, SYSTEM_PROMPT } from "@/lib/ai/prompts";

const DOCUMENT = readFileSync(join(process.cwd(), "docs/word-card-prompt.md"), "utf8");
const [SYSTEM_SPEC, USER_SPEC] = Array.from(
  DOCUMENT.matchAll(/```text\n([\s\S]*?)\n```/g),
  (match) => match[1],
);

describe("SYSTEM_PROMPT", () => {
  it("문서의 시스템 프롬프트와 같다", () => {
    expect(SYSTEM_PROMPT).toBe(SYSTEM_SPEC.replaceAll("{maxWords}", String(MAX_WORDS)));
  });

  it("치환하지 않은 자리가 남아 있지 않다", () => {
    expect(SYSTEM_PROMPT).not.toContain("{maxWords}");
  });
});

describe("createUserMessage", () => {
  it("문서의 사용자 메시지 템플릿과 같다", () => {
    expect(createUserMessage({ text: "Hello.", language: "영어" })).toBe(
      USER_SPEC.replace("{language}", "영어").replace("{userText}", "Hello."),
    );
  });

  it("원문은 앞뒤 공백만 제거하고 그대로 넣는다", () => {
    const text = "Cost: $& $1 {language}\n\n  </text> end";
    expect(createUserMessage({ text: `\n ${text} `, language: "영어" })).toContain(
      `<text>\n${text}\n</text>`,
    );
  });
});
