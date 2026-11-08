"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { PriceCountry, PriceRates } from "@/config/pricing";
import { siteConfig } from "@/config/site";

const COUNTRY_KEY = "arrivo-price-country";

/** The country in the visitor's browser language, such as "IN" from "en-IN". */
function browserCountry(): string | null {
  try {
    return new Intl.Locale(navigator.language).region ?? null;
  } catch {
    return null;
  }
}

type Estimate = {
  rates: PriceRates | null;
  /** The countries that have a usable rate, sorted by name. */
  usable: readonly PriceCountry[];
  /** The country the estimates are shown for, when we know one. */
  country: PriceCountry | undefined;
  chooseCountry: (code: string) => void;
};

const NONE: Estimate = { rates: null, usable: [], country: undefined, chooseCountry: () => undefined };

const EstimateContext = createContext<Estimate>(NONE);

const never = () => () => undefined;

/**
 * The estimate, but only once the component using it has hydrated. The plan cards sit behind a Suspense boundary
 * and hydrate after this provider has already fetched the rates; reading them on the very first client render
 * would not match the server's HTML. `useSyncExternalStore` gives the server's answer (false) during hydration.
 */
export function usePriceEstimate(): Estimate {
  const value = useContext(EstimateContext);
  const hydrated = useSyncExternalStore(never, () => true, () => false);
  return hydrated ? value : NONE;
}

/**
 * Fetches the day's exchange rates and remembers which country the visitor wants estimates for, so the picker
 * (next to the heading) and the plan cards (below it) always agree. If the rates cannot be had, only dollars are shown.
 */
export function PriceEstimateProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<PriceRates | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

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

  const value = useMemo<Estimate>(() => {
    const usable = rates ? rates.countries.filter((c) => rates.rates[c.currency]).sort((a, b) => a.name.localeCompare(b.name)) : [];
    return {
      rates,
      usable,
      country: usable.find((c) => c.code === countryCode),
      chooseCountry(code) {
        setCountryCode(code);
        try {
          window.localStorage.setItem(COUNTRY_KEY, code);
        } catch {
          // Not remembered, still used for now.
        }
      },
    };
  }, [rates, countryCode]);

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>;
}
