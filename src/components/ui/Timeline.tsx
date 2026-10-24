"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import type { Step } from "@/config/content";
import { AppScreen } from "./AppScreen";
import { FadeIn } from "./FadeIn";
import { Heading } from "./Heading";

/**
 * Steps down a vertical line that fills as you scroll. Each numbered dot lights up when the line reaches it,
 * with the step's words on one side and its screen on the other.
 */
export function Timeline({ steps }: { steps: readonly Step[] }) {
  const container = useRef<HTMLOListElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [positions, setPositions] = useState<number[]>([]);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({ target: container, offset: ["start center", "end center"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const measure = () => {
      const top = el.getBoundingClientRect().top;
      setPositions(dots.current.map((dot) => (dot ? dot.getBoundingClientRect().top - top + dot.offsetHeight / 2 : 0)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [steps.length]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const container_ = container.current;
    if (!container_) return;
    const line = latest * container_.offsetHeight;
    const count = positions.filter((position) => position <= line).length;
    setReached((current) => (current === count ? current : count));
  });

  return (
    <ol ref={container} className="relative mx-auto flex max-w-5xl flex-col gap-16 pl-12 sm:pl-16 lg:gap-24">
      <span aria-hidden="true" className="absolute bottom-0 left-[17.5px] top-0 w-[5px] rounded-full border border-foreground/10 bg-background sm:left-[21.5px]" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: fill, transformOrigin: "top" }}
        className="absolute bottom-0 left-[17.5px] top-0 w-[5px] rounded-full bg-primary sm:left-[21.5px]"
      />
      {steps.map((step, index) => {
        const lit = index < reached;
        const visual = Boolean(step.photo ?? step.screen);
        return (
          <li key={step.title} className={`relative grid items-center gap-6 lg:gap-12 ${visual ? "lg:grid-cols-2" : ""}`}>
            <span
              ref={(el) => {
                dots.current[index] = el;
              }}
              className="absolute -left-12 top-0 flex size-10 items-center justify-center overflow-hidden rounded-full bg-background font-mono text-xs font-semibold shadow-md sm:-left-16 sm:size-12 sm:text-sm"
            >
              <motion.span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary" animate={{ scale: lit ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} />
              <span className={`relative z-10 transition-colors duration-300 ${lit ? "text-primary-foreground" : "text-primary"}`}>{String(index + 1).padStart(2, "0")}</span>
            </span>
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <FadeIn>
                <Heading level={3} className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {step.title}
                </Heading>
              </FadeIn>
              <FadeIn delay={120}>
                <p className="mt-3 text-base text-muted-foreground">{step.text}</p>
              </FadeIn>
            </div>
            {visual ? (
            <FadeIn delay={200} className={index % 2 === 1 ? "lg:order-1" : ""}>
              <div className="group mx-auto flex max-w-md justify-center rounded-[28px] bg-background p-6 shadow-raise">
                {step.photo ? (
                  <Image src={step.photo.src} alt={step.photo.alt} width={step.photo.width} height={step.photo.height} unoptimized className="h-auto w-full max-w-64 drop-shadow-2xl" />
                ) : step.screen ? (
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    <AppScreen variant={step.screen} size="sm" />
                  </div>
                ) : null}
              </div>
            </FadeIn>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
