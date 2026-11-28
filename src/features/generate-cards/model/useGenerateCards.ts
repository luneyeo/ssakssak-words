import { useEffect, useRef, useState } from "react";

import { TITLE_LENGTH } from "@/entities/word-card/model/constants";
import { cardsApiErrorSchema, cardsApiSuccessSchema } from "@/entities/word-card/model/schema";
import type { CardSet } from "@/entities/word-card/model/types";
import { ERROR_DETAILS } from "@/ai/errors";
import type { GenerateCardsInput } from "@/ai/types";

type SettledState =
  | { status: "success"; cardSet: CardSet; isDemoMode: boolean }
  | { status: "error"; message: string }
  // 서버까지 닿지 못한 경우라, 서버가 정한 문구 대신 연결을 확인하라고 안내한다
  | { status: "requestError" };

export type GenerateCardsState = { status: "idle" } | { status: "loading" } | SettledState;

export function useGenerateCards(onSuccess: (cardSet: CardSet) => void) {
  const [state, setState] = useState<GenerateCardsState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);
  const lastInputRef = useRef<GenerateCardsInput | null>(null);

  useEffect(() => cancelRequest, []);

  function cancelRequest() {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }

  async function generateCards(input: GenerateCardsInput) {
    cancelRequest();
    lastInputRef.current = input;
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ status: "loading" });
    const nextState = await requestCards(input, controller.signal);

    // 기다리는 사이 예시 글을 고르거나 다시 요청했다면, 늦게 온 결과가 새 화면을 덮지 않게 한다
    if (controller.signal.aborted) return;
    setState(nextState);
    if (nextState.status === "success") onSuccess(nextState.cardSet);
  }

  function showDemo(demoCardSet: CardSet) {
    cancelRequest();
    const cardSet = { ...demoCardSet, createdAt: new Date().toISOString() };
    setState({ status: "success", cardSet, isDemoMode: false });
    onSuccess(cardSet);
  }

  function retry() {
    if (lastInputRef.current) void generateCards(lastInputRef.current);
  }

  return { state, generateCards, showDemo, retry };
}

async function requestCards(input: GenerateCardsInput, signal: AbortSignal): Promise<SettledState> {
  let response: Response;
  try {
    response = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
    });
  } catch {
    return { status: "requestError" };
  }

  try {
    const body: unknown = await response.json();

    if (!response.ok) {
      return { status: "error", message: cardsApiErrorSchema.parse(body).error.message };
    }

    const { cards, provider } = cardsApiSuccessSchema.parse(body);
    return {
      status: "success",
      cardSet: createCardSet(input, cards),
      isDemoMode: provider === "mock",
    };
  } catch {
    return { status: "error", message: ERROR_DETAILS.AI_ERROR.message };
  }
}

function createCardSet(
  { text, language }: GenerateCardsInput,
  generatedCards: Omit<CardSet["cards"][number], "id">[],
): CardSet {
  const sourceText = text.trim();

  return {
    id: crypto.randomUUID(),
    title: sourceText.slice(0, TITLE_LENGTH),
    language,
    sourceText,
    cards: generatedCards.map((card) => ({ ...card, id: crypto.randomUUID() })),
    isDemo: false,
    createdAt: new Date().toISOString(),
  };
}
