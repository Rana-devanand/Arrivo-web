import type { Metadata } from "next";
import { AdminOffers } from "@/components/account/AdminOffers";

export const metadata: Metadata = { title: "Offers" };

export default function AccountAdminOffersPage() {
  return <AdminOffers />;
}
