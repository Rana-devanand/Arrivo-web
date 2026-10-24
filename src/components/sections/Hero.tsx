import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { heroHeadline, heroShapes } from "@/config/content";
import { HeroDiagram } from "./HeroDiagram";
import { HeroShapeProvider } from "./HeroShapeProvider";
import { HeroTitle } from "./HeroTitle";
// import { heroSlides } from "@/config/content";
// import { HeroSlider } from "./HeroSlider";

/** Starts under the floating navbar so the dots can drift behind it. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-22 flex min-h-svh items-center overflow-hidden pb-[22rem] pt-32 sm:pb-[26rem] lg:pb-0 lg:pt-22">
      <HeroShapeProvider shapes={heroShapes}>
        <HeroDiagram />
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5 text-foreground">
            <HeroTitle tagline={siteConfig.tagline} before={heroHeadline.before} after={heroHeadline.after} />
            <p className="max-w-xl text-base text-muted-foreground sm:text-sm">
              Arrivo lets you share a journey and your live location with the people you trust. They know when you set off, can follow you on a map, and are told the moment you arrive safely. If you run late, Arrivo checks on you first before it alerts anyone.
            </p>
            <StoreButtons size="sm" />
          </div>
        </Container>
      </HeroShapeProvider>
    </section>
  );
}
