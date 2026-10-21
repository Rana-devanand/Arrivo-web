import type { Metadata } from "next";
import { privacyTable } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { LegalPage, type LegalSection } from "@/components/sections/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read the Arrivo Privacy Policy to learn what information the Arrivo mobile app and website collect, how it is used, and the choices you have over your data.",
  path: "/privacy-policy",
});

const sections: readonly LegalSection[] = [
  {
    heading: "What we collect and why",
    paragraphs: ["We collect only what is needed to run journey sharing and safety features."],
    items: privacyTable.rows.map((row) => `${row.cells[0]}. Why: ${row.cells[1]}. Kept: ${row.cells[2]}.`),
  },
  {
    heading: "Who can see your location",
    paragraphs: [
      "Only trusted contacts you choose for a journey, who have accepted your invitation, can see your location, and only while that journey is active. People without the app can be given an expiring, read-only link.",
    ],
  },
  {
    heading: "What we do not do",
    paragraphs: ["We do not sell your data and we do not use it for advertising. We never put coordinates in notification text. [PLACEHOLDER: legal review of final wording.]"],
  },
  {
    heading: "This website",
    paragraphs: [
      "The sample map on our home page asks a free service (country.is) which country your connection is in, so it can show a route in your country. Your browser sends your IP address to that service for this lookup, and we do not store the result. The map itself uses OpenStreetMap tiles, the OSRM routing service and OpenStreetMap place names, which receive your IP address and the map area you view.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: ["You can pause or stop sharing at any time, remove a contact, delete a journey, and delete your account from Profile, Privacy and data."],
  },
  {
    heading: "Contact",
    paragraphs: ["[PLACEHOLDER: company name, address and privacy contact email.]"],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="[PLACEHOLDER: date]"
      intro="This summary explains how Arrivo handles your information. It is a draft that must be reviewed by a lawyer before launch."
      sections={sections}
    />
  );
}
