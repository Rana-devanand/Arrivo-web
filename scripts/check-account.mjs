import assert from "node:assert/strict";
import { test } from "node:test";
import {
  billingPeriod,
  contactsLeft,
  contactsPercent,
  daysLeft,
  durationText,
  firstName,
  formatDay,
  initials,
  journeyCounts,
  journeyLook,
  journeyMinutes,
  modeIcon,
  parseBilling,
  parseJourneys,
  safeReturnPath,
  statusSummary,
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
