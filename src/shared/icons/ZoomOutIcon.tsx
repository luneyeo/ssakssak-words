import { cn } from "@/shared/lib/cn";

type ZoomOutIconProps = {
  className?: string;
};

export function ZoomOutIcon({ className }: ZoomOutIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}
