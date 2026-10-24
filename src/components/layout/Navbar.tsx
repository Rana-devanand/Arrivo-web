import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "./NavLink";
import { NavMenu } from "./NavMenu";

const links = [{ label: "Home", href: "/" }, ...siteConfig.nav];

function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <Button href={siteConfig.downloadHref} size="sm" arrow className={`min-h-12 shadow-md hover:shadow-lg ${className}`}>
      Download
    </Button>
  );
}

export function Navbar() {
  return (
    <nav aria-label="Main" className="flex items-center gap-2 lg:contents">
      <NavMenu items={links} />
      <DownloadButton className="hidden lg:inline-flex" />
      <details className="group relative lg:hidden">
        <summary
          aria-label="Toggle menu"
          className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-full bg-card text-nav shadow-sm [&::-webkit-details-marker]:hidden"
        >
          <Icon name="menu" className="size-6 group-open:hidden" />
          <Icon name="close" className="hidden size-6 group-open:block" />
        </summary>
        <ul className="absolute right-0 top-14 w-64 space-y-1 rounded-3xl border border-border bg-card p-3 shadow-lg">
          {links.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} className="w-full" />
            </li>
          ))}
          <li>
            <DownloadButton className="w-full" />
          </li>
        </ul>
      </details>
    </nav>
  );
}
