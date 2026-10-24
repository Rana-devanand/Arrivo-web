import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { SplitWords } from "@/components/ui/SplitWords";

type FaqSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Buttons under the intro. */
  actions?: ReactNode;
  children: ReactNode;
};

/** Heading and buttons on the left (they stay in view while you read), the answers on the right. */
export function FaqSection({ id, eyebrow, title, intro, actions, children }: FaqSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <Container className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="grid gap-5 lg:sticky lg:top-32">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading level={2} id={`${id}-title`} className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <SplitWords text={title} />
          </Heading>
          {intro ? <p className="text-muted-foreground">{intro}</p> : null}
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
