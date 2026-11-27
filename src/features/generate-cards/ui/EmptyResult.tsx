import { useId } from "react";

import { ZoomOutIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/Button";

type EmptyResultProps = {
  onPickLanguage: () => void;
  onNewText: () => void;
};

export function EmptyResult({ onPickLanguage, onNewText }: EmptyResultProps) {
  const titleId = useId();

  return (
    <section
      role="status"
      aria-labelledby={titleId}
      className="bg-surface border-text-muted/30 flex flex-col items-center rounded-3xl border-[1.5px] border-dashed px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="bg-border-soft text-text-muted flex size-16 items-center justify-center rounded-[20px]"
      >
        <ZoomOutIcon className="size-7.5" />
      </span>
      <h2 id={titleId} className="mt-4.5 text-xl font-extrabold tracking-tight">
        이 글에서는 담을 단어를 찾지 못했어요
      </h2>
      <p className="text-text-muted mt-2 max-w-105 text-sm leading-[1.7]">
        글이 너무 짧거나, 고른 언어와 글의 언어가 다를 수 있어요. 언어를 확인하거나 다른 글을 넣어
        보세요.
      </p>
      <div className="mt-5.5 flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={onPickLanguage}>
          언어 다시 고르기
        </Button>
        <Button variant="outline" onClick={onNewText}>
          다른 글 넣기
        </Button>
      </div>
    </section>
  );
}
