import type { Metadata } from "next";
import { AdminRevenue } from "@/components/account/AdminRevenue";

export const metadata: Metadata = { title: "Revenue" };

export default function AccountAdminRevenuePage() {
  return <AdminRevenue />;
}
