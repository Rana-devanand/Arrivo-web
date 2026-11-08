import type { Metadata } from "next";
import { AdminNotifications } from "@/components/account/AdminNotifications";

export const metadata: Metadata = { title: "Notifications" };

export default function AccountAdminNotificationsPage() {
  return <AdminNotifications />;
}
