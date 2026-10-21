"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const CDN = "https://cdn.lordicon.com";

let registered: Promise<void> | undefined;

/** Registers the `lord-icon` element once, and only when an icon is about to be seen. */
function defineLordicon(): Promise<void> {
  registered ??= import("@lordicon/element").then((element) => {
    element.defineElement();
  });
  return registered;
}

type LordIconProps = {
  iconKey: string;
  /** Replays every few seconds. By default it plays while the nearest `.group` ancestor is hovered. */
  loop?: boolean;
  className?: string;
  /** Shown until the animated icon is ready, and for visitors who prefer reduced motion. */
  children: ReactNode;
};

export function LordIcon({ iconKey, loop = false, className = "", children }: LordIconProps) {
  const host = useRef<HTMLSpanElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void defineLordicon().then(() => {
          if (!cancelled) setLoaded(true);
        });
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // The built-in icon stays until Lordicon has drawn its first frame.
  const watch = (icon: HTMLElement | null) => {
    icon?.addEventListener("ready", () => setReady(true), { once: true });
  };

  return (
    <span ref={host} className={`relative inline-flex shrink-0 ${className}`}>
      <span className={`inline-flex size-full ${ready ? "invisible" : ""}`}>{children}</span>
      {loaded ? (
        <lord-icon
          ref={watch}
          src={`${CDN}/${iconKey}.json`}
          intro="in-reveal"
          trigger={loop ? "loop(3500)" : "hover"}
          target=".group"
          stroke="regular"
          current-color=""
          loading="lazy"
          className="absolute inset-0 size-full"
        />
      ) : null}
    </span>
  );
}
