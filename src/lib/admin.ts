/**
 * What the admin screens work out from the Arrivo API's answers, as plain functions with no imports, so
 * `npm run check:admin` can test them without a browser. Every parser returns null for a reply it does not
 * understand, and copies only the fields the screens show.
 *
 * The server decides who may see this (it reads the role from the database on every request); the website only
 * hides the menu for everyone else.
 */

export type Role = "USER" | "ADMIN";

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const text = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const maybeText = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
const count = (v: unknown): number => (isNumber(v) && v >= 0 ? Math.floor(v) : 0);
const record = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null);

/** Turns `GET /v1/me` into who is signed in and their role, or null. */
export function parseMe(json: unknown): { role: Role; name: string } | null {
  const j = record(json);
  if (!j || typeof j.id !== "string") return null;
  return { role: j.role === "ADMIN" ? "ADMIN" : "USER", name: text(j.displayName) };
}

export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  role: Role;
  createdAt: string;
  deletionRequested: boolean;
  total: number;
  active: number;
  overdue: number;
  completed: number;
  cancelled: number;
  lastStartedAt: string | null;
};

/** `GET /v1/admin/users`: everyone, with their country, role and how many journeys. */
export function parseAdminUsers(json: unknown): AdminUserRow[] | null {
  const j = record(json);
  if (!j || !Array.isArray(j.users)) return null;
  const rows: AdminUserRow[] = [];
  for (const raw of j.users) {
    const u = record(raw);
    if (!u || typeof u.id !== "string") continue;
    const c = record(u.journeys) ?? {};
    rows.push({
      id: u.id,
      name: text(u.displayName),
      email: maybeText(u.email),
      phone: maybeText(u.phone),
      countryCode: maybeText(u.countryCode),
      role: u.role === "ADMIN" ? "ADMIN" : "USER",
      createdAt: text(u.createdAt),
      deletionRequested: u.deletionRequested === true,
      total: count(c.total),
      active: count(c.active),
      overdue: count(c.overdue),
      completed: count(c.completed),
      cancelled: count(c.cancelled),
      lastStartedAt: maybeText(c.lastStartedAt),
    });
  }
  return rows;
}

export type AdminJourneyStatus = "active" | "overdue" | "completed" | "cancelled";
const JOURNEY_STATUSES: AdminJourneyStatus[] = ["active", "overdue", "completed", "cancelled"];

export type AdminJourney = {
  id: string;
  originName: string;
  destinationName: string;
  mode: string;
  status: AdminJourneyStatus;
  startedAt: string;
  expectedArrival: string;
  arrivedAt: string | null;
  endedAt: string | null;
  distanceKm: number;
  vehicle: string;
  contactCount: number;
  notificationCount: number;
  recipientCount: number;
  places: string[];
};

/** `GET /v1/admin/journey-activity`: per person, their journeys with how many notifications went out and from which places. */
export function parseAdminActivity(json: unknown): Record<string, AdminJourney[]> | null {
  const j = record(json);
  if (!j || !Array.isArray(j.users)) return null;
  const out: Record<string, AdminJourney[]> = {};
  for (const raw of j.users) {
    const u = record(raw);
    if (!u || typeof u.id !== "string" || !Array.isArray(u.journeys)) continue;
    const journeys: AdminJourney[] = [];
    for (const rawJourney of u.journeys) {
      const x = record(rawJourney);
      const status = JOURNEY_STATUSES.find((v) => v === x?.status);
      if (!x || typeof x.id !== "string" || !status) continue;
      journeys.push({
        id: x.id,
        originName: text(x.originName),
        destinationName: text(x.destinationName),
        mode: text(x.mode),
        status,
        startedAt: text(x.startedAt),
        expectedArrival: text(x.expectedArrival),
        arrivedAt: maybeText(x.arrivedAt),
        endedAt: maybeText(x.endedAt),
        distanceKm: isNumber(x.distanceKm) ? x.distanceKm : 0,
        vehicle: text(x.vehicle),
        contactCount: count(x.contactCount),
        notificationCount: count(x.notificationCount),
        recipientCount: count(x.recipientCount),
        places: Array.isArray(x.places) ? x.places.filter((p): p is string => typeof p === "string") : [],
      });
    }
    out[u.id] = journeys;
  }
  return out;
}

export type AdminNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  recipientName: string;
  recipientEmail: string | null;
  travellerName: string | null;
  place: string | null;
  /** A ride photo came with it. Only the fact: the photo is never sent to the dashboard. */
  hasAttachment: boolean;
};

/** `GET /v1/admin/notifications`: who got which notification and what it said. */
export function parseAdminNotifications(json: unknown): AdminNotification[] | null {
  const j = record(json);
  if (!j || !Array.isArray(j.notifications)) return null;
  const rows: AdminNotification[] = [];
  for (const raw of j.notifications) {
    const n = record(raw);
    if (!n || typeof n.id !== "string") continue;
    const to = record(n.recipient) ?? {};
    const who = record(n.traveller);
    rows.push({
      id: n.id,
      type: text(n.type),
      title: text(n.title),
      body: text(n.body),
      read: n.read === true,
      createdAt: text(n.createdAt),
      recipientName: text(to.name),
      recipientEmail: maybeText(to.email),
      travellerName: who ? text(who.name) || null : null,
      place: maybeText(n.place),
      hasAttachment: n.hasAttachment === true,
    });
  }
  return rows;
}

/** Narrows the people list to those whose name, email, phone or country matches every word typed. */
export function filterUsers(users: readonly AdminUserRow[], query: string, countryOf: (code: string | null) => string = () => ""): AdminUserRow[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...users];
  return users.filter((u) => {
    const hay = `${u.name} ${u.email ?? ""} ${u.phone ?? ""} ${u.countryCode ?? ""} ${countryOf(u.countryCode)} ${u.role}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export type UserStats = { total: number; admins: number; countries: number; journeys: number; deletionRequests: number };

export function userStats(users: readonly AdminUserRow[]): UserStats {
  return {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    countries: new Set(users.map((u) => u.countryCode).filter(Boolean)).size,
    journeys: users.reduce((sum, u) => sum + u.total, 0),
    deletionRequests: users.filter((u) => u.deletionRequested).length,
  };
}

/** "India" for "IN", or "Not set". Falls back to the code itself when the name is not known. */
export function countryName(code: string | null): string {
  if (!code) return "Not set";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** The flag emoji for a two-letter country code, or an empty string. */
export function countryFlag(code: string | null): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export type NotificationIcon = "users" | "checkCircle" | "circleX" | "navigation" | "flag" | "clock" | "pin" | "signal" | "camera" | "alert" | "user" | "bell";

const LOOKS: Record<string, { label: string; icon: NotificationIcon }> = {
  invitation: { label: "Invitation", icon: "users" },
  invite_accepted: { label: "Invite accepted", icon: "checkCircle" },
  invite_declined: { label: "Invite declined", icon: "circleX" },
  journey_started: { label: "Journey started", icon: "navigation" },
  journey_arrived: { label: "Arrived", icon: "flag" },
  journey_cancelled: { label: "Journey ended", icon: "circleX" },
  journey_delayed: { label: "Running late", icon: "clock" },
  journey_progress: { label: "Progress update", icon: "pin" },
  location_stale: { label: "Location quiet", icon: "signal" },
  attachment: { label: "Ride photo", icon: "camera" },
  sos: { label: "SOS", icon: "alert" },
  new_user: { label: "New user", icon: "user" },
};

/** One word and one icon for a kind of notification. */
export function notificationLook(type: string): { label: string; icon: NotificationIcon } {
  return LOOKS[type] ?? { label: "Notification", icon: "bell" };
}

/** The kinds of notification present, for the filter, in the order the list first shows them. */
export function notificationTypes(list: readonly AdminNotification[]): string[] {
  return [...new Set(list.map((n) => n.type))];
}

export type Paged<T> = { rows: T[]; page: number; pageCount: number; from: number; to: number; total: number };

/** One page of a list. A page number that is too high or low is brought back in range; an empty list has one empty page. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Paged<T> {
  const size = Math.max(1, Math.floor(pageSize) || 1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const at = Math.min(Math.max(0, Math.floor(page) || 0), pageCount - 1);
  const start = at * size;
  const rows = items.slice(start, start + size);
  return { rows, page: at, pageCount, from: rows.length === 0 ? 0 : start + 1, to: start + rows.length, total: items.length };
}

export type AdminPayment = {
  id: string;
  /** In the smallest unit of the currency (cents), as the payment partner counts it. */
  amountMinor: number;
  currency: string;
  status: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  chargeType: string | null;
  method: string | null;
  refundStatus: "partial" | "full" | null;
  disputeStatus: string | null;
};

/** `GET /v1/admin/payments`: the newest payments, and whether there may be older ones. */
export function parseAdminPayments(json: unknown): { payments: AdminPayment[]; truncated: boolean } | null {
  const j = record(json);
  if (!j || !Array.isArray(j.payments)) return null;
  const payments: AdminPayment[] = [];
  for (const raw of j.payments) {
    const p = record(raw);
    if (!p || typeof p.id !== "string" || !isNumber(p.amountMinor) || typeof p.createdAt !== "string") continue;
    payments.push({
      id: p.id,
      amountMinor: Math.round(p.amountMinor),
      currency: text(p.currency, "USD").toUpperCase(),
      status: text(p.status, "unknown"),
      createdAt: p.createdAt,
      customerName: text(p.customerName),
      customerEmail: text(p.customerEmail),
      chargeType: maybeText(p.chargeType),
      method: maybeText(p.method),
      refundStatus: p.refundStatus === "partial" || p.refundStatus === "full" ? p.refundStatus : null,
      disputeStatus: maybeText(p.disputeStatus),
    });
  }
  return { payments, truncated: j.truncated === true };
}

export type PaymentGroup = "succeeded" | "refunded" | "failed" | "pending";

/** Where a payment stands, in four words people use: paid, refunded, did not go through, still moving. */
export function paymentGroup(p: Pick<AdminPayment, "status" | "refundStatus">): PaymentGroup {
  if (p.refundStatus) return "refunded";
  if (p.status === "succeeded") return "succeeded";
  if (p.status === "failed" || p.status === "cancelled") return "failed";
  return "pending";
}

const PAYMENT_LOOKS: Record<PaymentGroup, { label: string; tone: "good" | "warn" | "bad" | "quiet"; icon: NotificationIcon | "creditCard" }> = {
  succeeded: { label: "Paid", tone: "good", icon: "checkCircle" },
  refunded: { label: "Refunded", tone: "quiet", icon: "creditCard" },
  failed: { label: "Failed", tone: "bad", icon: "circleX" },
  pending: { label: "In progress", tone: "warn", icon: "clock" },
};

export function paymentLook(p: Pick<AdminPayment, "status" | "refundStatus">) {
  const group = paymentGroup(p);
  const look = PAYMENT_LOOKS[group];
  const label = p.refundStatus === "partial" ? "Part refunded" : look.label;
  return { ...look, label, group };
}

const CHARGE_TYPES: Record<string, string> = { new: "First payment", renewal: "Renewal", plan_change: "Plan change", on_demand: "On demand" };

export function chargeTypeLabel(type: string | null): string {
  return type ? (CHARGE_TYPES[type] ?? "Payment") : "Payment";
}

/** "$9.99" for 999 USD. Amounts are in the smallest unit, so a currency with no decimals (yen) is not divided. */
export function formatMoney(amountMinor: number, currency: string): string {
  try {
    const format = new Intl.NumberFormat("en", { style: "currency", currency });
    const digits = format.resolvedOptions().maximumFractionDigits ?? 2;
    return format.format(amountMinor / 10 ** digits);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}

export type RevenueSummary = {
  /** Money kept, per currency: paid payments that were not refunded. Currencies are never added together. */
  collected: { currency: string; amountMinor: number }[];
  paid: number;
  failed: number;
  refunded: number;
  pending: number;
};

export function revenueSummary(payments: readonly AdminPayment[]): RevenueSummary {
  const money = new Map<string, number>();
  const out: RevenueSummary = { collected: [], paid: 0, failed: 0, refunded: 0, pending: 0 };
  for (const p of payments) {
    const group = paymentGroup(p);
    if (group === "succeeded") {
      out.paid += 1;
      money.set(p.currency, (money.get(p.currency) ?? 0) + p.amountMinor);
    } else if (group === "refunded") out.refunded += 1;
    else if (group === "failed") out.failed += 1;
    else out.pending += 1;
  }
  out.collected = [...money].map(([currency, amountMinor]) => ({ currency, amountMinor })).sort((a, b) => b.amountMinor - a.amountMinor);
  return out;
}

/** Narrows payments by where they stand ("" means all) and by words in the person, amount, id, kind or method. */
export function filterPayments(list: readonly AdminPayment[], query: string, group: string): AdminPayment[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((p) => {
    if (group && paymentGroup(p) !== group) return false;
    const hay = `${p.customerName} ${p.customerEmail} ${p.id} ${chargeTypeLabel(p.chargeType)} ${p.method ?? ""} ${formatMoney(p.amountMinor, p.currency)} ${paymentLook(p).label}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

/** Narrows the list by kind ("" means all) and by words in the title, text, people or place. */
export function filterNotifications(list: readonly AdminNotification[], query: string, type: string): AdminNotification[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter((n) => {
    if (type && n.type !== type) return false;
    const hay = `${n.title} ${n.body} ${n.recipientName} ${n.recipientEmail ?? ""} ${n.travellerName ?? ""} ${n.place ?? ""} ${n.hasAttachment ? "attachment photo" : ""}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
