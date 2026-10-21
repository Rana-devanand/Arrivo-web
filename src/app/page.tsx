import type { Metadata } from "next";
import { facts, features, neverList, toolsList } from "@/config/content";
import { siteConfig } from "@/config/site";
import { softwareApplicationJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/sections/Faq";
import { FactStrip } from "@/components/sections/FactStrip";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LiveRoute } from "@/components/sections/LiveRoute";
import { Testimonials } from "@/components/sections/Testimonials";
import { Worrying } from "@/components/sections/Worrying";

export const metadata: Metadata = buildMetadata({
  title: "Share the Journey, Celebrate the Arrival",
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd} />
      <Hero />
      <FactStrip label="Why people trust Arrivo" facts={facts} />
      <Worrying />
      <LiveRoute />
      <HowItWorks />
      <Section id="features" title="Everything you need to travel with peace of mind" intro="Simple for you, calm for the people who care about you." tone="muted">
        <FeatureGrid items={features} columns={4} />
        <div className="mt-10 flex justify-center">
          <Button href="/features" variant="outline">
            Explore every feature
          </Button>
        </div>
      </Section>
      <FeatureRow
        id="safety"
        icon="shield"
        title="A safety net that respects your privacy"
        text="Running late? Arrivo checks on you first, and only then tells your contacts, with your last known location and the time it was recorded. It is honest about stale, offline and paused states, and it never contacts emergency services for you."
        points={neverList}
        screen="overdue"
      >
        <div className="mt-8">
          <Button href="/safety">Read how safety works</Button>
        </div>
      </FeatureRow>
      <FeatureRow
        id="for-contacts"
        icon="eye"
        title="Peace of mind for the people who care"
        text="Trusted contacts accept your invitation, then follow your trip on a live map with your arrival time, a freshness label and a call button. They only ever see a journey while it is in progress."
        screen="watch"
        reverse
        tone="muted"
      >
        <div className="mt-8">
          <Button href="/for-contacts" variant="outline">
            See what contacts see
          </Button>
        </div>
      </FeatureRow>
      <Section id="tools" title="More ways to feel looked after" intro="Not every moment is a journey. These shortcuts live on the home screen.">
        <FeatureGrid items={toolsList} columns={3} />
      </Section>
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
