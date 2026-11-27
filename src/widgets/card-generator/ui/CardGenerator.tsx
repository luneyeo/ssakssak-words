"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { ArrowRightIcon } from "@/shared/icons";
import { Chip } from "@/shared/ui/Chip";
import { CardGrid } from "@/entities/word-card/ui/CardGrid";
import { CardResult } from "@/entities/word-card/ui/CardResult";
import { EmptyResult } from "@/features/generate-cards/ui/EmptyResult";
import { ErrorNotice } from "@/shared/ui/ErrorNotice";
import { GenerateStatus } from "@/features/generate-cards/ui/GenerateStatus";
import { BusyNotice } from "@/features/generate-cards/ui/BusyNotice";
import { RateLimitNotice } from "@/features/generate-cards/ui/RateLimitNotice";
import { RequestErrorNotice } from "@/features/generate-cards/ui/RequestErrorNotice";
import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import { TextInputForm } from "@/features/generate-cards/ui/TextInputForm";
import type { TextInputFormHandle } from "@/features/generate-cards/ui/TextInputForm";
import { WordCardSkeleton } from "@/entities/word-card/ui/WordCardSkeleton";
import { useGenerateCards } from "@/features/generate-cards/model/useGenerateCards";
import { saveCardSet } from "@/entities/word-card/model/savedCardSets";
import type { CardSet } from "@/entities/word-card/model/types";

const SKELETON_COUNT = 6;

export function CardGenerator() {
  const [hasSaveError, setHasSaveError] = useState(false);
  const formRef = useRef<TextInputFormHandle>(null);
  const { state, generateCards, showDemo, retry } = useGenerateCards(handleSuccess);
  const hasCards = state.status === "success" && state.cardSet.cards.length > 0;
  const isEmptyResult = state.status === "success" && !hasCards;

  function handleSuccess(cardSet: CardSet) {
    const canSave = cardSet.cards.length > 0;
    setHasSaveError(canSave && !saveCardSet(cardSet));
  }

  return (
    <div>
      <TextInputForm
        ref={formRef}
        isLoading={state.status === "loading"}
        onSubmit={generateCards}
        onDemoSelect={showDemo}
      />

      <div className="mt-14 flex flex-col gap-4">
        {state.status === "requestError" && <RequestErrorNotice onRetry={retry} />}
        {state.status === "busy" && <BusyNotice onRetry={retry} />}
        {state.status === "rateLimited" && (
          <RateLimitNotice onShowDemo={() => showDemo(DEMO_ARTICLES[0].cardSet)} />
        )}
        {isEmptyResult && (
          <EmptyResult
            onPickLanguage={() => formRef.current?.focusLanguage()}
            onNewText={() => formRef.current?.selectText()}
          />
        )}
        {state.status !== "requestError" &&
          state.status !== "busy" &&
          state.status !== "rateLimited" &&
          !isEmptyResult && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex grow flex-wrap items-center gap-3">
                <GenerateStatus state={state} />
                {state.status === "success" && state.isDemoMode && <Chip>데모 모드</Chip>}
              </div>
              {hasCards && (
                <Link
                  href="/cards"
                  className="rounded-control border-primary/25 bg-surface text-primary hover:border-primary/40 hover:bg-primary-soft/50 hover:text-primary-strong inline-flex min-h-11 items-center gap-1.5 border px-3.5 text-sm font-bold transition"
                >
                  담은 단어 보러 가기
                  <ArrowRightIcon className="size-4" />
                </Link>
              )}
            </div>
          )}
        {state.status === "success" && hasSaveError && (
          <ErrorNotice>카드를 저장하지 못했어요. 이 화면을 벗어나면 카드가 사라져요</ErrorNotice>
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
        {state.status === "success" && (
          <CardResult key={state.cardSet.id} cardSet={state.cardSet} />
        )}
      </div>
    </div>
  );
}
