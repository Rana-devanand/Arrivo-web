import type { ReactNode } from "react";
import { Container } from "./Container";
import { Heading } from "./Heading";

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  tone?: "default" | "muted" | "inverse";
  align?: "center" | "left";
  children: ReactNode;
};

const tones = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  inverse: "bg-primary text-primary-foreground",
} as const;

export function Section({ id, title, intro, tone = "default", align = "center", children }: SectionProps) {
  const titleId = `${id}-title`;
  const inverse = tone === "inverse";
  return (
    <section id={id} aria-labelledby={titleId} className={`py-16 [contain-intrinsic-size:auto_700px] [content-visibility:auto] sm:py-24 ${tones[tone]}`}>
      <Container>
        <div className={`mb-12 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
          <Heading level={2} id={titleId} className={inverse ? "text-primary-foreground" : ""}>
            {title}
          </Heading>
          {intro ? (
            <p className={`mt-4 text-lg ${inverse ? "text-primary-foreground" : "text-muted-foreground"}`}>{intro}</p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
