import type { Screen } from "@/config/content";
import { AppScreen } from "@/components/ui/AppScreen";
import { Section } from "@/components/ui/Section";

type ShowcaseProps = {
  id?: string;
  title: string;
  intro: string;
  screens: readonly Screen[];
  tone?: "muted" | "inverse";
};

export function Showcase({ id = "screenshots", title, intro, screens, tone = "inverse" }: ShowcaseProps) {
  return (
    <Section id={id} title={title} intro={intro} tone={tone}>
      <ul className={`grid gap-10 sm:grid-cols-2 ${screens.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {screens.map((screen) => (
          <li key={screen.title}>
            <figure className="flex flex-col items-center gap-4">
              <AppScreen variant={screen.variant} />
              <figcaption className="max-w-60 text-center">
                <span className="block text-lg font-semibold">{screen.title}</span>
                <span className="block">{screen.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
