import { useId } from "react";

import { Button } from "@/shared/ui/Button";
import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import type { CardSet } from "@/entities/word-card/model/types";

type DemoArticlePickerProps = {
  onSelect: (cardSet: CardSet) => void;
};

export function DemoArticlePicker({ onSelect }: DemoArticlePickerProps) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId} className="flex flex-wrap items-center gap-1.5">
      <span id={titleId} className="text-text-muted mr-0.5 text-sm">
        예시로 해보기
      </span>
      {DEMO_ARTICLES.map(({ label, cardSet }) => (
        <Button key={cardSet.id} variant="chip" onClick={() => onSelect(cardSet)}>
          {label}
        </Button>
      ))}
    </div>
  );
}
