"use client";

import { useEffect, useRef } from "react";
import { buildShape, type DotShapeId } from "@/lib/dot-shapes";

type Rgb = readonly [number, number, number];

const CAMERA = 3;
const FALLBACK: Rgb = [29, 74, 106];
/** How long the dots drift across the whole section before they gather into the next shape. */
const SCATTER_SECONDS = 1.8;
const PUSH_RADIUS = 60;

function readColor(name: string): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!/^#[0-9a-f]{6}$/i.test(raw)) return FALLBACK;
  return [parseInt(raw.slice(1, 3), 16), parseInt(raw.slice(3, 5), 16), parseInt(raw.slice(5, 7), 16)];
}

/**
 * A cloud of dots that fills its box. On every change of `shape` the dots scatter over the whole box and
 * then gather into the new shape. The cursor pushes nearby dots away a little.
 * Decorative only.
 */
export function DotCanvas({ shape, className = "" }: { shape: DotShapeId; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef(shape);
  const wake = useRef<() => void>(() => undefined);

  useEffect(() => {
    shapeRef.current = shape;
    wake.current();
  }, [shape]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = window.matchMedia("(max-width: 640px)").matches ? 1000 : 1900;
    const main = readColor("--primary");
    const spot = readColor("--spot");
    const current = new Float32Array(dots * 3);
    const target = new Float32Array(dots * 3);
    const formed = new Float32Array(dots * 3);
    const offset = new Float32Array(dots * 2);
    const tone = new Uint8Array(dots);
    const pointer = { x: 0, y: 0, active: false };
    let loaded: DotShapeId | null = null;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let scale = 1;
    let scatterEnd = 0;
    let visible = true;
    let frame = 0;
    let last = 0;
    let clock = 0;
    let spin = 0.5;

    function layout() {
      const wide = width >= 1024;
      const box = wide ? Math.min(height * 0.8, width * 0.42) : Math.min(width * 0.9, 440);
      scale = box * 0.4;
      centerX = wide ? width * 0.72 : width / 2;
      centerY = wide ? height / 2 : height - box * 0.6;
    }

    function scatter() {
      for (let i = 0; i < dots; i += 1) {
        target[i * 3] = (Math.random() * width - centerX) / scale;
        target[i * 3 + 1] = (centerY - Math.random() * height) / scale;
        target[i * 3 + 2] = Math.random() * 2 - 1;
      }
    }

    function load(id: DotShapeId) {
      buildShape(id, dots, 7).forEach(([x, y, z, t], i) => {
        formed.set([x, y, z], i * 3);
        tone[i] = t;
      });
      if (reduced) {
        current.set(formed);
        target.set(formed);
      } else if (loaded === null) {
        scatter();
        current.set(target);
        target.set(formed);
      } else {
        scatter();
        scatterEnd = clock + SCATTER_SECONDS;
      }
      loaded = id;
    }

    function resize() {
      if (!el || !ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layout();
    }

    function draw(dt: number) {
      if (!ctx || width === 0) return;
      clock += dt;
      if (loaded !== shapeRef.current) load(shapeRef.current);
      if (scatterEnd > 0 && clock >= scatterEnd) {
        target.set(formed);
        scatterEnd = 0;
      }
      const ease = 1 - Math.exp(-dt * (scatterEnd > 0 ? 1.1 : 2.2));
      if (!reduced) spin += dt * 0.35;
      const cy = Math.cos(spin);
      const sy = Math.sin(spin);
      const cp = Math.cos(-0.18);
      const sp = Math.sin(-0.18);
      const dotSize = Math.max(0.9, Math.min(width, 1200) * 0.0013);
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < dots; i += 1) {
        const k = i * 3;
        current[k] += (target[k] - current[k]) * ease;
        current[k + 1] += (target[k + 1] - current[k + 1]) * ease;
        current[k + 2] += (target[k + 2] - current[k + 2]) * ease;
        const x1 = current[k] * cy + current[k + 2] * sy;
        const z1 = -current[k] * sy + current[k + 2] * cy;
        const y2 = current[k + 1] * cp - z1 * sp;
        const z2 = current[k + 1] * sp + z1 * cp;
        const f = CAMERA / (CAMERA - Math.min(z2, 1.8));
        const sx = centerX + x1 * f * scale;
        const syy = centerY - y2 * f * scale;

        let pushX = 0;
        let pushY = 0;
        if (pointer.active) {
          const dx = sx - pointer.x;
          const dy = syy - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < PUSH_RADIUS) {
            const power = (1 - d / PUSH_RADIUS) * PUSH_RADIUS;
            pushX = (dx / d) * power * 0.22 - (dy / d) * power * 0.08;
            pushY = (dy / d) * power * 0.22 + (dx / d) * power * 0.08;
          }
        }
        offset[i * 2] += (pushX - offset[i * 2]) * 0.18;
        offset[i * 2 + 1] += (pushY - offset[i * 2 + 1]) * 0.18;

        const depth = Math.min(1, Math.max(0, (z2 + 1) / 2));
        const [r, g, b] = tone[i] ? spot : main;
        ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + depth * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx + offset[i * 2], syy + offset[i * 2 + 1], dotSize * f, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick(now: number) {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      draw(dt);
      if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }

    function start() {
      if (frame === 0) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function move(event: PointerEvent) {
      const rect = el?.getBoundingClientRect();
      if (!rect || event.pointerType !== "mouse" || reduced) return;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    }

    function leave() {
      pointer.active = false;
    }

    wake.current = start;
    resize();
    start();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    const sizer = new ResizeObserver(() => {
      resize();
      start();
    });
    observer.observe(el);
    sizer.observe(el);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizer.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
      wake.current = () => undefined;
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className={className} />;
}
