import type { Faq } from "./content";

export type BillingPlanKey = "monthly" | "sixMonths" | "yearly";

export type Interval = {
  key: BillingPlanKey;
  label: string;
  months: number;
  /** US cents, tax included. */
  priceCents: number;
};

/**
 * What Arrivo Plus costs. These three numbers must equal the price of the matching product in the
 * Dodo Payments dashboard (in USD) and `PRICES_USD_CENTS` in the API (`backend/src/domain/plans.ts`): the
 * amount charged is the Dodo product's price, this is only what we show.
 */
export const intervals: readonly Interval[] = [
  { key: "monthly", label: "Monthly", months: 1, priceCents: 299 },
  { key: "sixMonths", label: "6 months", months: 6, priceCents: 1499 },
  { key: "yearly", label: "Yearly", months: 12, priceCents: 2499 },
];

const monthly = intervals[0]!;

/** "$24.99" from 2499 cents. */
export const usd = (cents: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

/** What one month costs on this plan, in cents. */
export const perMonthCents = (interval: Interval): number => Math.round(interval.priceCents / interval.months);

/** What paying this way saves, compared with paying monthly for the same time. */
export function saving(interval: Interval): { cents: number; percent: number } {
  const full = monthly.priceCents * interval.months;
  const saved = Math.max(0, full - interval.priceCents);
  return { cents: saved, percent: Math.round((saved / full) * 100) };
}

/** A country people can look prices up for, as the API lists it. */
export type PriceCountry = { code: string; name: string; currency: string };

export type PriceRates = { live: boolean; rates: Record<string, number>; countries: PriceCountry[] };

/**
 * An estimate in the country's money, such as "₹2,099", or null for dollars or an unknown currency.
 * It is only the day's exchange rate: people are charged in US dollars.
 */
export function localPrice(cents: number, rates: PriceRates | null, country: PriceCountry | undefined): string | null {
  if (!rates || !country || country.currency === "USD") return null;
  const rate = rates.rates[country.currency];
  if (!rate) return null;
  const value = (cents / 100) * rate;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: country.currency,
      maximumFractionDigits: value >= 100 ? 0 : undefined,
    }).format(value);
  } catch {
    return null;
  }
}

export const pricingHead = {
  eyebrow: "Pricing",
  title: "Arrivo Free and Arrivo Plus",
  intro: "Start free with one trusted contact. Go Plus when your whole family wants to be looked after.",
} as const;

export const freePlan = {
  name: "Arrivo Free",
  tagline: "Everything you need to start.",
  price: "$0",
  features: [
    "Live location sharing during a journey",
    "1 trusted contact",
    "Arrival and running-late alerts",
    "Safety timer and watch link",
    "Journey history and battery report",
  ],
} as const;

export const plusPlan = {
  name: "Arrivo Plus",
  tagline: "For families and anyone who travels a lot.",
  features: [
    "Everything in Arrivo Free",
    "Up to 10 trusted contacts",
    "Family household: make a family circle and add everyone to a journey in one tap",
  ],
} as const;

export const payHow = [
  { title: "Open Arrivo", text: "Go to Profile, then Subscription, and tap Upgrade." },
  { title: "Choose how to pay", text: "Monthly, every 6 months or yearly. You land here with your account already picked, so there is nothing to sign in to." },
  { title: "Pay securely", text: "You pay on a secure page run by Dodo Payments, our payment partner. Arrivo never sees your card or UPI details." },
  { title: "Plus switches on", text: "Go back to the app. Arrivo Plus turns on within a minute, with no restart." },
] as const;

export const pricingFaqs: readonly Faq[] = [
  {
    group: "Account",
    question: "Why do I pay on the website and not in the app?",
    answer:
      "Payments are handled on this website by Dodo Payments, a payment partner that also looks after taxes and invoices. The app only opens this page for you. Your card or UPI details are never entered in the app.",
  },
  {
    group: "Account",
    question: "Can I cancel any time?",
    answer:
      "Yes. In the app, open Profile, Subscription and Manage subscription to cancel, change your card or see invoices. If you cancel, Arrivo Plus stays on until the end of the time you already paid for.",
  },
  {
    group: "Account",
    question: "What happens to my contacts if Plus ends?",
    answer:
      "Nothing is deleted. You keep the contacts and the household you already made, but you cannot add more than one contact on Arrivo Free, and the household cannot be edited until you are on Plus again.",
  },
  {
    group: "Account",
    question: "Which way of paying is the best value?",
    answer:
      "The yearly plan costs the least per month. Paying every 6 months sits in between, and monthly lets you stop at any time.",
  },
  {
    group: "Account",
    question: "Which currency am I charged in?",
    answer:
      "US dollars. The price in your own currency is an estimate from the day's exchange rate, so your bank may show a slightly different amount. Taxes are included.",
  },
  {
    group: "Account",
    question: "Is there a free trial?",
    answer: "Not at the moment. Arrivo Free has no time limit, so you can use it as long as you like and upgrade when you are ready.",
  },
];

export const checkoutErrors = {
  expired: "This link has expired. Open Arrivo and tap Upgrade again.",
  generic: "We could not start the payment. Please try again in a moment.",
} as const;
