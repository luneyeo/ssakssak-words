import "server-only";

import { GoogleGenAI } from "@google/genai";
import type { GoogleGenAIRequestOptions } from "@google/genai";

import { CARD_RESPONSE_JSON_SCHEMA } from "@/ai/cardJsonSchema";
import { CardGenerationError } from "@/ai/errors";
import type { ErrorCode } from "@/ai/errors";
import { generateValidCards } from "@/ai/postprocess";
import { createUserMessage, SYSTEM_PROMPT } from "@/ai/prompts";
import type { GenerateCardsInput, WordCardProvider } from "@/ai/types";

// 무료 모델은 과부하(503)가 잦아 그때만 다시 시도한다. 한도 초과(429)는 재시도해도 한도만 더 쓴다
const REQUEST_OPTIONS = {
  timeout: 60_000,
  retry_codes: ["503"],
  retries: {
    strategy: "attempt-count-backoff",
    maxRetries: 2,
    backoff: { initialInterval: 1000, exponent: 2, maxInterval: 4000, maxElapsedTime: 10_000 },
    retryConnectionErrors: false,
  },
} satisfies GoogleGenAIRequestOptions;

// 앞은 Interactions API, 뒤는 예전 형식(quotaId)의 하루 한도 표시다
const DAILY_QUOTA_PATTERN = /quota_exceeded|PerDay/;

type GeminiConfig = { apiKey: string; model: string };

export function createGeminiProvider({ apiKey, model }: GeminiConfig): WordCardProvider {
  const client = new GoogleGenAI({ apiKey });

  return {
    name: "gemini",
    generateCards: (input) => generateValidCards(() => requestText(client, model, input)),
  };
}

async function requestText(
  client: GoogleGenAI,
  model: string,
  input: GenerateCardsInput,
): Promise<string> {
  try {
    const interaction = await client.interactions.create(
      {
        model,
        system_instruction: SYSTEM_PROMPT,
        input: createUserMessage(input),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: CARD_RESPONSE_JSON_SCHEMA,
        },
        // 기본값이 보관(true)이라, 사용자 글이 구글 서버에 대화로 남지 않게 끈다
        store: false,
      },
      REQUEST_OPTIONS,
    );
    return interaction.output_text ?? "";
  } catch (error) {
    const status = getStatus(error);
    // 에러 메시지에는 원문이 섞일 수 있어, 원인을 찾을 수 있는 상태 코드만 남긴다
    console.error("[gemini] 호출 실패", status ?? (error instanceof Error ? error.name : ""));
    throw new CardGenerationError(toErrorCode(status, error));
  }
}

function toErrorCode(status: number | undefined, error: unknown): ErrorCode {
  if (status === 429) return isDailyQuotaError(error) ? "RATE_LIMITED" : "TOO_MANY_REQUESTS";
  if (status === 503) return "TOO_MANY_REQUESTS";
  return "AI_ERROR";
}

// 하루 한도와 분당 한도가 모두 429라 본문으로 구분
function isDailyQuotaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("body" in error)) return false;
  return typeof error.body === "string" && DAILY_QUOTA_PATTERN.test(error.body);
}

function getStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  return typeof error.status === "number" ? error.status : undefined;
}
