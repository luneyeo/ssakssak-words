import type { ComponentProps } from "react";

import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        className={cn(
          "rounded-control border-border bg-surface w-full appearance-none border py-3 pr-11 pl-4 shadow-sm",
          FOCUS_RING,
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="text-text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}
