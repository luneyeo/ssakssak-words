import { ClockIcon, RetryIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/Button";
import { StatusNotice } from "@/shared/ui/StatusNotice";

type BusyNoticeProps = {
  onRetry: () => void;
};

export function BusyNotice({ onRetry }: BusyNoticeProps) {
  return (
    <StatusNotice
      icon={<ClockIcon className="size-6.5" />}
      title="요청이 너무 많아요"
      action={
        <Button onClick={onRetry}>
          <RetryIcon className="size-4" />
          다시 시도
        </Button>
      }
    >
      지금 단어를 담으려는 사람이 많아요. 잠시 후 다시 시도해 주세요. 입력한 글은 그대로 남아
      있어요.
    </StatusNotice>
  );
}
