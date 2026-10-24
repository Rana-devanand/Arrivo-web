import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { SplitWords } from "@/components/ui/SplitWords";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Error 404: the page you are looking for could not be found. It may have moved, or the link may be mistyped.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="flex min-h-[75svh] items-center py-12 sm:py-16">
      <Container className="flex flex-col items-center text-center">
        <FadeIn>
          <div className="animate-float">
            <Image
              src="/404.png"
              alt="A worried kitten sitting in front of the number 404."
              width={1122}
              height={1402}
              priority
              sizes="(min-width: 640px) 320px, 240px"
              className="h-auto w-60 sm:w-80"
            />
          </div>
        </FadeIn>
        <div className="mt-4 flex max-w-xl flex-col items-center gap-4">
          <FadeIn delay={150}>
            <Eyebrow>Error 404</Eyebrow>
          </FadeIn>
          <Heading level={1} id="not-found-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <SplitWords text="This page took a wrong turn." />
          </Heading>
          <FadeIn delay={300}>
            <p className="text-lg text-muted-foreground">
              We could not find the page you are looking for. It may have moved, or the link may have a typing mistake. Let us get you back on the route.
            </p>
          </FadeIn>
          <FadeIn delay={450} className="flex flex-wrap justify-center gap-3">
            <Button href="/" arrow>
              Back to home
            </Button>
            <Button href="/sitemap" variant="soft">
              See the sitemap
            </Button>
            <Button href="/contact" variant="soft">
              Contact us
            </Button>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
