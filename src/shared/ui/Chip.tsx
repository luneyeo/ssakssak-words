import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type ChipProps = {
  children: ReactNode;
  variant?: "default" | "inverse";
};

const VARIANT_CLASSES = {
  default: "bg-primary-soft text-primary-strong",
  inverse: "bg-surface/15 text-surface",
};

export function Chip({ children, variant = "default" }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-xs font-bold",
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
    </span>
  );
}
