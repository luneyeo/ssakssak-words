import type { WordCard } from "@/entities/word-card/model/types";

export type GenerateCardsInput = { text: string; language: string };

export type GeneratedCard = Omit<WordCard, "id">;

export type WordCardProvider = {
  name: "mock" | "gemini";
  generateCards(input: GenerateCardsInput): Promise<GeneratedCard[]>;
};
