"use client";

import { useRef, useState } from "react";

import { SUPPORTED_LANGUAGES } from "@/entities/word-card/model/constants";
import { deleteCardSet } from "@/entities/word-card/model/savedCardSets";
import type { CardSet } from "@/entities/word-card/model/types";
import { useSavedCards } from "@/entities/word-card/model/useSavedCards";
import { Tabs } from "@/shared/ui/Tabs";
import type { TabItem } from "@/shared/ui/Tabs";
import { CardsHero } from "@/widgets/saved-card-sets/ui/CardsHero";
import { SavedCardSetItem } from "@/widgets/saved-card-sets/ui/SavedCardSetItem";

const ALL_LANGUAGES = "all";

export function SavedCardSets() {
  const { cardSets, isLoaded } = useSavedCards();
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(ALL_LANGUAGES);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const tabItems = createTabItems(cardSets);
  // 고른 언어의 세트를 모두 지우면 그 탭이 사라지므로 전체로 돌아간다
  const activeLanguage = tabItems.some((item) => item.value === selectedLanguage)
    ? selectedLanguage
    : ALL_LANGUAGES;
  const visibleCardSets =
    activeLanguage === ALL_LANGUAGES
      ? cardSets
      : cardSets.filter((cardSet) => cardSet.language === activeLanguage);

  function handleDelete(id: string) {
    if (!window.confirm("이 카드를 모두 지울까요? 지우면 되돌릴 수 없어요")) return;

    const isDeleted = deleteCardSet(id);
    setMessage(isDeleted ? "카드를 지웠어요" : "앗, 카드를 지우지 못했어요");
    // 누른 삭제 버튼이 사라지므로, 키보드 사용자의 위치를 잃지 않게 제목으로 옮긴다
    if (isDeleted) headingRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-8">
      <CardsHero cards={cardSets} headingRef={headingRef} />
      {/* TODO StatusNotice 활용해서 삭제 안내 컴포넌트 생성하기 */}
      <p role="status" className="text-text-muted empty:hidden">
        {message}
      </p>

      {isLoaded && cardSets.length === 0 && (
        <p className="text-text-muted">아직 담은 단어가 없어요. 글을 붙여넣어 보세요!</p>
      )}
      {cardSets.length > 0 && (
        <Tabs
          label="언어별로 보기"
          items={tabItems}
          selectedValue={activeLanguage}
          onSelect={setSelectedLanguage}
        >
          <ul className="flex flex-col gap-4">
            {visibleCardSets.map((cardSet) => (
              <li key={cardSet.id}>
                <SavedCardSetItem cardSet={cardSet} onDelete={handleDelete} />
              </li>
            ))}
          </ul>
        </Tabs>
      )}
    </div>
  );
}

// 저장한 세트가 있는 언어만, 언어 선택 목록과 같은 순서로 보여 준다
function createTabItems(cardSets: CardSet[]): TabItem[] {
  const counts = new Map<string, number>();
  cardSets.forEach(({ language }) => counts.set(language, (counts.get(language) ?? 0) + 1));

  const languages = [...counts.keys()].toSorted(
    (a, b) => getLanguageOrder(a) - getLanguageOrder(b),
  );

  return [
    { value: ALL_LANGUAGES, label: "전체", count: cardSets.length },
    ...languages.map((language) => ({
      value: language,
      label: language,
      count: counts.get(language) ?? 0,
    })),
  ];
}

function getLanguageOrder(language: string): number {
  const index = SUPPORTED_LANGUAGES.findIndex((supported) => supported === language);
  return index === -1 ? SUPPORTED_LANGUAGES.length : index;
}
