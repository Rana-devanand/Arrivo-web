import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountShell } from "@/components/account/AccountShell";

/**
 * The signed-in dashboard. It is private to whoever signs in: search engines never list it, no referrer is sent
 * from it, and it is not in the sitemap. The pages hold no personal data on the server: everything is loaded in
 * the browser, with the person's own sign-in, from the Arrivo API.
 */
export const metadata: Metadata = {
  title: { default: "Your account", template: "%s | Arrivo" },
  description:
    "Sign in to your Arrivo account to see your plan, your journeys and your trusted contacts, and to upgrade to Arrivo Plus on a secure payment page, any time.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
