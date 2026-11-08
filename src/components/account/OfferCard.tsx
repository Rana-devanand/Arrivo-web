"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { useNow } from "@/components/watch/useNow";
import { offerEndsText, type Offer } from "@/lib/account";

type OfferCardProps = {
  offer: Offer;
  /** On the plan page: whether the offer is switched on for the payment, and how to switch it. Left out elsewhere. */
  applied?: boolean;
  onToggle?: () => void;
  /** Where the button goes when the card is not on the plan page. */
  href?: string;
  actionLabel?: string;
};

/**
 * A discount offer, while it is live: the percentage, the code to copy, and how long is left. When the time runs out the card
 * simply goes away, with no reload. The payment partner takes the percentage off the first payment.
 */
export function OfferCard({ offer, applied = false, onToggle, href, actionLabel = "Use this offer" }: OfferCardProps) {
  const now = useNow();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // `now` is 0 until the page runs in the browser; once the end has come the card is gone.
  if (now > 0 && Date.parse(offer.endsAt) <= now) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard: the code is on the card to read and type.
    }
  }

  return (
    <section aria-labelledby="offer-title" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground sm:p-6">
      <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-primary-foreground/10" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-24 size-40 rounded-full bg-primary-foreground/5" />
      <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <div className="min-w-0 flex-1 basis-64">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
            <Icon name="sparkles" className="size-3" />
            Limited offer
          </p>
          <Heading level={2} size={5} tone="inverse" id="offer-title" className="mt-3">
            {offer.percentOff}% off your first payment
          </Heading>
          <p className="mt-1 text-[13px] text-primary-foreground/85">{offer.title}. Use this code when you pay.</p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-foreground/50 bg-primary-foreground/10 py-1.5 pl-3.5 pr-1.5">
            <span className="font-mono text-sm font-bold tracking-[0.2em]">{offer.code}</span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Code copied" : `Copy the code ${offer.code}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary-foreground/15 px-2.5 text-xs font-semibold transition-colors hover:bg-primary-foreground/25"
            >
              <Icon name={copied ? "check" : "copy"} className="size-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground/85" aria-live="off">
            <Icon name="clock" className="size-3.5" />
            {now > 0 ? offerEndsText(offer.endsAt, now) : "Limited time"}
          </p>
          {onToggle ? (
            <Button onClick={onToggle} variant={applied ? "inverseOutline" : "inverse"} size="xs">
              {applied ? "Offer applied. Remove" : "Apply this offer"}
            </Button>
          ) : href ? (
            <Button href={href} variant="inverse" size="xs" arrow>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
