import "server-only";

import { DEMO_ARTICLES } from "@/features/word-card/demo/demoArticles";
import { CardGenerationError, isErrorCode } from "@/lib/ai/errors";
import { postprocessCards } from "@/lib/ai/postprocess";
import { isFunctionWord } from "@/lib/ai/providers/mockFunctionWords";
import type { GenerateCardsInput, GeneratedCard, WordCardProvider } from "@/lib/ai/types";

const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 1500;

const ERROR_TRIGGER = /^!error:([A-Z_]+)/;
const WORD_SEPARATOR = /(?:[^\p{L}\p{M}\p{N}'’-]|-{2,})+/u;
const EDGE_PUNCTUATION = /^['’-]+|['’-]+$/g;

export const mockProvider: WordCardProvider = {
  name: "mock",
  async generateCards(input) {
    await waitLikeRealAi();
    throwIfErrorRequested(input.text);

    const cards = findDemoCards(input) ?? createPlaceholderCards(input);
    return postprocessCards({ cards });
  },
};

function waitLikeRealAi(): Promise<void> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function throwIfErrorRequested(text: string): void {
  const code = ERROR_TRIGGER.exec(text.trim())?.[1];
  if (code !== undefined && isErrorCode(code)) {
    throw new CardGenerationError(code);
  }
}

function findDemoCards({ text, language }: GenerateCardsInput): GeneratedCard[] | undefined {
  return DEMO_ARTICLES.find(
    ({ cardSet }) => cardSet.sourceText === text.trim() && cardSet.language === language,
  )?.cardSet.cards;
}

function createPlaceholderCards({ text, language }: GenerateCardsInput): GeneratedCard[] {
  const cardsByKey = new Map<string, GeneratedCard>();

  for (const sentence of splitSentences(text)) {
    for (const word of splitWords(sentence)) {
      const key = word.toLowerCase();
      if (cardsByKey.has(key) || isFunctionWord(word, language)) continue;
      cardsByKey.set(key, createPlaceholderCard(word, sentence));
    }
  }

  return [...cardsByKey.values()];
}

function splitSentences(text: string): string[] {
  // 3.5 같은 소수점에서 문장이 잘리지 않도록 정규식 대신 Segmenter를 쓴다
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
  return Array.from(segmenter.segment(text), ({ segment }) => segment.trim()).filter(Boolean);
}

function splitWords(sentence: string): string[] {
  return sentence
    .split(WORD_SEPARATOR)
    .map((token) => token.replace(EDGE_PUNCTUATION, ""))
    .filter((token) => token !== "" && !/\p{N}/u.test(token));
}

function createPlaceholderCard(word: string, context: string): GeneratedCard {
  return {
    word,
    lemma: word.toLowerCase(),
    meaning: "(데모) 실제 뜻은 AI 연결 후 표시돼요",
    partOfSpeech: "기타",
    context,
    example: "(데모) 예문은 AI 연결 후 표시돼요",
    exampleTranslation: "(데모) 예문 번역은 AI 연결 후 표시돼요",
  };
}
