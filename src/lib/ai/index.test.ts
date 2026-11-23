import { getWordCardProvider } from "@/lib/ai";

const ORIGINAL_PROVIDER = process.env.AI_PROVIDER;

afterEach(() => {
  if (ORIGINAL_PROVIDER === undefined) {
    delete process.env.AI_PROVIDER;
  } else {
    process.env.AI_PROVIDER = ORIGINAL_PROVIDER;
  }
});

describe("getWordCardProvider", () => {
  it("AI_PROVIDER가 없으면 mock을 쓴다", () => {
    delete process.env.AI_PROVIDER;
    expect(getWordCardProvider().name).toBe("mock");
  });

  it.each(["", "mock", "unknown"])("AI_PROVIDER가 '%s'이면 mock을 쓴다", (value) => {
    process.env.AI_PROVIDER = value;
    expect(getWordCardProvider().name).toBe("mock");
  });
});
