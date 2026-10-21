import { features } from "@/config/content";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Section } from "@/components/ui/Section";

export function Features() {
  return (
    <Section id="features" title="Everything you need to travel with peace of mind" intro="Simple for you, calm for the people who care about you." tone="muted">
      <FeatureGrid items={features} columns={4} />
    </Section>
  );
}
