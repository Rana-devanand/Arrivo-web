"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { extendTrail, nextDelay, parseWatch, stabilise, type LatLng, type WatchData } from "@/lib/watch";

export type WatchState =
  | { kind: "loading" }
  /** The first answer has not come, and asking again has failed. */
  | { kind: "offline" }
  /** The last answer is kept on screen while a later one fails ([reconnecting]). */
  | { kind: "ready"; data: WatchData; receivedAt: number; trail: LatLng[]; reconnecting: boolean }
  /** The link is wrong, turned off, expired, or the journey is over for good. */
  | { kind: "gone"; message: string };

const GONE = "This link is not active any more.";

async function reasonOf(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { message?: unknown } };
    return typeof body.error?.message === "string" ? body.error.message : GONE;
  } catch {
    return GONE;
  }
}

/**
 * Follows one journey: asks the API for the traveller's position every few seconds while the tab is
 * open, keeps the path seen so far, and stops once the journey is over or the link is gone. A failed
 * request never clears what is on screen; it only slows the asking down.
 */
export function useWatch(token: string | null): WatchState {
  const [state, setState] = useState<WatchState>({ kind: "loading" });

  useEffect(() => {
    // No secret yet (still being built on the server) or none in the link: nothing to ask for.
    if (!token) return;
    const secret: string = token;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let failures = 0;
    let trail: LatLng[] = [];
    let previous: WatchData | null = null;

    const schedule = (ms: number) => {
      if (!stopped) timer = setTimeout(poll, ms);
    };

    async function poll() {
      // A tab nobody is looking at does not need a position every five seconds.
      if (document.hidden) {
        schedule(nextDelay(0));
        return;
      }
      controller = new AbortController();
      const abort = controller;
      const timeout = setTimeout(() => abort.abort(), 10000);
      try {
        const res = await fetch(`${siteConfig.apiUrl}/v1/watch/${encodeURIComponent(secret)}`, {
          cache: "no-store",
          signal: abort.signal,
        });
        if (stopped) return;
        if (res.status === 404 || res.status === 410) {
          setState({ kind: "gone", message: await reasonOf(res) });
          return;
        }
        if (!res.ok) throw new Error(`status ${res.status}`);
        const parsed = parseWatch(await res.json());
        if (!parsed) throw new Error("unexpected answer");
        const data = stabilise(previous, parsed);
        previous = data;
        failures = 0;
        if (data.last) trail = extendTrail(trail, data.last.position);
        setState({ kind: "ready", data, receivedAt: Date.now(), trail, reconnecting: false });
        // Once the journey is over nothing on the page can change.
        if (data.status === "completed" || data.status === "cancelled") return;
        schedule(nextDelay(0));
      } catch {
        if (stopped) return;
        failures += 1;
        setState((prev) => (prev.kind === "ready" ? { ...prev, reconnecting: true } : { kind: "offline" }));
        schedule(nextDelay(failures));
      } finally {
        clearTimeout(timeout);
      }
    }

    const onVisible = () => {
      if (document.hidden || stopped) return;
      clearTimeout(timer);
      void poll();
    };

    document.addEventListener("visibilitychange", onVisible);
    void poll();

    return () => {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [token]);

  return state;
}
