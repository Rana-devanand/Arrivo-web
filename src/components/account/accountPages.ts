import type { IconName } from "@/components/ui/Icon";

export type PageInfo = { title: string; subtitle: string; icon: IconName };

/** The name and a line of detail for each account screen, shown in the top bar of the content. */
export function pageInfo(pathname: string, firstName: string): PageInfo {
  switch (pathname) {
    case "/account":
      return {
        title: "Dashboard",
        subtitle: firstName ? `Hi ${firstName}. Here is your plan and your latest journeys.` : "Here is your plan and your latest journeys.",
        icon: "dashboard",
      };
    case "/account/plan":
      return { title: "Upgrade plan", subtitle: "Choose a plan and pay on a secure page run by Dodo Payments. You can change or cancel at any time.", icon: "crown" };
    case "/account/journeys":
      return { title: "Journeys", subtitle: "Your latest journeys, newest first. Places are shown by name only.", icon: "map" };
    case "/account/admin/users":
      return { title: "Users", subtitle: "Everyone who has signed up, with their country, role and journeys.", icon: "users" };
    case "/account/admin/notifications":
      return { title: "Notifications", subtitle: "Every notification sent: who got it, from where and what it said.", icon: "bell" };
    case "/account/admin/revenue":
      return { title: "Revenue", subtitle: "Every payment: who paid, how much, and whether it went through.", icon: "chart" };
    case "/account/admin/offers":
      return { title: "Offers", subtitle: "Discount offers people can use when they pay. Each one runs for a time you set.", icon: "tag" };
    default:
      return { title: "Account", subtitle: "", icon: "dashboard" };
  }
}
