import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { CheckList } from "./CheckList";
import { Heading } from "./Heading";

type PlanCardProps = {
  id: string;
  name: string;
  /** A small pill next to the name, such as "Most popular". */
  badge?: string;
  tagline: string;
  /** The plan most people pick: outlined in the highlight colour and a little taller on wide screens. */
  featured?: boolean;
  /** Something between the tagline and the price, such as the choice of how often to pay. */
  choice?: ReactNode;
  price: ReactNode;
  action: ReactNode;
  features: readonly string[];
  /** A plain card (white, thin border, no shadow) for the account dashboard, instead of the raised look of the public page. */
  flat?: boolean;
};

const RAISED = "rounded-[28px] bg-background p-5 text-foreground sm:p-6";
const FLAT = "rounded-2xl border border-border bg-card p-5 text-card-foreground";

/** One plan on the pricing page: name, short promise, price, one button, then what is included. */
export function PlanCard({ id, name, badge, tagline, featured = false, choice, price, action, features, flat = false }: PlanCardProps) {
  const look = flat
    ? `${FLAT} ${featured ? "border-highlight ring-1 ring-highlight" : ""}`
    : `${RAISED} ${featured ? "shadow-raise ring-2 ring-highlight lg:-my-4 lg:py-9" : "shadow-soft"}`;
  return (
    <article aria-labelledby={id} className={`flex flex-col ${look}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <Heading level={3} size={5} id={id}>
          {name}
        </Heading>
        {badge ? <Badge>{badge}</Badge> : null}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{tagline}</p>
      {choice ? <div className="mt-5">{choice}</div> : null}
      <div className="mt-5">{price}</div>
      <div className="mt-5 grid gap-3">{action}</div>
      <div className="mt-6 border-t border-border pt-5">
        <CheckList items={features} size="sm" />
      </div>
    </article>
  );
}
