import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomePage } from "@/views/home/ui/HomePage";

beforeEach(() => {
  window.localStorage.clear();
  render(<HomePage />);
});

describe("HomePage", () => {
  it("서비스 이름과 소개 문구를 보여 준다", () => {
    expect(screen.getByRole("link", { name: "싹싹단어" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "글 속 단어를 싹싹 쓸어 담아 드려요",
    );
  });

  it("예시 글로 담은 단어 수를 헤더 링크에 보여 준다", async () => {
    const user = userEvent.setup();
    expect(screen.getByRole("link", { name: "담은 단어" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "짧은 문장" }));

    expect(screen.getByRole("link", { name: "담은 단어 5개" })).toHaveAttribute("href", "/cards");
  });
});
