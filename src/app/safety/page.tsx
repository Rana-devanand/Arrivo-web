import type { Metadata } from "next";
import { escalation, neverList, principles, situations, toolsList } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { CheckList } from "@/components/ui/CheckList";
import { DataTable } from "@/components/ui/DataTable";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Section } from "@/components/ui/Section";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Safety",
  description:
    "How Arrivo keeps you safe: honest connection status, a check-in when you run late, alerts to contacts, and a promise never to call emergency services for you.",
  path: "/safety",
});

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety"
        title="Safety you can understand at a glance"
        intro="Arrivo is calm by design. It tells the truth about what it knows, checks on you before it alerts anyone, and leaves decisions to you and your people."
        screen="overdue"
        tone="muted"
      />
      <Section id="principles" title="Four principles behind every screen">
        <FeatureGrid items={principles} columns={4} />
      </Section>
      <Section id="escalation" title="What happens when you are late" intro="Timings are defaults and may change before launch." tone="muted" align="left">
        <DataTable caption="Late-arrival escalation" headers={escalation.headers} rows={escalation.rows} />
      </Section>
      <FeatureRow
        id="honest"
        icon="signal"
        title="Honest about connection, battery and permissions"
        text="Real trips lose signal, run out of battery and change plans. Arrivo shows contacts exactly what is going on, so a quiet phone is never mistaken for a safe one, or for an emergency."
        screen="live"
        reverse
      />
      <Section id="situations" title="When things do not go to plan" tone="muted" align="left">
        <DataTable caption="Situations and Arrivo's response" headers={situations.headers} rows={situations.rows} />
      </Section>
      <Section id="tools" title="Tools for when you need them" intro="Available from the home screen at any time." >
        <FeatureGrid items={toolsList} columns={3} />
      </Section>
      <FeatureRow
        id="timer"
        icon="bolt"
        title="A timer for the times you have no destination"
        text="Walking home, meeting someone new, waiting for a late cab: start a safety timer. Tap I am safe before it ends and nothing happens. If time runs out, your contacts are told."
        screen="timer"
        tone="muted"
      />
      <Section id="never" title="What Arrivo never does" tone="inverse">
        <Card className="mx-auto max-w-2xl">
          <CheckList items={neverList} icon="close" />
        </Card>
      </Section>
      <FinalCta title="Travel with people who have your back" />
    </>
  );
}
