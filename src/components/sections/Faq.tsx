import { faqs } from "@/config/content";
import { faqJsonLd } from "@/lib/json-ld";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";

const featured = faqs.filter((faq) => faq.featured);

export function Faq() {
  return (
    <Section id="faq" title="Frequently asked questions" tone="muted">
      <JsonLd data={faqJsonLd(featured)} />
      <FaqList items={featured} />
    </Section>
  );
}
