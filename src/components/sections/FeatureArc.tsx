"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import type { Feature } from "@/config/content";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FeatureGrid } from "@/components/ui/FeatureGrid";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { SplitWords } from "@/components/ui/SplitWords";

type ArcFrame = { width: number; height: number; centerX: number; centerY: number; radius: number; angle: number; visible: number; path: string };

/** Coordinate frames for the arc the step badges slide along. Desktop shows neighbours, phones show one step. */
const DESKTOP: ArcFrame = { width: 1200, height: 520, centerX: 600, centerY: 760, radius: 700, angle: 28, visible: 48, path: "M -30 460 A 700 700 0 0 1 1230 460" };
const PHONE: ArcFrame = { width: 380, height: 110, centerX: 190, centerY: 480, radius: 450, angle: 18, visible: 12, path: "M -20 82 A 450 450 0 0 1 400 82" };

const SECTION_VH_PER_STEP = 45;
const EASE = [0.22, 1, 0.36, 1] as const;

function useMedia(query: string, server: boolean) {
  const subscribe = useMemo(
    () => (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => server);
}

type ArcHead = { eyebrow: string; title: string; intro: string };

/**
 * The home features as a scroll-driven arc: the section sticks while you scroll, step badges glide along a
 * curved rail, and the feature in the middle changes. Visitors who prefer reduced motion get a plain grid.
 */
export function FeatureArc({ features, head, href }: { features: readonly Feature[]; head: ArcHead; href: string }) {
  const container = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);
  const reduced = useMedia("(prefers-reduced-motion: reduce)", false);
  const phone = useMedia("(max-width: 639px)", false);
  const total = features.length;

  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(0);

  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, total - 1)]);
  const smooth = useSpring(raw, { stiffness: 90, damping: 22, mass: 0.5 });

  useMotionValueEvent(smooth, "change", (latest) => {
    setPosition(latest);
    setActive(Math.min(total - 1, Math.max(0, Math.round(latest))));
  });

  const goTo = useCallback(
    (index: number) => {
      const target = Math.min(total - 1, Math.max(0, index));
      setActive(target);
      const el = container.current;
      if (!el || total <= 1) return;
      const scrollable = el.scrollHeight - window.innerHeight;
      if (scrollable > 0) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top + (target / (total - 1)) * scrollable, behavior: "smooth" });
    },
    [total],
  );

  function swipeEnd(clientX: number) {
    if (touchStart.current === null) return;
    const diff = touchStart.current - clientX;
    if (Math.abs(diff) > 40) goTo(active + (diff > 0 ? 1 : -1));
    touchStart.current = null;
  }

  if (reduced) {
    return (
      <section id="features" aria-labelledby="features-title" className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[84rem] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <Eyebrow>{head.eyebrow}</Eyebrow>
            <Heading level={2} id="features-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {head.title}
            </Heading>
            <p className="mt-4 text-muted-foreground">{head.intro}</p>
          </div>
          <FeatureGrid items={features} columns={4} />
        </div>
      </section>
    );
  }

  const frame = phone ? PHONE : DESKTOP;
  const current = features[active];
  const counter = `${String(active + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  const content = (
    <div className="flex w-full flex-col items-center text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(3px)" }}
          transition={{ duration: 0.28, ease: EASE }}
          className="flex w-full flex-col items-center"
        >
          <AnimatedIcon name={current.icon} className="mb-3 size-12 text-highlight" />
          <h3 className="mb-2 font-heading text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{current.title}</h3>
          <p className="mx-auto min-h-11 max-w-sm text-sm text-muted-foreground sm:max-w-md lg:text-base">{current.text}</p>
        </motion.div>
      </AnimatePresence>
      <Button href={href} variant="outline" size="sm" className="mt-5">
        Explore every feature
        <Icon name="arrow" className="size-4" />
      </Button>
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground">{counter}</span>
        <div className="flex items-center">
          {features.map((feature, i) => (
            <button key={feature.title} type="button" onClick={() => goTo(i)} aria-label={`Show ${feature.title}`} aria-current={i === active} className="group inline-flex size-6 items-center justify-center">
              <span className={`rounded-full transition-all duration-300 ${i === active ? "size-2.5 bg-primary" : "size-2 bg-border group-hover:bg-muted-foreground"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={container}
      id="features"
      aria-labelledby="features-title"
      style={{ height: `${100 + total * SECTION_VH_PER_STEP}vh` }}
      className="relative select-none"
    >
      <ul className="sr-only">
        {features.map((feature) => (
          <li key={feature.title}>
            {feature.title}. {feature.text}
          </li>
        ))}
      </ul>
      <div className="sticky top-0 flex h-svh w-full flex-col justify-center gap-2 overflow-hidden pb-6 pt-24 sm:justify-between sm:pb-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 size-[22rem] rounded-full bg-highlight/10 blur-3xl sm:size-[28rem]" />
          <div className="absolute right-1/4 top-1/4 size-[22rem] rounded-full bg-spot/20 blur-3xl sm:size-[28rem]" />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-2xl px-4 text-center">
          <div className="mb-2 flex justify-center">
            <Eyebrow>{head.eyebrow}</Eyebrow>
          </div>
          <Heading level={2} id="features-title" className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            <SplitWords text={head.title} />
          </Heading>
          <p className="mt-2 hidden text-muted-foreground sm:block">{head.intro}</p>
        </div>

        <div
          onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
          onTouchEnd={(event) => swipeEnd(event.changedTouches[0].clientX)}
          className={`relative mx-auto w-full ${phone ? "my-auto max-w-sm px-4" : "my-auto h-[490px] max-w-[1100px] px-2 lg:h-[530px]"}`}
        >
          <div className={phone ? "relative mx-auto h-[105px] w-full max-w-[380px]" : "absolute inset-0"}>
            <svg viewBox={`0 0 ${frame.width} ${frame.height}`} preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
              <defs>
                <linearGradient id="arc-rail" x1="0" y1="0" x2="1" y2="0">
                  {[0, 0.12, 0.25, 0.5, 0.75, 0.88, 1].map((offset, i) => (
                    <stop key={offset} offset={`${offset * 100}%`} style={{ stopColor: "var(--card)", stopOpacity: [0, 0.6, 0.95, 1, 0.95, 0.6, 0][i] }} />
                  ))}
                </linearGradient>
                <linearGradient id="arc-shadow" x1="0" y1="0" x2="1" y2="0">
                  {[0, 0.2, 0.5, 0.8, 1].map((offset, i) => (
                    <stop key={offset} offset={`${offset * 100}%`} style={{ stopColor: "var(--primary)", stopOpacity: [0, 0.1, 0.18, 0.1, 0][i] }} />
                  ))}
                </linearGradient>
              </defs>
              <path d={frame.path} fill="none" stroke="url(#arc-shadow)" strokeWidth={phone ? 12 : 14} strokeLinecap="round" />
              <path d={frame.path} fill="none" stroke="url(#arc-rail)" strokeWidth={phone ? 9 : 11} strokeLinecap="round" />
              <path d={frame.path} fill="none" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.9" style={{ stroke: "var(--card)" }} />
            </svg>

            <div className="pointer-events-none absolute inset-0">
              {features.map((feature, index) => {
                const angleDeg = (index - position) * frame.angle;
                const absAngle = Math.abs(angleDeg);
                if (absAngle > frame.visible) return null;
                const rad = (angleDeg * Math.PI) / 180;
                const left = ((frame.centerX + frame.radius * Math.sin(rad)) / frame.width) * 100;
                const top = ((frame.centerY - frame.radius * Math.cos(rad)) / frame.height) * 100;
                const fadeFrom = frame.visible - 14;
                const opacity = phone ? Math.max(0, 1 - (absAngle / frame.visible) ** 2) : absAngle > fadeFrom ? Math.max(0, (frame.visible - absAngle) / 14) : 1;
                const apex = absAngle < (phone ? frame.visible : 14);
                const label = String(index + 1).padStart(2, "0");
                return (
                  <div key={feature.title} className="pointer-events-auto absolute" style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`, opacity }}>
                    {apex ? (
                      <div className="flex flex-col items-center">
                        <span className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Feature</span>
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary font-mono text-sm font-bold text-primary-foreground shadow-lg sm:size-12">{label}</div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          goTo(index);
                        }}
                        aria-label={`Jump to ${feature.title}`}
                        className="flex size-10 items-center justify-center rounded-xl border border-card bg-card/95 font-mono text-xs font-semibold text-muted-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 hover:text-primary active:scale-95 sm:size-11"
                      >
                        {label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {phone ? <div className="mt-2">{content}</div> : <div className="absolute left-1/2 top-[55%] z-10 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4">{content}</div>}
        </div>
      </div>
    </section>
  );
}
