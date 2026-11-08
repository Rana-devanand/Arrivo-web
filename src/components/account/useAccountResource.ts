"use client";

import { useAccount } from "./AccountProvider";
import { useResource, type Resource } from "./useResource";

export type { Resource };

/** Loads [path] for the signed-in person: loading, error (with `reload` for the retry button) or data. */
export function useAccountResource<T>(path: string, parse: (json: unknown) => T | null): { state: Resource<T>; reload: () => void } {
  const { auth, getToken } = useAccount();
  const email = auth.status === "signedIn" ? auth.user.email : "";
  return useResource(getToken, auth.status === "signedIn", email, path, parse);
}
