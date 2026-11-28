import { SavedCardSets } from "@/widgets/saved-card-sets/ui/SavedCardSets";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

export function CardsPage() {
  return (
    <>
      <SiteHeader page="cards" />
      <SavedCardSets />
    </>
  );
}
