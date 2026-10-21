export const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "muted",
  "muted-foreground",
  "border",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];
export type Palette = Record<ColorToken, string>;

const MIN_RATIO = 4.8;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function hslToHex(h: number, s: number, l: number): string {
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const value = light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Moves lightness in `step` increments until the colour reaches the target contrast against every background. */
function fit(h: number, s: number, startL: number, step: number, backgrounds: readonly string[]): string {
  let l = startL;
  let hex = hslToHex(h, s, l);
  while (l > 0 && l < 100 && backgrounds.some((bg) => contrastRatio(hex, bg) < MIN_RATIO)) {
    l += step;
    hex = hslToHex(h, s, l);
  }
  return hex;
}

function lightPalette(): Palette {
  const h = rand(0, 360);
  const s = rand(25, 60);
  const background = hslToHex(h, s, rand(88, 95));
  const card = hslToHex(h, s, rand(96, 99));
  const muted = hslToHex(h, s, rand(83, 88));
  const secondary = hslToHex(h, s + 5, rand(78, 84));
  const surfaces = [background, card, muted, secondary];
  const foreground = fit(h, 25, 12, 1, surfaces);
  const mutedForeground = fit(h, 22, 40, -1, surfaces);
  const primaryHue = Math.random() < 0.4 ? h : (h + rand(0, 80)) % 360;
  const primary = Math.random() < 0.4 ? hslToHex(h, 15, 5) : fit(primaryHue, rand(50, 75), 40, -1, [card]);
  const accent = fit((h + rand(120, 200)) % 360, rand(45, 70), 40, -1, [card]);
  return {
    background,
    foreground,
    card,
    "card-foreground": foreground,
    primary,
    "primary-foreground": card,
    secondary,
    "secondary-foreground": foreground,
    accent,
    "accent-foreground": card,
    muted,
    "muted-foreground": mutedForeground,
    border: hslToHex(h, s - 10, rand(62, 72)),
  };
}

function darkPalette(): Palette {
  const h = rand(0, 360);
  const s = rand(20, 50);
  const background = hslToHex(h, s, rand(5, 10));
  const card = hslToHex(h, s, rand(10, 14));
  const muted = hslToHex(h, s, rand(13, 17));
  const secondary = hslToHex(h, s, rand(18, 24));
  const surfaces = [background, card, muted, secondary];
  const foreground = fit(h, 25, 88, -1, surfaces);
  const mutedForeground = fit(h, 20, 60, 1, surfaces);
  const primary = fit(Math.random() < 0.4 ? h : (h + rand(0, 80)) % 360, rand(40, 70), 60, 1, [background]);
  const accent = fit((h + rand(120, 200)) % 360, rand(55, 75), 55, 1, [background]);
  return {
    background,
    foreground,
    card,
    "card-foreground": foreground,
    primary,
    "primary-foreground": background,
    secondary,
    "secondary-foreground": foreground,
    accent,
    "accent-foreground": background,
    muted,
    "muted-foreground": mutedForeground,
    border: hslToHex(h, s, rand(24, 30)),
  };
}

/** A random palette whose text and surface pairs all pass WCAG AA. */
export function randomPalette(): Palette {
  return Math.random() < 0.65 ? lightPalette() : darkPalette();
}

export const CONTRAST_PAIRS: readonly (readonly [ColorToken, ColorToken])[] = [
  ["foreground", "background"],
  ["primary-foreground", "primary"],
  ["muted-foreground", "background"],
  ["accent-foreground", "accent"],
];
