import Image from "next/image";
import type { ReactNode } from "react";
import { AppScreen, type ScreenVariant } from "@/components/ui/AppScreen";
import { CheckList } from "@/components/ui/CheckList";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { SplitWords } from "@/components/ui/SplitWords";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import type { IconName } from "@/components/ui/Icon";

type FeatureRowProps = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  points?: readonly string[];
  /** A phone screenshot from the app. */
  screen?: ScreenVariant;
  /** A square illustration shown instead of a phone screenshot. */
  image?: { src: string; alt: string };
  reverse?: boolean;
  children?: ReactNode;
};

export function FeatureRow({ id, icon, title, text, points, screen, image, reverse = false, children }: FeatureRowProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="group py-8 [contain-intrinsic-size:auto_520px] [content-visibility:auto] sm:py-10">
      <Container className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className={`w-full max-w-xl lg:justify-self-center ${reverse ? "lg:order-2" : ""}`}>
          <FadeIn>
            <AnimatedIcon name={icon} className="mb-3 size-11 text-highlight" loop />
          </FadeIn>
          <Heading level={2} id={`${id}-title`} className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            <SplitWords text={title} />
          </Heading>
          <FadeIn delay={120}>
            <p className="mt-3 text-base text-muted-foreground">{text}</p>
          </FadeIn>
          {points ? (
            <div className="mt-4 text-[15px]">
              <CheckList items={points} animateFrom={240} />
            </div>
          ) : null}
          {children ? <FadeIn delay={360}>{children}</FadeIn> : null}
        </div>
        <FadeIn delay={150} className={`flex justify-center lg:justify-self-center ${reverse ? "lg:order-1" : ""}`}>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={1536}
              height={1536}
              sizes="(min-width: 1024px) 400px, 80vw"
              className="h-auto w-full max-w-sm rounded-[28px] shadow-raise"
            />
          ) : screen ? (
            <AppScreen variant={screen} />
          ) : null}
        </FadeIn>
      </Container>
    </section>
  );
}
