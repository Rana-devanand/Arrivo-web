import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/theme.css", import.meta.url), "utf8");

const pairs = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["primary", "background"],
  ["foreground", "muted"],
];

function parseBlock(block) {
  const tokens = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[m[1]] = m[2];
  return tokens;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const light = parseBlock(css.match(/:root\s*\{([^}]*)\}/)[1]);

let failed = false;
for (const [name, tokens] of [["light", light]]) {
  for (const [fg, bg] of pairs) {
    const value = ratio(tokens[fg], tokens[bg]);
    const ok = value >= 4.5;
    if (!ok) failed = true;
    console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(5)} ${fg} on ${bg}: ${value.toFixed(2)}`);
  }
}
process.exit(failed ? 1 : 0);
