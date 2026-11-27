import type { CardSet } from "@/entities/word-card/model/types";

export function countWords(cardSets: CardSet[]): number {
  return cardSets.reduce((sum, cardSet) => sum + cardSet.cards.length, 0);
}
