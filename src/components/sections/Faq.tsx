import { faqs } from "@/config/content";
import { faqJsonLd } from "@/lib/json-ld";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqSection } from "./FaqSection";

const featured = faqs.filter((faq) => faq.featured);

export function Faq() {
  return (
    <FaqSection
      id="faq"
      eyebrow="Questions people ask us"
      title="Straight answers before you set off."
      intro="Still not sure? Our support page has quick fixes and ways to reach us."
      actions={
        <>
          <Button href="/faq" arrow>
            See all questions
          </Button>
          <Button href="/support" variant="soft" arrow>
            Ask us anything
          </Button>
        </>
      }
    >
      <JsonLd data={faqJsonLd(featured)} />
      <FaqList items={featured} openFirst />
    </FaqSection>
  );
}
