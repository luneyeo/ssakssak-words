import { CardGenerator } from "@/widgets/card-generator/ui/CardGenerator";
import { HomeHero } from "@/widgets/home-hero/ui/HomeHero";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

export function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-7 pb-24">
      <SiteHeader />
      <HomeHero />
      <CardGenerator />
    </main>
  );
}
