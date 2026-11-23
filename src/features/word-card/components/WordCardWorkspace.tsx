"use client";

import { Chip } from "@/components/ui/Chip";
import { CardGrid } from "@/features/word-card/components/CardGrid";
import { CardResult } from "@/features/word-card/components/CardResult";
import { DemoArticlePicker } from "@/features/word-card/components/DemoArticlePicker";
import { GenerateStatus } from "@/features/word-card/components/GenerateStatus";
import { TextInputForm } from "@/features/word-card/components/TextInputForm";
import { WordCardSkeleton } from "@/features/word-card/components/WordCardSkeleton";
import { useGenerateCards } from "@/features/word-card/hooks/useGenerateCards";

const SKELETON_COUNT = 6;

export function WordCardWorkspace() {
  const { state, generateCards, showDemo } = useGenerateCards();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-primary-strong text-3xl font-bold">싹싹단어</h1>
          {state.status === "success" && state.isDemoMode && <Chip>데모 모드</Chip>}
        </div>
        <p className="text-text-muted mt-2">글 속 단어를 싹싹 쓸어 담아 드려요</p>
      </header>

      <TextInputForm isLoading={state.status === "loading"} onSubmit={generateCards} />
      <DemoArticlePicker onSelect={showDemo} />

      <GenerateStatus state={state} />
      {state.status === "loading" && (
        <CardGrid>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <li key={index}>
              <WordCardSkeleton />
            </li>
          ))}
        </CardGrid>
      )}
      {state.status === "success" && <CardResult key={state.cardSet.id} cardSet={state.cardSet} />}
    </div>
  );
}
