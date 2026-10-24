"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** A card that fades up when it scrolls into view and tilts in 3D toward the pointer. */
export function TiltCard({ children, index = 0, className = "" }: { children: ReactNode; index?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 260, damping: 20 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  function track(clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="h-full perspective-[1000px]"
    >
      <motion.div
        ref={ref}
        onPointerMove={(event) => event.pointerType === "mouse" && track(event.clientX, event.clientY)}
        onPointerLeave={reset}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduceMotion ? undefined : { y: -6 }}
        className={`h-full ${className}`}
      >
        {children}
      </motion.div>
    </motion.li>
  );
}
