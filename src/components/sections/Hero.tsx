import { heroSlides } from "@/config/content";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { HeroSlider } from "./HeroSlider";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-background py-4 sm:py-6">
      <Container className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-4 rounded-2xl bg-card p-6 text-card-foreground sm:p-8">
          <Heading level={1} id="hero-title" className="sm:text-4xl lg:text-5xl font-extrabold capitalize">
            {siteConfig.tagline}
          </Heading>
          <p className="text-base text-muted-foreground sm:text-sm">
            Arrivo lets you share a journey and your live location with the people you trust. They know when you set off, can follow you on a map, and are told the moment you arrive safely. If you run late, Arrivo checks on you first before it alerts anyone.
          </p>
          <StoreButtons size="sm" />
        </div>
        <HeroSlider slides={heroSlides} />
      </Container>
    </section>
  );
}
