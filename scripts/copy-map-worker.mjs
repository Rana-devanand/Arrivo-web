import { copyFileSync, mkdirSync } from "node:fs";

/** MapLibre starts its own web worker from a plain file URL; the bundler cannot serve it, so copy it into public/. */
const from = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const to = new URL("../public/maplibre/", import.meta.url);
mkdirSync(to, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(new URL(file, from), new URL(file, to));
