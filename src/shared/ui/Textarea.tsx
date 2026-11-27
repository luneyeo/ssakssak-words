import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "rounded-card border-border bg-surface-soft placeholder:text-text-muted block min-h-50 w-full resize-y border px-4.5 py-4 leading-[1.7]",
        className,
      )}
      {...props}
    />
  );
}
