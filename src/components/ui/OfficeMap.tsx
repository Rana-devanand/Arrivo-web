"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { loadMapLibre, loadMapStyle } from "@/lib/map";
import { Icon } from "./Icon";

/** A calm map with the office card on top. The map code loads only when the section scrolls into view. */
export function OfficeMap() {
  const target = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { name, address, lat, lng, zoom, pinned } = siteConfig.office;

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const [maplibre, style] = await Promise.all([loadMapLibre(), loadMapStyle()]);
          if (cancelled) return;
          const instance = new maplibre.Map({
            container: el,
            style,
            pitch: 45,
            center: [lng, lat],
            zoom,
            cooperativeGestures: true,
            attributionControl: { compact: true },
          });
          map = instance;
          instance.addControl(new maplibre.NavigationControl({ visualizePitch: true }), "top-right");
          if (pinned) {
            const pin = document.createElement("div");
            pin.className = "size-5 rounded-full bg-primary ring-4 ring-card shadow-md";
            new maplibre.Marker({ element: pin }).setLngLat([lng, lat]).addTo(instance);
          }
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
      map?.remove();
    };
  }, [lat, lng, zoom, pinned]);

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-3xl border border-border bg-muted shadow-md sm:h-[30rem]">
      <div ref={target} className="absolute! inset-0" role="img" aria-label={`Map showing the ${name} office area`} />
      {failed && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-muted-foreground">
          The map could not load. Use the address below instead.
        </p>
      )}
      <div className="absolute inset-x-4 bottom-4 max-w-sm rounded-2xl border border-card/80 bg-card/90 p-5 shadow-lg backdrop-blur-xl sm:inset-x-auto sm:left-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-highlight">Visit us</p>
        <p className="mt-1 text-lg font-bold text-foreground">{name}</p>
        <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
          <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
          {address}
        </p>
        {pinned && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-85"
          >
            Open in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
