"use client";

import { useState } from "react";

import { Chip } from "@/components/ui/Chip";
import { HighlightedText } from "@/features/word-card/components/HighlightedText";
import type { WordCard as WordCardData } from "@/features/word-card/types";
import { cn } from "@/lib/cn";

type WordCardProps = {
  card: WordCardData;
  elementId: string;
};

// 두 면을 같은 grid 칸에 겹쳐, 내용이 긴 면에 맞춰 카드 높이가 정해지게 한다
const FACE_CLASSES =
  "rounded-card border-border bg-surface col-start-1 row-start-1 flex min-h-56 flex-col border p-5 shadow-sm transition group-hover:shadow-md motion-safe:backface-hidden motion-reduce:duration-400";

export function WordCard({ card, elementId }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    setIsFlipped((previous) => !previous);
  }

  return (
    <button
      id={elementId}
      type="button"
      aria-pressed={isFlipped}
      // 원문에서 이동해 온 카드가 마우스 사용자에게도 보이도록 focus-visible 대신 focus를 쓴다
      className="group rounded-card focus:outline-primary block size-full cursor-pointer perspective-distant focus:outline-2 focus:outline-offset-2"
      onClick={handleFlip}
    >
      <span
        className={cn(
          "grid size-full motion-safe:transition-transform motion-safe:duration-400 motion-safe:transform-3d",
          isFlipped && "motion-safe:rotate-y-180",
        )}
      >
        <span
          aria-hidden={isFlipped}
          className={cn(
            FACE_CLASSES,
            "items-center justify-center gap-2 text-center",
            isFlipped && "motion-reduce:opacity-0",
          )}
        >
          <span className="max-w-full text-[28px] leading-tight font-bold wrap-break-word">
            {card.word}
          </span>
          {card.lemma !== card.word && (
            <span className="text-text-muted text-sm">{card.lemma}</span>
          )}
          <Chip>{card.partOfSpeech}</Chip>
        </span>

        <span
          aria-hidden={!isFlipped}
          className={cn(
            FACE_CLASSES,
            "justify-center gap-3 text-left wrap-break-word motion-safe:rotate-y-180",
            !isFlipped && "motion-reduce:opacity-0",
          )}
        >
          <span className="text-primary-strong text-lg font-bold">{card.meaning}</span>
          <span className="text-sm">
            <HighlightedText text={card.context} targets={[card]} />
          </span>
          <span className="border-border flex flex-col gap-1 border-t pt-3 text-sm">
            <span>{card.example}</span>
            <span className="text-text-muted">{card.exampleTranslation}</span>
          </span>
        </span>
      </span>
    </button>
  );
}
