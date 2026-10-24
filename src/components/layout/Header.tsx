import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { HideOnScroll } from "./HideOnScroll";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <HideOnScroll>
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between rounded-full border border-card/80 bg-card/40 px-3 shadow-md backdrop-blur-xl lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-items-center lg:pl-7 lg:pr-3">
          <Link href="/" className="inline-flex min-h-11 items-center pl-3 text-2xl text-nav lg:justify-self-start lg:pl-0">
            <AnimatedLogo />
          </Link>
          <Navbar />
        </div>
      </Container>
    </HideOnScroll>
  );
}
