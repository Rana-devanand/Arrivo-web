"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { HeroShape } from "@/config/content";

const SECONDS = 9;

type HeroShapeState = { shapes: readonly HeroShape[]; index: number };

const HeroShapeContext = createContext<HeroShapeState | null>(null);

/** Holds which hero shape is showing, so the canvas and the big word change together. */
export function HeroShapeProvider({ shapes, children }: { shapes: readonly HeroShape[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % shapes.length), SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [index, shapes.length]);

  return <HeroShapeContext.Provider value={{ shapes, index }}>{children}</HeroShapeContext.Provider>;
}

export function useHeroShape(): HeroShapeState {
  const state = useContext(HeroShapeContext);
  if (!state) throw new Error("useHeroShape must be used inside HeroShapeProvider");
  return state;
}
