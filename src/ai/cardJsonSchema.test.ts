import { CARD_RESPONSE_JSON_SCHEMA } from "@/ai/cardJsonSchema";

it("AI에 보낼 카드 응답 스키마를 만든다", () => {
  expect(CARD_RESPONSE_JSON_SCHEMA).toEqual({
    type: "object",
    properties: {
      cards: {
        type: "array",
        items: {
          type: "object",
          properties: {
            word: { type: "string", description: "원문에 등장한 형태" },
            lemma: { type: "string", description: "사전 기본형" },
            meaning: { type: "string", description: "문맥상 한국어 뜻" },
            partOfSpeech: {
              type: "string",
              enum: ["명사", "동사", "형용사", "부사", "숙어", "기타"],
            },
            context: { type: "string", description: "원문 문장 그대로" },
            example: { type: "string", description: "새 예문" },
            exampleTranslation: { type: "string", description: "예문 번역" },
          },
          required: [
            "word",
            "lemma",
            "meaning",
            "partOfSpeech",
            "context",
            "example",
            "exampleTranslation",
          ],
        },
      },
    },
    required: ["cards"],
  });
});
