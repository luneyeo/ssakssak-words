export type PartOfSpeech = "명사" | "동사" | "형용사" | "부사" | "숙어" | "기타";

export type WordCard = {
  id: string;
  word: string;
  lemma: string;
  meaning: string;
  partOfSpeech: PartOfSpeech;
  context: string;
  example: string;
  exampleTranslation: string;
  level?: string;
};

export type CardSet = {
  id: string;
  title: string;
  language: string;
  sourceText: string;
  cards: WordCard[];
  isDemo: boolean;
  createdAt: string;
};
