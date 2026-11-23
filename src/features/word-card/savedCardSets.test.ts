import { DEMO_ARTICLES } from "@/features/word-card/demo/demoArticles";
import {
  deleteCardSet,
  parseCardSets,
  readRawCardSets,
  saveCardSet,
} from "@/features/word-card/savedCardSets";

const [SHORT, IDIOM, NEWS] = DEMO_ARTICLES.map(({ cardSet }) => cardSet);

function readIds() {
  return parseCardSets(readRawCardSets()).map(({ id }) => id);
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("saveCardSet", () => {
  it("저장한 세트를 그대로 다시 읽는다", () => {
    expect(saveCardSet(SHORT)).toBe(true);
    expect(parseCardSets(readRawCardSets())).toEqual([SHORT]);
  });

  it("최근에 저장한 세트를 맨 앞에 둔다", () => {
    saveCardSet(SHORT);
    saveCardSet(IDIOM);
    expect(readIds()).toEqual([IDIOM.id, SHORT.id]);
  });

  it("같은 id는 중복 저장하지 않고 맨 앞으로 옮긴다", () => {
    saveCardSet(SHORT);
    saveCardSet(IDIOM);
    saveCardSet(SHORT);
    expect(readIds()).toEqual([SHORT.id, IDIOM.id]);
  });

  it("저장하지 못하면 false를 돌려주고 기존 세트는 남겨 둔다", () => {
    saveCardSet(SHORT);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });

    expect(saveCardSet(IDIOM)).toBe(false);
    expect(readIds()).toEqual([SHORT.id]);
  });
});

describe("deleteCardSet", () => {
  it("해당 세트만 지운다", () => {
    [SHORT, IDIOM, NEWS].forEach(saveCardSet);
    deleteCardSet(IDIOM.id);
    expect(readIds()).toEqual([NEWS.id, SHORT.id]);
  });

  it("없는 id면 그대로 둔다", () => {
    saveCardSet(SHORT);
    deleteCardSet("unknown");
    expect(readIds()).toEqual([SHORT.id]);
  });
});

describe("parseCardSets", () => {
  it("형식이 깨진 세트는 빼고 읽는다", () => {
    expect(parseCardSets(JSON.stringify([{ id: "broken" }, SHORT]))).toEqual([SHORT]);
  });
});
