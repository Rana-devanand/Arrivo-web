"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { initials } from "@/lib/account";
import { useAccount } from "./AccountProvider";

/** Who is signed in, with Log out. It sits at the bottom of the sidebar (the bottom of the screen on phones). */
export function AccountUserBar() {
  const { auth, signOut } = useAccount();
  const [failed, setFailed] = useState(false);
  if (auth.status !== "signedIn") return null;
  const { name, email } = auth.user;

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2.5 lg:flex-col lg:items-stretch lg:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:rounded-xl lg:bg-background lg:p-2.5">
          <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials(name, email)}
          </span>
          <div className="min-w-0 flex-1">
            {name ? <p className="truncate text-[13px] font-semibold leading-tight">{name}</p> : null}
            <p className="truncate text-[11px] text-muted-foreground">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            void signOut().then((ok) => setFailed(!ok));
          }}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary lg:min-h-10 lg:w-full"
        >
          <Icon name="logout" className="size-4" />
          Log out
        </button>
      </div>
      <p role={failed ? "alert" : undefined} aria-live="polite" className="text-xs text-muted-foreground empty:hidden">
        {failed ? "We could not log you out. Check your connection and try again." : ""}
      </p>
    </div>
  );
}
