import type { ReactNode } from "react";
import { AppScreen, type ScreenVariant } from "@/components/ui/AppScreen";
import { CheckList } from "@/components/ui/CheckList";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Icon, type IconName } from "@/components/ui/Icon";

type FeatureRowProps = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  points?: readonly string[];
  screen: ScreenVariant;
  reverse?: boolean;
  tone?: "default" | "muted";
  children?: ReactNode;
};

export function FeatureRow({ id, icon, title, text, points, screen, reverse = false, tone = "default", children }: FeatureRowProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-14 [contain-intrinsic-size:auto_700px] [content-visibility:auto] sm:py-20 ${tone === "muted" ? "bg-muted" : "bg-background"}`}>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : ""}>
          <span className="mb-4 inline-flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icon name={icon} className="size-6" />
          </span>
          <Heading level={2} id={`${id}-title`}>
            {title}
          </Heading>
          <p className="mt-4 text-lg text-muted-foreground">{text}</p>
          {points ? (
            <div className="mt-6">
              <CheckList items={points} />
            </div>
          ) : null}
          {children}
        </div>
        <div className={`flex justify-center ${reverse ? "lg:order-1" : ""}`}>
          <AppScreen variant={screen} />
        </div>
      </Container>
    </section>
  );
}
