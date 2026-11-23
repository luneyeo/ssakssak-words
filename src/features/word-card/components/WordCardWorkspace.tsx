"use client";

import { useState } from "react";

import { Chip } from "@/components/ui/Chip";
import { TextLink } from "@/components/ui/TextLink";
import { CardGrid } from "@/features/word-card/components/CardGrid";
import { CardResult } from "@/features/word-card/components/CardResult";
import { DemoArticlePicker } from "@/features/word-card/components/DemoArticlePicker";
import { GenerateStatus } from "@/features/word-card/components/GenerateStatus";
import { TextInputForm } from "@/features/word-card/components/TextInputForm";
import { WordCardSkeleton } from "@/features/word-card/components/WordCardSkeleton";
import { useGenerateCards } from "@/features/word-card/hooks/useGenerateCards";
import { saveCardSet } from "@/features/word-card/savedCardSets";
import type { CardSet } from "@/features/word-card/types";

const SKELETON_COUNT = 6;

export function WordCardWorkspace() {
  const [hasSaveError, setHasSaveError] = useState(false);
  const { state, generateCards, showDemo } = useGenerateCards(handleSuccess);

  function handleSuccess(cardSet: CardSet) {
    const canSave = cardSet.cards.length > 0;
    setHasSaveError(canSave && !saveCardSet(cardSet));
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-primary-strong text-3xl font-bold">싹싹단어</h1>
          {state.status === "success" && state.isDemoMode && <Chip>데모 모드</Chip>}
          <span className="ml-auto">
            <TextLink href="/cards">담은 단어 모아보기</TextLink>
          </span>
        </div>
        <p className="text-text-muted mt-2">글 속 단어를 싹싹 쓸어 담아 드려요</p>
      </header>

      <TextInputForm isLoading={state.status === "loading"} onSubmit={generateCards} />
      <DemoArticlePicker onSelect={showDemo} />

      <GenerateStatus state={state} />
      {state.status === "success" && hasSaveError && (
        <p role="alert" className="text-danger">
          카드를 저장하지 못했어요. 이 화면을 벗어나면 카드가 사라져요
        </p>
      )}
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
