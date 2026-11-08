"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

/** Whole seconds, so repeated reads within a second agree. */
const read = () => Math.floor(Date.now() / 1000) * 1000;

/** Zero while the page is built on the server (the page never reads the clock then), the current time once it runs in the browser. */
const readOnServer = () => 0;

/** The current time in milliseconds, refreshed every second. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, read, readOnServer);
}
