import type { WordCard } from "@/features/word-card/types";

export type GenerateCardsInput = { text: string; language: string };

export type GeneratedCard = Omit<WordCard, "id">;

export type WordCardProvider = {
  name: "mock" | "gemini";
  generateCards(input: GenerateCardsInput): Promise<GeneratedCard[]>;
};
