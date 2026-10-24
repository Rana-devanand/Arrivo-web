import { withArrivo, withoutArrivo, worryingHead } from "@/config/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";

/** Each row sets one everyday worry next to what Arrivo does about it, in one soft raised card. */
export function Worrying() {
  return (
    <Section id="why" eyebrow={worryingHead.eyebrow} title={worryingHead.title} intro={worryingHead.intro}>
      <FadeIn>
        <dl className="grid overflow-hidden rounded-[28px] bg-background shadow-raise sm:grid-cols-2">
          {withoutArrivo.flatMap((worry, index) => [
            <div key={`without-${index}`} className="grid gap-1 border-b border-foreground/10 px-6 py-5 sm:border-r">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Without Arrivo</dt>
              <dd className="font-semibold text-muted-foreground">{worry}</dd>
            </div>,
            <div key={`with-${index}`} className="grid gap-1 border-b border-foreground/10 px-6 py-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-highlight">With Arrivo</dt>
              <dd className="font-semibold text-foreground">{withArrivo[index]}</dd>
            </div>,
          ])}
        </dl>
      </FadeIn>
    </Section>
  );
}
