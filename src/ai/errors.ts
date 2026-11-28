export type ErrorCode =
  | "INVALID_INPUT"
  | "TEXT_TOO_LONG"
  | "RATE_LIMITED"
  | "TOO_MANY_REQUESTS"
  | "AI_ERROR"
  | "PARSE_ERROR";

type ErrorDetail = { status: number; message: string };

const GENERATION_FAILED_MESSAGE = "앗, 단어를 담지 못했어요. 잠시 후 다시 시도해 주세요";

export const ERROR_DETAILS: Record<ErrorCode, ErrorDetail> = {
  INVALID_INPUT: { status: 400, message: "글을 입력하고 언어를 선택해 주세요" },
  TEXT_TOO_LONG: { status: 413, message: "글이 너무 길어요. 3,000자까지 담을 수 있어요" },
  RATE_LIMITED: {
    status: 429,
    message: "오늘 담을 수 있는 양을 다 썼어요. 예시 글로 체험해 보세요!",
  },
  TOO_MANY_REQUESTS: {
    status: 503,
    message: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요",
  },
  AI_ERROR: { status: 502, message: GENERATION_FAILED_MESSAGE },
  PARSE_ERROR: { status: 502, message: GENERATION_FAILED_MESSAGE },
};

export function isErrorCode(value: string): value is ErrorCode {
  return Object.hasOwn(ERROR_DETAILS, value);
}

export class CardGenerationError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode) {
    super(ERROR_DETAILS[code].message);
    this.name = "CardGenerationError";
    this.code = code;
  }
}
