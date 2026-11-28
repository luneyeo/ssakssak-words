import { useId } from "react";

import { RetryIcon, WifiOffIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/Button";

type RequestErrorNoticeProps = {
  onRetry: () => void;
};

export function RequestErrorNotice({ onRetry }: RequestErrorNoticeProps) {
  const titleId = useId();

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      className="bg-warning-soft border-warning/25 flex flex-wrap items-start gap-4.5 rounded-3xl border p-7"
    >
      <span
        aria-hidden="true"
        className="bg-warning/15 text-warning flex size-13 shrink-0 items-center justify-center rounded-2xl"
      >
        <WifiOffIcon className="size-6.5" />
      </span>
      <div className="min-w-0 flex-[1_1_280px]">
        <h2 id={titleId} className="text-[19px] font-extrabold tracking-tight">
          요청을 보내지 못했어요
        </h2>
        <p className="text-warning-strong mt-1.5 text-sm leading-[1.7]">
          인터넷 연결이 끊겼거나 응답이 너무 늦어요. 연결을 확인한 뒤 다시 시도해 주세요. 입력한
          글은 그대로 남아 있어요.
        </p>
        <Button className="mt-4" onClick={onRetry}>
          <RetryIcon className="size-4" />
          다시 시도
        </Button>
      </div>
    </section>
  );
}
