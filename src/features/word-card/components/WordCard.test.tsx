import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WordCard } from "@/features/word-card/components/WordCard";
import type { WordCard as WordCardData } from "@/features/word-card/types";

const CARD: WordCardData = {
  id: "card-1",
  word: "gave up",
  lemma: "give up",
  meaning: "끊다",
  partOfSpeech: "숙어",
  context: "She gave up smoking.",
  example: "He gave up coffee.",
  exampleTranslation: "그는 커피를 끊었어요.",
};

function renderCard(overrides: Partial<WordCardData> = {}) {
  render(<WordCard card={{ ...CARD, ...overrides }} elementId="card" />);
  return screen.getByRole("button");
}

describe("WordCard", () => {
  it("처음에는 앞면만 읽힌다", () => {
    const button = renderCard();

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAccessibleName(/gave up.*give up.*숙어/);
    expect(button).not.toHaveAccessibleName(/끊다/);
  });

  it("클릭하면 뒷면으로, 다시 클릭하면 앞면으로 뒤집힌다", async () => {
    const user = userEvent.setup();
    const button = renderCard();

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAccessibleName(
      /끊다.*She.*gave up.*smoking.*He gave up coffee.*그는 커피를 끊었어요/,
    );
    expect(button).not.toHaveAccessibleName(/give up/);

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it.each(["{Enter}", " "])("키보드(%s)로 뒤집을 수 있다", async (key) => {
    const user = userEvent.setup();
    const button = renderCard();

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(key);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("단어와 기본형이 같으면 기본형을 따로 보여 주지 않는다", () => {
    renderCard({ word: "joy", lemma: "joy", context: "A simple pleasure." });
    expect(screen.getAllByText("joy")).toHaveLength(1);
  });

  it("뒷면 원문 문장에서 해당 단어를 하이라이트한다", () => {
    renderCard();
    expect(screen.getByText("gave up", { selector: "mark" })).toBeInTheDocument();
  });
});
