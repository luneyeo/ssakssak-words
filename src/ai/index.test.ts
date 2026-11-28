import { GoogleGenAI } from "@google/genai";

import { getWordCardProvider } from "@/ai";

jest.mock("@google/genai", () => ({ GoogleGenAI: jest.fn() }));

const ORIGINAL_ENV = process.env;
const GEMINI_ENV = { GEMINI_API_KEY: " test-key ", GEMINI_MODEL: " test-model " };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.AI_PROVIDER;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_MODEL;
  jest.mocked(GoogleGenAI).mockReset();
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("mock을 쓰는 경우", () => {
  it.each([
    ["설정이 없음", {}],
    ["AI_PROVIDER가 비어 있음", { AI_PROVIDER: "", ...GEMINI_ENV }],
    ["AI_PROVIDER가 mock", { AI_PROVIDER: "mock", ...GEMINI_ENV }],
    ["모르는 제공자", { AI_PROVIDER: "unknown", ...GEMINI_ENV }],
  ])("%s: 경고하지 않는다", (_, env) => {
    Object.assign(process.env, env);

    expect(getWordCardProvider().name).toBe("mock");
    expect(GoogleGenAI).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it.each([
    ["GEMINI_API_KEY", { GEMINI_MODEL: "test-model" }],
    ["GEMINI_API_KEY", { GEMINI_API_KEY: "  ", GEMINI_MODEL: "test-model" }],
    ["GEMINI_MODEL", { GEMINI_API_KEY: "test-key" }],
    ["GEMINI_MODEL", { GEMINI_API_KEY: "test-key", GEMINI_MODEL: "  " }],
  ])("gemini인데 %s이(가) 없으면 이름을 알려 준다: %j", (name, env) => {
    Object.assign(process.env, { AI_PROVIDER: "gemini", ...env });

    expect(getWordCardProvider().name).toBe("mock");
    expect(GoogleGenAI).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(name));
  });
});

describe("gemini를 쓰는 경우", () => {
  beforeEach(() => {
    Object.assign(process.env, { AI_PROVIDER: "gemini", ...GEMINI_ENV });
  });

  it("GEMINI_API_KEY로 클라이언트를 만든다", () => {
    expect(getWordCardProvider().name).toBe("gemini");
    expect(GoogleGenAI).toHaveBeenCalledWith({ apiKey: "test-key" });
  });

  it("GEMINI_MODEL에 적은 모델로 요청한다", async () => {
    const create = jest.fn().mockResolvedValue({ output_text: '{"cards":[]}' });
    jest.mocked(GoogleGenAI).mockImplementation(
      // SDK 전체 대신 실제로 쓰는 메서드만 대체한다
      () => ({ interactions: { create } }) as unknown as GoogleGenAI,
    );

    await getWordCardProvider().generateCards({ text: "Hello", language: "영어" });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ model: "test-model" }),
      expect.anything(),
    );
  });
});
