import type { Metadata } from "next";
import { contactSees, contactSteps } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { CheckList } from "@/components/ui/CheckList";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "For Trusted Contacts",
  description:
    "Invited to follow someone on Arrivo? Learn what you will see, how to accept an invite code, and how to follow a trip, with or without the app installed.",
  path: "/for-contacts",
});

const control = [
  "You see nothing until you tap Accept",
  "You can decline, or leave later",
  "You only see a trip while it is in progress",
  "The traveller can remove you at any time",
];

export default function ForContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="For trusted contacts"
        title="Someone trusts you to look out for them"
        intro="Here is exactly what that means: what you will see, what you will be told, and how little you have to do."
        screen="watch"
      />
      <Section id="what-you-see" title="What you will see" tone="muted">
        <FeatureGrid items={contactSees} columns={4} />
      </Section>
      <Section id="accept" title="How to accept an invitation" intro="Four steps, about a minute.">
        <Timeline steps={contactSteps} />
      </Section>
      <Section id="no-app" title="No app? You can still follow" tone="inverse">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <Heading level={3}>A secure link</Heading>
            <p className="mt-2 text-muted-foreground">
              The traveller can send a link that opens a read-only view in your browser. It shows their first name, status, destination and last location, and it stops working shortly after the journey ends.
            </p>
          </Card>
          <Card>
            <Heading level={3}>When to install the app</Heading>
            <p className="mt-2 text-muted-foreground">
              Install Arrivo if you want to follow trips regularly, receive alerts inside the app, or share your own journeys.
            </p>
          </Card>
        </div>
      </Section>
      <Section id="your-control" title="You are always in control">
        <div className="max-w-2xl">
          <CheckList items={control} />
        </div>
      </Section>
      <FinalCta title="Get Arrivo to follow a trip" text="Install the app, enter your invite code and accept." />
    </>
  );
}
