import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { CheckoutResult } from "@/components/sections/CheckoutResult";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Payment received",
  description:
    "Thank you for choosing Arrivo Plus. Go back to the Arrivo app and Plus switches on within a minute. Your invoice is emailed to you, and you can cancel any time.",
  path: "/pricing/success",
});

export default function PaymentReceivedPage() {
  return (
    <>
      <PageHero eyebrow="Arrivo Plus" title="Back to your journey" intro="Your payment page has closed. Here is what happens next." />
      <Section id="result" title="What happens now">
        <Suspense fallback={<div className="min-h-48" aria-hidden="true" />}>
          <CheckoutResult />
        </Suspense>
      </Section>
    </>
  );
}
