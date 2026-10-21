import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-xl font-bold text-foreground">
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            {siteConfig.name.charAt(0)}
          </span>
          {siteConfig.name}
        </Link>
        <Navbar />
      </Container>
    </header>
  );
}
