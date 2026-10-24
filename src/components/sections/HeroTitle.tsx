"use client";

import { Heading } from "@/components/ui/Heading";
import { useHeroShape } from "./HeroShapeProvider";

/**
 * One fixed sentence with a highlighted word that follows the canvas shape. The h1 keeps the full tagline for
 * search engines and screen readers. The words share one grid cell so the height never jumps, and the new
 * word fades in once the dots have gathered.
 */
export function HeroTitle({ tagline, before, after }: { tagline: string; before: string; after: string }) {
  const { shapes, index } = useHeroShape();
  return (
    <Heading level={1} id="hero-title" className="text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-16">
      <span className="sr-only">{tagline}</span>
      <span aria-hidden="true" className="block text-wrap">
        <span className="block">{before}</span>
        <span className="grid">
          {shapes.map((entry, i) => (
            <span
              key={entry.shape}
              className={`col-start-1 row-start-1 text-highlight transition-all duration-700 motion-reduce:transition-none ${
                i === index ? "translate-y-0 opacity-100 delay-[1600ms] motion-reduce:delay-0" : "translate-y-4 opacity-0"
              }`}
            >
              {entry.word}
            </span>
          ))}
        </span>
        <span className="block whitespace-pre-line ">{after}</span>
      </span>
    </Heading>
  );
}
