import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
};

export function Chip({ children }: ChipProps) {
  return (
    <span className="bg-primary-soft text-primary-strong inline-block rounded-full px-3 py-1 text-sm">
      {children}
    </span>
  );
}
