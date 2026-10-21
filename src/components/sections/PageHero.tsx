import type { ReactNode } from "react";
import { AppScreen, type ScreenVariant } from "@/components/ui/AppScreen";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  screen?: ScreenVariant;
  tone?: "default" | "muted";
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, screen, tone = "default", children }: PageHeroProps) {
  const split = screen !== undefined;
  return (
    <section aria-labelledby="page-title" className={`py-16 sm:py-20 ${tone === "muted" ? "bg-muted" : "bg-background"}`}>
      <Container className={split ? "grid items-center gap-12 lg:grid-cols-2" : ""}>
        <div className={`flex flex-col gap-5 ${split ? "items-start" : "mx-auto max-w-3xl items-center text-center"}`}>
          <Badge>{eyebrow}</Badge>
          <Heading level={1} id="page-title">
            {title}
          </Heading>
          <p className="max-w-xl text-lg text-muted-foreground">{intro}</p>
          {children}
        </div>
        {split ? (
          <div className="flex justify-center">
            <AppScreen variant={screen} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
