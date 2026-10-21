"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { COLOR_TOKENS, CONTRAST_PAIRS, contrastRatio, randomPalette, type ColorToken, type Palette } from "@/lib/palette";

const STYLE_ID = "theme-palette-override";

function readTokens(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const palette = {} as Palette;
  for (const token of COLOR_TOKENS) {
    const raw = styles.getPropertyValue(`--${token}`).trim().toLowerCase();
    palette[token] = /^#[0-9a-f]{6}$/.test(raw) ? raw : "#000000";
  }
  return palette;
}

/** An injected style element beats the dark-mode media query, so the preview works in either scheme. */
function applyTokens(palette: Palette) {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  const body = COLOR_TOKENS.map((token) => `--${token}: ${palette[token]};`).join(" ");
  style.textContent = `:root, :root:root { ${body} }`;
}

function toCss(palette: Palette): string {
  return `:root {\n${COLOR_TOKENS.map((token) => `  --${token}: ${palette[token]};`).join("\n")}\n}`;
}

const buttonClasses =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-primary px-4 text-sm font-semibold hover:bg-secondary";

export function ThemePalette() {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [status, setStatus] = useState("");

  const load = () => {
    if (palette === null) setPalette(readTokens());
  };

  const update = (next: Palette) => {
    applyTokens(next);
    setPalette(next);
  };

  const change = (token: ColorToken, value: string) => {
    if (palette) update({ ...palette, [token]: value });
  };

  const reset = () => {
    document.getElementById(STYLE_ID)?.remove();
    setPalette(readTokens());
    setStatus("Back to the colours in theme.css");
  };

  const copy = async () => {
    if (!palette) return;
    try {
      await navigator.clipboard.writeText(toCss(palette));
      setStatus("CSS copied. Paste it over the :root block in src/styles/theme.css");
    } catch {
      setStatus("Could not copy. Select the CSS below and copy it by hand.");
    }
  };

  return (
    <Container className="mt-8 border-t border-border pt-6">
      <details onToggle={load} className="group rounded-lg border border-border bg-card text-card-foreground">
        <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 px-4 py-2 font-semibold">
          <span>Colour playground (design tool)</span>
          <span className="text-sm font-normal text-muted-foreground group-open:hidden">Open</span>
        </summary>
        {palette ? (
          <div className="space-y-5 px-4 pb-5">
            <p className="text-sm text-muted-foreground">
              Pick any colour or press Random. Only this tab changes. Press Copy CSS when you like it, then paste it into <code>src/styles/theme.css</code>.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={`${buttonClasses} bg-primary text-primary-foreground`} onClick={() => update(randomPalette())}>
                Random palette
              </button>
              <button type="button" className={buttonClasses} onClick={copy}>
                Copy CSS
              </button>
              <button type="button" className={buttonClasses} onClick={reset}>
                Reset
              </button>
            </div>
            <p role="status" className="min-h-5 text-sm text-muted-foreground">
              {status}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {COLOR_TOKENS.map((token) => (
                <li key={token}>
                  <label className="flex items-center gap-3 rounded-md border border-border p-2 text-sm">
                    <input
                      type="color"
                      value={palette[token]}
                      onChange={(event) => change(token, event.target.value)}
                      className="size-9 shrink-0 cursor-pointer rounded-sm border border-border bg-transparent p-0"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{token}</span>
                      <span className="block text-muted-foreground">{palette[token]}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {CONTRAST_PAIRS.map(([foreground, background]) => {
                const ratio = contrastRatio(palette[foreground], palette[background]);
                return (
                  <li key={foreground + background}>
                    {foreground} on {background}: {ratio.toFixed(1)}:1 {ratio >= 4.5 ? "(passes AA)" : "(fails AA)"}
                  </li>
                );
              })}
            </ul>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-muted-foreground" tabIndex={0}>
              {toCss(palette)}
            </pre>
          </div>
        ) : null}
      </details>
    </Container>
  );
}
