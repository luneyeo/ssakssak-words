import { SUPPORTED_LANGUAGES } from "@/entities/word-card/model/constants";

// 화면 어디서든 언어 선택 목록과 같은 순서로 보여 주고, 목록에 없는 언어는 맨 뒤로 보낸다
export function compareLanguages(a: string, b: string): number {
  return getLanguageOrder(a) - getLanguageOrder(b);
}

function getLanguageOrder(language: string): number {
  const index = SUPPORTED_LANGUAGES.findIndex((supported) => supported === language);
  return index === -1 ? SUPPORTED_LANGUAGES.length : index;
}
