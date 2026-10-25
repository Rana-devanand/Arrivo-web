import type { Metadata } from "next";
import { Suspense } from "react";
import { payHow, pricingFaqs, pricingHead } from "@/config/pricing";
import { faqJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { PricingPlans } from "@/components/sections/PricingPlans";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Arrivo Free covers one trusted contact. Arrivo Plus adds up to ten contacts and a Family household, paid monthly, every 6 months or yearly. Cancel any time.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(pricingFaqs)} />
      <PageHero eyebrow={pricingHead.eyebrow} title={pricingHead.title} intro={pricingHead.intro} />
      <Section id="plans" title="Choose your plan" intro="Prices are in US dollars and include taxes. See an estimate in your own currency below. You can change or cancel at any time.">
        {/* The ticket in the address is read in the browser, so the rest of the page stays static. */}
        <Suspense fallback={<div className="min-h-[40rem]" aria-hidden="true" />}>
          <PricingPlans />
        </Suspense>
      </Section>
      <Section id="how-to-pay" title="How paying works" tone="muted">
        <Timeline steps={payHow} />
      </Section>
      <FaqSection id="billing-faq" eyebrow="Questions" title="About paying">
        <FaqList items={pricingFaqs} />
      </FaqSection>
    </>
  );
}
