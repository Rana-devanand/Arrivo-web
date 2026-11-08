"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { useNow } from "@/components/watch/useNow";
import { firstName } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { pageInfo } from "./accountPages";

function Chip({ icon, children, strong = false }: { icon: IconName; children: string; strong?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${strong ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}
    >
      <Icon name={icon} className="size-3" />
      {children}
    </span>
  );
}

/**
 * The bar across the top of the content, always in view: the name of the screen (the page's one h1), where it sits, a line about it,
 * and the details on the right: the person's plan, an Admin mark, and today's date.
 */
export function AccountTopBar() {
  const pathname = usePathname();
  const { auth, billing, isAdmin } = useAccount();
  const now = useNow();
  const name = auth.status === "signedIn" ? firstName(auth.user.name, auth.user.email) : "";
  const info = pageInfo(pathname, name);
  const plan = billing.status === "ready" ? billing.data : null;
  const today = now ? new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(now) : "";

  return (
    <header className="border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile name={info.icon} />
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-[11px] leading-none text-muted-foreground">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link href="/account" className="hover:underline">
                    Account
                  </Link>
                </li>
                {pathname !== "/account" ? (
                  <li aria-current="page" className="flex items-center gap-1.5">
                    <span aria-hidden="true">/</span>
                    {info.title}
                  </li>
                ) : null}
              </ol>
            </nav>
            <Heading level={1} size={7} className="mt-1">
              {info.title}
            </Heading>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {plan ? <Chip icon={plan.plan === "free" ? "shield" : "crown"}>{plan.name}</Chip> : null}
          {isAdmin ? (
            <Chip icon="shieldCheck" strong>
              Admin
            </Chip>
          ) : null}
          {today ? (
            <span className="hidden sm:inline-flex">
              <Chip icon="clock">{today}</Chip>
            </span>
          ) : null}
        </div>
      </div>
      {info.subtitle ? <p className="mx-auto mt-2 w-full max-w-5xl text-xs text-muted-foreground">{info.subtitle}</p> : null}
    </header>
  );
}
