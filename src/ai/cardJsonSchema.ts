import { z } from "zod";

import { cardResponseSchema } from "@/entities/word-card/model/schema";

// zod 스키마에서 만들어 두 스키마가 어긋나지 않게 한다
export const CARD_RESPONSE_JSON_SCHEMA = createResponseJsonSchema();

function createResponseJsonSchema(): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(cardResponseSchema, {
    // AI가 강제하지 않는 조건이라 보내지 않고, 응답을 받은 뒤 zod로 검증한다
    override: ({ jsonSchema: node }) => {
      delete node.minLength;
      delete node.additionalProperties;
    },
  });

  return Object.fromEntries(Object.entries(jsonSchema).filter(([key]) => key !== "$schema"));
}
