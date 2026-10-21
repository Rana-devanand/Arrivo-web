import type { Metadata } from "next";
import { faqGroups, faqs } from "@/config/content";
import { faqJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about Arrivo: who can see your location, what happens if you are late, battery use, offline travel, privacy and account deletion.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero eyebrow="FAQ" title="Questions, answered" intro="Short, plain answers about privacy, safety and how Arrivo works. The same answers are inside the app under Profile, Help and FAQ." screen="faq" tone="muted" />
      {faqGroups.map((group, index) => (
        <Section
          key={group}
          id={group.toLowerCase().replace(/\s+/g, "-")}
          title={group}
          tone={index % 2 === 0 ? "default" : "muted"}
        >
          <FaqList items={faqs.filter((faq) => faq.group === group)} />
        </Section>
      ))}
      <Section id="more-help" title="Still need help?" intro="Our support page covers troubleshooting and how to reach us." tone="inverse">
        <div className="flex justify-center">
          <Button href="/support" variant="inverse">
            Go to support
          </Button>
        </div>
      </Section>
    </>
  );
}
