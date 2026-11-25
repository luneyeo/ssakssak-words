import { GoogleGenAI } from "@google/genai";

import { CARD_RESPONSE_JSON_SCHEMA } from "@/lib/ai/cardJsonSchema";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { createGeminiProvider } from "@/lib/ai/providers/gemini";

jest.mock("@google/genai", () => ({ GoogleGenAI: jest.fn() }));

const INPUT = { text: "My secret diary.", language: "영어" };

const CARD = {
  word: "secret",
  lemma: "secret",
  meaning: "비밀의",
  partOfSpeech: "형용사",
  context: "My secret diary.",
  example: "It is a secret place.",
  exampleTranslation: "그곳은 비밀 장소예요.",
};

const create = jest.fn();

function mockOutput(output_text: string | undefined) {
  return { status: "completed", output_text };
}

function generate() {
  return createGeminiProvider({ apiKey: "test-key", model: "test-model" }).generateCards(INPUT);
}

beforeEach(() => {
  create.mockReset();
  jest.mocked(GoogleGenAI).mockImplementation(
    // SDK 전체 대신 실제로 쓰는 메서드만 대체한다
    () => ({ interactions: { create } }) as unknown as GoogleGenAI,
  );
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("요청", () => {
  it("공통 프롬프트와 스키마를 구조화 출력으로 보내고, 보관을 끄고 503만 재시도한다", async () => {
    create.mockResolvedValue(mockOutput(JSON.stringify({ cards: [] })));
    await generate();

    expect(create).toHaveBeenCalledWith(
      {
        model: "test-model",
        system_instruction: SYSTEM_PROMPT,
        input: expect.stringContaining("<text>\nMy secret diary.\n</text>"),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: CARD_RESPONSE_JSON_SCHEMA,
        },
        store: false,
      },
      expect.objectContaining({
        timeout: 60_000,
        retry_codes: ["503"],
        retries: expect.objectContaining({ maxRetries: 2, retryConnectionErrors: false }),
      }),
    );
  });
});

describe("응답", () => {
  it("카드를 후처리해서 돌려준다", async () => {
    const duplicate = { ...CARD, word: "Secret", lemma: "SECRET" };
    create.mockResolvedValue(mockOutput(JSON.stringify({ cards: [CARD, duplicate] })));

    expect(await generate()).toEqual([CARD]);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("형식이 틀리면 한 번 더 요청한다", async () => {
    create
      .mockResolvedValueOnce(mockOutput("not json"))
      .mockResolvedValueOnce(mockOutput(JSON.stringify({ cards: [CARD] })));

    expect(await generate()).toEqual([CARD]);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["빈 응답", undefined],
    ["잘린 JSON", '{"cards":[{"word":"sec'],
    ["필드가 빠진 카드", JSON.stringify({ cards: [{ word: "secret" }] })],
  ])("두 번 다 %s이면 PARSE_ERROR를 던진다", async (_, output) => {
    create.mockResolvedValue(mockOutput(output));

    await expect(generate()).rejects.toMatchObject({ code: "PARSE_ERROR" });
    expect(create).toHaveBeenCalledTimes(2);
  });
});

describe("호출 실패", () => {
  it.each([
    [429, "TOO_MANY_REQUESTS"],
    [400, "AI_ERROR"],
    [401, "AI_ERROR"],
    [403, "AI_ERROR"],
    [404, "AI_ERROR"],
    [500, "AI_ERROR"],
    [503, "TOO_MANY_REQUESTS"],
  ])("HTTP %d이면 %s를 던지고 새 요청을 만들지 않는다", async (status, code) => {
    create.mockRejectedValue(Object.assign(new Error("failed"), { status }));

    await expect(generate()).rejects.toMatchObject({ code });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["하루 한도", '{"error":{"code":"quota_exceeded"}}', "RATE_LIMITED"],
    ["하루 한도(예전 형식)", '[{"quotaId":"GenerateRequestsPerDayPerProject"}]', "RATE_LIMITED"],
    ["분당 한도", '{"error":{"code":"rate_limit_exceeded"}}', "TOO_MANY_REQUESTS"],
    ["짧은 시간에 많은 요청", '{"error":{"code":"too_many_requests"}}', "TOO_MANY_REQUESTS"],
    ["알 수 없는 본문", "<html>", "TOO_MANY_REQUESTS"],
  ])("429 %s 초과를 구분한다", async (_, body, code) => {
    create.mockRejectedValue(Object.assign(new Error("failed"), { status: 429, body }));
    await expect(generate()).rejects.toMatchObject({ code });
  });

  it("상태 코드가 없는 에러(연결 실패, 시간 초과)는 AI_ERROR로 바꾼다", async () => {
    create.mockRejectedValue(new TypeError("fetch failed"));
    await expect(generate()).rejects.toMatchObject({ code: "AI_ERROR" });
  });

  it("재시도한 요청이 실패하면 그 에러를 던진다", async () => {
    create
      .mockResolvedValueOnce(mockOutput("not json"))
      .mockRejectedValueOnce(Object.assign(new Error("limit"), { status: 429 }));

    await expect(generate()).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("로그에 원문과 키를 남기지 않는다", async () => {
    create.mockRejectedValue(
      Object.assign(new Error("bad: My secret diary. test-key"), { status: 400 }),
    );
    await expect(generate()).rejects.toThrow();

    const logs = JSON.stringify(jest.mocked(console.error).mock.calls);
    expect(logs).toContain("400");
    expect(logs).not.toMatch(/secret|test-key/);
  });
});
