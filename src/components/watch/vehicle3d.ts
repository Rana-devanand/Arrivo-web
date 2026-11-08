/**
 * A small 3D vehicle for the map, made of CSS boxes (no 3D library). It stands on the map: the marker that
 * carries it lies flat on the map surface and tilts with it, so when the map is tilted the boxes rise up and
 * the vehicle has a front, sides and a roof. It turns to face where it is heading.
 *
 * Colours are theme token classes only. Written as DOM code because it is placed inside a map marker, which
 * MapLibre needs as a plain element.
 */

/** One box. [x] and [y] are its centre from the middle of the vehicle (the front points up, so −y is forward); [z] is its height off the ground. */
type Part = {
  w: number;
  l: number;
  h: number;
  x?: number;
  y?: number;
  z?: number;
  side: string;
  top?: string;
  front?: string;
  /** Window glass along the sides, as a colour class. */
  windows?: string;
};

type Style = Partial<Record<keyof CSSStyleDeclaration, string>>;

function el(className: string, style: Style = {}): HTMLDivElement {
  const node = document.createElement("div");
  node.className = className;
  Object.assign(node.style, style);
  return node;
}

/** Each face is a little darker or lighter, so the box reads as solid. */
const SHADE = { top: 1, front: 0.95, back: 0.75, left: 0.85, right: 0.7 } as const;

function face(className: string, style: Style, shade: number): HTMLDivElement {
  return el(className, { ...style, filter: shade === 1 ? "" : `brightness(${shade})` });
}

function windowStrip(colour: string): HTMLDivElement {
  // On a side face the width runs up the box and the height runs along it.
  return el(`absolute inset-y-[8%] left-[32%] w-[40%] rounded-[1px] ${colour}`);
}

/** How much bigger than the drawings below the vehicle is on screen. */
const K = 1.3;

function box(raw: Part): HTMLDivElement {
  const p: Part = { ...raw, w: raw.w * K, l: raw.l * K, h: raw.h * K, x: (raw.x ?? 0) * K, y: (raw.y ?? 0) * K, z: (raw.z ?? 0) * K };
  const x = (p.x ?? 0) - p.w / 2;
  const y = (p.y ?? 0) - p.l / 2;
  const root = el("absolute", {
    left: "0",
    top: "0",
    width: `${p.w}px`,
    height: `${p.l}px`,
    transformStyle: "preserve-3d",
    transform: `translate3d(${x}px, ${y}px, ${p.z ?? 0}px)`,
  });
  const top = p.top ?? p.side;
  root.append(
    face(`absolute inset-0 ${top}`, { transform: `translateZ(${p.h}px)` }, SHADE.top),
    face(`absolute ${p.front ?? p.side}`, { left: "0", top: "0", width: `${p.w}px`, height: `${p.h}px`, transformOrigin: "0 0", transform: "rotateX(90deg)" }, SHADE.front),
    face(`absolute ${p.side}`, { left: "0", top: `${p.l}px`, width: `${p.w}px`, height: `${p.h}px`, transformOrigin: "0 0", transform: "rotateX(90deg)" }, SHADE.back),
  );
  for (const [left, shade] of [[0, SHADE.left], [p.w, SHADE.right]] as const) {
    const side = face(`absolute ${p.side}`, { left: `${left}px`, top: "0", width: `${p.h}px`, height: `${p.l}px`, transformOrigin: "0 0", transform: "rotateY(-90deg)" }, shade);
    if (p.windows) side.append(windowStrip(p.windows));
    root.append(side);
  }
  return root;
}

const GLASS = "bg-foreground";
const TYRE = "bg-foreground";

function wheels(xs: number[], ys: number[], size: { w: number; l: number; h: number }): Part[] {
  return xs.flatMap((x) => ys.map((y) => ({ ...size, x, y, z: 0, side: TYRE })));
}

/** Everything is drawn pointing up (the front is at the top). Lengths are in pixels, on a small marker. */
const BUILDS: Record<string, Part[]> = {
  car: [
    ...wheels([-9.5, 9.5], [-11, 11], { w: 3, l: 7, h: 5 }),
    { w: 18, l: 38, h: 7, z: 2, side: "bg-highlight" },
    { w: 14, l: 17, h: 6, y: 4, z: 9, side: GLASS, top: "bg-card", front: GLASS },
    { w: 4, l: 1.5, h: 2, x: -5.5, y: -19.5, z: 5, side: "bg-warning" },
    { w: 4, l: 1.5, h: 2, x: 5.5, y: -19.5, z: 5, side: "bg-warning" },
  ],
  bike: [
    { w: 2.5, l: 10, h: 10, y: -11, z: 0, side: TYRE },
    { w: 2.5, l: 10, h: 10, y: 11, z: 0, side: TYRE },
    { w: 2, l: 22, h: 2, z: 5, side: "bg-highlight" },
    { w: 11, l: 2, h: 2, y: -9, z: 11, side: "bg-foreground" },
    { w: 6, l: 6, h: 9, y: 2, z: 6, side: "bg-primary", top: "bg-primary" },
    { w: 5, l: 5, h: 5, y: 1, z: 15, side: "bg-warning" },
  ],
  walk: [
    { w: 3, l: 3.5, h: 8, x: -2.2, z: 0, side: "bg-foreground" },
    { w: 3, l: 3.5, h: 8, x: 2.2, z: 0, side: "bg-foreground" },
    { w: 10, l: 5, h: 9, z: 8, side: "bg-highlight", top: "bg-highlight" },
    { w: 2.5, l: 3, h: 8, x: -6, z: 8, side: "bg-highlight" },
    { w: 2.5, l: 3, h: 8, x: 6, z: 8, side: "bg-highlight" },
    { w: 6, l: 6, h: 6, z: 17, side: "bg-warning" },
  ],
  transit: [
    ...wheels([-8.5, 8.5], [-13, 13], { w: 3, l: 7, h: 5 }),
    { w: 17, l: 44, h: 13, z: 2, side: "bg-warning", top: "bg-card", windows: "bg-foreground" },
    { w: 15, l: 1, h: 7, y: -22.5, z: 6, side: GLASS },
  ],
  train: [0, 1, 2].map((i) => ({ w: 16, l: 22, h: 14, y: -24 + i * 24, z: 2, side: "bg-card", top: "bg-primary", windows: "bg-primary", front: i === 0 ? GLASS : "bg-card" })),
  metro: [0, 1].map((i) => ({ w: 16, l: 24, h: 13, y: -13 + i * 26, z: 2, side: "bg-highlight", top: "bg-card", windows: "bg-card", front: i === 0 ? GLASS : "bg-highlight" })),
};

/** A vehicle for a travel mode, ready to be a map marker. Unknown modes get a car. */
export function buildVehicle(mode: string): HTMLElement {
  const parts = BUILDS[mode] ?? BUILDS.car;
  const root = el("relative", { width: "0", height: "0", transformStyle: "preserve-3d" });
  // A ring on the ground: it pulses while the position is live (see [data-pulse]).
  const ring = el("absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2", { width: `${64 * K}px`, height: `${64 * K}px` });
  ring.append(
    el("absolute inset-0 rounded-full border-2 border-primary opacity-60 motion-reduce:animate-none", {}),
    el("absolute inset-[18%] rounded-full bg-primary opacity-20", {}),
  );
  (ring.firstElementChild as HTMLElement).dataset.pulse = "";
  const rotor = el("absolute left-0 top-0 [transition:transform_700ms_ease-out] motion-reduce:transition-none", {
    transformStyle: "preserve-3d",
    width: "0",
    height: "0",
  });
  rotor.dataset.rotor = "";
  const shadow = el("absolute rounded-xl bg-foreground opacity-25 blur-[3px]", { left: `${-14 * K}px`, top: `${-22 * K}px`, width: `${28 * K}px`, height: `${44 * K}px` });
  rotor.append(shadow, ...parts.map(box));
  root.append(ring, rotor);
  return root;
}

/** Turns the vehicle to face [degrees] (0 = north on the map). Pass a number that keeps counting (see turnTo) so it never spins the long way. */
export function setVehicleHeading(root: HTMLElement, degrees: number): void {
  const rotor = root.querySelector<HTMLElement>("[data-rotor]");
  if (rotor) rotor.style.transform = `rotateZ(${degrees}deg)`;
}
