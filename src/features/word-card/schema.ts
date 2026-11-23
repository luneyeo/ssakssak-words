import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/features/word-card/constants";
import type { CardSet, PartOfSpeech, WordCard } from "@/features/word-card/types";
import type { GeneratedCard, GenerateCardsInput } from "@/lib/ai/types";

export const partOfSpeechSchema = z.enum([
  "명사",
  "동사",
  "형용사",
  "부사",
  "숙어",
  "기타",
]) satisfies z.ZodType<PartOfSpeech>;

// level은 아직 쓰지 않는 필드라, AI 응답 스키마에는 넣지 않고 저장용 스키마에서만 허용한다
export const generatedCardSchema = z.object({
  word: z.string().min(1),
  lemma: z.string().min(1),
  meaning: z.string().min(1),
  partOfSpeech: partOfSpeechSchema,
  context: z.string().min(1),
  example: z.string().min(1),
  exampleTranslation: z.string().min(1),
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

// 글자 수 초과는 별도 에러 코드(TEXT_TOO_LONG)로 응답해야 해서 여기서는 검사하지 않는다
export const generateCardsRequestSchema = z.object({
  text: z.string().trim().min(1),
  language: z.enum(SUPPORTED_LANGUAGES),
}) satisfies z.ZodType<GenerateCardsInput>;
