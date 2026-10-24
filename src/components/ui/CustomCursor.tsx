"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, summary, input, textarea, select, label, [role='button']";

/** A small dot that sticks to the pointer and a ring that trails it, grows over links and buttons and squeezes on press. Mouse only. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;

    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotEl && ringEl) {
        dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      if (!ringEl?.classList.contains("is-visible")) {
        rx = event.clientX;
        ry = event.clientY;
        dotEl?.classList.add("is-visible");
        ringEl?.classList.add("is-visible");
      }
      x = event.clientX;
      y = event.clientY;
    }

    function over(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      ringEl?.classList.toggle("is-hover", Boolean(target?.closest(INTERACTIVE)));
    }

    const down = () => ringEl?.classList.add("is-down");
    const up = () => ringEl?.classList.remove("is-down");
    function leave() {
      dotEl?.classList.remove("is-visible");
      ringEl?.classList.remove("is-visible");
    }

    frame = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
