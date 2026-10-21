import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../.next/server/app", import.meta.url));

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith(".html") && !name.startsWith("_") ? [path] : [];
  });
}

let failed = false;
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, "utf8");
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const ok = description.length >= 150 && description.length <= 160 && h1Count === 1;
  if (!ok) failed = true;
  console.log(`${ok ? "ok  " : "FAIL"} ${file.slice(root.length)}: description ${description.length} chars, ${h1Count} h1`);
}
process.exit(failed ? 1 : 0);
