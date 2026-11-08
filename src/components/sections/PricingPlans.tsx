"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AccountApiError, startCheckout } from "@/components/account/accountApi";
import { discountedCents, type BillingInfo } from "@/lib/account";
import {
  checkoutErrors,
  familyPlan,
  freePlan,
  intervals,
  localPrice,
  perMonthCents,
  plusPlan,
  saving,
  usd,
  type BillingPlanKey,
  type CheckoutPlanKey,
} from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { usePriceEstimate } from "@/components/pricing/PriceEstimateProvider";
import { Button } from "@/components/ui/Button";
import { PlanCard } from "@/components/ui/PlanCard";
import { PlanPrice } from "@/components/ui/PlanPrice";

const KEYS: readonly string[] = intervals.map((interval) => interval.key);

/** Only a real checkout address is followed: https, nothing else. */
function isSafeCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

type PricingPlansProps = {
  /** Given on the account dashboard: who is signed in and how to get their token. Leave out on the public page. */
  account?: {
    billing: BillingInfo;
    getToken: () => Promise<string | null>;
    /** An offer switched on for this payment: its code goes to the checkout, and the cards show the first payment after it. */
    coupon?: { code: string; percentOff: number };
    /** Called when the server says the offer is no longer available, so the page can look again. */
    onOfferRejected?: () => void;
  };
};

function ChangeHint({ canManage }: { canManage: boolean }) {
  return (
    <p className="text-xs text-muted-foreground">
      {canManage ? "To switch plans or change how you pay, use Manage subscription on your " : "Your plan is managed by the person who pays. See your "}
      <Link href="/account" className="font-semibold text-foreground underline">
        Dashboard
      </Link>
      .
    </p>
  );
}

/**
 * Arrivo Free, Arrivo Plus (three ways of paying) and Arrivo Plus Family (yearly). When the visitor came from the
 * app, the address carries a short-lived ticket (`?t=`) that says who is paying, and the buttons start the payment.
 * Without one, the page explains where to start. The card details are only ever entered on the payment partner's page.
 */
export function PricingPlans({ account }: PricingPlansProps) {
  const params = useSearchParams();
  const ticket = params.get("t");
  const asked = params.get("plan");
  // Signed in on the website (the account dashboard): the sign-in says who is paying, no ticket needed.
  const signedIn = !ticket && account ? account : null;
  // Someone who already has a paid plan of their own changes it in Manage subscription, not by paying again.
  const owned = signedIn && !signedIn.billing.familyOwner ? signedIn.billing.plan : "free";
  const groupName = useId();
  const [choice, setChoice] = useState<BillingPlanKey>(asked && KEYS.includes(asked) ? (asked as BillingPlanKey) : "yearly");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  // Which card's button was pressed, so the message and spinner show under it.
  const [paying, setPaying] = useState<"plus" | "family">(asked === familyPlan.key ? "family" : "plus");
  const [message, setMessage] = useState("");
  const { rates, country } = usePriceEstimate();

  const selected = intervals.find((interval) => interval.key === choice) ?? intervals[2]!;
  const save = saving(selected);

  async function pay(plan: CheckoutPlanKey) {
    if ((!ticket && !signedIn) || status === "loading") return;
    setPaying(plan === familyPlan.key ? "family" : "plus");
    setStatus("loading");
    setMessage("");
    if (signedIn) {
      try {
        window.location.assign(await startCheckout(await signedIn.getToken(), plan, signedIn.coupon?.code));
        return;
      } catch (error) {
        setMessage(error instanceof AccountApiError ? error.message : checkoutErrors.generic);
        if (error instanceof AccountApiError && error.status === 400 && signedIn.coupon) signedIn.onOfferRejected?.();
        setStatus("error");
        return;
      }
    }
    try {
      const res = await fetch(`${siteConfig.apiUrl}/v1/billing/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticket, plan }),
      });
      const data: { checkoutUrl?: unknown; error?: { message?: string } } | null = await res.json().catch(() => null);
      if (res.ok && isSafeCheckoutUrl(data?.checkoutUrl)) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      setMessage(res.status === 410 ? checkoutErrors.expired : (data?.error?.message ?? checkoutErrors.generic));
    } catch {
      setMessage(checkoutErrors.generic);
    }
    setStatus("error");
  }

  // The offer only counts for someone who is about to pay; the payment partner works out the exact amount.
  const coupon = signedIn && owned === "free" ? signedIn.coupon : undefined;
  const offerLine = (c: typeof coupon, cents: number) =>
    c ? `${c.percentOff}% off with ${c.code}: about ${usd(discountedCents(cents, c.percentOff))} on your first payment` : null;
  const plusLocal = localPrice(selected.priceCents, rates, country);
  const familyLocal = localPrice(familyPlan.priceCents, rates, country);
  const upgradeHint = (
    <p className="text-xs text-muted-foreground">
      Sign in with Google to subscribe. You can also upgrade in the app: <b className="text-foreground">Profile, Subscription</b>, then <b className="text-foreground">Upgrade</b>.
    </p>
  );

  return (
    <div>
      <div className="grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
        <PlanCard
          flat={Boolean(account)}
          id={`${groupName}-free`}
          name={freePlan.name}
          tagline={freePlan.tagline}
          price={<PlanPrice amount={freePlan.price} note="Free for as long as you like" />}
          action={
            signedIn ? (
              <Button disabled variant="outline" size="sm" className="w-full">
                {owned === "free" ? "Current plan" : "Free plan"}
              </Button>
            ) : (
              <Button href="/account" variant="outline" size="sm" className="w-full">
                Get started free
              </Button>
            )
          }
          features={freePlan.features}
        />

        <PlanCard
          flat={Boolean(account)}
          id={`${groupName}-plus`}
          name={plusPlan.name}
          badge=""
          tagline={plusPlan.tagline}
          featured
          choice={
            <div role="radiogroup" aria-label="How often you pay" className={`grid grid-cols-3 gap-1 rounded-xl p-1 ${account ? "bg-secondary" : "shadow-press"}`}>
              {intervals.map((interval) => {
                const on = interval.key === choice;
                const off = saving(interval);
                return (
                  <button
                    key={interval.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChoice(interval.key)}
                    className={`flex min-h-11 flex-col items-center justify-center rounded-lg px-1.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${on ? "bg-primary text-primary-foreground" : `text-foreground ${account ? "hover:bg-card" : "hover:bg-secondary"}`}`}
                  >
                    <span>{interval.label}</span>
                    <span className="text-[0.65rem] font-medium">{off.percent > 0 ? `Save ${off.percent}%` : "Flexible"}</span>
                  </button>
                );
              })}
            </div>
          }
          price={
            <PlanPrice
              amount={usd(selected.priceCents)}
              per={selected.months === 1 ? "/mo" : `/${selected.months} mo`}
              local={plusLocal ? `${plusLocal} in ${country?.name}` : null}
              offer={offerLine(coupon, selected.priceCents)}
              note={
                selected.months === 1
                  ? "Taxes included. Cancel any time."
                  : `About ${usd(perMonthCents(selected))} a month. You save ${usd(save.cents)} compared with paying monthly. Taxes included.`
              }
            />
          }
          action={
            signedIn && owned !== "free" ? (
              <>
                <Button disabled size="sm" className="w-full">
                  {owned === "plus" ? "Current plan" : "Included in Plus Family"}
                </Button>
                <ChangeHint canManage={signedIn.billing.canManage} />
              </>
            ) : ticket || signedIn ? (
              <>
                <Button onClick={() => pay(choice)} disabled={status === "loading"} size="sm" className="w-full">
                  {status === "loading" && paying === "plus"
                    ? "Opening secure payment..."
                    : signedIn
                      ? `Upgrade to Plus · ${coupon ? "about " + usd(discountedCents(selected.priceCents, coupon.percentOff)) : usd(selected.priceCents)}`
                      : `Continue to secure payment · ${usd(selected.priceCents)}`}
                </Button>
                <p role={status === "error" && paying === "plus" ? "alert" : undefined} aria-live="polite" className="min-h-6 text-xs text-muted-foreground">
                  {status === "error" && paying === "plus" ? message : "You will pay on a secure page run by Dodo Payments."}
                </p>
              </>
            ) : (
              <>
                <Button href="/account/plan" size="sm" className="w-full">
                  Get started
                </Button>
                {upgradeHint}
              </>
            )
          }
          features={plusPlan.features}
        />

        <PlanCard
          flat={Boolean(account)}
          id={`${groupName}-family`}
          name={familyPlan.name}
          tagline={familyPlan.tagline}
          price={
            <PlanPrice
              amount={usd(familyPlan.priceCents)}
              per="/year"
              local={familyLocal ? `${familyLocal} in ${country?.name}` : null}
              offer={offerLine(coupon, familyPlan.priceCents)}
              note={`You and ${familyPlan.members} more people get Arrivo Plus. Taxes included.`}
            />
          }
          action={
            signedIn && owned !== "free" ? (
              <>
                <Button disabled variant="outline" size="sm" className="w-full">
                  {owned === "family" ? "Current plan" : "Change in Manage subscription"}
                </Button>
                {owned === "family" ? null : <ChangeHint canManage={signedIn.billing.canManage} />}
              </>
            ) : ticket || signedIn ? (
              <>
                <Button onClick={() => pay(familyPlan.key)} disabled={status === "loading"} variant="outline" size="sm" className="w-full">
                  {status === "loading" && paying === "family" ? "Opening secure payment..." : `Get Plus Family · ${coupon ? "about " + usd(discountedCents(familyPlan.priceCents, coupon.percentOff)) : usd(familyPlan.priceCents)}`}
                </Button>
                <p role={status === "error" && paying === "family" ? "alert" : undefined} aria-live="polite" className="min-h-6 text-xs text-muted-foreground">
                  {status === "error" && paying === "family" ? message : "You invite your 2 members in the app after paying."}
                </p>
              </>
            ) : (
              <>
                <Button href="/account/plan" variant="outline" size="sm" className="w-full">
                  Get started
                </Button>
                <p className="text-xs text-muted-foreground">
                  Sign in with Google to subscribe, or start from the app: <b className="text-foreground">Profile, Subscription</b>, then the Arrivo Plus Family card.
                </p>
              </>
            )
          }
          features={familyPlan.features}
        />
      </div>
    </div>
  );
}
