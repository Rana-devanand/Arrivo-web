"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { useNow } from "@/components/watch/useNow";
import { effectiveOfferStatus, formatDayTime, offerEndsText, offerStatusLook, parseAdminOffer, type AdminOffer } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { AccountApiError, postJson } from "./accountApi";

/** One offer in the admin list: its code, discount and window, where it stands now, and "End now" with a confirmation step. */
export function AdminOfferRow({ offer, onChanged }: { offer: AdminOffer; onChanged: () => void }) {
  const { getToken } = useAccount();
  const now = useNow();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const status = now > 0 ? effectiveOfferStatus(offer, now) : offer.status;
  const look = offerStatusLook(status);

  async function end() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await postJson(`/admin/coupons/${encodeURIComponent(offer.id)}/end`, await getToken(), {}, parseAdminOffer);
      setConfirming(false);
      onChanged();
    } catch (e) {
      setError(e instanceof AccountApiError ? e.message : "We could not end the offer. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel as="li" className="grid gap-3 p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <IconTile name="tag" />
        <div className="min-w-0 flex-1 basis-56">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {offer.title}
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-widest">{offer.code}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {offer.percentOff}% off the first payment · {formatDayTime(offer.startsAt)} to {formatDayTime(offer.endsAt)}
            {status === "live" ? ` · ${offerEndsText(offer.endsAt, now)}` : ""}
          </p>
        </div>
        <StatusPill label={look.label} tone={look.tone} icon={look.icon} />
      </div>

      {status !== "ended" ? (
        <div className="flex flex-wrap items-center gap-2">
          {confirming ? (
            <>
              <p className="text-xs font-medium">End this offer now? The code stops working.</p>
              <Button size="xs" variant="outline" onClick={end} disabled={busy}>
                {busy ? "Ending..." : "Yes, end it"}
              </Button>
              <Button size="xs" variant="secondary" onClick={() => setConfirming(false)} disabled={busy}>
                Keep it
              </Button>
            </>
          ) : (
            <Button size="xs" variant="outline" onClick={() => setConfirming(true)}>
              End now
            </Button>
          )}
        </div>
      ) : null}
      <p role={error ? "alert" : undefined} aria-live="polite" className="text-xs font-medium text-danger empty:hidden">
        {error}
      </p>
    </Panel>
  );
}
