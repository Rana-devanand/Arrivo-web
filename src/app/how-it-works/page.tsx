import type { Metadata } from "next";
import { contactSees, escalation, journeySteps } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "See how Arrivo works in six steps: invite trusted contacts, plan your trip, share your journey live, and let everyone know the moment you arrive safely.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="From setting off to arriving safely"
        intro="Six simple steps. Your first trip takes a couple of minutes, because you also build your circle. Repeat trips take a tap."
        screen="setup"
        tone="muted"
      />
      <Section id="steps" title="The journey, step by step" intro="What you do, and what Arrivo does for you." align="left">
        <Timeline steps={journeySteps} />
      </Section>
      <FeatureRow
        id="contacts-side"
        icon="eye"
        title="Meanwhile, your contacts see"
        text="They are told when you set off and can follow along. When you arrive, they are told you are safe. Everything below is read-only."
        points={contactSees.map((item) => `${item.title}: ${item.text}`)}
        screen="watch"
        reverse
        tone="muted"
      />
      <Section id="running-late" title="And if you run late" intro="Arrivo checks on you first, then your contacts." tone="inverse">
        <ol className="grid gap-6 md:grid-cols-3">
          {escalation.rows.slice(0, 3).map((row, index) => (
            <li key={row.cells[0]}>
              <Card as="article" className="h-full">
                <span className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <Heading level={3}>{row.cells[1]}</Heading>
                <p className="mt-2 text-muted-foreground">Trigger: {row.cells[0].toLowerCase()}. Told: {row.cells[2].toLowerCase()}.</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>
      <FinalCta title="Ready for your first journey?" />
    </>
  );
}
