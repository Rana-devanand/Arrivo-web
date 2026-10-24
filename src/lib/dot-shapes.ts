/** Point clouds for the hero canvas. Coordinates are roughly -1..1, y up. Tone 0 is the main colour, 1 the highlight. */
export type DotShapeId = "journey" | "location" | "ontime" | "safe";

export type Dot = readonly [x: number, y: number, z: number, tone: 0 | 1];

type Vec2 = readonly [number, number];

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LAYERS = [-0.2, -0.1, 0, 0.1, 0.2];

function along(points: readonly Vec2[], step: number, tone: 0 | 1, layers: readonly number[] = LAYERS, closed = false): Dot[] {
  const out: Dot[] = [];
  const count = closed ? points.length : points.length - 1;
  for (let i = 0; i < count; i += 1) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % points.length];
    const steps = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step));
    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      for (const z of layers) out.push([ax + (bx - ax) * t, ay + (by - ay) * t, z, tone]);
    }
  }
  return out;
}

function ring(cx: number, cy: number, cz: number, radius: number, count: number, tone: 0 | 1, plane: "xy" | "xz"): Dot[] {
  return Array.from({ length: count }, (_, i): Dot => {
    const a = (i / count) * Math.PI * 2;
    const u = Math.cos(a) * radius;
    const v = Math.sin(a) * radius;
    return plane === "xy" ? [cx + u, cy + v, cz, tone] : [cx + u, cy, cz + v, tone];
  });
}

function inside(polygon: readonly Vec2[], x: number, y: number) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function journey(): Dot[] {
  const roof: Vec2[] = [[-0.82, 0.05], [0, 0.78], [0.82, 0.05]];
  const walls: Vec2[] = [[-0.62, 0.05], [-0.62, -0.72], [0.62, -0.72], [0.62, 0.05]];
  const door: Vec2[] = [[-0.18, -0.72], [-0.18, -0.25], [0.18, -0.25], [0.18, -0.72]];
  return [...along(roof, 0.028, 0), ...along(walls, 0.028, 0), ...along(door, 0.026, 1)];
}

function location(): Dot[] {
  const out: Dot[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const top = 0.28;
  const radius = 0.46;
  const samples = 900;
  for (let i = 0; i < samples; i += 1) {
    const y = top + (i / samples) * radius;
    const r = Math.sqrt(Math.max(0, radius * radius - (y - top) ** 2));
    out.push([Math.cos(i * golden) * r, y, Math.sin(i * golden) * r, 0]);
  }
  for (let i = 0; i < 18; i += 1) {
    const t = i / 17;
    const r = radius * (1 - t) ** 0.85;
    out.push(...ring(0, top - t * 1.05, 0, r, Math.max(4, Math.round(r * 110)), 0, "xz"));
  }
  out.push(...ring(0, top, radius + 0.02, 0.16, 32, 1, "xy"));
  out.push(...ring(0, -0.82, 0, 0.5, 70, 1, "xz"), ...ring(0, -0.82, 0, 0.8, 110, 1, "xz"));
  return out;
}

function ontime(): Dot[] {
  const out: Dot[] = [];
  const major = 0.72;
  const minor = 0.12;
  for (let i = 0; i < 140; i += 1) {
    for (let j = 0; j < 12; j += 1) {
      const theta = (i / 140) * Math.PI * 2;
      const phi = (j / 12) * Math.PI * 2;
      const rr = major + minor * Math.cos(phi);
      const progress = (theta + Math.PI / 2) % (Math.PI * 2) < Math.PI * 1.35;
      out.push([Math.cos(theta) * rr, Math.sin(theta) * rr, minor * Math.sin(phi), progress ? 0 : 1]);
    }
  }
  out.push(...along([[0, 0], [0, 0.5]], 0.03, 1, [-0.04, 0, 0.04]), ...along([[0, 0], [0.32, -0.12]], 0.03, 1, [-0.04, 0, 0.04]));
  return out;
}

function safe(): Dot[] {
  const outline: Vec2[] = [[0, 0.88], [0.7, 0.58], [0.7, -0.05], [0.55, -0.52], [0, -0.92], [-0.55, -0.52], [-0.7, -0.05], [-0.7, 0.58]];
  const out = along(outline, 0.03, 0, [-0.15, -0.05, 0.05, 0.15], true);
  const random = seeded(11);
  let placed = 0;
  while (placed < 700) {
    const x = (random() * 2 - 1) * 0.7;
    const y = (random() * 2 - 1) * 0.9;
    if (inside(outline, x, y)) {
      out.push([x, y, random() < 0.5 ? -0.15 : 0.15, 0]);
      placed += 1;
    }
  }
  out.push(...along([[-0.3, 0], [-0.08, -0.26], [0.32, 0.26]], 0.02, 1, [0.2, 0.26, 0.32, 0.38]));
  return out;
}

const builders: Record<DotShapeId, () => Dot[]> = { journey, location, ontime, safe };

/** Exactly `count` dots, in a shuffled order so every shape morphs into the next like dust. */
export function buildShape(id: DotShapeId, count: number, seed: number): Dot[] {
  const source = builders[id]();
  const random = seeded(seed);
  const picked = Array.from({ length: count }, (_, i): Dot => {
    const dot = source[Math.floor((i * source.length) / count) % source.length];
    if (source.length >= count) return dot;
    return [dot[0] + (random() - 0.5) * 0.03, dot[1] + (random() - 0.5) * 0.03, dot[2] + (random() - 0.5) * 0.03, dot[3]];
  });
  for (let i = picked.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
}
