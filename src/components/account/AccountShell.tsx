"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AFTER_SIGN_IN_KEY, safeReturnPath } from "@/lib/account";
import { AccountFrame } from "./AccountFrame";
import { AccountMobileBar } from "./AccountMobileBar";
import { AccountNav } from "./AccountNav";
import { AccountProvider, useAccount } from "./AccountProvider";
import { AccountTopBar } from "./AccountTopBar";
import { AccountUserBar } from "./AccountUserBar";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { SignInPanel } from "./SignInPanel";

function Gate({ children }: { children: ReactNode }) {
  const { auth } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // Google always sends people back to /account. If they started from another account page (the plan page,
  // from "Get started"), take them on to it once, then forget it.
  useEffect(() => {
    if (auth.status !== "signedIn" || pathname !== "/account") return;
    let target: string | null = null;
    try {
      target = safeReturnPath(window.sessionStorage.getItem(AFTER_SIGN_IN_KEY));
      window.sessionStorage.removeItem(AFTER_SIGN_IN_KEY);
    } catch {
      // No storage: stay on the dashboard.
    }
    if (target) router.replace(target);
  }, [auth.status, pathname, router]);

  // The website's navbar, footer and loader are not part of the account area (see HideInAccount).
  if (auth.status === "loading") return <DashboardSkeleton />;

  if (auth.status === "signedIn") {
    return (
      <AccountFrame mobileBar={<AccountMobileBar />} menu={<AccountNav />} user={<AccountUserBar />} header={<AccountTopBar />}>
        {children}
      </AccountFrame>
    );
  }

  return (
    <Container className="flex min-h-svh flex-col items-center justify-center gap-6 py-10">
      <div className="w-full max-w-xl">
        <SignInPanel />
      </div>
      <nav aria-label="Website" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-foreground underline">
          Back to the website
        </Link>
        <Link href="/terms" className="inline-flex min-h-11 items-center underline">
          Terms of Service
        </Link>
        <Link href="/privacy-policy" className="inline-flex min-h-11 items-center underline">
          Privacy Policy
        </Link>
      </nav>
    </Container>
  );
}

/** Wraps every account screen: a skeleton while we check, the sign-in card until someone is signed in, then the menu and the screen. */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <AccountProvider>
      <Gate>{children}</Gate>
    </AccountProvider>
  );
}
