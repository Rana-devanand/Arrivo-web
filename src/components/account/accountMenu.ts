import type { IconName } from "@/components/ui/Icon";

/** The account menu: the same three places in the sidebar (wide screens) and in the menu sheet (phones). */
export const accountMenu: readonly { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/account", icon: "dashboard" },
  { label: "Upgrade plan", href: "/account/plan", icon: "crown" },
  { label: "Journeys", href: "/account/journeys", icon: "map" },
];
