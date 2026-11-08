"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { accountMenu } from "./accountMenu";

/** The account menu as a vertical list of links, each with an icon tile. The current page is filled in. */
export function AccountMenuLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {accountMenu.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group inline-flex min-h-11 w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-2.5 text-[13px] font-semibold transition-colors lg:min-h-10 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <span
                aria-hidden="true"
                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary-foreground/15" : "bg-secondary group-hover:bg-card"}`}
              >
                <Icon name={item.icon} className="size-4" />
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
