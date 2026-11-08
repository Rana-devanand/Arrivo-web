import type { Metadata } from "next";
import { AccountPlan } from "@/components/account/AccountPlan";

export const metadata: Metadata = { title: "Upgrade plan" };

export default function AccountPlanPage() {
  return <AccountPlan />;
}
