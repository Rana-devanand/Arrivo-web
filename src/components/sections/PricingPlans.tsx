"use client";

import { useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkoutErrors, freePlan, intervals, localPrice, perMonthCents, plusPlan, saving, usd, type BillingPlanKey, type PriceRates } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckList } from "@/components/ui/CheckList";
import { Heading } from "@/components/ui/Heading";
import { StoreButtons } from "@/components/ui/StoreButtons";

const COUNTRY_KEY = "arrivo-price-country";

/** The country in the visitor's browser language, such as "IN" from "en-IN". */
function browserCountry(): string | null {
  try {
    return new Intl.Locale(navigator.language).region ?? null;
  } catch {
    return null;
  }
}

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

/**
 * Arrivo Free and Arrivo Plus, with the three ways of paying for Plus. When the visitor came from the app, the
 * address carries a short-lived ticket (`?t=`) that says who is paying, and the button starts the payment.
 * Without one, the page explains where to start. The card details are only ever entered on the payment partner's page.
 */
export function PricingPlans() {
  const params = useSearchParams();
  const ticket = params.get("t");
  const asked = params.get("plan");
  const groupName = useId();
  const [choice, setChoice] = useState<BillingPlanKey>(asked && KEYS.includes(asked) ? (asked as BillingPlanKey) : "yearly");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [rates, setRates] = useState<PriceRates | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  // Estimated local prices: the rates come from the API; if they cannot be had, only dollars are shown.
  useEffect(() => {
    let stop = false;
    fetch(`${siteConfig.apiUrl}/v1/billing/rates`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PriceRates | null) => {
        if (stop || !data || typeof data.rates !== "object" || !Array.isArray(data.countries)) return;
        setRates(data);
        let saved: string | null = null;
        try {
          saved = window.localStorage.getItem(COUNTRY_KEY);
        } catch {
          // No saved choice: use the browser's country.
        }
        setCountryCode(saved ?? browserCountry());
      })
      .catch(() => undefined);
    return () => {
      stop = true;
    };
  }, []);

  const usable = rates ? rates.countries.filter((c) => rates.rates[c.currency]).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const country = usable.find((c) => c.code === countryCode);

  function chooseCountry(code: string) {
    setCountryCode(code);
    try {
      window.localStorage.setItem(COUNTRY_KEY, code);
    } catch {
      // Not remembered, still used for now.
    }
  }

  const selected = intervals.find((interval) => interval.key === choice) ?? intervals[2]!;
  const save = saving(selected);

  async function pay() {
    if (!ticket || status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`${siteConfig.apiUrl}/v1/billing/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticket, plan: choice }),
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

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
      <article aria-labelledby={`${groupName}-free`} className="rounded-[28px] bg-background p-6 text-foreground shadow-soft sm:p-8">
        <Heading level={3} id={`${groupName}-free`} className="text-2xl">
          {freePlan.name}
        </Heading>
        <p className="mt-1 text-muted-foreground">{freePlan.tagline}</p>
        <p className="mt-6 font-heading text-5xl font-extrabold tracking-tight">{freePlan.price}</p>
        <p className="text-sm text-muted-foreground">Free for as long as you like</p>
        <div className="mt-6">
          <CheckList items={freePlan.features} />
        </div>
      </article>

      <article aria-labelledby={`${groupName}-plus`} className="rounded-[28px] bg-background p-6 text-foreground shadow-raise ring-2 ring-highlight sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading level={3} id={`${groupName}-plus`} className="text-2xl">
            {plusPlan.name}
          </Heading>
          <Badge>Most popular</Badge>
        </div>
        <p className="mt-1 text-muted-foreground">{plusPlan.tagline}</p>

        <div role="radiogroup" aria-label="How often you pay" className="mt-6 grid grid-cols-3 gap-2 rounded-2xl p-1 shadow-press">
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
                className={`flex min-h-14 flex-col items-center justify-center rounded-xl px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${on ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
              >
                <span>{interval.label}</span>
                {off.percent > 0 ? <span className="text-xs font-medium">Save {off.percent}%</span> : <span className="text-xs font-medium">Flexible</span>}
              </button>
            );
          })}
        </div>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <span className="font-heading text-5xl font-extrabold tracking-tight">{usd(selected.priceCents)}</span>
          <span className="text-muted-foreground">{selected.months === 1 ? "per month" : `for ${selected.months} months`}</span>
        </p>
        {localPrice(selected.priceCents, rates, country) ? (
          <p className="mt-1 font-semibold" aria-live="polite">
            About {localPrice(selected.priceCents, rates, country)} in {country?.name}
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {selected.months === 1
            ? "Taxes included. Cancel any time."
            : `That is about ${usd(perMonthCents(selected))} a month. You save ${usd(save.cents)} compared with paying monthly. Taxes included.`}
        </p>
        {usable.length > 1 ? (
          <div className="mt-3">
            <label htmlFor={`${groupName}-country`} className="block text-sm font-semibold">
              Show the estimate for
            </label>
            <select
              id={`${groupName}-country`}
              value={country?.code ?? "US"}
              onChange={(event) => chooseCountry(event.target.value)}
              className="mt-1 min-h-12 w-full rounded-xl bg-background px-3 text-foreground shadow-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              {usable.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">
          You are charged in US dollars. Local prices are estimates from the day&apos;s exchange rate; your bank sets the final amount.
        </p>

        <div className="mt-6">
          <CheckList items={plusPlan.features} />
        </div>

        <div className="mt-8 grid gap-3">
          {ticket ? (
            <>
              <Button onClick={pay} disabled={status === "loading"} arrow>
                {status === "loading" ? "Opening secure payment..." : `Continue to secure payment · ${usd(selected.priceCents)}`}
              </Button>
              <p role={status === "error" ? "alert" : undefined} aria-live="polite" className="min-h-6 text-sm text-muted-foreground">
                {status === "error" ? message : "You will pay on a secure page run by Dodo Payments."}
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                To upgrade, open Arrivo, go to <b className="text-foreground">Profile, then Subscription</b> and tap <b className="text-foreground">Upgrade</b>. The app brings you back here with your account ready.
              </p>
              <StoreButtons size="sm" />
            </>
          )}
        </div>
      </article>
    </div>
  );
}
