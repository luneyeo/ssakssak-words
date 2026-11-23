import type { ComponentProps } from "react";

import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "rounded-control border-border bg-surface placeholder:text-text-muted w-full border p-4 shadow-sm",
        FOCUS_RING,
        className,
      )}
      {...props}
    />
  );
}
