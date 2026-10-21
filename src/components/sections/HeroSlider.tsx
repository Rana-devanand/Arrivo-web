import Image from "next/image";
import type { HeroSlide } from "@/config/content";

/** Seconds each image stays on screen. Must match the 36s (6 x 6s) cycle in globals.css. */
const SLIDE_SECONDS = 6;
const FADE_SECONDS = 1.5;

function Slide({ slide, index }: { slide: HeroSlide; index: number }) {
  return (
    <li
      className={`absolute inset-0 animate-hero-fade opacity-0 motion-reduce:animate-none ${index === 0 ? "motion-reduce:opacity-100" : ""}`}
      style={{ animationDelay: `${index * SLIDE_SECONDS - FADE_SECONDS}s` }}
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 700px, 100vw"
        priority={index === 0}
        loading="eager"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary from-15% via-primary/65 to-transparent px-6 pb-6 pt-28 text-primary-foreground sm:px-8 sm:pb-8">
        <p className="text-xl font-bold sm:text-xl">{slide.title}</p>
        <p className="mt-1 max-w-md text-base sm:text-xs">{slide.text}</p>
      </div>
    </li>
  );
}

/** Images cross-fade one into the next on their own. Hovering or focusing pauses it; reduced-motion users see the first image only. */
export function HeroSlider({ slides }: { slides: readonly HeroSlide[] }) {
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Arrivo in everyday life"
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:aspect-auto lg:min-h-[26rem]"
    >
      <ul className="[&>li]:group-focus-within:[animation-play-state:paused] [&>li]:group-hover:[animation-play-state:paused]">
        {slides.map((slide, index) => (
          <Slide key={slide.src} slide={slide} index={index} />
        ))}
      </ul>
    </div>
  );
}
