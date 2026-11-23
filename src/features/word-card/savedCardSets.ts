import { cardSetSchema } from "@/features/word-card/schema";
import type { CardSet } from "@/features/word-card/types";
import { parseStoredList, readStorage, writeStorage } from "@/lib/storage";

const STORAGE_KEY = "ssakssak-words:card-sets";

export function readRawCardSets(): string | null {
  return readStorage(STORAGE_KEY);
}

export function parseCardSets(raw: string | null): CardSet[] {
  return parseStoredList(raw, cardSetSchema);
}

// 예시 글은 id가 고정이라, 다시 골라도 쌓이지 않고 맨 앞으로 옮겨진다
export function saveCardSet(cardSet: CardSet): boolean {
  return writeStorage(STORAGE_KEY, [cardSet, ...readOthers(cardSet.id)]);
}

export function deleteCardSet(id: string): boolean {
  return writeStorage(STORAGE_KEY, readOthers(id));
}

// 다른 탭에서 저장한 세트를 덮어쓰지 않도록, 화면의 값 대신 저장소의 최신 값을 기준으로 한다
function readOthers(id: string): CardSet[] {
  return parseCardSets(readRawCardSets()).filter((cardSet) => cardSet.id !== id);
}
