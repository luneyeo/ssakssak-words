import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "outline" | "chip";
};

const VARIANT_CLASSES = {
  primary:
    "rounded-control bg-primary text-surface not-disabled:hover:bg-primary-strong inline-flex min-h-12 items-center justify-center gap-2 px-5 font-bold shadow-sm not-disabled:hover:shadow-md",
  outline:
    "rounded-control border-primary/25 bg-surface text-primary hover:border-primary/40 hover:bg-primary-soft/50 hover:text-primary-strong min-h-11 border px-4.5 text-sm font-bold",
  chip: "border-border bg-surface text-primary-strong hover:border-primary/40 hover:bg-primary-soft/50 min-h-9 rounded-full border px-3 text-sm font-medium",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
