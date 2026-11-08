"use client";

import { useCallback, useEffect, useState } from "react";
import { AccountApiError, getJson } from "./accountApi";

export type Resource<T> = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

type Stored<T> = { key: string; value: Resource<T> };

/**
 * Loads [path] with the person's token while [enabled]. [key] says whose answer it is (their email): an answer kept from
 * someone else who was signed in before counts as still loading, so it never shows for the next person. `reload` asks again.
 */
export function useResource<T>(
  getToken: () => Promise<string | null>,
  enabled: boolean,
  key: string,
  path: string,
  parse: (json: unknown) => T | null,
): { state: Resource<T>; reload: () => void } {
  const [stored, setStored] = useState<Stored<T>>({ key: "", value: { status: "loading" } });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let stop = false;
    getToken()
      .then((token) => getJson(path, token, parse))
      .then((data) => {
        if (!stop) setStored({ key, value: { status: "ready", data } });
      })
      .catch((error: unknown) => {
        if (!stop) setStored({ key, value: { status: "error", message: error instanceof AccountApiError ? error.message : "Something went wrong. Please try again." } });
      });
    return () => {
      stop = true;
    };
  }, [enabled, getToken, key, path, parse, round]);

  const reload = useCallback(() => {
    setStored((s) => ({ key: s.key, value: { status: "loading" } }));
    setRound((n) => n + 1);
  }, []);

  const state: Resource<T> = enabled && stored.key === key ? stored.value : { status: "loading" };
  return { state, reload };
}
