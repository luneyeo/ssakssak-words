"use client";

import Link from "next/link";

import { BookmarkIcon } from "@/shared/icons";

export function AddToWordsLink() {
  return (
    <Link
      href="/"
      className={
        "border-border bg-surface hover:border-text-muted/40 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
      }
    >
      <BookmarkIcon className="text-primary size-4" />
      단어 담으러 가기
    </Link>
  );
}
