import type { z } from "zod";

const listeners = new Set<() => void>();

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // 브라우저 설정으로 저장소가 막혀 있어도 나머지 기능은 쓸 수 있어야 한다
    return null;
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }

  // storage 이벤트는 값을 바꾼 탭에는 오지 않으므로 같은 탭의 구독자에게 직접 알린다
  listeners.forEach((listener) => listener());
  return true;
}

export function subscribeStorage(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function parseStoredList<T>(raw: string | null, itemSchema: z.ZodType<T>): T[] {
  const value = parseJson(raw);
  if (!Array.isArray(value)) return [];

  // 항목 하나가 깨졌다고 나머지까지 잃지 않도록 하나씩 검증한다
  return value.flatMap((item: unknown) => {
    const result = itemSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });
}

function parseJson(raw: string | null): unknown {
  if (raw === null) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
