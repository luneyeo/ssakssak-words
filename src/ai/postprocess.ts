import { cardResponseSchema } from "@/entities/word-card/model/schema";
import { CardGenerationError } from "@/ai/errors";
import type { GeneratedCard } from "@/ai/types";

export const MAX_WORDS = 40;

export function postprocessCards(response: unknown): GeneratedCard[] {
  const result = cardResponseSchema.safeParse(response);

  if (!result.success) {
    throw new CardGenerationError("PARSE_ERROR");
  }

  return dedupeByLemma(result.data.cards).slice(0, MAX_WORDS);
}

export async function generateValidCards(
  requestText: () => Promise<string>,
): Promise<GeneratedCard[]> {
  try {
    return postprocessCards(parseJson(await requestText()));
  } catch (error) {
    // 호출 자체가 실패했다면 다시 보내도 한도만 더 쓰므로, 응답 형식이 틀렸을 때만 한 번 더 요청한다
    if (!isParseError(error)) throw error;
    return postprocessCards(parseJson(await requestText()));
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new CardGenerationError("PARSE_ERROR");
  }
}

function isParseError(error: unknown): boolean {
  return error instanceof CardGenerationError && error.code === "PARSE_ERROR";
}

function dedupeByLemma(cards: GeneratedCard[]): GeneratedCard[] {
  const seenLemmas = new Set<string>();

  return cards.filter((card) => {
    const key = card.lemma.toLowerCase();
    if (seenLemmas.has(key)) return false;
    seenLemmas.add(key);
    return true;
  });
}
