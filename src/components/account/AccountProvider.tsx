"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { AFTER_SIGN_IN_KEY, parseBilling, type BillingInfo } from "@/lib/account";
import { parseMe } from "@/lib/admin";
import { authConfigured, getSupabase } from "@/lib/supabase";
import { useResource, type Resource } from "./useResource";

export type AccountUser = { email: string; name: string };

export type AuthState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "signedOut" }
  | { status: "signedIn"; user: AccountUser };

type Actions = {
  /** Sends the person to Google, and back to this page once signed in. */
  signIn: () => Promise<void>;
  /** False when it could not sign out (for example offline): the person is then still signed in. */
  signOut: () => Promise<boolean>;
  /** The current access token for the Arrivo API (refreshed by the client when it runs out), or null. */
  getToken: () => Promise<string | null>;
};

type Account = Actions & {
  auth: AuthState;
  /** True for an admin. The server decides this on every request; the website only uses it to show the admin menu. */
  isAdmin: boolean;
  /** True while we are still finding out whether the person is an admin. */
  rolePending: boolean;
  /** The person's plan, loaded once for every screen (the top bar, the dashboard, the plan page). */
  billing: Resource<BillingInfo>;
  reloadBilling: () => void;
};

const AccountContext = createContext<Account | null>(null);

export function useAccount(): Account {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}

function toAuth(session: Session | null): AuthState {
  const user = session?.user;
  if (!user) return { status: "signedOut" };
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const name = typeof meta?.full_name === "string" ? meta.full_name : typeof meta?.name === "string" ? meta.name : "";
  return { status: "signedIn", user: { email: user.email ?? "", name } };
}

/** Module-level so their identity never changes: a screen that loads data depends on `getToken` and must not reload when the auth state is refreshed. */
const actions: Actions = {
  async signIn() {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Sign-in is not set up.");
    try {
      // Google sends the person back to /account; the shell then takes them on to this page.
      window.sessionStorage.setItem(AFTER_SIGN_IN_KEY, window.location.pathname);
    } catch {
      // Not remembered: they land on the dashboard instead.
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // One fixed address, so Supabase's list of allowed redirect URLs needs just `<site>/account`.
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) throw error;
  },
  async signOut() {
    const supabase = getSupabase();
    if (!supabase) return true;
    const { error } = await supabase.auth.signOut();
    return !error;
  },
  async getToken() {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
};

/** Holds who is signed in on the website, their role and plan. The session is kept by the Supabase client in this browser only. */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({ status: authConfigured ? "loading" : "unconfigured" }));

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let stop = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!stop) setAuth(toAuth(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuth(toAuth(session)));
    return () => {
      stop = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signedIn = auth.status === "signedIn";
  const email = auth.status === "signedIn" ? auth.user.email : "";
  const me = useResource(actions.getToken, signedIn, email, "/me", parseMe);
  const billing = useResource(actions.getToken, signedIn, email, "/billing/me", parseBilling);
  const isAdmin = signedIn && me.state.status === "ready" && me.state.data.role === "ADMIN";
  const rolePending = signedIn && me.state.status === "loading";

  const value = useMemo<Account>(
    () => ({ auth, ...actions, isAdmin, rolePending, billing: billing.state, reloadBilling: billing.reload }),
    [auth, isAdmin, rolePending, billing.state, billing.reload],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
