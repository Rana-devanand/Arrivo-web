"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { siteConfig } from "@/config/site";
import { useAccount } from "./AccountProvider";

/** What shows instead of the dashboard until someone is signed in: the sign-in button, or a note that it is not set up yet. */
export function SignInPanel() {
  const { auth, signIn } = useAccount();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function start() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await signIn();
    } catch {
      setMessage("We could not start the sign-in. Please try again in a moment.");
      setBusy(false);
    }
  }

  if (auth.status === "unconfigured") {
    return (
      <Panel className="p-6 sm:p-8">
        <IconTile name="lock" />
        <Heading level={1} size={2} className="mt-4">
          Your Arrivo account
        </Heading>
        <p className="mt-3 text-muted-foreground">
          Signing in on the website is not switched on yet. For now you can see and manage your plan in the Arrivo app, under Profile, then Subscription.
        </p>
        <div className="mt-6">
          <Button href={siteConfig.downloadHref} variant="outline">
            Get the Arrivo app
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="p-6 sm:p-8">
      <IconTile name="user" />
      <Heading level={1} size={2} className="mt-4">
        Sign in to your account
      </Heading>
      <p className="mt-3 text-muted-foreground">
        Use the same Google account as in the Arrivo app to see your plan and your journeys, and to subscribe.
      </p>
      <div className="mt-6 grid gap-3">
        <Button onClick={start} disabled={busy} className="w-full">
          {busy ? "Opening Google..." : "Continue with Google"}
        </Button>
        <p role={message ? "alert" : undefined} aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {message || "We only read your name and email. You pay on a secure page run by Dodo Payments; Arrivo never sees your card."}
        </p>
      </div>
    </Panel>
  );
}
