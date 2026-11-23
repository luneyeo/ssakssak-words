import type { ComponentProps } from "react";

import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "rounded-control border-border bg-surface border px-4 py-3 shadow-sm",
        FOCUS_RING,
        className,
      )}
      {...props}
    />
  );
}
