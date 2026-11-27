import { useId } from "react";

import { FlipIcon } from "@/shared/icons";
import { HighlightedText } from "@/entities/word-card/ui/HighlightedText";
import { WordCardList } from "@/entities/word-card/ui/WordCardList";
import type { CardSet } from "@/entities/word-card/model/types";

type CardResultProps = {
  cardSet: CardSet;
  headingTag?: "h2" | "h3";
};

export function CardResult({ cardSet, headingTag: Heading = "h2" }: CardResultProps) {
  const sourceTitleId = useId();
  const cardsTitleId = useId();
  const { cards, sourceText } = cardSet;

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby={sourceTitleId}
        className="rounded-card border-border bg-surface border px-5.5 py-5"
      >
        <Heading id={sourceTitleId} className="text-text-muted text-xs font-bold tracking-wider">
          원문
        </Heading>
        <p className="mt-2 text-lg leading-[1.9] wrap-break-word whitespace-pre-wrap">
          <HighlightedText text={sourceText} targets={cards} onSelect={moveToCard} />
        </p>
      </section>
      <section aria-labelledby={cardsTitleId}>
        <Heading id={cardsTitleId} className="sr-only">
          단어 카드
        </Heading>
        <p className="text-text-muted mb-3 flex items-center gap-1.5 text-sm">
          <FlipIcon className="size-4" />
          카드를 누르면 문맥 속 뜻이 보여요
        </p>
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
  element?.focus({ preventScroll: true });
  element?.scrollIntoView({ block: "center" });
}
