import type { ReactNode } from "react";
import Link from "next/link";

type TextLinkProps = {
  href: string;
  children: ReactNode;
};

export function TextLink({ href, children }: TextLinkProps) {
  return (
    <Link href={href} className={"text-primary-strong rounded-sm text-sm hover:underline"}>
      {children}
    </Link>
  );
}
