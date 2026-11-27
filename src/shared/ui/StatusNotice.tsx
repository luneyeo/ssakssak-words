import { useId } from "react";
import type { ReactNode } from "react";

type StatusNoticeProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export function StatusNotice({ icon, title, children, action }: StatusNoticeProps) {
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
        {icon}
      </span>
      <div className="min-w-0 flex-[1_1_280px]">
        <h2 id={titleId} className="text-[19px] font-extrabold tracking-tight">
          {title}
        </h2>
        <p className="text-warning-strong mt-1.5 text-sm leading-[1.7]">{children}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </section>
  );
}
