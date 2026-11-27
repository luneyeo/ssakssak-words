import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";
import { ChevronDownIcon } from "@/shared/icons";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        className={
          "rounded-control border-border bg-surface-soft h-10 w-full cursor-pointer appearance-none border pr-9 pl-3.5 text-sm font-semibold"
        }
        {...props}
      />
      <ChevronDownIcon className="text-text-muted pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </span>
  );
}
