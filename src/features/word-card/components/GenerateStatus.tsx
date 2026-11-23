import { Spinner } from "@/components/ui/Spinner";
import type { GenerateCardsState } from "@/features/word-card/hooks/useGenerateCards";

type GenerateStatusProps = {
  state: GenerateCardsState;
};

export function GenerateStatus({ state }: GenerateStatusProps) {
  if (state.status === "error") {
    return (
      <p role="alert" className="text-danger">
        {state.message}
      </p>
    );
  }

  return (
    <p role="status" className="text-text-muted flex items-center gap-2">
      {state.status === "loading" && <Spinner />}
      {getStatusMessage(state)}
    </p>
  );
}

function getStatusMessage(state: Exclude<GenerateCardsState, { status: "error" }>): string {
  if (state.status === "idle") return "아직 담은 단어가 없어요. 글을 붙여넣어 보세요!";
  if (state.status === "loading") return "단어를 싹싹 쓸어 담는 중이에요…";

  const count = state.cardSet.cards.length;
  return count === 0 ? "이 글에서는 담을 단어를 찾지 못했어요" : `단어 ${count}개를 싹싹 담았어요!`;
}
