"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** A short statement whose words light up one after another when it scrolls into view. Words in `highlight` stand out. */
export function StatementWords({ text, highlight = [] }: { text: string; highlight?: readonly string[] }) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-lit");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={root} className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={`statement-word ${highlight.some((item) => word.toLowerCase().startsWith(item)) ? "text-spot" : ""}`}
          style={{ "--i": index } as CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
