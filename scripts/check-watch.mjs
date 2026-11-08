import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ageSeconds,
  bearingDeg,
  between,
  decodePolyline,
  distanceText,
  extendTrail,
  formatAgo,
  freshness,
  freshnessNote,
  haversineKm,
  formatWhen,
  headline,
  modeLabel,
  nextDelay,
  parseWatch,
  stabilise,
  turnTo,
} from "../src/lib/watch.ts";

const api = {
  travellerName: "Alex",
  status: "active",
  startedAt: "2026-11-08T10:00:00.000Z",
  sharingPaused: false,
  destinationName: "Golden Temple",
  expectedArrival: "2026-11-08T12:00:00.000Z",
  arrivedAt: null,
  vehicle: "PB 02 AB 1234",
  mode: "car",
  destinationLat: 31.62,
  destinationLng: 74.8765,
  routePolyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
  note: "",
  lastLocation: { lat: 31.6, lng: 74.8, recordedAt: "2026-11-08T11:00:00.000Z" },
  serverTime: "2026-11-08T11:00:05.000Z",
};

test("decodes a Google polyline (the documented example)", () => {
  assert.deepEqual(decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@"), [
    [38.5, -120.2],
    [40.7, -120.95],
    [43.252, -126.453],
  ]);
});

test("keeps the whole points when a polyline is cut off, and survives garbage", () => {
  assert.equal(decodePolyline("").length, 0);
  // The second point is cut off before its longitude ends: only the first, complete point is kept.
  assert.equal(decodePolyline("_p~iF~ps|U_ulLnnq").length, 1);
  assert.equal(decodePolyline("_p~iF~ps|U_ulLnnqC").length, 2);
  assert.doesNotThrow(() => decodePolyline("%%%%"));
});

test("reads the API answer and rejects a wrong shape", () => {
  const data = parseWatch(api);
  assert.equal(data?.travellerName, "Alex");
  assert.deepEqual(data?.destination, [31.62, 74.8765]);
  assert.equal(data?.route.length, 3);
  assert.deepEqual(data?.last?.position, [31.6, 74.8]);
  assert.equal(parseWatch(null), null);
  assert.equal(parseWatch("x"), null);
  assert.equal(parseWatch({ ...api, status: "exploded" }), null);
});

test("a missing or odd location is simply no location", () => {
  assert.equal(parseWatch({ ...api, lastLocation: null })?.last, null);
  assert.equal(parseWatch({ ...api, lastLocation: { lat: "x", lng: 1, recordedAt: "t" } })?.last, null);
  assert.equal(parseWatch({ ...api, destinationLat: null, destinationLng: null })?.destination, null);
  assert.deepEqual(parseWatch({ ...api, routePolyline: null })?.route, []);
});

test("sharing paused is read as true only when it is true", () => {
  assert.equal(parseWatch({ ...api, sharingPaused: true })?.sharingPaused, true);
  assert.equal(parseWatch({ ...api, sharingPaused: "yes" })?.sharingPaused, false);
  assert.equal(parseWatch({ ...api, sharingPaused: undefined })?.sharingPaused, false);
});

test("distance between two points", () => {
  assert.ok(Math.abs(haversineKm([0, 0], [0, 1]) - 111.19) < 0.5);
  assert.equal(haversineKm([31.6, 74.8], [31.6, 74.8]), 0);
});

test("age is measured with the server clock, whatever the phone's clock says", () => {
  const recorded = "2026-11-08T11:00:00.000Z";
  const server = "2026-11-08T11:00:30.000Z"; // the server answered 30 s after the point
  const received = 1_000_000;
  assert.equal(ageSeconds(recorded, server, received, received), 30);
  assert.equal(ageSeconds(recorded, server, received, received + 45_000), 75); // 45 s later still
  assert.equal(ageSeconds(recorded, "garbage", received, received), 0);
  assert.equal(ageSeconds("2026-11-08T11:05:00.000Z", server, received, received), 0); // never negative
});

test("freshness: live, delayed, stale, paused, waiting", () => {
  const moving = { last: { position: [1, 1], recordedAt: "t" }, sharingPaused: false };
  assert.equal(freshness(moving, 10), "live");
  assert.equal(freshness(moving, 90), "live");
  assert.equal(freshness(moving, 91), "delayed");
  assert.equal(freshness(moving, 300), "delayed");
  assert.equal(freshness(moving, 301), "stale");
  assert.equal(freshness({ ...moving, sharingPaused: true }, 9999), "paused"); // paused is expected, not a worry
  assert.equal(freshness({ last: null, sharingPaused: false }, 0), "waiting");
});

test("ago text", () => {
  assert.equal(formatAgo(3), "just now");
  assert.equal(formatAgo(42), "42 s ago");
  assert.equal(formatAgo(60), "1 min ago");
  assert.equal(formatAgo(3599), "59 min ago");
  assert.equal(formatAgo(3600), "1 h ago");
  assert.equal(formatAgo(3600 + 5 * 60), "1 h 5 min ago");
});

test("polling slows down while the connection is bad, and recovers", () => {
  assert.equal(nextDelay(0), 5000);
  assert.equal(nextDelay(1), 10000);
  assert.equal(nextDelay(2), 20000);
  assert.equal(nextDelay(3), 30000);
  assert.equal(nextDelay(10), 30000);
});

test("sliding between two positions", () => {
  assert.deepEqual(between([0, 0], [10, 20], 0.5), [5, 10]);
  assert.deepEqual(between([0, 0], [10, 20], 2), [10, 20]);
  assert.deepEqual(between([0, 0], [10, 20], -1), [0, 0]);
});

test("the trail skips repeats and is capped", () => {
  let trail = extendTrail([], [1, 1]);
  trail = extendTrail(trail, [1, 1]);
  assert.equal(trail.length, 1);
  trail = extendTrail(trail, [2, 2]);
  assert.equal(trail.length, 2);
  let long = [];
  for (let i = 0; i < 12; i++) long = extendTrail(long, [i, i], 5);
  assert.equal(long.length, 5);
  assert.deepEqual(long[0], [7, 7]);
});

test("headlines never claim 'on the way' for an ended or late journey", () => {
  const base = { travellerName: "Alex", destinationName: "Home" };
  assert.match(headline({ ...base, status: "active" }, "live"), /on the way to Home/);
  assert.match(headline({ ...base, status: "active" }, "paused"), /paused sharing/);
  assert.match(headline({ ...base, status: "overdue" }, "live"), /has not arrived/);
  assert.match(headline({ ...base, status: "completed" }, "live"), /arrived safely/);
  assert.match(headline({ ...base, status: "cancelled" }, "live"), /ended this journey/);
});

test("when the position is not live the page says so, in plain words", () => {
  assert.equal(freshnessNote("live", "Alex", 5), null);
  assert.match(freshnessNote("delayed", "Alex", 120) ?? "", /Last seen 2 min ago/);
  assert.match(freshnessNote("stale", "Alex", 900) ?? "", /not their live position/);
  assert.match(freshnessNote("paused", "Alex", 900) ?? "", /on purpose/);
  assert.match(freshnessNote("waiting", "Alex", 0) ?? "", /first location/);
});

test("times read as today, tomorrow or a date, in the viewer's own zone", () => {
  const now = Date.parse("2026-11-08T08:00:00Z"); // 13:30 in India
  assert.equal(formatWhen("2026-11-08T12:00:00Z", now, "Asia/Kolkata"), "5:30 PM");
  assert.equal(formatWhen("2026-11-09T01:00:00Z", now, "Asia/Kolkata"), "Tomorrow, 6:30 AM");
  assert.equal(formatWhen("2026-11-12T12:00:00Z", now, "Asia/Kolkata"), "12 Nov, 5:30 PM");
  assert.equal(formatWhen("garbage", now, "UTC"), "");
  // The same instant is a different day in another zone.
  assert.equal(formatWhen("2026-11-08T20:00:00Z", now, "Asia/Kolkata"), "Tomorrow, 1:30 AM");
});

test("modes have a plain label, and an unknown one still reads well", () => {
  assert.equal(modeLabel("car"), "By car");
  assert.equal(modeLabel("walk"), "On foot");
  assert.equal(modeLabel("hoverboard"), "On the move");
});

test("an unchanged answer keeps the same objects, so the map is not redrawn", () => {
  const first = parseWatch(api);
  const again = parseWatch(api);
  const kept = stabilise(first, again);
  assert.equal(kept.destination, first.destination);
  assert.equal(kept.route, first.route);
  assert.equal(kept.last.position, first.last.position);
});

test("a moved traveller gets the new position, the rest stays", () => {
  const first = parseWatch(api);
  const moved = parseWatch({ ...api, lastLocation: { lat: 31.61, lng: 74.81, recordedAt: "2026-11-08T11:00:05.000Z" } });
  const kept = stabilise(first, moved);
  assert.deepEqual(kept.last.position, [31.61, 74.81]);
  assert.equal(kept.route, first.route);
  assert.equal(kept.destination, first.destination);
});

test("a changed route or destination is taken, and the first answer is used as it is", () => {
  const first = parseWatch(api);
  const other = parseWatch({ ...api, destinationLat: 28.6, destinationLng: 77.2, routePolyline: "_p~iF~ps|U_ulLnnqC" });
  const kept = stabilise(first, other);
  assert.deepEqual(kept.destination, [28.6, 77.2]);
  assert.equal(kept.route.length, 2);
  assert.equal(stabilise(null, first), first);
  assert.equal(stabilise(first, parseWatch({ ...api, lastLocation: null })).last, null);
});

test("distance to go is short and never says 0.0 km", () => {
  assert.equal(distanceText(0), "Almost there");
  assert.equal(distanceText(0.09), "Almost there");
  assert.equal(distanceText(0.1), "0.1 km");
  assert.equal(distanceText(3.14159), "3.1 km");
  assert.equal(distanceText(9.96), "10.0 km");
  assert.equal(distanceText(10), "10 km");
  assert.equal(distanceText(1234.6), "1,235 km");
});

test("compass bearings: north, east, south, west", () => {
  const near = (a, b) => Math.abs(a - b) < 0.5;
  assert.ok(near(bearingDeg([0, 0], [1, 0]), 0));
  assert.ok(near(bearingDeg([0, 0], [0, 1]), 90));
  assert.ok(near(bearingDeg([1, 0], [0, 0]), 180));
  assert.ok(near(bearingDeg([0, 1], [0, 0]), 270));
  assert.ok(near(bearingDeg([0, 0], [1, 1]), 45));
});

test("a vehicle turns the short way, also across north", () => {
  assert.equal(turnTo(0, 90), 90);
  assert.equal(turnTo(350, 10), 370); // 20 degrees right, not 340 left
  assert.equal(turnTo(10, 350), -10); // 20 degrees left
  assert.equal(turnTo(90, 90), 90);
  assert.equal(Math.abs(turnTo(0, 180)), 180); // straight behind: either way is as short
  assert.equal(turnTo(370, 350), 350); // keeps counting from where it already is
});
