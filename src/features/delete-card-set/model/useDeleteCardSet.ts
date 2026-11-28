import { useState } from "react";

import { deleteCardSet } from "@/entities/word-card/model/savedCardSets";

type UseDeleteCardSetOptions = {
  // 누른 삭제 버튼이 사라지므로, 지운 뒤 포커스를 어디로 옮길지는 화면이 정한다
  onDeleted: () => void;
};

export function useDeleteCardSet({ onDeleted }: UseDeleteCardSetOptions) {
  const [message, setMessage] = useState("");

  function deleteWithConfirm(id: string) {
    if (!window.confirm("이 카드를 모두 지울까요? 지우면 되돌릴 수 없어요")) return;

    const isDeleted = deleteCardSet(id);
    setMessage(isDeleted ? "카드를 지웠어요" : "앗, 카드를 지우지 못했어요");
    if (isDeleted) onDeleted();
  }

  return { message, deleteWithConfirm };
}
