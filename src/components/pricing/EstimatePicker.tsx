"use client";

import { SearchSelect } from "@/components/ui/SearchSelect";
import { usePriceEstimate } from "./PriceEstimateProvider";

/** "Show estimates for" with a searchable country list, and the note that people are charged in US dollars. */
export function EstimatePicker({ flat = false }: { flat?: boolean }) {
  const { usable, country, chooseCountry } = usePriceEstimate();
  return (
    <div className="w-full lg:max-w-sm">
      {usable.length > 1 ? (
        <SearchSelect
          label="Show estimates for"
          searchLabel="Search country or currency"
          options={usable.map((c) => ({ value: c.code, label: c.name, hint: c.currency }))}
          value={country?.code ?? "US"}
          onChange={chooseCountry}
          emptyText="No country matches your search."
          flat={flat}
        />
      ) : null}
      <p className="mt-3 text-xs text-muted-foreground">
        You are charged in US dollars. Local prices are estimates from the day&apos;s exchange rate; your bank sets the final amount.
      </p>
    </div>
  );
}
