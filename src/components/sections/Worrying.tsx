import { withArrivo, withoutArrivo } from "@/config/content";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CalmIllustration, WorryIllustration } from "@/components/ui/Illustrations";
import { TickList } from "@/components/ui/TickList";

export function Worrying() {
  return (
    <section id="why" aria-labelledby="why-title" className="bg-muted py-16 sm:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Heading level={2} id="why-title">
            Worrying should not be part of the journey
          </Heading>
          <p className="mt-4 text-lg text-muted-foreground">
            Most of us still rely on texts and phone calls to know someone got home. Arrivo replaces the guessing with something calm and clear.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border-2 border-dashed border-border bg-card p-8 text-card-foreground sm:p-10">
            <div className="text-muted-foreground">
              <WorryIllustration />
            </div>
            <Heading level={3} className="mt-6 text-2xl!">
              Without Arrivo
            </Heading>
            <div className="mt-6">
              <TickList items={withoutArrivo} variant="bad" />
            </div>
          </article>
          <article className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg sm:p-10">
            <div className="text-primary-foreground">
              <CalmIllustration />
            </div>
            <Heading level={3} className="mt-6 text-2xl! text-primary-foreground">
              With Arrivo
            </Heading>
            <div className="mt-6">
              <TickList items={withArrivo} variant="good" />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
