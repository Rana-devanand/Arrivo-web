import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  items?: readonly string[];
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Heading level={1}>{title}</Heading>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
        <p className="mt-6 text-lg text-muted-foreground">{intro}</p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <Heading level={2} className="text-2xl sm:text-2xl">
              {section.heading}
            </Heading>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </Container>
    </article>
  );
}
