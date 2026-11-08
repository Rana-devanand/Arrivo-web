import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bestOffer,
  billingPeriod,
  contactsLeft,
  contactsPercent,
  daysLeft,
  durationText,
  firstName,
  formatDay,
  discountedCents,
  effectiveOfferStatus,
  initials,
  journeyCounts,
  journeyLook,
  journeyMinutes,
  modeIcon,
  normaliseCode,
  offerEndsText,
  offerMinutes,
  offerStatusLook,
  offerWindow,
  parseBilling,
  parseAdminOffer,
  parseAdminOffers,
  parseJourneys,
  parseOffers,
  safeReturnPath,
  statusSummary,
  validateOffer,
} from "../src/lib/account.ts";

const NOW = Date.parse("2026-11-08T10:00:00Z");
const inDays = (d) => new Date(NOW + d * 24 * 60 * 60 * 1000).toISOString();

const paid = {
  plan: "plus",
  name: "Arrivo Plus",
  planKey: "yearly",
  status: "active",
  intervalMonths: 12,
  renewsAt: inDays(30),
  cancelled: false,
  limits: { contacts: 10, household: true },
  contactsUsed: 4,
  canManage: true,
  familyMemberOf: null,
};

test("parseBilling reads the plan, and refuses anything that is not a plan", () => {
  const b = parseBilling(paid);
  assert.equal(b.plan, "plus");
  assert.equal(b.contactLimit, 10);
  assert.equal(b.contactsUsed, 4);
  assert.equal(b.canManage, true);
  assert.equal(b.familyOwner, null);
  assert.equal(parseBilling(null), null);
  assert.equal(parseBilling({ plan: "gold", limits: { contacts: 1 } }), null);
  assert.equal(parseBilling({ plan: "free" }), null);
});

test("parseBilling reads a Family member and a free plan", () => {
  const member = parseBilling({ ...paid, canManage: false, familyMemberOf: { ownerName: "Asha" } });
  assert.equal(member.familyOwner, "Asha");
  const free = parseBilling({ plan: "free", name: "Arrivo Free", planKey: null, status: null, renewsAt: null, cancelled: false, limits: { contacts: 1 }, contactsUsed: 1 });
  assert.equal(free.planKey, null);
  assert.equal(free.renewsAt, null);
});

test("parseJourneys keeps only what the dashboard shows: no coordinates, routes, photos or tokens", () => {
  const out = parseJourneys({
    items: [
      {
        id: "j1",
        status: "completed",
        originName: "Home",
        destinationName: "Office",
        mode: "car",
        startedAt: "2026-11-01T08:00:00Z",
        expectedArrival: "2026-11-01T09:00:00Z",
        arrivedAt: "2026-11-01T08:50:00Z",
        endedAt: "2026-11-01T08:50:00Z",
        distanceKm: 12.5,
        destinationLat: 23.1,
        destinationLng: 85.3,
        originLat: 23.2,
        originLng: 85.2,
        routePolyline: "abc",
        trackToken: "secret-token",
        vehicleImageUrl: "https://photos.test/plate.jpg",
      },
      { id: "bad", status: "weird" },
      "not an object",
    ],
    nextBefore: "2026-11-01T08:00:00Z",
  });
  assert.equal(out.items.length, 1);
  assert.equal(out.more, true);
  const text = JSON.stringify(out);
  for (const secret of ["secret-token", "23.1", "85.3", "abc", "plate.jpg"]) assert.ok(!text.includes(secret), secret);
  assert.deepEqual(Object.keys(out.items[0]).sort(), [
    "arrivedAt",
    "destinationName",
    "distanceKm",
    "endedAt",
    "expectedArrival",
    "id",
    "mode",
    "originName",
    "startedAt",
    "status",
  ]);
  assert.equal(parseJourneys({}), null);
  assert.equal(parseJourneys(null), null);
});

test("daysLeft rounds up and never goes below zero", () => {
  assert.equal(daysLeft(inDays(30), NOW), 30);
  assert.equal(daysLeft(new Date(NOW + 3 * 3600 * 1000).toISOString(), NOW), 1);
  assert.equal(daysLeft(inDays(-2), NOW), 0);
  assert.equal(daysLeft(null, NOW), null);
  assert.equal(daysLeft("nonsense", NOW), null);
});

test("formatDay is a plain date in the given time zone", () => {
  assert.equal(formatDay("2026-11-12T20:00:00Z", "UTC"), "12 Nov 2026");
  assert.equal(formatDay("2026-11-12T20:00:00Z", "Asia/Kolkata"), "13 Nov 2026");
  assert.equal(formatDay("nonsense"), "");
});

test("statusSummary says it in words, for every state", () => {
  const free = statusSummary(parseBilling({ plan: "free", limits: { contacts: 1 } }), NOW, "UTC");
  assert.deepEqual([free.label, free.tone], ["Free", "quiet"]);

  const active = statusSummary(parseBilling(paid), NOW, "UTC");
  assert.deepEqual([active.label, active.tone], ["Active", "good"]);
  assert.match(active.note, /^Renews on \d+ \w+ 2026 \(30 days left\)\.$/);

  const cancelled = statusSummary(parseBilling({ ...paid, status: "cancelled", cancelled: true }), NOW, "UTC");
  assert.deepEqual([cancelled.label, cancelled.tone], ["Cancelled", "warn"]);
  assert.match(cancelled.note, /stays on until .*will not renew/);

  for (const status of ["past_due", "on_hold"]) {
    const due = statusSummary(parseBilling({ ...paid, status }), NOW, "UTC");
    assert.deepEqual([due.label, due.tone], ["Payment due", "warn"]);
    assert.match(due.note, /Manage subscription/);
  }

  const member = statusSummary(parseBilling({ ...paid, canManage: false, familyMemberOf: { ownerName: "Asha" } }), NOW, "UTC");
  assert.equal(member.label, "Active");
  assert.match(member.note, /Asha's Family plan/);

  const ends = statusSummary(parseBilling({ ...paid, renewsAt: new Date(NOW - 1000).toISOString() }), NOW, "UTC");
  assert.match(ends.note, /ends today/);
});

test("contacts left and the progress bar never go out of range", () => {
  assert.equal(contactsLeft({ contactLimit: 10, contactsUsed: 4 }), 6);
  assert.equal(contactsLeft({ contactLimit: 1, contactsUsed: 3 }), 0);
  assert.equal(contactsPercent({ contactLimit: 10, contactsUsed: 4 }), 40);
  assert.equal(contactsPercent({ contactLimit: 1, contactsUsed: 3 }), 100);
  assert.equal(contactsPercent({ contactLimit: 0, contactsUsed: 0 }), 0);
});

test("every journey status has its own word, tone and icon", () => {
  assert.deepEqual(journeyLook("completed"), { label: "Arrived", tone: "good", icon: "checkCircle" });
  assert.deepEqual(journeyLook("cancelled"), { label: "Ended", tone: "quiet", icon: "circleX" });
  assert.deepEqual(journeyLook("overdue"), { label: "Late", tone: "bad", icon: "alert" });
  assert.deepEqual(journeyLook("active"), { label: "In progress", tone: "good", icon: "navigation" });
});

test("every way of travelling has an icon", () => {
  assert.equal(modeIcon("car"), "car");
  assert.equal(modeIcon("bike"), "bike");
  assert.equal(modeIcon("walk"), "walk");
  for (const m of ["train", "metro", "transit"]) assert.equal(modeIcon(m), "train");
  assert.equal(modeIcon("hoverboard"), "navigation");
  assert.equal(modeIcon(""), "navigation");
});

test("durations read like a person would say them", () => {
  assert.equal(durationText(35), "35 min");
  assert.equal(durationText(60), "1 h");
  assert.equal(durationText(130), "2 h 10 min");
  assert.equal(durationText(24 * 60), "1 day");
  assert.equal(durationText(27 * 60), "1 day 3 h");
  assert.equal(durationText(2 * 24 * 60 + 60), "2 days 1 h");
  assert.equal(durationText(-5), "0 min");
});

test("journeyMinutes is null while it runs or when the times are wrong", () => {
  const base = { startedAt: "2026-11-01T08:00:00Z", arrivedAt: null, endedAt: null };
  assert.equal(journeyMinutes(base), null);
  assert.equal(journeyMinutes({ ...base, arrivedAt: "2026-11-01T08:50:00Z" }), 50);
  assert.equal(journeyMinutes({ ...base, endedAt: "2026-11-01T07:00:00Z" }), null);
});

test("journeyCounts separates finished from running", () => {
  const item = (status) => ({ id: status, status });
  assert.deepEqual(journeyCounts([item("completed"), item("completed"), item("active"), item("overdue"), item("cancelled")]), { total: 5, completed: 2, inProgress: 2 });
  assert.deepEqual(journeyCounts([]), { total: 0, completed: 0, inProgress: 0 });
});

test("safeReturnPath only ever returns one of our own account pages", () => {
  assert.equal(safeReturnPath("/account/plan"), "/account/plan");
  assert.equal(safeReturnPath("/account/journeys"), "/account/journeys");
  for (const bad of [null, "", "/account", "/", "//evil.test", "https://evil.test/account/plan", "/account/plan?x=1", "/account/plan/../..", "javascript:alert(1)"]) {
    assert.equal(safeReturnPath(bad), null, String(bad));
  }
});

test("billingPeriod names the way of paying", () => {
  assert.equal(billingPeriod("monthly"), "Monthly");
  assert.equal(billingPeriod("sixMonths"), "Every 6 months");
  assert.equal(billingPeriod("yearly"), "Yearly");
  assert.equal(billingPeriod("familyYearly"), "Yearly");
  assert.equal(billingPeriod(null), null);
  assert.equal(billingPeriod("lifetime"), null);
});

test("names: a greeting and avatar letters, even without a name", () => {
  assert.equal(firstName("Asha Rao", "a@x.test"), "Asha");
  assert.equal(firstName("  ", "asha.rao@x.test"), "asha.rao");
  assert.equal(initials("Asha Rao", "a@x.test"), "AR");
  assert.equal(initials("Asha", "a@x.test"), "AS");
  assert.equal(initials("", "zed@x.test"), "ZE");
});

test("parseOffers keeps only what the offer card needs", () => {
  const out = parseOffers({ offers: [{ code: "LAUNCH20", title: "Launch offer", percentOff: 20, endsAt: "2026-11-10T10:00:00Z", dodoDiscountId: "dsc_1", startsAt: "x" }, { code: "", percentOff: 10 }, { code: "BAD", percentOff: 0 }, { code: "HUGE", percentOff: 200 }, "nope"] });
  assert.equal(out.length, 1);
  assert.deepEqual(out[0], { code: "LAUNCH20", title: "Launch offer", percentOff: 20, endsAt: "2026-11-10T10:00:00Z" });
  assert.ok(!JSON.stringify(out).includes("dsc_1"));
  assert.deepEqual(parseOffers({ offers: [] }), []);
  assert.equal(parseOffers({}), null);
  assert.equal(parseOffers(null), null);
});

test("parseAdminOffer(s) read the admin's list and the answer to making or ending an offer", () => {
  const one = { id: "c1", code: "LAUNCH20", title: "Launch", percentOff: 20, startsAt: "2026-11-09T00:00:00Z", endsAt: "2026-11-10T00:00:00Z", status: "live", createdAt: "2026-11-09T00:00:00Z" };
  assert.equal(parseAdminOffer(one).status, "live");
  assert.equal(parseAdminOffer({ ...one, status: "weird" }), null);
  assert.equal(parseAdminOffer({ ...one, id: "" }), null);
  assert.equal(parseAdminOffers({ coupons: [one, { ...one, id: "c2", status: "ended" }, "x"] }).length, 2);
  assert.equal(parseAdminOffers({}), null);
});

test("an offer says how long is left, and Ended when the time has come", () => {
  const now = Date.parse("2026-11-09T10:00:00Z");
  assert.equal(offerEndsText("2026-11-09T10:45:00Z", now), "Ends in 45 min");
  assert.equal(offerEndsText("2026-11-09T15:12:00Z", now), "Ends in 5 h 12 min");
  assert.equal(offerEndsText("2026-11-11T11:00:00Z", now), "Ends in 2 days 1 h");
  assert.equal(offerEndsText("2026-11-09T10:00:00Z", now), "Ended");
  assert.equal(offerEndsText("2026-11-08T10:00:00Z", now), "Ended");
  assert.equal(offerEndsText("nonsense", now), "Ended");
});

test("discountedCents takes the percentage off, rounded, and stays in range", () => {
  assert.equal(discountedCents(2499, 20), 1999);
  assert.equal(discountedCents(4900, 25), 3675);
  assert.equal(discountedCents(299, 33), 200);
  assert.equal(discountedCents(2499, 0), 2499);
  assert.equal(discountedCents(2499, 100), 0);
  assert.equal(discountedCents(2499, 150), 0);
  assert.equal(discountedCents(2499, -5), 2499);
});

test("each offer status has a word, a tone and an icon", () => {
  assert.deepEqual(offerStatusLook("live"), { label: "Live", tone: "good", icon: "checkCircle" });
  assert.deepEqual(offerStatusLook("scheduled"), { label: "Scheduled", tone: "warn", icon: "clock" });
  assert.deepEqual(offerStatusLook("ended"), { label: "Ended", tone: "quiet", icon: "circleX" });
});

test("the code box keeps capital letters and digits only, up to 16", () => {
  assert.equal(normaliseCode("launch 20!"), "LAUNCH20");
  assert.equal(normaliseCode("a-b_c"), "ABC");
  assert.equal(normaliseCode("x".repeat(30)).length, 16);
  assert.equal(normaliseCode(""), "");
});

test("validateOffer names the first thing wrong, with the same rules as the server", () => {
  const now = Date.parse("2026-11-09T10:00:00Z");
  const ok = { title: "Launch offer", code: "LAUNCH20", percentOff: 20, startsAtMs: null, minutes: offerMinutes(1, "days") };
  assert.equal(validateOffer(ok, now), null);
  assert.equal(validateOffer({ ...ok, code: "launch20" }, now), null);
  assert.match(validateOffer({ ...ok, title: "x" }, now), /name/);
  assert.match(validateOffer({ ...ok, title: "x".repeat(61) }, now), /name/);
  assert.match(validateOffer({ ...ok, code: "ab" }, now), /code/);
  assert.match(validateOffer({ ...ok, code: "has space" }, now), /code/);
  assert.match(validateOffer({ ...ok, percentOff: 0 }, now), /1 to 90/);
  assert.match(validateOffer({ ...ok, percentOff: 91 }, now), /1 to 90/);
  assert.match(validateOffer({ ...ok, percentOff: 12.5 }, now), /1 to 90/);
  assert.match(validateOffer({ ...ok, minutes: 4 }, now), /5 minutes/);
  assert.match(validateOffer({ ...ok, minutes: Number.NaN }, now), /5 minutes/);
  assert.match(validateOffer({ ...ok, minutes: offerMinutes(367, "days") }, now), /366 days/);
  assert.equal(validateOffer({ ...ok, minutes: offerMinutes(366, "days") }, now), null);
  assert.match(validateOffer({ ...ok, startsAtMs: now - 3600_000 }, now), /past/);
  assert.match(validateOffer({ ...ok, startsAtMs: Number.NaN }, now), /valid start/);
  assert.equal(validateOffer({ ...ok, startsAtMs: now + 3600_000 }, now), null);
});

test("offerWindow gives the start (only when scheduled) and the end", () => {
  const now = Date.parse("2026-11-09T10:00:00Z");
  assert.deepEqual(offerWindow(now, null, 90), { endsAt: "2026-11-09T11:30:00.000Z" });
  const later = Date.parse("2026-11-10T08:00:00Z");
  assert.deepEqual(offerWindow(now, later, offerMinutes(2, "days")), { startsAt: "2026-11-10T08:00:00.000Z", endsAt: "2026-11-12T08:00:00.000Z" });
  assert.equal(offerMinutes(3, "hours"), 180);
  assert.equal(offerMinutes(2, "days"), 2880);
});

test("bestOffer picks the biggest discount, and nothing when there is none", () => {
  const a = { code: "A", title: "a", percentOff: 10, endsAt: "x" };
  const b = { code: "B", title: "b", percentOff: 30, endsAt: "x" };
  const c = { code: "C", title: "c", percentOff: 20, endsAt: "x" };
  assert.equal(bestOffer([a, b, c]).code, "B");
  assert.equal(bestOffer([a]).code, "A");
  assert.equal(bestOffer([]), null);
});

test("an offer's standing moves with the clock, and an ended offer never comes back", () => {
  const o = { status: "scheduled", startsAt: "2026-11-09T10:00:00Z", endsAt: "2026-11-09T12:00:00Z" };
  const at = (iso) => Date.parse(iso);
  assert.equal(effectiveOfferStatus(o, at("2026-11-09T09:00:00Z")), "scheduled");
  assert.equal(effectiveOfferStatus(o, at("2026-11-09T10:00:00Z")), "live");
  assert.equal(effectiveOfferStatus({ ...o, status: "live" }, at("2026-11-09T11:59:59Z")), "live");
  assert.equal(effectiveOfferStatus({ ...o, status: "live" }, at("2026-11-09T12:00:00Z")), "ended");
  assert.equal(effectiveOfferStatus({ ...o, status: "ended" }, at("2026-11-09T11:00:00Z")), "ended");
  // Just made: the server says live, the local clock is a moment before the start.
  assert.equal(effectiveOfferStatus({ ...o, status: "live" }, at("2026-11-09T09:59:59Z")), "live");
});
