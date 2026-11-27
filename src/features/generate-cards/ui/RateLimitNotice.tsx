import { CalendarIcon, SparkleIcon } from "@/shared/icons";
import { Button } from "@/shared/ui/Button";
import { StatusNotice } from "@/shared/ui/StatusNotice";

type RateLimitNoticeProps = {
  onShowDemo: () => void;
};

export function RateLimitNotice({ onShowDemo }: RateLimitNoticeProps) {
  return (
    <StatusNotice
      icon={<CalendarIcon className="size-6.5" />}
      title="오늘 담을 수 있는 양을 다 썼어요"
      action={
        <Button onClick={onShowDemo}>
          <SparkleIcon className="size-4" />
          예시 글로 체험하기
        </Button>
      }
    >
      하루에 담을 수 있는 양이 정해져 있어요. 내일 다시 담을 수 있고, 그동안은 미리 만든 예시 글로
      체험해 볼 수 있어요.
    </StatusNotice>
  );
}
