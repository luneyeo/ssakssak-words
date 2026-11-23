import { cardResponseSchema } from "@/features/word-card/schema";
import { CardGenerationError } from "@/lib/ai/errors";
import type { GeneratedCard } from "@/lib/ai/types";

export const MAX_WORDS = 40;

export function postprocessCards(response: unknown): GeneratedCard[] {
  const result = cardResponseSchema.safeParse(response);

  if (!result.success) {
    throw new CardGenerationError("PARSE_ERROR");
  }

  return dedupeByLemma(result.data.cards).slice(0, MAX_WORDS);
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
