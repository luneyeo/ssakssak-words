import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WordCardWorkspace } from "@/features/word-card/components/WordCardWorkspace";
import { parseCardSets, readRawCardSets } from "@/features/word-card/savedCardSets";
import type { GeneratedCard } from "@/lib/ai/types";

const CARD: GeneratedCard = {
  word: "gorgeous",
  lemma: "gorgeous",
  meaning: "아주 멋진",
  partOfSpeech: "형용사",
  context: "The weather is gorgeous.",
  example: "What a gorgeous dress!",
  exampleTranslation: "정말 멋진 드레스예요!",
};

const AI_ERROR_MESSAGE = "앗, 단어를 담지 못했어요. 잠시 후 다시 시도해 주세요";

const fetchMock = jest.fn();

function mockResponse(body: unknown, status = 200) {
  return { ok: status < 400, status, json: () => Promise.resolve(body) };
}

async function submitText(text = "The weather is gorgeous.") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("외국어 글"), text);
  await user.click(screen.getByRole("button", { name: "단어 싹싹 담기" }));
  return user;
}

function getCards() {
  return within(screen.getByRole("region", { name: "단어 카드" })).getAllByRole("button");
}

function getSavedCardSets() {
  return parseCardSets(readRawCardSets());
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  window.localStorage.clear();
  fetchMock.mockReset();
  globalThis.fetch = fetchMock;
  Element.prototype.scrollIntoView = jest.fn();
  let uuidCount = 0;
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    configurable: true,
    value: () => `uuid-${uuidCount++}`,
  });
  render(<WordCardWorkspace />);
});

afterEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

describe("처음 화면", () => {
  it("빈 상태를 안내한다", () => {
    expect(screen.getByRole("status")).toHaveTextContent(
      "아직 담은 단어가 없어요. 글을 붙여넣어 보세요!",
    );
  });
});

describe("예시 글로 체험하기", () => {
  it("API를 호출하지 않고 바로 카드를 보여 준다", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("단어 5개를 싹싹 담았어요!");
    expect(getCards()).toHaveLength(5);
    expect(screen.queryByText("데모 모드")).not.toBeInTheDocument();
  });

  it("원문의 단어를 누르면 해당 카드로 이동한다", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));

    const source = screen.getByRole("region", { name: "원문" });
    await user.click(within(source).getByRole("button", { name: "gave up" }));

    const card = getCards()[1];
    expect(card).toHaveAccessibleName(/gave up/);
    expect(card).toHaveFocus();
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(jest.mocked(Element.prototype.scrollIntoView).mock.contexts).toEqual([card]);
  });
});

describe("직접 입력", () => {
  it("기다리는 동안 안내하고, mock 결과면 데모 모드 배지와 카드를 보여 준다", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    fetchMock.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)));

    await submitText();
    expect(screen.getByRole("status")).toHaveTextContent("단어를 싹싹 쓸어 담는 중이에요…");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cards",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ text: "The weather is gorgeous.", language: "영어" }),
      }),
    );

    await act(async () => resolveFetch(mockResponse({ cards: [CARD], provider: "mock" })));
    expect(screen.getByRole("status")).toHaveTextContent("단어 1개를 싹싹 담았어요!");
    expect(screen.getByText("데모 모드")).toBeInTheDocument();
    expect(getCards()).toHaveLength(1);
  });

  it("mock이 아니면 데모 모드 배지를 보여 주지 않는다", async () => {
    fetchMock.mockResolvedValue(mockResponse({ cards: [CARD], provider: "gemini" }));
    await submitText();

    expect(await screen.findByText("단어 1개를 싹싹 담았어요!")).toBeInTheDocument();
    expect(screen.queryByText("데모 모드")).not.toBeInTheDocument();
  });

  it("담을 단어가 없으면 안내한다", async () => {
    fetchMock.mockResolvedValue(mockResponse({ cards: [], provider: "mock" }));
    await submitText("I am in it.");

    expect(await screen.findByText("이 글에서는 담을 단어를 찾지 못했어요")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "단어 카드" })).not.toBeInTheDocument();
  });

  it("기다리는 사이 예시 글을 고르면 늦게 온 결과를 무시한다", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    fetchMock.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)));

    const user = await submitText();
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));
    await act(async () => resolveFetch(mockResponse({ cards: [CARD], provider: "mock" })));

    expect(screen.getByRole("status")).toHaveTextContent("단어 5개를 싹싹 담았어요!");
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
});

describe("저장", () => {
  it("직접 만든 카드를 저장한다", async () => {
    fetchMock.mockResolvedValue(mockResponse({ cards: [CARD], provider: "mock" }));
    await submitText();
    await screen.findByText("단어 1개를 싹싹 담았어요!");

    expect(getSavedCardSets()).toEqual([
      expect.objectContaining({
        title: "The weather is gorgeous.",
        isDemo: false,
        cards: [expect.objectContaining(CARD)],
      }),
    ]);
  });

  it("예시 글은 여러 번 골라도 한 번만 저장한다", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));
    await user.click(screen.getByRole("button", { name: "뉴스 한 단락" }));
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));

    expect(getSavedCardSets().map(({ id, isDemo }) => [id, isDemo])).toEqual([
      ["demo-short", true],
      ["demo-news", true],
    ]);
  });

  it("담을 단어가 없거나 실패하면 저장하지 않는다", async () => {
    fetchMock.mockResolvedValueOnce(mockResponse({ cards: [], provider: "mock" }));
    await submitText("I am in it.");
    await screen.findByText("이 글에서는 담을 단어를 찾지 못했어요");

    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await submitText(" Again.");
    await screen.findByRole("alert");

    expect(getSavedCardSets()).toEqual([]);
  });

  it("저장하지 못해도 카드는 보여 주고 안내한다", async () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "짧은 문장" }));

    expect(screen.getByRole("alert")).toHaveTextContent("카드를 저장하지 못했어요");
    expect(getCards()).toHaveLength(5);
  });
});

describe("에러", () => {
  it("서버가 보낸 문구를 보여 주고 입력한 글은 남겨 둔다", async () => {
    const message = "오늘 담을 수 있는 양을 다 썼어요. 예시 글로 체험해 보세요!";
    fetchMock.mockResolvedValue(mockResponse({ error: { code: "RATE_LIMITED", message } }, 429));
    await submitText();

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.getByLabelText("외국어 글")).toHaveValue("The weather is gorgeous.");
  });

  it.each([
    ["연결 실패", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["형식이 다른 성공 응답", () => Promise.resolve(mockResponse({ cards: [{}] }))],
    ["형식이 다른 에러 응답", () => Promise.resolve(mockResponse("<html>", 500))],
  ])("%s이면 기본 에러 문구를 보여 준다", async (_, respond) => {
    fetchMock.mockImplementation(respond);
    await submitText();

    expect(await screen.findByRole("alert")).toHaveTextContent(AI_ERROR_MESSAGE);
  });
});
