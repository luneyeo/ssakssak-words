import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("서비스 이름과 소개 문구를 보여 준다", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: "싹싹단어" })).toBeInTheDocument();
    expect(screen.getByText("글 속 단어를 싹싹 쓸어 담아 드려요")).toBeInTheDocument();
  });
});
