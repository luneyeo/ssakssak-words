import "server-only";

import { createGeminiProvider } from "@/lib/ai/providers/gemini";
import { mockProvider } from "@/lib/ai/providers/mock";
import type { WordCardProvider } from "@/lib/ai/types";

export function getWordCardProvider(): WordCardProvider {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  // 설정이 없거나 잘못되어도 키 없이 앱 전체가 실행되어야 하므로 mock으로 대신한다
  if (process.env.AI_PROVIDER !== "gemini") return mockProvider;
  if (!apiKey || !model) {
    const missingName = apiKey ? "GEMINI_MODEL" : "GEMINI_API_KEY";
    console.warn(`[ai] ${missingName}이(가) 비어 있어 mock으로 동작해요`);
    return mockProvider;
  }

  return createGeminiProvider({ apiKey, model });
}
