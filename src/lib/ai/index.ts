import "server-only";

import { mockProvider } from "@/lib/ai/providers/mock";
import type { WordCardProvider } from "@/lib/ai/types";

const PROVIDERS = new Map<string, WordCardProvider>([[mockProvider.name, mockProvider]]);

export function getWordCardProvider(): WordCardProvider {
  // 설정이 없거나 잘못되어도 키 없이 앱 전체가 실행되어야 하므로 mock으로 대신한다
  return PROVIDERS.get(process.env.AI_PROVIDER ?? "") ?? mockProvider;
}
