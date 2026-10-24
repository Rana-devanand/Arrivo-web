"use client";

import { useEffect, useState } from "react";

const STEPS = ["Texts and calls", "A live map", "One calm view"] as const;
const BASE_Z = [0, 87.5, 175] as const;
const LIFT = 28;
const SECONDS = 2.6;

/**
 * Three flat cards stacked in 3D: the messages we send today, a live map, and the one calm view Arrivo
 * gives. Focus moves up the stack on its own, or follows the pointer over the pills. Decorative only.
 */
export function LayerStack() {
  const [focus, setFocus] = useState(2);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (hovering || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setFocus((value) => (value + 1) % STEPS.length), SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [focus, hovering]);

  const layer = (index: number) => ({
    style: { transform: `translateZ(${BASE_Z[index] + (focus === index ? LIFT : 0)}px)` },
    className: `absolute inset-0 overflow-hidden rounded-[22px] transition-[transform,box-shadow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
      focus === index ? "shadow-[0_0_0_3px_var(--highlight),0_70px_80px_-30px_rgb(20_40_60/0.5)]" : "shadow-[0_40px_60px_-30px_rgb(20_40_60/0.45)]"
    }`,
  });

  return (
    <div aria-hidden="true" className="grid">
      <div className="relative grid h-[340px] place-items-center [perspective:1800px] sm:h-[420px] lg:h-[520px]">
        <div className="relative aspect-[1.4/1] w-[min(380px,78%)] [transform-style:preserve-3d] [transform:rotateX(56deg)_rotate(-36deg)]">
          <div {...layer(0)} className={`${layer(0).className} grid content-start gap-3 bg-card px-5 pb-5 pt-12`}>
            <span className="absolute left-[18px] top-[14px] font-mono text-[11px] tracking-[0.08em] text-muted-foreground">MESSAGES</span>
            <span className="absolute right-4 top-9 -rotate-[10deg] rounded-md border-2 border-foreground/50 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/60">Seen</span>
            <p className="w-fit rounded-2xl rounded-bl-sm bg-muted px-3 py-1.5 text-[12px] text-foreground">Reached home?</p>
            <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-secondary px-3 py-1.5 text-[12px] text-foreground">…</p>
            <p className="w-fit rounded-2xl rounded-bl-sm bg-muted px-3 py-1.5 text-[12px] text-foreground">Call me?</p>
          </div>

          <div {...layer(1)} className={`${layer(1).className} bg-card px-[14px] pb-[14px] pt-10`}>
            <span className="absolute left-[18px] top-[14px] font-mono text-[11px] tracking-[0.08em] text-highlight">LIVE ROUTE</span>
            <div className="relative h-full rounded-xl bg-muted">
              <div className="absolute inset-0 grid grid-cols-7 grid-rows-4 gap-[2px] p-[2px]">
                {Array.from({ length: 28 }, (_, i) => (
                  <i key={i} className={`rounded-[2px] ${i % 5 === 1 ? "bg-spot/30" : "bg-foreground/5"}`} />
                ))}
              </div>
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
                <path d="M10 48 C 30 48, 28 14, 50 22 S 78 42, 90 12" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 5" className="stroke-highlight" />
                <circle cx="10" cy="48" r="4" className="fill-background stroke-highlight" strokeWidth="2" />
                <circle cx="90" cy="12" r="4" className="fill-highlight" />
              </svg>
            </div>
          </div>

          <div {...layer(2)} className={`${layer(2).className} grid grid-cols-[22%_1fr] bg-primary text-primary-foreground`}>
            <div className="grid content-start gap-2.5 bg-primary-foreground/5 px-3 py-4">
              <b className="mb-2 size-[22px] rounded-full bg-spot" />
              <i className="h-1.5 rounded-sm bg-spot" />
              <i className="h-1.5 rounded-sm bg-primary-foreground/20" />
              <i className="h-1.5 rounded-sm bg-primary-foreground/20" />
              <i className="h-1.5 rounded-sm bg-primary-foreground/20" />
            </div>
            <div className="grid grid-rows-[auto_1fr] gap-3 p-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["ARRIVES", "18 min"],
                  ["UPDATED", "Now"],
                  ["FOLLOWING", "2"],
                ].map(([label, value]) => (
                  <span key={label} className="grid rounded-[10px] bg-primary-foreground/10 p-2 text-[15px] font-bold">
                    <small className="font-mono text-[7px] font-normal tracking-[0.1em] text-spot">{label}</small>
                    {value}
                  </span>
                ))}
              </div>
              <div className="flex items-end gap-[7px]">
                {[28, 42, 36, 58, 50, 74].map((height, i) => (
                  <i key={i} style={{ height: `${height}%` }} className="flex-1 rounded-t-[5px] rounded-b-sm bg-gradient-to-b from-spot to-spot/35" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ol className="relative z-10 -mt-3 flex flex-wrap justify-center gap-3 sm:-mt-8 lg:-mt-16" onPointerLeave={() => setHovering(false)}>
        {STEPS.map((label, index) => (
          <li
            key={label}
            onPointerEnter={() => {
              setHovering(true);
              setFocus(index);
            }}
            className={`inline-flex cursor-default items-center gap-2.5 rounded-full py-2.5 pl-2.5 pr-4 text-[15px] font-semibold transition-[background-color,color,box-shadow] duration-500 ${
              focus === index ? "bg-primary text-primary-foreground shadow-raise" : "bg-background text-foreground shadow-soft"
            }`}
          >
            <b className={`grid size-7 place-items-center rounded-full font-mono text-[11px] font-medium ${focus === index ? "bg-spot text-primary" : "text-highlight shadow-press"}`}>
              {String(index + 1).padStart(2, "0")}
            </b>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
