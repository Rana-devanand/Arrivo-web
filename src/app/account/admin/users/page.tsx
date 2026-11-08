import type { Metadata } from "next";
import { AdminUsers } from "@/components/account/AdminUsers";

export const metadata: Metadata = { title: "Users" };

export default function AccountAdminUsersPage() {
  return <AdminUsers />;
}
