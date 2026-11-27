import Link from "next/link";

import { BucketIcon } from "@/shared/icons";
import { SavedWordsLink } from "@/widgets/site-header/ui/SavedWordsLink";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className={"rounded-control flex items-center gap-2.5"}>
        <span
          aria-hidden="true"
          className="bg-primary text-surface flex size-9 items-center justify-center rounded-[11px]"
        >
          <BucketIcon className="size-5" />
        </span>
        <span className="text-xl font-extrabold tracking-tight">싹싹단어</span>
      </Link>
      <SavedWordsLink />
    </header>
  );
}
