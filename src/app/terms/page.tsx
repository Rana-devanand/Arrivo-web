import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, type LegalSection } from "@/components/sections/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Read the Arrivo Terms of Service covering your use of the Arrivo mobile app and website, including accounts, acceptable use, subscriptions and liability limits.",
  path: "/terms",
});

const sections: readonly LegalSection[] = [
  {
    heading: "Using Arrivo",
    paragraphs: ["[PLACEHOLDER] Eligibility and minimum age, accounts, and acceptable use."],
  },
  {
    heading: "Arrivo is not an emergency service",
    paragraphs: [
      "Arrivo shares your journey with people you trust. It does not contact emergency services and cannot guarantee that a notification or location update is delivered. In an emergency, contact your local emergency number.",
    ],
  },
  {
    heading: "Subscriptions and payments",
    paragraphs: ["[PLACEHOLDER] Pricing, billing and cancellation, once plans are decided."],
  },
  {
    heading: "Liability",
    paragraphs: ["[PLACEHOLDER] Warranties, limits of liability and governing law, after legal review."],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="[PLACEHOLDER: date]"
      intro="These terms are a draft and must be reviewed by a lawyer before launch."
      sections={sections}
    />
  );
}
