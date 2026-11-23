import type { ComponentProps } from "react";

import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "chip";
};

// primary 위의 흰 글씨는 이 크기에서 대비 기준(AA)에 못 미쳐 primary-strong을 배경으로 쓴다
const VARIANT_CLASSES = {
  primary:
    "rounded-control bg-primary-strong text-surface px-6 py-3 font-bold shadow-sm not-disabled:hover:shadow-md",
  chip: "border-border bg-surface text-primary-strong hover:bg-primary-soft rounded-full border px-4 py-2 text-sm",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50",
        FOCUS_RING,
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
