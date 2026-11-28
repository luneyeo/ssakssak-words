import { CardGrid } from "@/entities/word-card/ui/CardGrid";
import { WordCard } from "@/entities/word-card/ui/WordCard";
import type { WordCard as WordCardData } from "@/entities/word-card/model/types";

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
