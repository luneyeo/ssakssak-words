import { CardGenerator } from "@/widgets/card-generator/ui/CardGenerator";
import { HomeHero } from "@/widgets/home-hero/ui/HomeHero";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

export function HomePage() {
  return (
    <>
      <SiteHeader page="main" />
      <HomeHero />
      <CardGenerator />
    </>
  );
}
