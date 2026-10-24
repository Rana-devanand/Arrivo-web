"use client";

import { DotCanvas } from "@/components/ui/DotCanvas";
import { useHeroShape } from "./HeroShapeProvider";

/** Full-section dotted canvas for the home hero. It flows through one shape per Arrivo promise. */
export function HeroDiagram() {
  const { shapes, index } = useHeroShape();
  return <DotCanvas shape={shapes[index].shape} className="pointer-events-none absolute inset-0 size-full" />;
}
