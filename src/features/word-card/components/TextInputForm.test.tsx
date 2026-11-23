import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextInputForm } from "@/features/word-card/components/TextInputForm";
import { MAX_TEXT_LENGTH } from "@/features/word-card/constants";

function renderForm(isLoading = false) {
  const handleSubmit = jest.fn();
  render(<TextInputForm isLoading={isLoading} onSubmit={handleSubmit} />);
  return {
    handleSubmit,
    textarea: screen.getByLabelText("외국어 글"),
    select: screen.getByLabelText("언어"),
    button: screen.getByRole("button", { name: "단어 싹싹 담기" }),
  };
}

describe("TextInputForm", () => {
  it("앞뒤 공백을 뺀 글과 고른 언어를 넘긴다", async () => {
    const user = userEvent.setup();
    const { handleSubmit, textarea, select, button } = renderForm();

    await user.type(textarea, "  Hola  ");
    await user.selectOptions(select, "스페인어");
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({ text: "Hola", language: "스페인어" });
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

  it("담는 중에는 다시 누를 수 없다", async () => {
    const user = userEvent.setup();
    const { textarea, button } = renderForm(true);

    await user.type(textarea, "Hello");
    expect(button).toBeDisabled();
  });
});
