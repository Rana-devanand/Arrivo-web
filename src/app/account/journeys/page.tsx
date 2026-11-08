import type { Metadata } from "next";
import { AccountJourneys } from "@/components/account/AccountJourneys";

export const metadata: Metadata = { title: "Journeys" };

export default function AccountJourneysPage() {
  return <AccountJourneys />;
}
