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
