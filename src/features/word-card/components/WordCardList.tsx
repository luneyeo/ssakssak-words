import { CardGrid } from "@/features/word-card/components/CardGrid";
import { WordCard } from "@/features/word-card/components/WordCard";
import type { WordCard as WordCardData } from "@/features/word-card/types";

type WordCardListProps = {
  cards: WordCardData[];
  getElementId: (cardId: string) => string;
};

export function WordCardList({ cards, getElementId }: WordCardListProps) {
  return (
    <CardGrid>
      {cards.map((card) => (
        <li key={card.id}>
          <WordCard card={card} elementId={getElementId(card.id)} />
        </li>
      ))}
    </CardGrid>
  );
}
