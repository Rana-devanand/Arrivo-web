"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "./AccountProvider";
import { AccountApiError, getJson } from "./accountApi";

export type Resource<T> = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: T };

/** Loads [path] for the signed-in person. `reload` asks again (the retry button). */
export function useAccountResource<T>(path: string, parse: (json: unknown) => T | null): { state: Resource<T>; reload: () => void } {
  const { getToken } = useAccount();
  const [state, setState] = useState<Resource<T>>({ status: "loading" });
  const [round, setRound] = useState(0);

  useEffect(() => {
    let stop = false;
    getToken()
      .then((token) => getJson(path, token, parse))
      .then((data) => {
        if (!stop) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (!stop) setState({ status: "error", message: error instanceof AccountApiError ? error.message : "Something went wrong. Please try again." });
      });
    return () => {
      stop = true;
    };
  }, [getToken, path, parse, round]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setRound((n) => n + 1);
  }, []);

  return { state, reload };
}
