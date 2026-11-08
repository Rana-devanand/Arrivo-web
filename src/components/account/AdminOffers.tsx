"use client";

import { Heading } from "@/components/ui/Heading";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { parseAdminOffers } from "@/lib/account";
import { AdminOfferRow } from "./AdminOfferRow";
import { AdminOnly } from "./AdminOnly";
import { OfferForm } from "./OfferForm";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

/** Admin: make discount offers for people paying for a plan, see every offer and where it stands, and end one early. */
export function AdminOffers() {
  return (
    <AdminOnly>
      <Offers />
    </AdminOnly>
  );
}

function Offers() {
  const { state, reload } = useAccountResource("/admin/coupons", parseAdminOffers);
  return (
    <div className="grid gap-6">
      <OfferForm onCreated={reload} />
      <section aria-labelledby="all-offers-title" className="grid gap-3">
        <Heading level={2} size={6} id="all-offers-title" className="text-muted-foreground">
          All offers
        </Heading>
        <ResourceView state={state} onRetry={reload} loader="inline">
          {(offers) =>
            offers.length === 0 ? (
              <Panel className="flex items-center gap-3">
                <IconTile name="tag" />
                <div>
                  <p className="font-semibold">No offers yet</p>
                  <p className="text-xs text-muted-foreground">Make one above and it shows on the dashboard of everyone who has not paid yet.</p>
                </div>
              </Panel>
            ) : (
              <ul className="grid gap-3">
                {offers.map((o) => (
                  <AdminOfferRow key={o.id} offer={o} onChanged={reload} />
                ))}
              </ul>
            )
          }
        </ResourceView>
      </section>
    </div>
  );
}
