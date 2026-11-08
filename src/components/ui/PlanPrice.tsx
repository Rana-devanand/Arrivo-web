import type { ReactNode } from "react";

type PlanPriceProps = {
  amount: string;
  /** "/mo", "/year": shown smaller after the amount. */
  per?: string;
  /** An estimate in the visitor's own money, when there is one. */
  local?: string | null;
  note: ReactNode;
};

/** The price of a plan on one line, with the small print under it. */
export function PlanPrice({ amount, per, local, note }: PlanPriceProps) {
  return (
    <div>
      <p className="flex flex-nowrap items-baseline gap-x-1 whitespace-nowrap">
        <span className="font-heading text-3xl font-extrabold tracking-tight">{amount}</span>
        {per ? <span className="text-base font-semibold text-muted-foreground">{per}</span> : null}
      </p>
      {local ? (
        <p className="mt-1 text-sm font-semibold" aria-live="polite">
          About {local}
        </p>
      ) : null}
      <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
