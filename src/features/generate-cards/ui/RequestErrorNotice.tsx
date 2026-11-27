import { RetryIcon, WifiOffIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/Button";
import { StatusNotice } from "@/shared/ui/StatusNotice";

type RequestErrorNoticeProps = {
  onRetry: () => void;
};

export function RequestErrorNotice({ onRetry }: RequestErrorNoticeProps) {
  return (
    <StatusNotice
      icon={<WifiOffIcon className="size-6.5" />}
      title="요청을 보내지 못했어요"
      action={
        <Button onClick={onRetry}>
          <RetryIcon className="size-4" />
          다시 시도
        </Button>
      }
    >
      인터넷 연결이 끊겼거나 응답이 너무 늦어요. 연결을 확인한 뒤 다시 시도해 주세요. 입력한 글은
      그대로 남아 있어요.
    </StatusNotice>
  );
}
