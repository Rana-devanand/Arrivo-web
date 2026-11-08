import Link from "next/link";
import { Heading } from "@/components/ui/Heading";

/** The top of an account screen: where you are, the one h1 of the page, and a line about it. */
export function AccountHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/account" className="font-medium hover:underline">
              Account
            </Link>
          </li>
          {title !== "Dashboard" ? (
            <li aria-current="page" className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {title}
            </li>
          ) : null}
        </ol>
      </nav>
      <Heading level={1} size={2}>
        {title}
      </Heading>
      {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}
