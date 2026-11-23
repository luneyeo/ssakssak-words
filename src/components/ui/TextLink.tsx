import type { ReactNode } from "react";
import Link from "next/link";

import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";

type TextLinkProps = {
  href: string;
  children: ReactNode;
};

export function TextLink({ href, children }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn("text-primary-strong rounded-sm text-sm hover:underline", FOCUS_RING)}
    >
      {children}
    </Link>
  );
}
