import { useMemo, useSyncExternalStore } from "react";

import { parseCardSets, readRawCardSets } from "@/features/word-card/savedCardSets";
import { subscribeStorage } from "@/lib/storage";

export function useSavedCards() {
  // 서버에는 localStorage가 없어, 화면이 준비되기 전(undefined)과 저장한 적 없음(null)을 구분한다
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribeStorage,
    readRawCardSets,
    getServerSnapshot,
  );

  // 세트가 많으면 검증 비용이 커서, 저장된 값이 바뀔 때만 다시 검증한다
  const cardSets = useMemo(() => parseCardSets(raw ?? null), [raw]);

  return { cardSets, isLoaded: raw !== undefined };
}

function getServerSnapshot(): undefined {
  return undefined;
}
