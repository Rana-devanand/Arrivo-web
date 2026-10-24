"use client";

import { useEffect, useRef } from "react";

/** The words of a heading, each sliding up into place when the heading scrolls into view. Put it inside a Heading. */
export function SplitWords({ text }: { text: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={root}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 && " "}
          <span className="split-line">
            <span className="split-word" style={{ "--i": index } as React.CSSProperties}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
