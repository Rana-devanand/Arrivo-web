"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import type { IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { StatusPill, type PillTone } from "@/components/ui/StatusPill";
import { useNow } from "@/components/watch/useNow";
import { billingPeriod, formatDay, statusSummary, type BillingInfo } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { AccountApiError, openPortal } from "./accountApi";

const PILL_ICONS: Record<PillTone, IconName> = { good: "checkCircle", warn: "alert", bad: "alert", quiet: "shield" };

/** The plan, whether it is active, when it renews or ends, and the buttons to upgrade or manage it. */
export function SubscriptionCard({ billing }: { billing: BillingInfo }) {
  const now = useNow();
  const { getToken } = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const summary = statusSummary(billing, now);
  const period = billingPeriod(billing.planKey);

  async function manage() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      window.location.assign(await openPortal(await getToken()));
    } catch (e) {
      setError(e instanceof AccountApiError ? e.message : "We could not open the payment portal. Please try again.");
      setBusy(false);
    }
  }

  return (
    <Panel as="section" aria-labelledby="subscription-title" className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile name="creditCard" />
          <div>
            <Heading level={2} size={6} id="subscription-title" className="text-muted-foreground">
              Your subscription
            </Heading>
            <p className="text-lg font-bold leading-tight">{billing.name}</p>
          </div>
        </div>
        <StatusPill label={summary.label} tone={summary.tone} icon={PILL_ICONS[summary.tone]} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{summary.note}</p>

      {billing.plan !== "free" ? (
        <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
          {period ? (
            <div>
              <dt className="text-muted-foreground">Billing</dt>
              <dd className="mt-0.5 font-semibold">{period}</dd>
            </div>
          ) : null}
          {billing.renewsAt ? (
            <div>
              <dt className="text-muted-foreground">{billing.cancelled ? "Plus ends on" : "Next payment"}</dt>
              <dd className="mt-0.5 font-semibold">{formatDay(billing.renewsAt)}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {billing.plan === "free" ? (
          <Button href="/account/plan" size="sm">
            Upgrade plan
          </Button>
        ) : billing.canManage ? (
          <Button onClick={manage} disabled={busy} size="sm" variant="outline">
            {busy ? "Opening..." : "Manage subscription"}
          </Button>
        ) : null}
        <p role={error ? "alert" : undefined} aria-live="polite" className="text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    </Panel>
  );
}
