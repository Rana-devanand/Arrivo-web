import type { ReactNode } from "react";
import { AppScreen, type ScreenVariant } from "@/components/ui/AppScreen";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { SplitWords } from "@/components/ui/SplitWords";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  screen?: ScreenVariant;
  /** Something other than a phone for the right-hand side, such as an illustration. */
  visual?: ReactNode;
  children?: ReactNode;
};

/** Tall page opener: the title slides in word by word, then the intro and buttons follow. */
export function PageHero({ eyebrow, title, intro, screen, visual, children }: PageHeroProps) {
  const split = screen !== undefined || visual !== undefined;
  return (
    <section aria-labelledby="page-title" className={`flex min-h-[70svh] items-center py-20 sm:py-24 ${split ? "lg:py-20" : "lg:py-32"}`}>
      <Container className={`w-full ${split ? "grid gap-12 lg:grid-cols-2 lg:items-start" : ""}`}>
        <div className={`flex flex-col gap-6 sm:gap-7 ${split ? "items-start lg:pt-12" : "mx-auto max-w-4xl items-center text-center"}`}>
          <FadeIn>
            <Eyebrow>{eyebrow}</Eyebrow>
          </FadeIn>
          <Heading level={1} id="page-title" className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            <SplitWords text={title} />
          </Heading>
          <FadeIn delay={250}>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">{intro}</p>
          </FadeIn>
          {children ? <FadeIn delay={400}>{children}</FadeIn> : null}
        </div>
        {visual ? (
          <FadeIn delay={200}>{visual}</FadeIn>
        ) : screen ? (
          <FadeIn delay={200} className="flex justify-center">
            <div className="animate-float">
              <AppScreen variant={screen} size="lg" priority />
            </div>
          </FadeIn>
        ) : null}
      </Container>
    </section>
  );
}
