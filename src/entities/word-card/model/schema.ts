import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/entities/word-card/model/constants";
import type { CardSet, PartOfSpeech, WordCard } from "@/entities/word-card/model/types";
import type { GeneratedCard, GenerateCardsInput } from "@/ai/types";

export const partOfSpeechSchema = z.enum([
  "명사",
  "동사",
  "형용사",
  "부사",
  "숙어",
  "기타",
]) satisfies z.ZodType<PartOfSpeech>;

// 설명(describe)은 AI에 보내는 JSON 스키마에 그대로 들어간다
// level은 아직 쓰지 않는 필드라, AI 응답 스키마에는 넣지 않고 저장용 스키마에서만 허용한다
export const generatedCardSchema = z.object({
  word: z.string().min(1).describe("원문에 등장한 형태"),
  lemma: z.string().min(1).describe("사전 기본형"),
  meaning: z.string().min(1).describe("문맥상 한국어 뜻"),
  partOfSpeech: partOfSpeechSchema,
  context: z.string().min(1).describe("원문 문장 그대로"),
  example: z.string().min(1).describe("새 예문"),
  exampleTranslation: z.string().min(1).describe("예문 번역"),
}) satisfies z.ZodType<GeneratedCard>;

export const cardResponseSchema = z.object({
  cards: z.array(generatedCardSchema),
});

export const wordCardSchema = generatedCardSchema.extend({
  id: z.string().min(1),
  level: z.string().optional(),
}) satisfies z.ZodType<WordCard>;

export const cardSetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(1),
  sourceText: z.string().min(1),
  cards: z.array(wordCardSchema),
  isDemo: z.boolean(),
  createdAt: z.iso.datetime(),
}) satisfies z.ZodType<CardSet>;

export const cardsApiSuccessSchema = cardResponseSchema.extend({
  provider: z.enum(["mock", "gemini"]),
});

export const cardsApiErrorSchema = z.object({
  error: z.object({ message: z.string().min(1) }),
});

// 글자 수 초과는 별도 에러 코드(TEXT_TOO_LONG)로 응답해야 해서 여기서는 검사하지 않는다
export const generateCardsRequestSchema = z.object({
  text: z.string().trim().min(1),
  language: z.enum(SUPPORTED_LANGUAGES),
}) satisfies z.ZodType<GenerateCardsInput>;
