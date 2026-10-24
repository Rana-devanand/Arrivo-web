"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const hidden = {
  up: "translate-y-8 opacity-0",
  left: "-translate-x-10 opacity-0",
  right: "translate-x-10 opacity-0",
} as const;

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Where the content slides in from. */
  from?: keyof typeof hidden;
  /** Wait this many milliseconds before starting, to stagger a group. */
  delay?: number;
};

/** Slides and fades its content in the first time it scrolls into view. */
export function FadeIn({ children, className = "", from = "up", delay = 0 }: FadeInProps) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.remove(...hidden[from].split(" "));
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [from]);

  return (
    <div
      ref={el}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
      className={`${hidden[from]} transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
