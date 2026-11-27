import { useState } from "react";

import { compareLanguages } from "@/entities/word-card/model/compareLanguages";
import type { CardSet } from "@/entities/word-card/model/types";
import type { TabItem } from "@/shared/ui/Tabs";

export const ALL_LANGUAGES = "all";

export function useLanguageFilter(cardSets: CardSet[]) {
  const [selectedLanguage, setSelectedLanguage] = useState(ALL_LANGUAGES);

  const tabItems = createTabItems(cardSets);
  // 고른 언어의 세트를 모두 지우면 그 탭이 사라지므로 전체로 돌아간다
  const activeLanguage = tabItems.some((item) => item.value === selectedLanguage)
    ? selectedLanguage
    : ALL_LANGUAGES;
  const visibleCardSets =
    activeLanguage === ALL_LANGUAGES
      ? cardSets
      : cardSets.filter((cardSet) => cardSet.language === activeLanguage);

  return { tabItems, activeLanguage, selectLanguage: setSelectedLanguage, visibleCardSets };
}

// 저장한 세트가 있는 언어만 보여 주고, 숫자는 그 언어로 저장한 세트 수다
export function createTabItems(cardSets: CardSet[]): TabItem[] {
  const counts = new Map<string, number>();
  cardSets.forEach(({ language }) => counts.set(language, (counts.get(language) ?? 0) + 1));

  return [
    { value: ALL_LANGUAGES, label: "전체", count: cardSets.length },
    ...[...counts.keys()].toSorted(compareLanguages).map((language) => ({
      value: language,
      label: language,
      count: counts.get(language) ?? 0,
    })),
  ];
}
