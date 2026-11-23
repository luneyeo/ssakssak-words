import { HighlightedText } from "@/features/word-card/components/HighlightedText";
import { WordCardList } from "@/features/word-card/components/WordCardList";
import type { CardSet } from "@/features/word-card/types";

type CardResultProps = {
  cardSet: CardSet;
};

export function CardResult({ cardSet }: CardResultProps) {
  const { cards, sourceText } = cardSet;

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="source-title">
        <h2 id="source-title" className="font-bold">
          원문
        </h2>
        <p className="rounded-card border-border bg-surface mt-3 border p-5 wrap-break-word whitespace-pre-wrap shadow-sm">
          <HighlightedText text={sourceText} targets={cards} onSelect={moveToCard} />
        </p>
      </section>
      <section aria-labelledby="cards-title">
        <h2 id="cards-title" className="mb-3 font-bold">
          단어 카드
        </h2>
        <WordCardList cards={cards} getElementId={getCardElementId} />
      </section>
    </div>
  );
}

function getCardElementId(cardId: string): string {
  return `word-card-${cardId}`;
}

function moveToCard(cardId: string) {
  const element = document.getElementById(getCardElementId(cardId));
  // focus의 기본 스크롤은 즉시 튀므로 막고, CSS 설정(부드러운 스크롤)을 따르게 한다
  element?.focus({ preventScroll: true });
  element?.scrollIntoView({ block: "center" });
}
