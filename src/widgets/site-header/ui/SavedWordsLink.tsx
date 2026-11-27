"use client";

import Link from "next/link";

import { BookmarkIcon } from "@/shared/icons";
import { useSavedCards } from "@/entities/word-card/model/useSavedCards";

export function SavedWordsLink() {
  const { cardSets, isLoaded } = useSavedCards();
  const wordCount = cardSets.reduce((sum, cardSet) => sum + cardSet.cards.length, 0);
  const hasBadge = isLoaded && wordCount > 0;

  return (
    <Link
      href="/cards"
      aria-label={hasBadge ? `담은 단어 ${wordCount}개` : undefined}
      className={
        "border-border bg-surface hover:border-text-muted/40 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
      }
    >
      <BookmarkIcon className="text-primary size-4" />
      담은 단어
      {hasBadge && (
        <span className="bg-primary text-surface inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold">
          {wordCount}
        </span>
      )}
    </Link>
  );
}
