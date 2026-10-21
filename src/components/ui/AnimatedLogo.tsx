"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig } from "@/config/site";

const CYCLE_MS = 9000;
const FADE_MS = 450;

/** The home-in-a-circle mark pops in, draws itself, slides left, and the name is written out. It plays again every few seconds. */
export function AnimatedLogo({ className = "" }: { className?: string }) {
  const [cycle, setCycle] = useState(0);
  const [fading, setFading] = useState(false);
  const restart = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setFading(true);
      restart.current = window.setTimeout(() => {
        setCycle((value) => value + 1);
        setFading(false);
      }, FADE_MS);
    }, CYCLE_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(restart.current);
    };
  }, []);

  return (
    <span key={cycle} role="img" aria-label={siteConfig.name} className={`alogo ${fading ? "alogo-out" : ""} ${className}`}>
      <span className="alogo-mark" aria-hidden="true">
        <span className="alogo-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path className="alogo-draw" pathLength="1" d="M4 11l8-7 8 7" />
            <path className="alogo-draw" pathLength="1" style={{ animationDelay: "0.45s" }} d="M6 9.5V20h12V9.5" />
            <path className="alogo-draw" pathLength="1" style={{ animationDelay: "0.6s" }} d="M10 20v-5h4v5" />
          </svg>
        </span>
      </span>
      <span className="alogo-text font-extrabold tracking-tight" aria-hidden="true">
        {[...siteConfig.name].map((letter, index) => (
          <span key={index} className="alogo-letter" style={{ "--i": index } as CSSProperties}>
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}
