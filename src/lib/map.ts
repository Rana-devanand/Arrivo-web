import "maplibre-gl/dist/maplibre-gl.css";
import type { StyleSpecification } from "maplibre-gl";

/** Free vector tiles from OpenFreeMap (OpenStreetMap data). No account or API key needed. */
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

/** Loads MapLibre on demand. Its web worker is a plain file copied into public/ by scripts/copy-map-worker.mjs. */
export async function loadMapLibre() {
  const maplibre = await import("maplibre-gl");
  maplibre.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
  return maplibre;
}

type Paint = Record<string, string>;

function colour(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--map-${name}`).trim();
}

/** Layer id in the Positron style -> the paint properties we recolour. Colours live in theme.css as --map-*. */
function palette(): Record<string, Paint> {
  const road = { "line-color": colour("road") };
  const motorway = { "line-color": colour("motorway") };
  const motorwayEdge = { "line-color": colour("motorway-edge") };
  const roadEdge = { "line-color": colour("road-edge") };
  const rail = { "line-color": colour("rail") };
  const halo = colour("land");
  const label = (text: string): Paint => ({ "text-color": text, "text-halo-color": halo });
  return {
    background: { "background-color": colour("land") },
    park: { "fill-color": colour("park") },
    landcover_wood: { "fill-color": colour("wood") },
    landuse_residential: { "fill-color": colour("residential") },
    water: { "fill-color": colour("water") },
    waterway: { "line-color": colour("water-line") },
    building: { "fill-color": colour("building"), "fill-outline-color": colour("building-edge") },
    highway_minor: road,
    highway_major_casing: roadEdge,
    highway_major_inner: road,
    highway_motorway_casing: motorwayEdge,
    highway_motorway_inner: motorway,
    highway_motorway_bridge_casing: motorwayEdge,
    highway_motorway_bridge_inner: motorway,
    railway: rail,
    railway_service: rail,
    railway_transit: rail,
    "highway-name-minor": label(colour("label")),
    "highway-name-major": label(colour("label-strong")),
    water_name_point_label: { "text-color": colour("water-label") },
    water_name_line_label: { "text-color": colour("water-label") },
    label_other: label(colour("label-strong")),
    label_village: label(colour("label-strong")),
    label_town: label(colour("label-strong")),
    label_city: label(colour("label-strong")),
  };
}

/**
 * The free Positron style, recoloured (soft land, green parks, blue water, peach motorways) and with 3D
 * buildings. Falls back to the plain style URL if the style cannot be fetched.
 */
export async function loadMapStyle(): Promise<StyleSpecification | string> {
  try {
    const response = await fetch(MAP_STYLE, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("style unavailable");
    const style = (await response.json()) as StyleSpecification;
    const colours = palette();
    for (const layer of style.layers) {
      const paint = colours[layer.id];
      if (paint) layer.paint = { ...layer.paint, ...paint } as typeof layer.paint;
    }
    const firstLabel = style.layers.findIndex((layer) => layer.type === "symbol");
    style.layers.splice(firstLabel === -1 ? style.layers.length : firstLabel, 0, {
      id: "building-3d",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": colour("building"),
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.85,
      },
    });
    return style;
  } catch {
    return MAP_STYLE;
  }
}
