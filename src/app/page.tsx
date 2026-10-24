import type { Metadata } from "next";
import { facts, features, featuresHead, neverList, toolsList } from "@/config/content";
import { siteConfig } from "@/config/site";
import { softwareApplicationJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { BigMarquee } from "@/components/sections/BigMarquee";
import { Faq } from "@/components/sections/Faq";
import { FeatureArc } from "@/components/sections/FeatureArc";
import { FactStrip } from "@/components/sections/FactStrip";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
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
      <FactStrip facts={facts} />
      <Worrying />
      <LiveRoute />
      <BigMarquee />
      <FeatureArc features={features.slice(0, 4)} head={featuresHead} href="/features" />
      <FeatureRow
        id="safety"
        icon="shield"
        title="A safety net that respects your privacy"
        text="Running late? Arrivo checks on you first, and only then tells your contacts, with your last known location and the time it was recorded. It is honest about stale, offline and paused states, and it never contacts emergency services for you."
        points={neverList.slice(0, 4)}
        image={{ src: "/features/safety.webp", alt: "A navy shield with a tick above a phone showing a check-in card, with a padlock, a clock and a location pin around it." }}
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
        image={{ src: "/features/for-contacts.webp", alt: "A relaxed figure on a sofa by a lamp, following a route with an arrived check on a phone while three friends' avatars float nearby." }}
        reverse
      >
        <div className="mt-8">
          <Button href="/for-contacts" variant="outline">
            See what contacts see
          </Button>
        </div>
      </FeatureRow>
      <Section id="tools" eyebrow="Always at hand" title="More ways to feel looked after" intro="Not every moment is a journey. These shortcuts live on the home screen.">
        <FeatureGrid items={toolsList} columns={3} />
      </Section>
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
