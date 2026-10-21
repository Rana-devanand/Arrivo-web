import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Reads light-mode color tokens from theme.css so server-rendered images stay in sync with the theme. */
export async function readThemeTokens(): Promise<Record<string, string>> {
  const css = await readFile(join(process.cwd(), "src/styles/theme.css"), "utf8");
  const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
  const tokens: Record<string, string> = {};
  for (const match of root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
