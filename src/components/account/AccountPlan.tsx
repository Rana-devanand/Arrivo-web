"use client";

import { Suspense } from "react";
import { EstimatePicker } from "@/components/pricing/EstimatePicker";
import { PriceEstimateProvider } from "@/components/pricing/PriceEstimateProvider";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { Skeleton } from "@/components/ui/Skeleton";
import { parseBilling } from "@/lib/account";
import { AccountHeader } from "./AccountHeader";
import { useAccount } from "./AccountProvider";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

/** Upgrade plan: the three plans, with the button that opens the secure payment page for the signed-in person. */
export function AccountPlan() {
  const { getToken } = useAccount();
  const { state, reload } = useAccountResource("/billing/me", parseBilling);
  return (
    <>
      <AccountHeader title="Upgrade plan" subtitle="Choose a plan and pay on a secure page run by Dodo Payments. You can change or cancel at any time." />
      <PriceEstimateProvider>
        <div className="mb-8 max-w-sm">
          <EstimatePicker flat />
        </div>
        <ResourceView
          state={state}
          onRetry={reload}
          skeleton={
            <div className="grid gap-6 lg:grid-cols-3">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-[28rem] rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          }
        >
          {(billing) => (
            <Suspense fallback={<Skeleton className="h-[28rem]" />}>
              <PricingPlans account={{ billing, getToken }} />
            </Suspense>
          )}
        </ResourceView>
      </PriceEstimateProvider>
    </>
  );
}
