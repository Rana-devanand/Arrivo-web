import type { Fact } from "@/config/content";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export function FactStrip({ label, facts }: { label: string; facts: readonly Fact[] }) {
  return (
    <section aria-label={label} className="bg-background pb-6 pt-4 sm:pb-10">
      <Container>
        <ul className="grid gap-4 md:grid-cols-3">
          {facts.map((fact, index) => (
            <li
              key={fact.title}
              className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground transition-shadow hover:shadow-md"
            >
              <span className="relative inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon name={fact.icon} className="size-8" />
                <span className="absolute -inset-1.5 rounded-[1.25rem] border border-border" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-bold">{fact.title}</p>
                <p className="mt-1 text-muted-foreground">{fact.text}</p>
              </div>
              <span
                aria-hidden="true"
                className="absolute right-4 top-2 text-6xl font-black text-secondary transition-colors group-hover:text-border"
              >
                {index + 1}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
