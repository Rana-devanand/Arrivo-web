"use client";

import { useEffect, useRef, useState } from "react";

/** A number that counts up from zero the first time it scrolls into view. Shows the final number straight away for reduced motion. */
export function CountUp({ to, suffix = "", seconds = 1.4 }: { to: number; suffix?: string; seconds?: number }) {
  const el = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced) {
        setValue(to);
        return;
      }
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - started) / (seconds * 1000)));
        setValue(Math.round(to * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, seconds]);

  return (
    <span ref={el} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}
