import { z } from "zod";

import { parseStoredList, readStorage, subscribeStorage, writeStorage } from "@/shared/lib/storage";

const KEY = "test-key";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("readStorage, writeStorage", () => {
  it("쓴 값을 JSON 문자열로 다시 읽는다", () => {
    expect(writeStorage(KEY, ["단어"])).toBe(true);
    expect(readStorage(KEY)).toBe('["단어"]');
  });

  it("저장한 적이 없으면 null을 돌려준다", () => {
    expect(readStorage(KEY)).toBeNull();
  });

  it("저장소를 읽을 수 없으면 null을 돌려준다", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    expect(readStorage(KEY)).toBeNull();
  });

  it("저장 공간이 부족하면 false를 돌려주고 구독자에게 알리지 않는다", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeStorage(listener);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });

    expect(writeStorage(KEY, [])).toBe(false);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });
});

describe("subscribeStorage", () => {
  it("같은 탭과 다른 탭의 변경을 알리고, 해지하면 알리지 않는다", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeStorage(listener);

    writeStorage(KEY, []);
    expect(listener).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    writeStorage(KEY, []);
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe("parseStoredList", () => {
  it.each([
    ["저장한 적 없음", null],
    ["깨진 JSON", "{"],
    ["배열이 아닌 값", '{"a":1}'],
  ])("%s이면 빈 배열을 돌려준다", (_, raw) => {
    expect(parseStoredList(raw, z.string())).toEqual([]);
  });

  it("검증에 실패한 항목만 뺀다", () => {
    expect(parseStoredList('["a", 1, "b", null]', z.string())).toEqual(["a", "b"]);
  });
});
