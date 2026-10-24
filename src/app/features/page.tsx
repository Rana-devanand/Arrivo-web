import type { Metadata } from "next";
import { featureDetails, features, moreScreens } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Section } from "@/components/ui/Section";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Showcase } from "@/components/sections/Showcase";

export const metadata: Metadata = buildMetadata({
  title: "Features",
  description:
    "Explore Arrivo features: live journey sharing, trusted contacts, late-arrival check-ins, train and metro trip planning, ride photos and honest location status.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Built for the moments between leaving and arriving"
        intro="Arrivo turns a trip into something the people you trust can follow, without turning your life into a live feed."
      />
      {featureDetails.map((feature, index) => (
        <FeatureRow
          key={feature.title}
          id={`feature-${index + 1}`}
          icon={feature.icon}
          title={feature.title}
          text={feature.text}
          points={feature.points}
          screen={feature.screen}
          reverse={index % 2 === 1}
        />
      ))}
      <Section id="all-features" title="And everything else" intro="The details that make a trip feel looked after.">
        <FeatureGrid items={features} columns={4} />
      </Section>
      <Showcase
        id="more-screens"
        title="More of the app"
        intro="A few more screens you will use every day."
        screens={moreScreens}

      />
      <FinalCta title="Try Arrivo on your next trip" />
    </>
  );
}
