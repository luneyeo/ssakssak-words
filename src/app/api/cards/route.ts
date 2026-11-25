import { MAX_TEXT_LENGTH } from "@/features/word-card/constants";
import { generateCardsRequestSchema } from "@/features/word-card/schema";
import { getWordCardProvider } from "@/lib/ai";
import { CardGenerationError, ERROR_DETAILS } from "@/lib/ai/errors";
import type { ErrorCode } from "@/lib/ai/errors";

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => null);
  const parsed = generateCardsRequestSchema.safeParse(body);

  if (!parsed.success) return errorResponse("INVALID_INPUT");
  if (parsed.data.text.length > MAX_TEXT_LENGTH) return errorResponse("TEXT_TOO_LONG");

  const startedAt = Date.now();

  try {
    const provider = getWordCardProvider();
    const cards = await provider.generateCards(parsed.data);
    // 어느 제공자가 응답했는지 서버 콘솔에서 확인할 수 있게 하되, 원문은 남기지 않는다
    console.info(
      `[api/cards] ${provider.name} 카드 ${cards.length}개 생성 (${Date.now() - startedAt}ms)`,
    );
    return Response.json({ cards, provider: provider.name });
  } catch (error) {
    const code = error instanceof CardGenerationError ? error.code : "AI_ERROR";
    // 에러 메시지에 사용자 원문이나 키가 섞일 수 있어 종류만 남긴다
    console.error("[api/cards] 카드 생성 실패", code, error instanceof Error ? error.name : "");
    return errorResponse(code);
  }
}

function errorResponse(code: ErrorCode): Response {
  const { status, message } = ERROR_DETAILS[code];
  return Response.json({ error: { code, message } }, { status });
}
