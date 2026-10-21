"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LatLngExpression, LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { makeNearbyTrip, pickRandomTrip, type Place, type Trip } from "@/config/routes";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";

type Leaflet = typeof import("leaflet");
type Summary = { trip: Trip; km: number; minutes: number; estimated: boolean };

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSRM = "https://router.project-osrm.org/route/v1/driving";
const LOOP_SECONDS = 22;

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const h =
    Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

async function fetchRoute(trip: Trip): Promise<{ points: [number, number][]; km: number; minutes: number; estimated: boolean }> {
  const { from, to } = trip;
  const straight: [number, number][] = [
    [from.lat, from.lng],
    [to.lat, to.lng],
  ];
  try {
    const response = await fetch(`${OSRM}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("route unavailable");
    const data = (await response.json()) as { routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[] };
    const route = data.routes?.[0];
    if (!route) throw new Error("no route");
    return {
      points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
      km: route.distance / 1000,
      minutes: Math.max(1, Math.round(route.duration / 60)),
      estimated: false,
    };
  } catch {
    const km = haversineKm(straight[0], straight[1]);
    return { points: straight, km, minutes: Math.max(1, Math.round((km / 25) * 60)), estimated: true };
  }
}

const COUNTRY_LOOKUP = "https://api.country.is";
const REVERSE_GEOCODE = "https://nominatim.openstreetmap.org/reverse";

/** Country of the visitor's connection from a free lookup. Falls back to the browser language region. */
async function detectCountry(): Promise<string | undefined> {
  // ?country=JP lets you preview another country.
  const forced = new URLSearchParams(window.location.search).get("country");
  if (forced) return forced.toUpperCase();
  try {
    const response = await fetch(COUNTRY_LOOKUP, { signal: AbortSignal.timeout(3000) });
    const data = (await response.json()) as { country?: string };
    if (data.country) return data.country.toUpperCase();
  } catch {
    // The browser language below is a good enough guess.
  }
  return navigator.language.split("-")[1]?.toUpperCase();
}

function countryName(code: string | undefined): string {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

async function areaName(place: Place, fallback: string): Promise<string> {
  try {
    const url = `${REVERSE_GEOCODE}?format=jsonv2&zoom=16&accept-language=en&lat=${place.lat}&lon=${place.lng}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const data = (await response.json()) as { address?: Record<string, string> };
    const a = data.address ?? {};
    return a.neighbourhood ?? a.suburb ?? a.road ?? a.city_district ?? fallback;
  } catch {
    return fallback;
  }
}

/** Generated trips get real area names from OpenStreetMap. The free service allows one request a second. */
async function nameTrip(trip: Trip): Promise<Trip> {
  if (!trip.generated) return trip;
  const from = await areaName(trip.from, trip.from.name);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  const to = await areaName(trip.to, trip.to.name);
  return { ...trip, from: { ...trip.from, name: from }, to: { ...trip.to, name: to === from ? trip.to.name : to } };
}

export function LiveRoute() {
  const section = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const lib = useRef<Leaflet | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const traveller = useRef<Marker | null>(null);
  const frame = useRef(0);
  const trip = useRef<Trip | undefined>(undefined);
  const country = useRef<string | undefined>(undefined);
  const [summary, setSummary] = useState<Summary | null>(null);

  const showRoute = useCallback(async () => {
    const L = lib.current;
    const leafletMap = map.current;
    const group = layer.current;
    if (!L || !leafletMap || !group) return;

    cancelAnimationFrame(frame.current);
    country.current ??= (await detectCountry()) ?? "IN";
    const code = country.current;
    const generated = code === "IN" ? undefined : makeNearbyTrip(code);
    const chosen = generated ?? { ...pickRandomTrip(trip.current), country: "IN" };
    trip.current = chosen;
    const [result, next] = await Promise.all([fetchRoute(chosen), nameTrip(chosen)]);

    group.clearLayers();
    const line = token("primary");
    const halo = token("background");
    const accent = token("accent");
    const path = result.points as LatLngExpression[];

    L.polyline(path, { color: halo, weight: 10, opacity: 0.95, lineCap: "round" }).addTo(group);
    L.polyline(path, { color: line, weight: 5, lineCap: "round", dashArray: result.estimated ? "2 10" : undefined }).addTo(group);

    const pin = (place: Trip["from"], filled: boolean) =>
      L.marker([place.lat, place.lng], {
        icon: L.divIcon({
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          html: `<span class="block size-5 rounded-full border-4 border-background shadow-md ${filled ? "bg-primary" : "bg-background ring-4 ring-primary"}"></span>`,
        }),
        keyboard: false,
      })
        .bindTooltip(place.name, { permanent: true, direction: "top", offset: [0, -10] })
        .addTo(group);
    pin(next.from, false);
    pin(next.to, true);

    traveller.current = L.marker(path[0], {
      icon: L.divIcon({
        className: "",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: `<span class="relative flex size-[22px]"><span class="absolute inline-flex size-full animate-ping rounded-full opacity-60" style="background:${accent}"></span><span class="relative inline-flex size-[22px] rounded-full border-[3px] border-background" style="background:${accent}"></span></span>`,
      }),
      keyboard: false,
      interactive: false,
    }).addTo(group);

    leafletMap.fitBounds(L.latLngBounds(path), { padding: [90, 90], maxZoom: 16 });
    setSummary({ trip: next, km: result.km, minutes: result.minutes, estimated: result.estimated });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || result.points.length < 2) return;

    const cumulative = [0];
    for (let i = 1; i < result.points.length; i++) {
      cumulative.push(cumulative[i - 1] + haversineKm(result.points[i - 1], result.points[i]));
    }
    const total = cumulative[cumulative.length - 1] || 1;
    const started = performance.now();
    const step = (now: number) => {
      const progress = (((now - started) / 1000) % LOOP_SECONDS) / LOOP_SECONDS;
      const target = progress * total;
      let i = 1;
      while (i < cumulative.length - 1 && cumulative[i] < target) i++;
      const span = cumulative[i] - cumulative[i - 1] || 1;
      const t = Math.min(1, Math.max(0, (target - cumulative[i - 1]) / span));
      const [aLat, aLng] = result.points[i - 1];
      const [bLat, bLng] = result.points[i];
      traveller.current?.setLatLng([aLat + (bLat - aLat) * t, aLng + (bLng - aLng) * t]);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const host = section.current;
    const target = container.current;
    if (!host || !target) return;
    let cancelled = false;

    // Load the map library and the first route only when the section is about to be seen.
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const L = (await import("leaflet")).default;
        if (cancelled) return;
        lib.current = L;
        const leafletMap = L.map(target, {
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
          worldCopyJump: false,
        }).setView([22.5, 79], 5);
        L.control.zoom({ position: "bottomright" }).addTo(leafletMap);
        L.tileLayer(TILES, {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMap);
        map.current = leafletMap;
        layer.current = L.layerGroup().addTo(leafletMap);
        await showRoute();
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame.current);
      map.current?.remove();
      map.current = null;
    };
  }, [showRoute]);

  return (
    <section ref={section} id="live-route" aria-labelledby="live-route-title" className="relative isolate h-[92svh] min-h-[620px] bg-muted">
      <div ref={container} role="application" aria-label="Map showing a sample journey" className="absolute inset-0 z-0" />
      <div className="pointer-events-none absolute inset-0 z-[1100] flex flex-col justify-between p-3 sm:p-5">
        <div className="pointer-events-auto max-w-[17rem] rounded-xl bg-card/95 px-4 py-3 text-card-foreground shadow-md backdrop-blur sm:max-w-sm">
          <Heading level={2} id="live-route-title" className="text-base leading-snug sm:text-xl">
            See a journey the way your contacts do
          </Heading>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            Live map, route and arrival time. A random sample on free OpenStreetMap.
          </p>
        </div>
        <div className="pointer-events-auto flex max-w-xl flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg sm:p-6">
          {summary ? (
            <>
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                  <Icon name="navigation" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {summary.trip.city}
                    {summary.trip.country ? `, ${countryName(summary.trip.country)}` : ""}: on the way
                  </p>
                  <p className="text-lg font-bold">
                    {summary.trip.from.name} to {summary.trip.to.name}
                  </p>
                </div>
              </div>
              <p className="flex flex-wrap gap-x-6 gap-y-1 text-base">
                <span>
                  <strong>{summary.km.toFixed(1)} km</strong> {summary.estimated ? "in a straight line" : "by road"}
                </span>
                <span>
                  <strong>about {summary.minutes} min</strong>
                </span>
                <span>Sharing live with 2 people</span>
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold">Finding a route...</p>
          )}
          <div>
            <button
              type="button"
              onClick={() => void showRoute()}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary-foreground px-4 py-1.5 text-sm font-semibold text-primary hover:opacity-85"
            >
              <Icon name="route" className="size-4" />
              Try another route
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
