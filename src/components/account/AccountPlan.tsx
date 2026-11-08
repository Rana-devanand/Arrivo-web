"use client";

import { Suspense, useState } from "react";
import { EstimatePicker } from "@/components/pricing/EstimatePicker";
import { PriceEstimateProvider } from "@/components/pricing/PriceEstimateProvider";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { Skeleton } from "@/components/ui/Skeleton";
import { bestOffer, parseOffers } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { OfferCard } from "./OfferCard";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

/** Upgrade plan: a live offer if there is one, and the three plans, with the button that opens the secure payment page. */
export function AccountPlan() {
  const { billing, reloadBilling, getToken } = useAccount();
  const offers = useAccountResource("/billing/offers", parseOffers);
  // An offer is on by default; the person can switch it off for this payment.
  const [removed, setRemoved] = useState(false);
  const offer = offers.state.status === "ready" ? bestOffer(offers.state.data) : null;

  return (
    <PriceEstimateProvider>
      <div className="mb-6 max-w-sm">
        <EstimatePicker flat />
      </div>
      <ResourceView state={billing} onRetry={reloadBilling}>
        {(b) => {
          // Someone who already pays changes plan in Manage subscription, so an offer is no use to them.
          const canUse = !!offer && (b.plan === "free" || !!b.familyOwner);
          const applied = canUse && !removed;
          return (
            <div className="grid gap-6">
              {canUse && offer ? <OfferCard offer={offer} applied={applied} onToggle={() => setRemoved((r) => !r)} /> : null}
              <Suspense fallback={<Skeleton className="h-[28rem]" />}>
                <PricingPlans
                  account={{
                    billing: b,
                    getToken,
                    coupon: applied && offer ? { code: offer.code, percentOff: offer.percentOff } : undefined,
                    onOfferRejected: offers.reload,
                  }}
                />
              </Suspense>
            </div>
          );
        }}
      </ResourceView>
    </PriceEstimateProvider>
  );
}
