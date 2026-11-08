import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { SplitWords } from "./SplitWords";

type SectionProps = {
  id: string;
  title: string;
  /** A short label above the heading. Skipped on dark sections. */
  eyebrow?: string;
  intro?: ReactNode;
  /** Something on the right of the heading, such as a control. The intro then sits under the heading instead. */
  aside?: ReactNode;
  tone?: "default" | "muted" | "inverse";
  children: ReactNode;
};

const tones = {
  default: "text-foreground",
  muted: "text-foreground",
  inverse: "bg-primary text-primary-foreground",
} as const;

export function Section({ id, title, eyebrow, intro, aside, tone = "default", children }: SectionProps) {
  const titleId = `${id}-title`;
  const inverse = tone === "inverse";
  const heading = (
    <Heading level={2} id={titleId} className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${inverse ? "text-primary-foreground" : ""}`}>
      <SplitWords text={title} />
    </Heading>
  );
  const introText = intro ? <p className={inverse ? "text-primary-foreground" : "text-muted-foreground"}>{intro}</p> : null;
  return (
    <section id={id} aria-labelledby={titleId} className={`py-16 [contain-intrinsic-size:auto_700px] [content-visibility:auto] sm:py-24 ${tones[tone]}`}>
      <Container>
        <div className="mb-12 grid items-end gap-x-16 gap-y-6 lg:mb-16 lg:grid-cols-[1fr_0.8fr]">
          {eyebrow && !inverse ? (
            <div className="lg:col-span-full">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          ) : null}
          {aside ? (
            <>
              <div className="grid gap-4">
                {heading}
                {introText}
              </div>
              <div className="lg:justify-self-end">{aside}</div>
            </>
          ) : (
            <>
              {heading}
              {introText}
            </>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
