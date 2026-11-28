import { Spinner } from "@/shared/ui/Spinner";
import { ErrorNotice } from "@/shared/ui/ErrorNotice";
import type { GenerateCardsState } from "@/features/generate-cards/model/useGenerateCards";

// 단어가 없을 때와 요청이 실패했을 때는 결과 영역 전체를 쓰는 상자로 따로 보여 준다
type GenerateStatusProps = {
  state: Exclude<GenerateCardsState, { status: "requestError" }>;
};

export function GenerateStatus({ state }: GenerateStatusProps) {
  if (state.status === "error") {
    return <ErrorNotice>{state.message}</ErrorNotice>;
  }

  if (state.status === "success") {
    return (
      <div role="status">
        <h2 className="text-[22px] font-extrabold tracking-tight">
          단어 <em className="text-primary not-italic">{state.cardSet.cards.length}개</em>를 싹싹
          담았어요!
        </h2>
      </div>
    );
  }

  return (
    <p role="status" className="text-text-muted flex items-center gap-2">
      {state.status === "loading" && <Spinner />}
      {state.status === "loading"
        ? "단어를 싹싹 쓸어 담는 중이에요…"
        : "아직 담은 단어가 없어요. 글을 붙여넣어 보세요!"}
    </p>
  );
}
