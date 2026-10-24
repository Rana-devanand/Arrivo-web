import Link from "next/link";
import { factsHead, type Fact } from "@/config/content";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Section } from "@/components/ui/Section";

export function FactStrip({ facts }: { facts: readonly Fact[] }) {
  return (
    <Section
      id="trust"
      eyebrow={factsHead.eyebrow}
      title={factsHead.title}
      intro={
        <>
          {factsHead.intro}{" "}
          <Link href={factsHead.href} className="font-semibold text-highlight underline underline-offset-4 hover:opacity-80">
            {factsHead.linkLabel}
          </Link>
          .
        </>
      }
    >
      <FeatureGrid items={facts} columns={3} />
    </Section>
  );
}
