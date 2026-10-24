"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SHOW_AT_TOP = 80;
const MIN_MOVE = 6;

/** The sticky header slides up out of sight while you scroll down and comes back as soon as you scroll up. */
export function HideOnScroll({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const focused = useRef(false);

  useEffect(() => {
    last.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) < MIN_MOVE) return;
      last.current = y;
      setHidden(y > SHOW_AT_TOP && delta > 0 && !focused.current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      onFocusCapture={() => {
        focused.current = true;
        setHidden(false);
      }}
      onBlurCapture={() => {
        focused.current = false;
      }}
      className={`sticky top-0 z-40 pt-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${hidden ? "-translate-y-[130%]" : "translate-y-0"}`}
    >
      {children}
    </header>
  );
}
