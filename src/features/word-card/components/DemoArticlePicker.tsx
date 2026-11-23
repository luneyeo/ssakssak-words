import { Button } from "@/components/ui/Button";
import { DEMO_ARTICLES } from "@/features/word-card/demo/demoArticles";
import type { CardSet } from "@/features/word-card/types";

type DemoArticlePickerProps = {
  onSelect: (cardSet: CardSet) => void;
};

export function DemoArticlePicker({ onSelect }: DemoArticlePickerProps) {
  return (
    <section aria-labelledby="demo-articles-title">
      <h2 id="demo-articles-title" className="text-text-muted text-sm">
        예시 글로 먼저 체험해 보세요
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_ARTICLES.map(({ label, cardSet }) => (
          <Button key={cardSet.id} variant="chip" onClick={() => onSelect(cardSet)}>
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
}
