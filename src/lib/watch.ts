/**
 * Everything the live watch page works out from the API's answer, as plain functions with no
 * imports, so `npm run check:watch` can test them without a browser.
 */

export type JourneyStatus = "active" | "overdue" | "completed" | "cancelled";

export type LatLng = [lat: number, lng: number];

export type WatchData = {
  travellerName: string;
  status: JourneyStatus;
  startedAt: string | null;
  sharingPaused: boolean;
  destinationName: string;
  expectedArrival: string;
  arrivedAt: string | null;
  vehicle: string;
  mode: string;
  destination: LatLng | null;
  route: LatLng[];
  note: string;
  last: { position: LatLng; recordedAt: string } | null;
  serverTime: string;
};

const STATUSES: JourneyStatus[] = ["active", "overdue", "completed", "cancelled"];

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const text = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

/** Turns the API's JSON into [WatchData], or null when it is not what we expect (never trust the shape). */
export function parseWatch(json: unknown): WatchData | null {
  if (typeof json !== "object" || json === null) return null;
  const j = json as Record<string, unknown>;
  const status = STATUSES.find((s) => s === j.status);
  if (!status) return null;

  const dLat = j.destinationLat;
  const dLng = j.destinationLng;
  const loc = j.lastLocation as { lat?: unknown; lng?: unknown; recordedAt?: unknown } | null | undefined;
  const last =
    loc && isNumber(loc.lat) && isNumber(loc.lng) && typeof loc.recordedAt === "string"
      ? { position: [loc.lat, loc.lng] as LatLng, recordedAt: loc.recordedAt }
      : null;

  return {
    travellerName: text(j.travellerName, "Traveller"),
    status,
    startedAt: typeof j.startedAt === "string" ? j.startedAt : null,
    sharingPaused: j.sharingPaused === true,
    destinationName: text(j.destinationName, "their destination"),
    expectedArrival: text(j.expectedArrival),
    arrivedAt: typeof j.arrivedAt === "string" ? j.arrivedAt : null,
    vehicle: text(j.vehicle),
    mode: text(j.mode),
    destination: isNumber(dLat) && isNumber(dLng) ? [dLat, dLng] : null,
    route: typeof j.routePolyline === "string" ? decodePolyline(j.routePolyline) : [],
    note: text(j.note),
    last,
    serverTime: text(j.serverTime),
  };
}

/** Decodes a Google encoded polyline (precision 5) into [lat, lng] points. */
export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    for (const axis of [0, 1]) {
      let result = 0;
      let shift = 0;
      let byte: number;
      do {
        if (index >= encoded.length) return points; // cut off: keep what decoded
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta;
      else lng += delta;
    }
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

const samePoint = (a: LatLng | null | undefined, b: LatLng | null | undefined) =>
  a === b || (!!a && !!b && a[0] === b[0] && a[1] === b[1]);

/**
 * The newest answer, but keeping the previous answer's objects wherever nothing changed. Every poll
 * parses fresh arrays; handing those to the map would redraw the route and pin and restart the
 * traveller's slide every five seconds for no reason.
 */
export function stabilise(prev: WatchData | null, next: WatchData): WatchData {
  if (!prev) return next;
  const route =
    prev.route.length === next.route.length &&
    samePoint(prev.route[0], next.route[0]) &&
    samePoint(prev.route[prev.route.length - 1], next.route[next.route.length - 1])
      ? prev.route
      : next.route;
  const last =
    next.last && prev.last && samePoint(prev.last.position, next.last.position)
      ? { ...next.last, position: prev.last.position }
      : next.last;
  return {
    ...next,
    destination: samePoint(prev.destination, next.destination) ? prev.destination : next.destination,
    route,
    last,
  };
}

/** Straight-line distance in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const h = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/**
 * How old a location is, in seconds. The phone's clock may be wrong, so the age is measured with
 * the server's clock: the server's time when it answered, plus the time that passed since.
 */
export function ageSeconds(recordedAt: string, serverTime: string, receivedAtMs: number, nowMs: number): number {
  const recorded = Date.parse(recordedAt);
  const server = Date.parse(serverTime);
  if (Number.isNaN(recorded) || Number.isNaN(server)) return 0;
  return Math.max(0, Math.round((server + (nowMs - receivedAtMs) - recorded) / 1000));
}

/** How trustworthy the position is. Never "live" for a position that has stopped moving. */
export type Freshness = "live" | "delayed" | "stale" | "paused" | "waiting";

export const LIVE_SECONDS = 90;
export const STALE_SECONDS = 5 * 60;

export function freshness(data: Pick<WatchData, "last" | "sharingPaused">, age: number): Freshness {
  if (data.sharingPaused) return "paused";
  if (!data.last) return "waiting";
  if (age <= LIVE_SECONDS) return "live";
  return age <= STALE_SECONDS ? "delayed" : "stale";
}

export function formatAgo(seconds: number): string {
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h ago` : `${hours} h ${rest} min ago`;
}

/** Milliseconds to wait before asking again: steady while it works, slower and slower while it does not. */
export function nextDelay(failures: number): number {
  if (failures <= 0) return 5000;
  return Math.min(30000, 5000 * 2 ** failures);
}

/** The direction from one point to another in degrees, 0 = north, 90 = east (a compass bearing). */
export function bearingDeg(from: LatLng, to: LatLng): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLng = rad(to[1] - from[1]);
  const y = Math.sin(dLng) * Math.cos(rad(to[0]));
  const x = Math.cos(rad(from[0])) * Math.sin(rad(to[0])) - Math.sin(rad(from[0])) * Math.cos(rad(to[0])) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * The angle to turn to so that a vehicle facing [current] ends up facing [target] by the short way round.
 * The result can pass 360 or go below 0 on purpose: it keeps a CSS transition from spinning the long way
 * when the heading crosses north.
 */
export function turnTo(current: number, target: number): number {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return current + delta;
}

/** A point part of the way from one position to another, for sliding the marker smoothly. */
export function between(from: LatLng, to: LatLng, t: number): LatLng {
  const k = Math.min(1, Math.max(0, t));
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
}

/** Appends a position to the trail, skipping repeats and keeping the last [max] points. */
export function extendTrail(trail: LatLng[], next: LatLng, max = 500): LatLng[] {
  const last = trail[trail.length - 1];
  if (last && last[0] === next[0] && last[1] === next[1]) return trail;
  const out = [...trail, next];
  return out.length > max ? out.slice(out.length - max) : out;
}

/** A distance to go, short enough for a small screen. */
export function distanceText(km: number): string {
  if (km < 0.1) return "Almost there";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString("en")} km`;
}

const MODES: Record<string, string> = {
  walk: "On foot",
  bike: "By bike",
  car: "By car",
  transit: "By transit",
  train: "By train",
  metro: "By metro",
};

export function modeLabel(mode: string): string {
  return MODES[mode] ?? "On the move";
}

/**
 * A time for a person to read: "6:30 pm" today, "Tomorrow, 6:30 pm", or "12 Nov, 6:30 pm". [now] says what
 * "today" is; [timeZone] is the viewer's own unless a test gives one.
 */
export function formatWhen(iso: string, nowMs: number, timeZone?: string): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return "";
  const day = (ms: number) => new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);
  const clock = new Intl.DateTimeFormat("en", { timeZone, hour: "numeric", minute: "2-digit" }).format(at);
  if (day(at) === day(nowMs)) return clock;
  if (day(at) === day(nowMs + 24 * 60 * 60 * 1000)) return `Tomorrow, ${clock}`;
  const date = new Intl.DateTimeFormat("en-GB", { timeZone, day: "numeric", month: "short" }).format(at);
  return `${date}, ${clock}`;
}

/** What the page says about the journey, in one line, from its status and how fresh the position is. */
export function headline(data: Pick<WatchData, "travellerName" | "status" | "destinationName">, fresh: Freshness): string {
  const { travellerName: name, destinationName: to } = data;
  switch (data.status) {
    case "completed":
      return `${name} arrived safely at ${to}`;
    case "cancelled":
      return `${name} ended this journey`;
    case "overdue":
      return `${name} has not arrived at ${to} yet`;
    default:
      if (fresh === "paused") return `${name} paused sharing`;
      if (fresh === "stale" || fresh === "delayed") return `${name} is on the way to ${to}`;
      return `${name} is on the way to ${to}`;
  }
}

/** Plain-language note under the headline when the position cannot be trusted as live. */
export function freshnessNote(fresh: Freshness, name: string, age: number): string | null {
  switch (fresh) {
    case "paused":
      return `${name} paused sharing on purpose. The last place shown is where they were.`;
    case "waiting":
      return `Waiting for ${name}'s first location.`;
    case "delayed":
      return `Last seen ${formatAgo(age)}. The phone may have a weak signal.`;
    case "stale":
      return `No update for ${formatAgo(age).replace(" ago", "")}. ${name}'s phone may be offline or out of signal, so this is not their live position.`;
    default:
      return null;
  }
}
