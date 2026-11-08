"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Whether this browser holds a sign-in. The Supabase client keeps its session in localStorage under `sb-<project>-auth-token`;
 * looking for that key avoids loading the whole sign-in library on every public page. The dashboard still checks the session
 * for real, so a stale key only means the button says "Dashboard" and the dashboard then asks the person to sign in.
 */
function hasSession(): boolean {
  try {
    return Object.keys(window.localStorage).some((key) => /^sb-.+-auth-token$/.test(key));
  } catch {
    return false;
  }
}

type LoginButtonProps = { size?: "md" | "sm" | "xs"; className?: string };

/** "Log in" for visitors (it opens the account page, which asks for Google sign-in), "Dashboard" for people already signed in. */
export function LoginButton({ size = "xs", className = "" }: LoginButtonProps) {
  // The server (and the first render in the browser) always says "Log in", so the HTML matches.
  const signedIn = useSyncExternalStore(subscribe, hasSession, () => false);
  return (
    <Button href="/account" variant="outline" size={size} className={className}>
      {signedIn ? "Dashboard" : "Log in"}
    </Button>
  );
}
