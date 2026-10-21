import Link from "next/link";
import { siteConfig, type NavItem } from "@/config/site";
import { Container } from "@/components/ui/Container";

const linkClasses = "inline-flex min-h-11 items-center text-base text-muted-foreground hover:text-foreground";

function LinkColumn({ label, items }: { label: string; items: readonly NavItem[] }) {
  return (
    <nav aria-label={label}>
      <p className="mb-1 font-semibold">{label}</p>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClasses}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="text-xl font-bold">{siteConfig.name}</p>
          <p className="mt-2 max-w-xs text-muted-foreground">{siteConfig.tagline}</p>
        </div>
        <LinkColumn label="Product" items={siteConfig.footer.product} />
        <LinkColumn label="Help" items={siteConfig.footer.help} />
        <LinkColumn label="Company" items={siteConfig.footer.company} />
        <nav aria-label="Social media">
          <p className="mb-1 font-semibold">Follow us</p>
          <ul>
            {siteConfig.socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={linkClasses}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          &copy; {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
      {/* No need now  */}
      {/* <ThemePalette /> */}  
    </footer>
  );
}
