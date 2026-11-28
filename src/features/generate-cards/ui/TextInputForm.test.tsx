import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextInputForm } from "@/features/generate-cards/ui/TextInputForm";
import { MAX_TEXT_LENGTH } from "@/entities/word-card/model/constants";
import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";

function renderForm(isLoading = false) {
  const handleSubmit = jest.fn();
  const handleDemoSelect = jest.fn();
  render(
    <TextInputForm isLoading={isLoading} onSubmit={handleSubmit} onDemoSelect={handleDemoSelect} />,
  );
  return {
    handleSubmit,
    handleDemoSelect,
    textarea: screen.getByLabelText("외국어 글"),
    select: screen.getByLabelText("어떤 언어의 글인가요?"),
    button: screen.getByRole("button", { name: "단어 싹싹 담기" }),
  };
}

describe("TextInputForm", () => {
  it("앞뒤 공백을 뺀 글과 고른 언어를 넘긴다", async () => {
    const user = userEvent.setup();
    const { handleSubmit, textarea, select, button } = renderForm();

    await user.type(textarea, "  Hallo  ");
    await user.selectOptions(select, "독일어");
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({ text: "Hallo", language: "독일어" });
  });

  it("글이 비어 있으면 담을 수 없다", async () => {
    const user = userEvent.setup();
    const { textarea, button } = renderForm();

    expect(button).toBeDisabled();
    await user.type(textarea, "   ");
    expect(button).toBeDisabled();
  });

  it("최대 글자 수를 넘으면 안내하고 막는다", () => {
    const { textarea, button } = renderForm();

    fireEvent.change(textarea, { target: { value: "a".repeat(MAX_TEXT_LENGTH) } });
    expect(button).toBeEnabled();

    fireEvent.change(textarea, { target: { value: "a".repeat(MAX_TEXT_LENGTH + 1) } });
    expect(button).toBeDisabled();
    expect(textarea).toBeInvalid();
    expect(textarea).toHaveAccessibleDescription(/글이 너무 길어요.*3,001 \/ 3,000자/);
  });

  it("예시 글을 고르면 입력창에 글을 채우고 미리 만든 결과를 넘긴다", async () => {
    const user = userEvent.setup();
    const { handleDemoSelect, textarea, select } = renderForm();
    const [{ label, cardSet }] = DEMO_ARTICLES;

    await user.selectOptions(select, "독일어");
    await user.click(screen.getByRole("button", { name: label }));

    expect(textarea).toHaveValue(cardSet.sourceText);
    expect(select).toHaveValue(cardSet.language);
    expect(handleDemoSelect).toHaveBeenCalledWith(cardSet);
  });

  it("담는 중에는 다시 누를 수 없다", async () => {
    const user = userEvent.setup();
    const { textarea, button } = renderForm(true);

    await user.type(textarea, "Hello");
    expect(button).toBeDisabled();
  });
});
