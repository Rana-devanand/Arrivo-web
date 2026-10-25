import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Payment cancelled",
  description:
    "You left the payment page, so nothing was charged. To try again, open the Arrivo app, go to Profile, then Subscription, tap Upgrade. Arrivo Free stays as is.",
  path: "/pricing/cancelled",
});

export default function PaymentCancelledPage() {
  return (
    <>
      <PageHero eyebrow="Arrivo Plus" title="No payment was taken" intro="You left the payment page before paying. Nothing has changed on your account." />
      <Section id="try-again" title="Want to try again?">
        <Card className="mx-auto max-w-2xl">
          <Heading level={3}>Start from the app</Heading>
          <p className="mt-2 text-muted-foreground">
            Open Arrivo, go to Profile, then Subscription, and tap Upgrade. The link in the app is private to you and lasts half an hour, so a new one is made each time.
          </p>
          <div className="mt-5">
            <Button href="/pricing" variant="outline">
              See the plans again
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
