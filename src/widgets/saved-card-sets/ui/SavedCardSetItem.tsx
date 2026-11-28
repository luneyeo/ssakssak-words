"use client";

import { useId, useState } from "react";

import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { CardResult } from "@/entities/word-card/ui/CardResult";
import type { CardSet } from "@/entities/word-card/model/types";
import { cn } from "@/shared/lib/cn";

type SavedCardSetItemProps = {
  cardSet: CardSet;
  onDelete: (id: string) => void;
};

export function SavedCardSetItem({ cardSet, onDelete }: SavedCardSetItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const { id, title, language, sourceText, cards, isDemo, createdAt } = cardSet;
  const displayTitle = title.length < sourceText.length ? `${title}…` : title;

  function handleToggle() {
    setIsOpen((previous) => !previous);
  }

  return (
    <article className="flex flex-col gap-4">
      <div className="rounded-card border-border bg-surface flex items-center gap-4 border p-5 shadow-sm">
        <div className="min-w-0 grow">
          <h2 className="font-bold wrap-break-word">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={contentId}
              className={"flex cursor-pointer gap-2 rounded-sm text-left hover:underline"}
              onClick={handleToggle}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "text-primary-strong motion-safe:transition-transform",
                  isOpen && "rotate-90",
                )}
              >
                ▸
              </span>
              <span className="min-w-0">{displayTitle}</span>
            </button>
          </h2>
          <p className="text-text-muted mt-1 flex flex-wrap items-center gap-2 text-sm">
            {isDemo && <Chip>예시 글</Chip>}
            <span>
              {language} · 단어 {cards.length}개 · {new Date(createdAt).toLocaleDateString("ko-KR")}
            </span>
          </p>
        </div>
        <Button
          variant="chip"
          className="shrink-0"
          aria-label={`${title} 삭제`}
          onClick={() => onDelete(id)}
        >
          삭제
        </Button>
      </div>
      <div id={contentId} hidden={!isOpen}>
        {isOpen && <CardResult cardSet={cardSet} headingTag="h3" />}
      </div>
    </article>
  );
}
