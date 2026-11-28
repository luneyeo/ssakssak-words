import type { Ref } from "react";

import { countWords } from "@/entities/word-card/model/countWords";
import type { CardSet } from "@/entities/word-card/model/types";

type CardsHeroProps = {
  cards: CardSet[];
  headingRef?: Ref<HTMLHeadingElement>;
};

export function CardsHero({ cards, headingRef }: CardsHeroProps) {
  const wordCount = countWords(cards);

  return (
    <section className="pt-14 pb-7">
      {/* 세트를 지운 뒤 포커스를 옮겨 두는 곳이라 Tab 순서에는 넣지 않고 focus 링도 끈다 */}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[clamp(30px,5vw,42px)] leading-tight font-extrabold tracking-tight outline-none"
      >
        담은 단어
      </h1>
      <p className="text-text-muted mt-3">
        문장 <em className="text-text font-bold not-italic">{cards.length}</em>개에서 단어{" "}
        <em className="text-primary font-bold not-italic">{wordCount}</em>개를 모았어요.
      </p>
    </section>
  );
}
