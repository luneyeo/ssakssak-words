import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SavedCardSets } from "@/widgets/saved-card-sets/ui/SavedCardSets";
import { DEMO_ARTICLES } from "@/entities/word-card/config/demoArticles";
import {
  parseCardSets,
  readRawCardSets,
  saveCardSet,
} from "@/entities/word-card/model/savedCardSets";

const [SHORT, IDIOM] = DEMO_ARTICLES.map(({ cardSet }) => cardSet);
const GERMAN = { ...SHORT, id: "german", title: "Guten Morgen", language: "독일어", isDemo: false };
const EMPTY_MESSAGE = "아직 담은 단어가 없어요. 글을 붙여넣어 보세요!";

const confirmMock = jest.fn();

beforeEach(() => {
  window.localStorage.clear();
  confirmMock.mockReset().mockReturnValue(true);
  window.confirm = confirmMock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SavedCardSets", () => {
  it("저장한 카드가 없으면 빈 상태를 안내한다", () => {
    render(<SavedCardSets />);
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("저장한 언어별 탭과 세트 수를 보여 주고, 고른 언어의 세트만 보여 준다", async () => {
    const user = userEvent.setup();
    saveCardSet(GERMAN);
    saveCardSet(SHORT);
    saveCardSet(IDIOM);
    render(<SavedCardSets />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.getAttribute("aria-label"))).toEqual([
      "전체 3개",
      "영어 2개",
      "독일어 1개",
    ]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("article")).toHaveLength(3);

    await user.click(screen.getByRole("tab", { name: "독일어 1개" }));

    expect(screen.getByRole("tab", { name: "독일어 1개" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const panel = screen.getByRole("tabpanel", { name: "독일어 1개" });
    expect(within(panel).getAllByRole("article")).toHaveLength(1);
    expect(panel).toHaveTextContent("Guten Morgen");
  });

  it("방향키와 Home, End로 탭을 옮기면 바로 고르고, Tab 순서에는 고른 탭만 둔다", async () => {
    const user = userEvent.setup();
    saveCardSet(GERMAN);
    saveCardSet(SHORT);
    render(<SavedCardSets />);

    await user.tab();
    expect(screen.getByRole("tab", { name: "전체 2개" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    const german = screen.getByRole("tab", { name: "독일어 1개" });
    expect(german).toHaveFocus();
    expect(german).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "전체 2개" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(german).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tab").map((tab) => tab.getAttribute("tabindex"))).toEqual([
      "-1",
      "-1",
      "0",
    ]);
  });

  it("고른 언어의 세트를 모두 지우면 전체 탭으로 돌아간다", async () => {
    const user = userEvent.setup();
    saveCardSet(GERMAN);
    saveCardSet(SHORT);
    render(<SavedCardSets />);

    await user.click(screen.getByRole("tab", { name: "독일어 1개" }));
    await user.click(screen.getByRole("button", { name: `${GERMAN.title} 삭제` }));

    expect(screen.queryByRole("tab", { name: /독일어/ })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "전체 1개" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("저장한 세트를 최근 순서로 보여 준다", () => {
    saveCardSet(SHORT);
    saveCardSet({ ...IDIOM, isDemo: false });
    render(<SavedCardSets />);

    const items = screen.getAllByRole("article");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(/Last month.*영어 · 단어 29개/);
    expect(within(items[0]).queryByText("예시 글")).not.toBeInTheDocument();
    expect(items[1]).toHaveTextContent(/She finally.*영어 · 단어 5개/);
    expect(within(items[1]).getByText("예시 글")).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
  });

  it("제목을 누르면 카드를 펼치고, 다시 누르면 접는다", async () => {
    const user = userEvent.setup();
    saveCardSet(SHORT);
    render(<SavedCardSets />);
    const toggle = screen.getByRole("button", { name: `${SHORT.title}…` });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const cards = screen.getByRole("region", { name: "단어 카드" });
    expect(within(cards).getAllByRole("button")).toHaveLength(5);

    await user.click(toggle);
    expect(screen.queryByRole("region", { name: "단어 카드" })).not.toBeInTheDocument();
  });

  it("확인하면 해당 세트만 지우고 제목으로 포커스를 옮긴다", async () => {
    const user = userEvent.setup();
    saveCardSet(SHORT);
    saveCardSet(IDIOM);
    render(<SavedCardSets />);

    await user.click(screen.getByRole("button", { name: `${IDIOM.title} 삭제` }));

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(parseCardSets(readRawCardSets())).toEqual([SHORT]);
    expect(screen.getByRole("status")).toHaveTextContent("카드를 지웠어요");
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  });

  it("취소하면 지우지 않는다", async () => {
    const user = userEvent.setup();
    confirmMock.mockReturnValue(false);
    saveCardSet(SHORT);
    render(<SavedCardSets />);

    await user.click(screen.getByRole("button", { name: `${SHORT.title} 삭제` }));

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(parseCardSets(readRawCardSets())).toEqual([SHORT]);
  });

  it("지우지 못하면 안내하고 목록을 남겨 둔다", async () => {
    const user = userEvent.setup();
    saveCardSet(SHORT);
    render(<SavedCardSets />);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    await user.click(screen.getByRole("button", { name: `${SHORT.title} 삭제` }));

    expect(screen.getByRole("status")).toHaveTextContent("앗, 카드를 지우지 못했어요");
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("다른 곳에서 저장하면 바로 반영한다", () => {
    render(<SavedCardSets />);
    act(() => {
      saveCardSet(SHORT);
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("저장된 값이 깨져 있어도 화면이 열린다", () => {
    window.localStorage.setItem("ssakssak-words:card-sets", "{broken");
    render(<SavedCardSets />);
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });
});
