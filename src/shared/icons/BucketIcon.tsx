import { cn } from "@/shared/lib/cn";

type BucketIconProps = {
  className?: string;
};

export function BucketIcon({ className }: BucketIconProps) {
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
      <path d="M4 7h16" />
      <path d="M6 7l1.2 12.2A2 2 0 0 0 9.2 21h5.6a2 2 0 0 0 2-1.8L18 7" />
      <path d="M9 11l1.5 6" />
      <path d="M15 11l-1.5 6" />
      <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
    </svg>
  );
}
