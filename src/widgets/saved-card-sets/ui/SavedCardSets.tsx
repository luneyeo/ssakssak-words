"use client";

import { useRef } from "react";

import { useSavedCards } from "@/entities/word-card/model/useSavedCards";
import { useDeleteCardSet } from "@/features/delete-card-set/model/useDeleteCardSet";
import { Tabs } from "@/shared/ui/Tabs";
import { useLanguageFilter } from "@/widgets/saved-card-sets/model/useLanguageFilter";
import { CardsHero } from "@/widgets/saved-card-sets/ui/CardsHero";
import { SavedCardSetItem } from "@/widgets/saved-card-sets/ui/SavedCardSetItem";

export function SavedCardSets() {
  const { cardSets, isLoaded } = useSavedCards();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { tabItems, activeLanguage, selectLanguage, visibleCardSets } = useLanguageFilter(cardSets);
  const { message, deleteWithConfirm } = useDeleteCardSet({
    onDeleted: () => headingRef.current?.focus(),
  });

  return (
    <div className="flex flex-col">
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
          onSelect={selectLanguage}
        >
          <ul className="flex flex-col gap-4">
            {visibleCardSets.map((cardSet) => (
              <li key={cardSet.id}>
                <SavedCardSetItem cardSet={cardSet} onDelete={deleteWithConfirm} />
              </li>
            ))}
          </ul>
        </Tabs>
      )}
    </div>
  );
}
