import assert from "node:assert/strict";
import { test } from "node:test";
import {
  chargeTypeLabel,
  countryFlag,
  countryName,
  filterNotifications,
  filterPayments,
  filterUsers,
  formatMoney,
  notificationLook,
  notificationTypes,
  paginate,
  parseAdminActivity,
  parseAdminNotifications,
  parseAdminPayments,
  parseAdminUsers,
  parseMe,
  paymentGroup,
  paymentLook,
  revenueSummary,
  userStats,
} from "../src/lib/admin.ts";

const user = (over = {}) => ({
  id: "u1",
  displayName: "Asha Rao",
  email: "asha@example.test",
  phone: "+91 98765 43210",
  avatarUrl: "https://photos.test/a.jpg",
  countryCode: "IN",
  role: "USER",
  createdAt: "2026-11-01T08:00:00Z",
  deletionRequested: false,
  journeys: { total: 5, active: 1, overdue: 0, completed: 3, cancelled: 1, lastStartedAt: "2026-11-07T10:00:00Z" },
  ...over,
});

test("parseMe reads the role, and anything that is not ADMIN is a USER", () => {
  assert.deepEqual(parseMe({ id: "u1", displayName: "Asha", role: "ADMIN" }), { role: "ADMIN", name: "Asha" });
  assert.equal(parseMe({ id: "u1", role: "root" }).role, "USER");
  assert.equal(parseMe({ role: "ADMIN" }), null);
  assert.equal(parseMe(null), null);
});

test("parseAdminUsers keeps the people, their country, role and journey counts", () => {
  const rows = parseAdminUsers({ users: [user(), user({ id: "u2", role: "ADMIN", phone: null, journeys: {} }), "bad", { name: "no id" }] });
  assert.equal(rows.length, 2);
  assert.deepEqual(
    { total: rows[0].total, active: rows[0].active, completed: rows[0].completed, cancelled: rows[0].cancelled, phone: rows[0].phone, country: rows[0].countryCode },
    { total: 5, active: 1, completed: 3, cancelled: 1, phone: "+91 98765 43210", country: "IN" },
  );
  assert.equal(rows[1].role, "ADMIN");
  assert.equal(rows[1].phone, null);
  assert.equal(rows[1].total, 0);
  assert.equal(parseAdminUsers({}), null);
  assert.equal(parseAdminUsers(null), null);
});

test("parseAdminUsers does not carry the photo address", () => {
  assert.ok(!JSON.stringify(parseAdminUsers({ users: [user()] })).includes("photos.test"));
});

test("parseAdminActivity gives each person's journeys with the notifications that went out", () => {
  const out = parseAdminActivity({
    users: [
      {
        id: "u1",
        journeys: [
          {
            id: "j1",
            originName: "Home",
            destinationName: "Office",
            mode: "car",
            status: "completed",
            startedAt: "2026-11-01T08:00:00Z",
            expectedArrival: "2026-11-01T09:00:00Z",
            arrivedAt: "2026-11-01T08:50:00Z",
            endedAt: null,
            distanceKm: 12.5,
            vehicle: "Taxi 1234",
            contactCount: 2,
            notificationCount: 4,
            recipientCount: 2,
            places: ["Indiranagar", 7, "Koramangala"],
          },
          { nope: true },
        ],
      },
      { id: "u2", journeys: [] },
      { id: "u3" },
    ],
  });
  assert.deepEqual(Object.keys(out).sort(), ["u1", "u2"]);
  assert.equal(out.u1.length, 1);
  assert.deepEqual(out.u1[0].places, ["Indiranagar", "Koramangala"]);
  assert.equal(out.u1[0].vehicle, "Taxi 1234");
  assert.equal(out.u1[0].notificationCount, 4);
  assert.equal(parseAdminActivity({}), null);
});

test("parseAdminNotifications keeps who got what, and the traveller and place when there are some", () => {
  const rows = parseAdminNotifications({
    notifications: [
      {
        id: "n1",
        type: "journey_started",
        title: "On the way",
        body: "Asha set off",
        read: false,
        createdAt: "2026-11-07T10:00:00Z",
        recipient: { id: "u2", name: "Bob", email: "bob@example.test" },
        journeyId: "j1",
        traveller: { id: "u1", name: "Asha" },
        place: "Indiranagar",
      },
      { id: "n2", type: "new_user", title: "New user joined Arrivo", body: "Dev just signed up.", read: true, createdAt: "2026-11-08T10:00:00Z", recipient: { name: "Root" }, traveller: null, place: null },
      { type: "x" },
    ],
  });
  assert.equal(rows.length, 2);
  assert.deepEqual([rows[0].recipientName, rows[0].recipientEmail, rows[0].travellerName, rows[0].place], ["Bob", "bob@example.test", "Asha", "Indiranagar"]);
  assert.deepEqual([rows[1].recipientEmail, rows[1].travellerName, rows[1].place, rows[1].read], [null, null, null, true]);
  assert.equal(parseAdminNotifications({}), null);
});

test("filterUsers matches every word against name, email, phone and country", () => {
  const users = parseAdminUsers({
    users: [user(), user({ id: "u2", displayName: "Bob Stone", email: "bob@x.test", phone: null, countryCode: "KE", role: "ADMIN" })],
  });
  assert.equal(filterUsers(users, "").length, 2);
  assert.deepEqual(filterUsers(users, "asha").map((u) => u.id), ["u1"]);
  assert.deepEqual(filterUsers(users, "98765").map((u) => u.id), ["u1"]);
  assert.deepEqual(filterUsers(users, "admin").map((u) => u.id), ["u2"]);
  assert.deepEqual(filterUsers(users, "bob ke").map((u) => u.id), ["u2"]);
  assert.deepEqual(filterUsers(users, "kenya", countryName).map((u) => u.id), ["u2"]);
  assert.equal(filterUsers(users, "asha kenya", countryName).length, 0);
});

test("userStats counts people, admins, countries, journeys and deletion requests", () => {
  const users = parseAdminUsers({
    users: [user(), user({ id: "u2", countryCode: "IN", role: "ADMIN", deletionRequested: true }), user({ id: "u3", countryCode: null, journeys: { total: 2 } })],
  });
  assert.deepEqual(userStats(users), { total: 3, admins: 1, countries: 1, journeys: 12, deletionRequests: 1 });
  assert.deepEqual(userStats([]), { total: 0, admins: 0, countries: 0, journeys: 0, deletionRequests: 0 });
});

test("country names and flags, and calm answers for what is not a country", () => {
  assert.equal(countryName("IN"), "India");
  assert.equal(countryName("in"), "India");
  assert.equal(countryName(null), "Not set");
  assert.equal(countryName("ZZ"), "Unknown Region");
  assert.equal(countryFlag("IN"), "\u{1F1EE}\u{1F1F3}");
  assert.equal(countryFlag("in"), "\u{1F1EE}\u{1F1F3}");
  for (const bad of [null, "", "I", "IND", "1N"]) assert.equal(countryFlag(bad), "");
});

test("every kind of notification has a word and an icon, and unknown ones a plain bell", () => {
  assert.deepEqual(notificationLook("sos"), { label: "SOS", icon: "alert" });
  assert.deepEqual(notificationLook("new_user"), { label: "New user", icon: "user" });
  assert.deepEqual(notificationLook("journey_arrived"), { label: "Arrived", icon: "flag" });
  assert.deepEqual(notificationLook("something_new"), { label: "Notification", icon: "bell" });
});

test("filterNotifications narrows by kind and by words in the text, people and place", () => {
  const list = parseAdminNotifications({
    notifications: [
      { id: "1", type: "journey_started", title: "On the way", body: "Asha set off", recipient: { name: "Bob" }, traveller: { name: "Asha" }, place: "Indiranagar" },
      { id: "2", type: "journey_arrived", title: "Arrived", body: "Asha arrived", recipient: { name: "Carol", email: "carol@x.test" }, traveller: { name: "Asha" }, place: "Whitefield" },
      { id: "3", type: "new_user", title: "New user joined Arrivo", body: "Dev just signed up.", recipient: { name: "Root" } },
    ],
  });
  assert.deepEqual(notificationTypes(list), ["journey_started", "journey_arrived", "new_user"]);
  assert.equal(filterNotifications(list, "", "").length, 3);
  assert.deepEqual(filterNotifications(list, "", "new_user").map((n) => n.id), ["3"]);
  assert.deepEqual(filterNotifications(list, "whitefield", "").map((n) => n.id), ["2"]);
  assert.deepEqual(filterNotifications(list, "carol@x", "").map((n) => n.id), ["2"]);
  assert.deepEqual(filterNotifications(list, "asha", "journey_arrived").map((n) => n.id), ["2"]);
  assert.equal(filterNotifications(list, "nobody", "").length, 0);
});

test("a notification says an attachment came with it, and only that", () => {
  const [a, b] = parseAdminNotifications({
    notifications: [
      { id: "1", type: "attachment", title: "Ride photo", hasAttachment: true, recipient: {}, photoUrl: "https://img.test/x.jpg" },
      { id: "2", type: "journey_started", title: "Started", recipient: {} },
    ],
  });
  assert.equal(a.hasAttachment, true);
  assert.equal(b.hasAttachment, false);
  assert.ok(!JSON.stringify(a).includes("img.test"));
  assert.deepEqual(filterNotifications([a, b], "photo", "").map((n) => n.id), ["1"]);
});

test("paginate gives one page at a time and keeps the page number in range", () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1);
  const first = paginate(items, 0, 10);
  assert.deepEqual([first.from, first.to, first.total, first.pageCount, first.rows.length], [1, 10, 23, 3, 10]);
  const last = paginate(items, 2, 10);
  assert.deepEqual([last.from, last.to, last.rows.length], [21, 23, 3]);
  assert.equal(paginate(items, 99, 10).page, 2);
  assert.equal(paginate(items, -4, 10).page, 0);
  const none = paginate([], 3, 10);
  assert.deepEqual([none.from, none.to, none.total, none.pageCount, none.page], [0, 0, 0, 1, 0]);
  assert.equal(paginate(items, 0, 0).rows.length, 1);
});

const payment = (over = {}) => ({
  id: "pay_1",
  amountMinor: 999,
  currency: "USD",
  status: "succeeded",
  createdAt: "2026-11-01T10:00:00Z",
  customerName: "Dave Kumar",
  customerEmail: "dave@example.test",
  chargeType: "new",
  method: "credit",
  refundStatus: null,
  disputeStatus: null,
  ...over,
});

test("parseAdminPayments keeps the fields the Revenue screen shows and skips what is not a payment", () => {
  const out = parseAdminPayments({ payments: [payment({ currency: "usd" }), { id: "x" }, "bad", payment({ id: "pay_2", refundStatus: "weird", currency: "eur" })], truncated: true });
  assert.equal(out.payments.length, 2);
  assert.equal(out.truncated, true);
  assert.equal(out.payments[0].currency, "USD");
  assert.equal(out.payments[1].refundStatus, null);
  assert.equal(parseAdminPayments({}), null);
  assert.equal(parseAdminPayments(null), null);
});

test("a payment is paid, refunded, failed or in progress, never by colour alone", () => {
  assert.equal(paymentGroup(payment()), "succeeded");
  assert.equal(paymentGroup(payment({ status: "failed" })), "failed");
  assert.equal(paymentGroup(payment({ status: "cancelled" })), "failed");
  assert.equal(paymentGroup(payment({ status: "processing" })), "pending");
  assert.equal(paymentGroup(payment({ refundStatus: "full" })), "refunded");
  assert.deepEqual([paymentLook(payment()).label, paymentLook(payment()).tone], ["Paid", "good"]);
  assert.equal(paymentLook(payment({ refundStatus: "partial" })).label, "Part refunded");
  assert.equal(paymentLook(payment({ status: "failed" })).tone, "bad");
  assert.equal(chargeTypeLabel("renewal"), "Renewal");
  assert.equal(chargeTypeLabel(null), "Payment");
});

test("formatMoney counts the smallest unit, and a currency without decimals is not divided", () => {
  assert.equal(formatMoney(999, "USD"), "$9.99");
  assert.equal(formatMoney(4900, "USD"), "$49.00");
  assert.equal(formatMoney(500, "JPY"), "¥500");
  assert.ok(formatMoney(1, "NOTACODE").includes("NOTACODE"));
});

test("revenueSummary adds each currency on its own and leaves out refunded and failed money", () => {
  const s = revenueSummary([
    payment({ amountMinor: 999 }),
    payment({ id: "b", amountMinor: 4900 }),
    payment({ id: "c", currency: "EUR", amountMinor: 1200 }),
    payment({ id: "d", status: "failed", amountMinor: 999 }),
    payment({ id: "e", refundStatus: "full", amountMinor: 999 }),
    payment({ id: "f", status: "processing" }),
  ]);
  assert.deepEqual(s.collected, [
    { currency: "USD", amountMinor: 5899 },
    { currency: "EUR", amountMinor: 1200 },
  ]);
  assert.deepEqual([s.paid, s.failed, s.refunded, s.pending], [3, 1, 1, 1]);
  assert.deepEqual(revenueSummary([]).collected, []);
});

test("filterPayments narrows by where a payment stands and by words", () => {
  const list = [
    payment(),
    payment({ id: "pay_2", customerName: "Kenji Sato", customerEmail: "kenji@x.test", status: "failed" }),
    payment({ id: "pay_3", chargeType: "renewal", amountMinor: 4900, refundStatus: "full" }),
  ];
  assert.equal(filterPayments(list, "", "").length, 3);
  assert.deepEqual(filterPayments(list, "", "failed").map((p) => p.id), ["pay_2"]);
  assert.deepEqual(filterPayments(list, "", "refunded").map((p) => p.id), ["pay_3"]);
  assert.deepEqual(filterPayments(list, "kenji", "").map((p) => p.id), ["pay_2"]);
  assert.deepEqual(filterPayments(list, "$49", "").map((p) => p.id), ["pay_3"]);
  assert.deepEqual(filterPayments(list, "renewal", "refunded").map((p) => p.id), ["pay_3"]);
  assert.equal(filterPayments(list, "nobody", "").length, 0);
});
