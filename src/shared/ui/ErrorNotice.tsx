import type { ReactNode } from "react";

import { AlertCircleIcon } from "@/shared/icons";

type ErrorNoticeProps = {
  children: ReactNode;
};

export function ErrorNotice({ children }: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="rounded-control border-danger/30 bg-danger/5 text-danger flex w-full items-start gap-3 border px-4 py-3"
    >
      {/* 문구가 여러 줄이 되어도 아이콘이 첫 줄에 맞도록 높이를 행간(1.6em)에 맞춘다 */}
      <AlertCircleIcon className="h-[1.6em] w-5" />
      <p>{children}</p>
    </div>
  );
}
