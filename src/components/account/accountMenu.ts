import type { IconName } from "@/components/ui/Icon";

export type MenuItem = { label: string; href: string; icon: IconName };

/** The account menu: the same places in the sidebar (wide screens) and in the menu sheet (phones). */
export const accountMenu: readonly MenuItem[] = [
  { label: "Dashboard", href: "/account", icon: "dashboard" },
  { label: "Upgrade plan", href: "/account/plan", icon: "crown" },
  { label: "Journeys", href: "/account/journeys", icon: "map" },
];

/** Only for admins. The server checks the role on every request; the menu is just hidden for everyone else. */
export const adminMenu: readonly MenuItem[] = [
  { label: "Users", href: "/account/admin/users", icon: "users" },
  { label: "Notifications", href: "/account/admin/notifications", icon: "bell" },
  { label: "Revenue", href: "/account/admin/revenue", icon: "chart" },
  { label: "Offers", href: "/account/admin/offers", icon: "tag" },
];
