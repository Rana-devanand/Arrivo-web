import type { Metadata } from "next";
import { values } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Arrivo means arrival. Learn why we built a calm, honest travel-safety app, what we believe about privacy and consent, and the principles behind every screen.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Arrivo"
        title="Because the best part of a journey is arriving"
        intro="Arrivo started with a simple wish: that the people who worry about us could know we are okay, without us having to keep texting." screen="splash"
      />
      <section aria-labelledby="story-title" className="bg-muted py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Heading level={2} id="story-title">
              Why we built it
            </Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              Travelling alone, getting home late, taking a cab in a new city: these are everyday moments that quietly worry the people who love us. Existing options were either too alarming or too invasive.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Arrivo is the calm middle. You choose who knows, they follow only while you travel, and everyone hears the good news the moment you arrive. [PLACEHOLDER: add the founder story and team.]
            </p>
          </div>
          <Card as="aside">
            <Heading level={3}>What the name means</Heading>
            <p className="mt-2 text-muted-foreground">
              {siteConfig.name} comes from the Italian <em>arrivo</em> and Spanish <em>arribo</em>, meaning arrival. It names the moment your contacts care about most.
            </p>
          </Card>
        </Container>
      </section>
      <Section id="values" title="What we believe">
        <FeatureGrid items={values} columns={4} />
      </Section>
      <Section id="promise" title={siteConfig.tagline} intro="That is the whole product, in one line." tone="inverse">
        <p className="mx-auto max-w-2xl text-center text-lg">
          Every screen, notification and setting is judged against it: does it help someone share a journey calmly, and celebrate an arrival?
        </p>
      </Section>
      <FinalCta title="Join us on the journey" />
    </>
  );
}
