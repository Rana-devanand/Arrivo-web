import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex min-h-11 items-center text-2xl text-foreground">
          <AnimatedLogo />
        </Link>
        <Navbar />
      </Container>
    </header>
  );
}
