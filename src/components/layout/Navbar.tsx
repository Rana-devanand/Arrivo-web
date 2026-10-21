import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const linkClasses =
  "inline-flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground hover:bg-muted";

export function Navbar() {
  return (
    <nav aria-label="Main" className="flex items-center gap-2">
      <ul className="hidden items-center gap-1 md:flex">
        {siteConfig.nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClasses}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Button href={siteConfig.downloadHref} className="hidden md:inline-flex">
        Download
      </Button>
      <details className="group relative md:hidden">
        <summary
          aria-label="Toggle menu"
          className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-card text-foreground [&::-webkit-details-marker]:hidden"
        >
          <Icon name="menu" className="size-6 group-open:hidden" />
          <Icon name="close" className="hidden size-6 group-open:block" />
        </summary>
        <ul className="absolute right-0 top-13 w-64 space-y-1 rounded-lg border border-border bg-card p-3 shadow-md">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${linkClasses} w-full`}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Button href={siteConfig.downloadHref} className="w-full">
              Download
            </Button>
          </li>
        </ul>
      </details>
    </nav>
  );
}
