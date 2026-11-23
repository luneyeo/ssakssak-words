import type { Metadata } from "next";

import { SavedCardSets } from "@/features/word-card/components/SavedCardSets";

export const metadata: Metadata = {
  title: "담은 단어 모아보기 | 싹싹단어",
};

export default function CardsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <SavedCardSets />
    </main>
  );
}
