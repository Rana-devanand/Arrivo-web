/**
 * Everything the account dashboard works out from the Arrivo API's answers, as plain functions with no
 * imports, so `npm run check:account` can test them without a browser.
 *
 * Never trust the shape of a reply: each parser returns null when it is not what we expect. The journey
 * parser copies only the few fields the dashboard shows, so coordinates, routes, photos and tracking tokens
 * that the API sends to the owner are never kept or rendered here.
 */

export type PlanId = "free" | "plus" | "family";
export type JourneyStatus = "active" | "overdue" | "completed" | "cancelled";
export type Tone = "good" | "warn" | "bad" | "quiet";

export type BillingInfo = {
  plan: PlanId;
  name: string;
  /** How it is paid for: "monthly", "sixMonths", "yearly" or "familyYearly". Null on Arrivo Free. */
  planKey: string | null;
  /** "active", "past_due", "on_hold", "cancelled", "expired" or "failed". Null when there is no paid plan. */
  status: string | null;
  renewsAt: string | null;
  cancelled: boolean;
  contactLimit: number;
  contactsUsed: number;
  /** Only the person who pays can open the payment portal. */
  canManage: boolean;
  /** Set when Plus comes through someone else's Family plan. */
  familyOwner: string | null;
};

export type JourneyItem = {
  id: string;
  status: JourneyStatus;
  originName: string;
  destinationName: string;
  mode: string;
  startedAt: string;
  expectedArrival: string;
  arrivedAt: string | null;
  endedAt: string | null;
  distanceKm: number;
};

const PLANS: PlanId[] = ["free", "plus", "family"];
const STATUSES: JourneyStatus[] = ["active", "overdue", "completed", "cancelled"];

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const text = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const maybeText = (v: unknown): string | null => (typeof v === "string" && v ? v : null);

/** Turns `GET /v1/billing/me` into [BillingInfo], or null. */
export function parseBilling(json: unknown): BillingInfo | null {
  if (typeof json !== "object" || json === null) return null;
  const j = json as Record<string, unknown>;
  const plan = PLANS.find((p) => p === j.plan);
  const limits = typeof j.limits === "object" && j.limits !== null ? (j.limits as Record<string, unknown>) : null;
  if (!plan || !limits || !isNumber(limits.contacts)) return null;
  const family = typeof j.familyMemberOf === "object" && j.familyMemberOf !== null ? (j.familyMemberOf as Record<string, unknown>) : null;
  return {
    plan,
    name: text(j.name, "Arrivo"),
    planKey: maybeText(j.planKey),
    status: maybeText(j.status),
    renewsAt: maybeText(j.renewsAt),
    cancelled: j.cancelled === true,
    contactLimit: limits.contacts,
    contactsUsed: isNumber(j.contactsUsed) ? j.contactsUsed : 0,
    canManage: j.canManage === true,
    familyOwner: family ? text(family.ownerName, "Your family") : null,
  };
}

/** Turns `GET /v1/journeys` into a list of [JourneyItem], newest first as sent, or null. */
export function parseJourneys(json: unknown): { items: JourneyItem[]; more: boolean } | null {
  if (typeof json !== "object" || json === null) return null;
  const j = json as Record<string, unknown>;
  if (!Array.isArray(j.items)) return null;
  const items: JourneyItem[] = [];
  for (const raw of j.items) {
    if (typeof raw !== "object" || raw === null) continue;
    const r = raw as Record<string, unknown>;
    const status = STATUSES.find((s) => s === r.status);
    const id = text(r.id);
    if (!status || !id) continue;
    items.push({
      id,
      status,
      originName: text(r.originName),
      destinationName: text(r.destinationName),
      mode: text(r.mode),
      startedAt: text(r.startedAt),
      expectedArrival: text(r.expectedArrival),
      arrivedAt: maybeText(r.arrivedAt),
      endedAt: maybeText(r.endedAt),
      distanceKm: isNumber(r.distanceKm) ? r.distanceKm : 0,
    });
  }
  return { items, more: typeof j.nextBefore === "string" && j.nextBefore.length > 0 };
}

/** Where the browser remembers, across the trip to Google and back, which account page the person started from. */
export const AFTER_SIGN_IN_KEY = "arrivo-after-sign-in";

const RETURN_PATHS = ["/account/plan", "/account/journeys"];

/** The page to go back to after signing in, or null. Only our own account pages are allowed, so a stored value can never send anyone elsewhere. */
export function safeReturnPath(stored: string | null): string | null {
  return stored !== null && RETURN_PATHS.includes(stored) ? stored : null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days until [iso] (rounded up, never below 0), or null when there is no date. */
export function daysLeft(iso: string | null, nowMs: number): number | null {
  if (!iso) return null;
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.ceil((at - nowMs) / DAY_MS));
}

/** "12 Nov 2026" in the viewer's own time zone, unless a test gives one. */
export function formatDay(iso: string, timeZone?: string): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return "";
  return new Intl.DateTimeFormat("en-GB", { timeZone, day: "numeric", month: "short", year: "numeric" }).format(at);
}

/** "12 Nov, 6:30 pm" in the viewer's own time zone, unless a test gives one. */
export function formatDayTime(iso: string, timeZone?: string): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return "";
  const date = new Intl.DateTimeFormat("en-GB", { timeZone, day: "numeric", month: "short" }).format(at);
  const clock = new Intl.DateTimeFormat("en", { timeZone, hour: "numeric", minute: "2-digit" }).format(at);
  return `${date}, ${clock}`;
}

export type StatusSummary = { label: string; tone: Tone; note: string };

/** How the paid plan stands, in a word and a sentence. Colour is never the only signal: the label says it. */
export function statusSummary(b: BillingInfo, nowMs: number, timeZone?: string): StatusSummary {
  if (b.plan === "free") {
    return { label: "Free", tone: "quiet", note: "No time limit. Upgrade any time for more contacts." };
  }
  const until = b.renewsAt ? formatDay(b.renewsAt, timeZone) : "";
  const left = daysLeft(b.renewsAt, nowMs);
  const days = left === null ? "" : left === 0 ? " (ends today)" : left === 1 ? " (1 day left)" : ` (${left} days left)`;
  if (b.familyOwner) {
    return { label: "Active", tone: "good", note: `Plus comes from ${b.familyOwner}'s Family plan${until ? `, paid until ${until}` : ""}${days}.` };
  }
  if (b.cancelled) {
    return { label: "Cancelled", tone: "warn", note: until ? `Plus stays on until ${until}${days}. It will not renew.` : "Plus will not renew." };
  }
  if (b.status === "past_due" || b.status === "on_hold") {
    return { label: "Payment due", tone: "warn", note: "The last payment did not go through. Update your card in Manage subscription to keep Plus." };
  }
  return { label: "Active", tone: "good", note: until ? `Renews on ${until}${days}.` : "Your plan is active." };
}

/** How the plan is paid for, in words: "Monthly", "Every 6 months", "Yearly". */
export function billingPeriod(planKey: string | null): string | null {
  switch (planKey) {
    case "monthly":
      return "Monthly";
    case "sixMonths":
      return "Every 6 months";
    case "yearly":
    case "familyYearly":
      return "Yearly";
    default:
      return null;
  }
}

/** Trusted contacts still free on this plan, never below 0. */
export const contactsLeft = (b: Pick<BillingInfo, "contactLimit" | "contactsUsed">): number => Math.max(0, b.contactLimit - b.contactsUsed);

/** How full the contacts are, 0 to 100, for a progress bar. */
export function contactsPercent(b: Pick<BillingInfo, "contactLimit" | "contactsUsed">): number {
  if (b.contactLimit <= 0) return 0;
  return Math.min(100, Math.round((b.contactsUsed / b.contactLimit) * 100));
}

export type StatusLook = { label: string; tone: Tone; icon: "checkCircle" | "circleX" | "alert" | "navigation" };

/** One word, one icon and one tone for a journey's status. */
export function journeyLook(status: JourneyStatus): StatusLook {
  switch (status) {
    case "completed":
      return { label: "Arrived", tone: "good", icon: "checkCircle" };
    case "cancelled":
      return { label: "Ended", tone: "quiet", icon: "circleX" };
    case "overdue":
      return { label: "Late", tone: "bad", icon: "alert" };
    default:
      return { label: "In progress", tone: "good", icon: "navigation" };
  }
}

export type ModeIcon = "car" | "bike" | "walk" | "train" | "navigation";

/** The icon for how a journey was made: by car, bike, on foot, or by train, metro and transit. */
export function modeIcon(mode: string): ModeIcon {
  switch (mode) {
    case "car":
      return "car";
    case "bike":
      return "bike";
    case "walk":
      return "walk";
    case "train":
    case "metro":
    case "transit":
      return "train";
    default:
      return "navigation";
  }
}

/** "35 min", "2 h 10 min", "1 day 3 h" for a length of time in minutes. */
export function durationText(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h < 24) return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
  const d = Math.floor(h / 24);
  const hours = h % 24;
  return `${d} ${d === 1 ? "day" : "days"}${hours ? ` ${hours} h` : ""}`;
}

/** How long a finished journey took, or null while it runs (or when the times make no sense). */
export function journeyMinutes(j: Pick<JourneyItem, "startedAt" | "arrivedAt" | "endedAt">): number | null {
  const end = j.arrivedAt ?? j.endedAt;
  if (!end) return null;
  const minutes = (Date.parse(end) - Date.parse(j.startedAt)) / 60000;
  return Number.isFinite(minutes) && minutes >= 0 ? minutes : null;
}

export type JourneyCounts = { total: number; completed: number; inProgress: number };

export function journeyCounts(items: readonly JourneyItem[]): JourneyCounts {
  return {
    total: items.length,
    completed: items.filter((j) => j.status === "completed").length,
    inProgress: items.filter((j) => j.status === "active" || j.status === "overdue").length,
  };
}

/** The first name to greet someone with, from their full name or, failing that, their email. */
export function firstName(name: string, email: string): string {
  const fromName = name.trim().split(/\s+/)[0];
  if (fromName) return fromName;
  return email.split("@")[0] ?? "";
}

/** Up to two capital letters for an avatar. */
export function initials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0]![0]}${parts[parts.length - 1]![0]}` : (parts[0] ?? email).slice(0, 2);
  return letters.toUpperCase();
}

// ---------------------------------------------------------------------------------------------------------------
// Discount offers. An admin makes them; people see the ones that are live and can use one when they pay.
// ---------------------------------------------------------------------------------------------------------------

/** An offer as signed-in people see it: only what the card needs. */
export type Offer = { code: string; title: string; percentOff: number; endsAt: string };
export type OfferStatus = "scheduled" | "live" | "ended";
/** An offer as the admin sees it. */
export type AdminOffer = Offer & { id: string; startsAt: string; status: OfferStatus; createdAt: string };

const OFFER_STATUSES: OfferStatus[] = ["scheduled", "live", "ended"];

function offerOf(raw: unknown): Offer | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const percent = o.percentOff;
  if (typeof o.code !== "string" || !o.code || !isNumber(percent) || percent < 1 || percent > 100) return null;
  return { code: o.code, title: text(o.title), percentOff: Math.round(percent), endsAt: text(o.endsAt) };
}

/** Turns `GET /v1/billing/offers` into the offers that are live now, or null. */
export function parseOffers(json: unknown): Offer[] | null {
  if (typeof json !== "object" || json === null) return null;
  const list = (json as Record<string, unknown>).offers;
  if (!Array.isArray(list)) return null;
  return list.map(offerOf).filter((o): o is Offer => o !== null);
}

/** One offer from the admin API (the list, or the answer to making or ending one), or null. */
export function parseAdminOffer(raw: unknown): AdminOffer | null {
  const base = offerOf(raw);
  if (!base || typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const status = OFFER_STATUSES.find((x) => x === o.status);
  const id = text(o.id);
  if (!status || !id) return null;
  return { ...base, id, startsAt: text(o.startsAt), status, createdAt: text(o.createdAt) };
}

/** Turns `GET /v1/admin/coupons` into every offer, newest first, or null. */
export function parseAdminOffers(json: unknown): AdminOffer[] | null {
  if (typeof json !== "object" || json === null) return null;
  const list = (json as Record<string, unknown>).coupons;
  if (!Array.isArray(list)) return null;
  return list.map(parseAdminOffer).filter((o): o is AdminOffer => o !== null);
}

/** "Ends in 5 h 12 min", or "Ended" once the time has come. */
export function offerEndsText(endsAt: string, nowMs: number): string {
  const end = Date.parse(endsAt);
  if (Number.isNaN(end) || end <= nowMs) return "Ended";
  return "Ends in " + durationText(Math.ceil((end - nowMs) / 60000));
}

/** The price after taking [percentOff] percent off, in cents. An estimate: the payment partner works out the exact amount. */
export function discountedCents(cents: number, percentOff: number): number {
  const p = Math.min(100, Math.max(0, percentOff));
  return Math.round((cents * (100 - p)) / 100);
}

export function offerStatusLook(status: OfferStatus): { label: string; tone: Tone; icon: "checkCircle" | "clock" | "circleX" } {
  switch (status) {
    case "live":
      return { label: "Live", tone: "good", icon: "checkCircle" };
    case "scheduled":
      return { label: "Scheduled", tone: "warn", icon: "clock" };
    default:
      return { label: "Ended", tone: "quiet", icon: "circleX" };
  }
}

export type OfferUnit = "minutes" | "hours" | "days";

const UNIT_MINUTES: Record<OfferUnit, number> = { minutes: 1, hours: 60, days: 24 * 60 };

/** How long an offer lasts, in minutes, from "3" and "days". */
export const offerMinutes = (amount: number, unit: OfferUnit): number => amount * UNIT_MINUTES[unit];

const MIN_OFFER_MINUTES = 5;
const MAX_OFFER_MINUTES = 366 * 24 * 60;

/** What the code box keeps of what was typed: capital letters and digits, up to 16. */
export const normaliseCode = (value: string): string => value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 16);

export type OfferForm = { title: string; code: string; percentOff: number; startsAtMs: number | null; minutes: number };

/** The first thing wrong with a new offer, in words, or null. The server checks the same rules again. */
export function validateOffer(f: OfferForm, nowMs: number): string | null {
  const title = f.title.trim();
  if (title.length < 3 || title.length > 60) return "Give the offer a name (3 to 60 letters).";
  if (!/^[A-Z0-9]{3,16}$/.test(f.code.trim().toUpperCase())) return "The code is 3 to 16 capital letters or digits.";
  if (!Number.isInteger(f.percentOff) || f.percentOff < 1 || f.percentOff > 90) return "The discount is 1 to 90 percent.";
  if (!Number.isFinite(f.minutes) || f.minutes < MIN_OFFER_MINUTES) return "An offer must run for at least 5 minutes.";
  if (f.minutes > MAX_OFFER_MINUTES) return "An offer can run for 366 days at most.";
  if (f.startsAtMs !== null) {
    if (!Number.isFinite(f.startsAtMs)) return "Pick a valid start time.";
    if (f.startsAtMs < nowMs - 60_000) return "The start time cannot be in the past.";
  }
  return null;
}

/** The start (left out for "now") and the end of an offer, as the API wants them. */
export function offerWindow(nowMs: number, startsAtMs: number | null, minutes: number): { startsAt?: string; endsAt: string } {
  const start = startsAtMs ?? nowMs;
  return { ...(startsAtMs === null ? {} : { startsAt: new Date(startsAtMs).toISOString() }), endsAt: new Date(start + minutes * 60_000).toISOString() };
}

/** When several offers are live, the one that takes the most off. */
export function bestOffer(offers: readonly Offer[]): Offer | null {
  return offers.reduce<Offer | null>((best, o) => (!best || o.percentOff > best.percentOff ? o : best), null);
}

/** Where an offer stands right now. The server"s word was true when it was sent; as time passes a live offer ends and a scheduled one starts. */
export function effectiveOfferStatus(o: Pick<AdminOffer, "status" | "startsAt" | "endsAt">, nowMs: number): OfferStatus {
  if (o.status === "ended" || nowMs >= Date.parse(o.endsAt)) return "ended";
  // A live offer the server just reported stays live, even if the clock here is a moment behind its start.
  if (o.status === "live" || nowMs >= Date.parse(o.startsAt)) return "live";
  return "scheduled";
}
