/**
 * @jest-environment node
 */
import { POST } from "@/app/api/cards/route";
import { MAX_TEXT_LENGTH } from "@/features/word-card/constants";
import { getWordCardProvider } from "@/lib/ai";
import { CardGenerationError } from "@/lib/ai/errors";
import type { ErrorCode } from "@/lib/ai/errors";

jest.mock("@/lib/ai", () => ({ getWordCardProvider: jest.fn() }));

const generateCards = jest.fn();

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/cards", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

async function expectError(response: Response, status: number, code: ErrorCode) {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual({ error: { code, message: expect.any(String) } });
}

beforeEach(() => {
  generateCards.mockReset().mockResolvedValue([]);
  jest.mocked(getWordCardProvider).mockReturnValue({ name: "mock", generateCards });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST /api/cards", () => {
  it("카드와 제공자 이름을 돌려준다", async () => {
    const response = await post({ text: "  Hello  ", language: "영어" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ cards: [], provider: "mock" });
    expect(generateCards).toHaveBeenCalledWith({ text: "Hello", language: "영어" });
  });

  it.each([
    ["빈 글", { text: "  ", language: "영어" }],
    ["지원하지 않는 언어", { text: "Hallo", language: "독일어" }],
    ["JSON이 아닌 요청", "not json"],
  ])("%s이면 INVALID_INPUT", async (_, body) => {
    await expectError(await post(body), 400, "INVALID_INPUT");
    expect(generateCards).not.toHaveBeenCalled();
  });

  it("최대 글자 수까지는 허용하고, 넘으면 TEXT_TOO_LONG", async () => {
    const longest = "a".repeat(MAX_TEXT_LENGTH);

    expect((await post({ text: longest, language: "영어" })).status).toBe(200);
    await expectError(await post({ text: `${longest}a`, language: "영어" }), 413, "TEXT_TOO_LONG");
    expect(generateCards).toHaveBeenCalledTimes(1);
  });

  it.each<[ErrorCode, number]>([
    ["RATE_LIMITED", 429],
    ["AI_ERROR", 502],
    ["PARSE_ERROR", 502],
  ])("제공자가 %s를 던지면 %d로 응답한다", async (code, status) => {
    generateCards.mockRejectedValue(new CardGenerationError(code));
    await expectError(await post({ text: "Hello", language: "영어" }), status, code);
  });

  it("예상하지 못한 에러는 AI_ERROR로 바꾸고, 원문을 로그에 남기지 않는다", async () => {
    generateCards.mockRejectedValue(new Error("failed on: my secret text"));

    const response = await post({ text: "my secret text", language: "영어" });

    await expectError(response, 502, "AI_ERROR");
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toContain("secret");
  });
});
