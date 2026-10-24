import type { Metadata } from "next";
import { troubleshooting } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckList } from "@/components/ui/CheckList";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { OfficeMap } from "@/components/ui/OfficeMap";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Support",
  description:
    "Get help with Arrivo. Fix location, invite code and alert issues, learn how to report a problem in the app, and find out how to contact the Arrivo support team.",
  path: "/support",
});

const include = [
  "Your phone model and Android or iOS version",
  "What you were doing when it happened and roughly what time",
  "A screenshot, if it helps (hide names and places first)",
  "Please do not send exact addresses or coordinates",
];

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="We are here to help" intro="Find a quick fix below, or reach out. We read every message." screen="faq" />
      <Section id="contact" title="Ways to reach us">
        <div className="grid gap-6 md:grid-cols-3">
          <Card as="article" className="flex h-full flex-col gap-3">
            <Icon name="mail" className="size-7" />
            <Heading level={3}>Email support</Heading>
            <p className="text-muted-foreground">{siteConfig.supportEmail}</p>
          </Card>
          <Card as="article" className="flex h-full flex-col gap-3">
            <Icon name="flag" className="size-7" />
            <Heading level={3}>Report a problem in the app</Heading>
            <p className="text-muted-foreground">Open Profile, then Help and FAQ, then Report a problem. It sends diagnostics without any location.</p>
          </Card>
          <Card as="article" className="flex h-full flex-col items-start gap-3">
            <Icon name="help" className="size-7" />
            <Heading level={3}>Read the FAQ</Heading>
            <p className="text-muted-foreground">Quick answers on privacy, safety and battery.</p>
            <Button href="/faq" variant="outline" className="mt-auto">
              Open the FAQ
            </Button>
          </Card>
        </div>
      </Section>
      <Section id="find-us" title="Find us" intro="Prefer to talk in person? Our office address is below.">
        <OfficeMap />
      </Section>
      <Section id="troubleshooting" title="Common fixes" intro="Try these first." tone="muted">
        <FeatureGrid items={troubleshooting} columns={4} />
      </Section>
      <Section id="report" title="What to include in your message">
        <div className="max-w-2xl">
          <CheckList items={include} />
        </div>
      </Section>
    </>
  );
}
