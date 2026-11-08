"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, IControl, Map as MapLibreMap, Marker } from "maplibre-gl";
import { loadMapLibre, loadMapStyle } from "@/lib/map";
import { bearingDeg, between, haversineKm, turnTo, type LatLng } from "@/lib/watch";
import { buildVehicle, setVehicleHeading } from "@/components/watch/vehicle3d";

type MapLibre = typeof import("maplibre-gl");

type Props = {
  /** Where the traveller is going. */
  destination: LatLng | null;
  destinationName: string;
  /** The planned route. */
  route: LatLng[];
  /** Where the traveller has been, as seen from this page. */
  trail: LatLng[];
  /** Where the traveller is now. Null until the first location. */
  traveller: LatLng | null;
  /** How the traveller is travelling (walk, bike, car, transit, train, metro): it picks the vehicle. */
  mode: string;
  /** The position is recent. A position that has stopped updating is shown still, never pulsing. */
  live: boolean;
  /** Keep the traveller in the middle of the map. */
  follow: boolean;
  /** How much of the map's bottom the info panel covers, so the traveller is kept in the part that can be seen. Zero until measured. */
  insetBottom: number;
  /** The person dragged the map: following stops until they ask for it again. */
  onUserMoved: () => void;
  label: string;
};

const SLIDE_MS = 1500;
/** How far the map leans back when it is in 3D, in degrees. */
const TILT = 55;
/** A move shorter than this (metres) is GPS jitter, not a turn. */
const TURN_MIN_METRES = 4;

/** A small "3D / 2D" button in MapLibre's own control stack. */
class TiltControl implements IControl {
  private box: HTMLDivElement | null = null;

  constructor(
    private readonly isTilted: () => boolean,
    private readonly toggle: () => void,
  ) {}

  onAdd(): HTMLElement {
    const box = document.createElement("div");
    box.className = "maplibregl-ctrl maplibregl-ctrl-group";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "font-semibold text-xs";
    button.addEventListener("click", () => {
      this.toggle();
      this.paint(button);
    });
    this.paint(button);
    box.append(button);
    this.box = box;
    return box;
  }

  private paint(button: HTMLButtonElement) {
    const tilted = this.isTilted();
    button.textContent = tilted ? "2D" : "3D";
    button.title = tilted ? "Switch to a flat map" : "Switch to a 3D map";
    button.setAttribute("aria-label", button.title);
  }

  onRemove(): void {
    this.box?.remove();
    this.box = null;
  }
}

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

const lngLat = ([lat, lng]: LatLng): [number, number] => [lng, lat];

function line(points: LatLng[]) {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: points.map(lngLat) } } as const;
}

/** The live map: planned route, the path travelled, the destination, and the traveller sliding between updates. */
export function WatchMap({ destination, destinationName, route, trail, traveller, live, follow, insetBottom, onUserMoved, mode, label }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const lib = useRef<MapLibre | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const travellerMarker = useRef<Marker | null>(null);
  const destinationMarker = useRef<Marker | null>(null);
  const shown = useRef<LatLng | null>(null);
  const frame = useRef(0);
  const fitted = useRef(false);
  const followRef = useRef(follow);
  const tilted = useRef(true);
  const heading = useRef(0);
  const markerMode = useRef("");
  const trailRef = useRef(trail);
  const destinationRef = useRef(destination);
  const movedRef = useRef(onUserMoved);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    followRef.current = follow;
    movedRef.current = onUserMoved;
    trailRef.current = trail;
    destinationRef.current = destination;
  }, [follow, onUserMoved, trail, destination]);

  // Start the map once.
  useEffect(() => {
    const target = container.current;
    if (!target) return;
    let cancelled = false;
    void (async () => {
      const [maplibre, style] = await Promise.all([loadMapLibre(), loadMapStyle()]);
      if (cancelled) return;
      lib.current = maplibre;
      const instance = new maplibre.Map({
        container: target,
        style,
        center: [78.9, 22.5],
        zoom: 4,
        attributionControl: { compact: true },
      });
      instance.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
      instance.addControl(
        new TiltControl(
          () => tilted.current,
          () => {
            tilted.current = !tilted.current;
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            instance.easeTo({ pitch: tilted.current ? TILT : 0, duration: reduced ? 0 : 600 });
          },
        ),
        "top-right",
      );
      instance.on("dragstart", () => movedRef.current());
      map.current = instance;
      await new Promise<void>((resolve) => instance.once("load", () => resolve()));
      if (cancelled) return;
      const empty = line([]);
      instance.addSource("route", { type: "geojson", data: empty });
      instance.addSource("trail", { type: "geojson", data: empty });
      instance.addLayer({
        id: "route-halo",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": token("background"), "line-width": 9, "line-opacity": 0.9 },
      });
      instance.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": token("primary"), "line-width": 4, "line-opacity": 0.55, "line-dasharray": [1, 1.6] },
      });
      instance.addLayer({
        id: "trail-line",
        type: "line",
        source: "trail",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": token("highlight"), "line-width": 5 },
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame.current);
      travellerMarker.current?.remove();
      destinationMarker.current?.remove();
      travellerMarker.current = null;
      destinationMarker.current = null;
      map.current?.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  // Keep the middle of the map above the panel, so "the middle" is always a place the person can see.
  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance || insetBottom <= 0) return;
    instance.setPadding({ top: 80, bottom: insetBottom + 16, left: 16, right: 16 });
    const at = shown.current;
    if (followRef.current && at) instance.jumpTo({ center: lngLat(at) });
  }, [ready, insetBottom]);

  // The planned route and the path travelled.
  useEffect(() => {
    const instance = map.current;
    if (!ready || !instance) return;
    (instance.getSource("route") as GeoJSONSource | undefined)?.setData(line(route));
    (instance.getSource("trail") as GeoJSONSource | undefined)?.setData(line(trail));
  }, [ready, route, trail]);

  // The destination pin. Its name is set as text, never as markup.
  useEffect(() => {
    const instance = map.current;
    const maplibre = lib.current;
    if (!ready || !instance || !maplibre) return;
    destinationMarker.current?.remove();
    destinationMarker.current = null;
    if (!destination) return;
    const el = document.createElement("div");
    el.className = "relative";
    el.innerHTML = `<span class="block size-5 rounded-full border-4 border-background bg-background shadow-md ring-4 ring-primary"></span><span class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1 text-xs font-semibold text-card-foreground shadow-md"></span>`;
    (el.lastElementChild as HTMLElement).textContent = destinationName;
    destinationMarker.current = new maplibre.Marker({ element: el }).setLngLat(lngLat(destination)).addTo(instance);
  }, [ready, destination, destinationName]);

  // The traveller: a 3D vehicle for the way they travel, sliding from the last position to the new one and turning to face the way it goes.
  useEffect(() => {
    const instance = map.current;
    const maplibre = lib.current;
    if (!ready || !instance || !maplibre) return;
    cancelAnimationFrame(frame.current);
    if (!traveller) {
      travellerMarker.current?.remove();
      travellerMarker.current = null;
      shown.current = null;
      return;
    }
    if (travellerMarker.current && markerMode.current !== mode) {
      travellerMarker.current.remove();
      travellerMarker.current = null;
    }
    if (!travellerMarker.current) {
      const el = buildVehicle(mode);
      // Lie flat on the map and turn with it, so a tilted map shows the vehicle from the side.
      travellerMarker.current = new maplibre.Marker({ element: el, rotationAlignment: "map", pitchAlignment: "map" })
        .setLngLat(lngLat(traveller))
        .addTo(instance);
      markerMode.current = mode;
      // Face the way it has been going; before that, towards the destination.
      const seen = trailRef.current;
      const ahead = destinationRef.current;
      if (seen.length >= 2) heading.current = bearingDeg(seen[seen.length - 2], seen[seen.length - 1]);
      else if (ahead) heading.current = bearingDeg(traveller, ahead);
      setVehicleHeading(el, heading.current);
      shown.current = traveller;
      return;
    }
    const from = shown.current ?? traveller;
    if (from[0] === traveller[0] && from[1] === traveller[1]) return; // nothing moved
    if (haversineKm(from, traveller) * 1000 >= TURN_MIN_METRES) {
      heading.current = turnTo(heading.current, bearingDeg(from, traveller));
      const el = travellerMarker.current.getElement();
      setVehicleHeading(el, heading.current);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const step = (now: number) => {
      const t = reduced ? 1 : (now - started) / SLIDE_MS;
      const at = between(from, traveller, t);
      shown.current = at;
      travellerMarker.current?.setLngLat(lngLat(at));
      if (followRef.current) instance.setCenter(lngLat(at));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [ready, traveller, mode]);

  // Pulse only while the position is live; a position that stopped updating just sits there.
  useEffect(() => {
    const el = travellerMarker.current?.getElement();
    if (!el) return;
    el.querySelector("[data-pulse]")?.classList.toggle("animate-ping", live);
    el.querySelector("[data-pulse]")?.classList.toggle("motion-reduce:animate-none", true);
    el.style.opacity = live ? "1" : "0.65";
  }, [live, traveller, ready]);

  // Show the whole trip the first time there is something to show.
  useEffect(() => {
    const instance = map.current;
    const maplibre = lib.current;
    // Wait until the panel has been measured, or the first view would be framed behind it.
    if (!ready || !instance || !maplibre || fitted.current || insetBottom <= 0) return;
    const points: LatLng[] = [];
    if (traveller) points.push(traveller);
    if (destination) points.push(destination);
    if (points.length === 0) return;
    fitted.current = true;
    const bounds = points.reduce((box, p) => box.extend(lngLat(p)), new maplibre.LngLatBounds(lngLat(points[0]), lngLat(points[0])));
    instance.fitBounds(bounds, {
      padding: 40,
      maxZoom: 16,
      duration: 0,
    });
    // Set separately: fitBounds does not always apply a pitch of its own.
    instance.setPitch(tilted.current ? TILT : 0);
  }, [ready, traveller, destination, insetBottom]);

  // "Follow" was switched on again: come back to where the traveller is shown.
  useEffect(() => {
    const instance = map.current;
    const at = shown.current;
    if (!ready || !instance || !follow || !at) return;
    instance.easeTo({ center: lngLat(at), duration: 600 });
  }, [ready, follow]);

  return <div ref={container} role="application" aria-label={label} className="absolute! inset-0 z-0" />;
}
