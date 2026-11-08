import { siteConfig } from "@/config/site";

/** What went wrong, in words that can be shown as they are. The API's own error text is never shown raw. */
export class AccountApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const SESSION_ENDED = "Your session has ended. Please sign in again.";
const OFFLINE = "We could not reach Arrivo. Check your connection and try again.";
const GENERIC = "Something went wrong on our side. Please try again in a moment.";

async function send(path: string, token: string | null, init: RequestInit): Promise<Response> {
  if (!token) throw new AccountApiError(401, SESSION_ENDED);
  try {
    return await fetch(`${siteConfig.apiUrl}/v1${path}`, {
      ...init,
      headers: { ...init.headers, authorization: `Bearer ${token}`, "content-type": "application/json" },
    });
  } catch {
    throw new AccountApiError(0, OFFLINE);
  }
}

/**
 * A message for a failed reply. The API words 4xx errors, and its 503 "payments are not open yet", for people;
 * any other 5xx (a crash, the payment partner being down) is never shown, so no detail can leak.
 */
async function failure(res: Response): Promise<AccountApiError> {
  if (res.status === 401) return new AccountApiError(401, SESSION_ENDED);
  if (res.status >= 500 && res.status !== 503) return new AccountApiError(res.status, GENERIC);
  const body: { error?: { message?: unknown } } | null = await res.json().catch(() => null);
  const message = body?.error?.message;
  return new AccountApiError(res.status, typeof message === "string" ? message : GENERIC);
}

/** GET [path] with the sign-in token and run it through [parse], which returns null for a reply it does not understand. */
export async function getJson<T>(path: string, token: string | null, parse: (json: unknown) => T | null): Promise<T> {
  const res = await send(path, token, { method: "GET" });
  if (!res.ok) throw await failure(res);
  const parsed = parse(await res.json().catch(() => null));
  if (parsed === null) throw new AccountApiError(res.status, GENERIC);
  return parsed;
}

/** Only a real payment address is followed: https, nothing else. */
function secureUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

async function postForUrl(path: string, token: string | null, body: object, key: "checkoutUrl" | "url"): Promise<string> {
  const res = await send(path, token, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw await failure(res);
  const json: Record<string, unknown> | null = await res.json().catch(() => null);
  const url = secureUrl(json?.[key]);
  if (!url) throw new AccountApiError(res.status, GENERIC);
  return url;
}

/** Starts a payment for the signed-in person and returns the secure page to pay on. [coupon] is an offer code the person chose. */
export const startCheckout = (token: string | null, plan: string, coupon?: string) =>
  postForUrl("/billing/checkout-session", token, { plan, ...(coupon ? { coupon } : {}) }, "checkoutUrl");

/** A link to the payment partner's portal: cancel, change card, invoices. */
export const openPortal = (token: string | null) => postForUrl("/billing/portal", token, {}, "url");

/** POSTs [body] to [path] and runs the answer through [parse], which returns null for a reply it does not understand. */
export async function postJson<T>(path: string, token: string | null, body: object, parse: (json: unknown) => T | null): Promise<T> {
  const res = await send(path, token, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw await failure(res);
  const parsed = parse(await res.json().catch(() => null));
  if (parsed === null) throw new AccountApiError(res.status, GENERIC);
  return parsed;
}
