"use client";

import { useState } from "react";

import { Chip } from "@/shared/ui/Chip";
import { FlipIcon } from "@/shared/icons";
import { HighlightedText } from "@/entities/word-card/ui/HighlightedText";
import type { WordCard as WordCardData } from "@/entities/word-card/model/types";
import { cn } from "@/shared/lib/cn";

type WordCardProps = {
  card: WordCardData;
  elementId: string;
};

const FACE_CLASSES =
  "rounded-card col-start-1 row-start-1 flex min-h-50 flex-col justify-between gap-4 border p-5 text-left shadow-sm transition group-hover:shadow-md motion-safe:backface-hidden motion-reduce:duration-400";

const TOP_ROW_CLASSES = "order-first flex items-center justify-between";

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
      className="group rounded-card focus:outline-primary block size-full cursor-pointer perspective-distant focus:outline-2 focus:outline-offset-2"
      onClick={handleFlip}
    >
      <span
        className={cn(
          "grid size-full motion-safe:transition-transform motion-safe:duration-400 motion-safe:transform-3d motion-safe:group-hover:-translate-y-0.75",
          isFlipped && "motion-safe:rotate-y-180",
        )}
      >
        <span
          aria-hidden={isFlipped}
          className={cn(
            FACE_CLASSES,
            "border-border bg-surface",
            isFlipped && "motion-reduce:opacity-0",
          )}
        >
          <span className="flex flex-col gap-1.5">
            <span className="text-[30px] leading-tight font-extrabold tracking-tight wrap-break-word">
              {card.word}
            </span>
            {card.lemma !== card.word && (
              <span className="text-text-muted text-sm">기본형 {card.lemma}</span>
            )}
          </span>
          <span className={TOP_ROW_CLASSES}>
            <Chip>{card.partOfSpeech}</Chip>
            <FlipIcon className="text-text-muted/70 size-4.5" />
          </span>
        </span>

        <span
          aria-hidden={!isFlipped}
          className={cn(
            FACE_CLASSES,
            "border-primary bg-primary text-surface wrap-break-word motion-safe:rotate-y-180",
            !isFlipped && "motion-reduce:opacity-0",
          )}
        >
          <span className="flex flex-col gap-3">
            <span>
              <span className="text-primary-soft text-sm font-semibold">
                {card.word} · 문맥 속 뜻
              </span>
              <span className="mt-1.5 block text-[22px] leading-snug font-extrabold">
                {card.meaning}
              </span>
            </span>
            <span className="text-sm">
              <HighlightedText text={card.context} targets={[card]} />
            </span>
            <span className="border-surface/20 flex flex-col gap-1 border-t pt-3 text-sm">
              <span>{card.example}</span>
              <span className="text-primary-soft">{card.exampleTranslation}</span>
            </span>
          </span>
          <span className={TOP_ROW_CLASSES}>
            <Chip variant="inverse">{card.partOfSpeech}</Chip>
            <FlipIcon className="text-primary-soft size-4.5" />
          </span>
        </span>
      </span>
    </button>
  );
}
