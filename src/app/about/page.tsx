import type { Metadata } from "next";
import { aboutGlance, aboutStats, values } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { SplitWords } from "@/components/ui/SplitWords";
import { StatementWords } from "@/components/ui/StatementWords";
import { FinalCta } from "@/components/sections/FinalCta";
import { LayerStack } from "@/components/sections/LayerStack";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "About us",
  description:
    "Arrivo means arrival. Learn why we built a calm, honest travel-safety app, what we believe about privacy and consent, and the principles behind every screen.",
  path: "/about",
});

const direction = [
  { title: "Vision", text: "A world where nobody has to wonder whether someone got home." },
  { title: "Mission", text: "To make sharing a journey calm, honest and private." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Because the best part of a journey is arriving"
        intro="Arrivo started with a simple wish: that the people who worry about us could know we are okay, without us having to keep texting."
        visual={<LayerStack />}
      />

      <section aria-label="Arrivo in numbers" className="pb-16 sm:pb-24">
        <Container>
          <ul className="grid gap-6 md:grid-cols-3">
            {aboutStats.map((stat, index) => (
              <li key={stat.label}>
                <FadeIn delay={index * 100} className="h-full">
                  <div className="h-full rounded-[26px] bg-background p-6 shadow-soft sm:p-8">
                    <p className="font-heading text-6xl font-bold tracking-tight text-highlight sm:text-7xl">
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </p>
                    <h3 className="mt-3 text-lg font-bold">{stat.label}</h3>
                    <p className="mt-1 text-[15px] text-muted-foreground">{stat.text}</p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="story-title" className="pb-16 sm:pb-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <Heading level={2} id="story-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <SplitWords text="Why we built it" />
            </Heading>
            <FadeIn delay={150}>
              <p className="mt-5 text-lg text-muted-foreground">
                Travelling alone, getting home late, taking a cab in a new city: these are everyday moments that quietly worry the people who love us. Existing options were either too alarming or too invasive.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Arrivo is the calm middle. You choose who knows, they follow only while you travel, and everyone hears the good news the moment you arrive. [PLACEHOLDER: add the founder story and team.]
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={250}>
            <Card as="aside">
              <Heading level={3} className="text-xl">
                What the name means
              </Heading>
              <p className="mt-2 text-muted-foreground">
                {siteConfig.name} comes from the Italian <em>arrivo</em> and Spanish <em>arribo</em>, meaning arrival. It names the moment your contacts care about most.
              </p>
            </Card>
          </FadeIn>
        </Container>
      </section>

      <section aria-labelledby="belief-title" className="py-8 sm:py-12">
        <Container>
          <div className="rounded-[32px] bg-primary px-6 py-14 text-primary-foreground shadow-raise sm:px-12 sm:py-20">
            <h2 id="belief-title" className="font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-spot">
              What we believe
            </h2>
            <div className="mt-6 max-w-4xl">
              <StatementWords
                text="We believe the people who worry about us should be able to relax, and the people who travel should stay in control. So Arrivo shares only what is needed, only while you travel, and only with the people you choose."
                highlight={["relax", "control", "only"]}
              />
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Vision and mission" className="py-16 sm:py-24">
        <Container className="grid gap-6 md:grid-cols-2">
          {direction.map((item, index) => (
            <FadeIn key={item.title} delay={index * 120} className="h-full">
              <div className="flex h-full items-start gap-5 rounded-[26px] bg-background p-6 shadow-soft sm:p-8">
                <span aria-hidden="true" className="mt-2 size-3 shrink-0 rounded-full bg-highlight shadow-[14px_0_0_-1px_var(--spot)]" />
                <div className="pl-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </Container>
      </section>

      <Section id="values" eyebrow="How we work" title="Four principles behind everything we build">
        <ol className="grid gap-6">
          {values.map((value, index) => (
            <li key={value.title} className="sticky" style={{ top: `${6.5 + index * 1.25}rem` }}>
              <div className="grid items-center gap-6 rounded-[28px] bg-background p-6 shadow-raise sm:grid-cols-[1fr_auto] sm:p-10">
                <div>
                  <span className="font-mono text-sm text-highlight">
                    {String(index + 1).padStart(2, "0")} / {String(values.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{value.title}</h3>
                  <p className="mt-3 max-w-xl text-lg text-muted-foreground">{value.text}</p>
                </div>
                <AnimatedIcon name={value.icon} className="size-20 text-highlight sm:size-28" />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="glance" eyebrow="Arrivo at a glance" title="The short version.">
        <FadeIn>
          <dl className="grid overflow-hidden rounded-[28px] bg-background shadow-raise sm:grid-cols-2">
            {aboutGlance.map((row) => (
              <div key={row.label} className="grid gap-1 border-b border-foreground/10 px-6 py-5 sm:odd:border-r">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{row.label}</dt>
                <dd className="font-semibold text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </Section>

      <FinalCta title="Join us on the journey" />
    </>
  );
}
