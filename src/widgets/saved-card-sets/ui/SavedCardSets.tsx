"use client";

import { useRef, useState } from "react";

import { SavedCardSetItem } from "@/widgets/saved-card-sets/ui/SavedCardSetItem";
import { useSavedCards } from "@/entities/word-card/model/useSavedCards";
import { deleteCardSet } from "@/entities/word-card/model/savedCardSets";
import { CardsHero } from "@/widgets/saved-card-sets/ui/CardsHero";

export function SavedCardSets() {
  const { cardSets, isLoaded } = useSavedCards();
  const [message, setMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

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
      <ul className="flex flex-col gap-4">
        {cardSets.map((cardSet) => (
          <li key={cardSet.id}>
            <SavedCardSetItem cardSet={cardSet} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}
