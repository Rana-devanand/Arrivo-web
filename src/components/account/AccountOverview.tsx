"use client";

import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { firstName, journeyCounts, parseBilling, parseJourneys } from "@/lib/account";
import { AccountHeader } from "./AccountHeader";
import { useAccount } from "./AccountProvider";
import { ContactsCard } from "./ContactsCard";
import { JourneyList } from "./JourneyList";
import { JourneyStats } from "./JourneyStats";
import { JourneysEmpty } from "./JourneysEmpty";
import { ResourceView } from "./ResourceView";
import { SubscriptionCard } from "./SubscriptionCard";
import { useAccountResource } from "./useAccountResource";

const RECENT = 5;

/** The dashboard: subscription status and contacts, journey numbers, and the latest journeys. */
export function AccountOverview() {
  const { auth } = useAccount();
  const billing = useAccountResource("/billing/me", parseBilling);
  const journeys = useAccountResource("/journeys?limit=50", parseJourneys);
  const name = auth.status === "signedIn" ? firstName(auth.user.name, auth.user.email) : "";

  return (
    <>
      <AccountHeader title="Dashboard" subtitle={name ? `Hi ${name}. Here is your plan and your latest journeys.` : "Here is your plan and your latest journeys."} />

      <div className="grid gap-6">
        <ResourceView
          state={billing.state}
          onRetry={billing.reload}
          skeleton={
            <div className="grid gap-4 lg:grid-cols-3">
              <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          }
        >
          {(b) => (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SubscriptionCard billing={b} />
              </div>
              <ContactsCard billing={b} />
            </div>
          )}
        </ResourceView>

        <ResourceView
          state={journeys.state}
          onRetry={journeys.reload}
          skeleton={
            <div className="grid gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              <Skeleton className="mt-3 h-6 w-40" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          }
        >
          {({ items, more }) => {
            const counts = journeyCounts(items);
            const running = items.find((j) => j.status === "active" || j.status === "overdue");
            return (
              <>
                <JourneyStats counts={counts} more={more} />
                {running ? (
                  <Panel role="status" className="flex items-center gap-3">
                    <IconTile name="navigation" />
                    <p>
                      A journey to <b>{running.destinationName || "your destination"}</b> is in progress. Open the Arrivo app to see it live.
                    </p>
                  </Panel>
                ) : null}
                <section aria-labelledby="recent-title">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Heading level={2} size={3} id="recent-title">
                      Latest journeys
                    </Heading>
                    {items.length > RECENT ? (
                      <Link href="/account/journeys" className="text-sm font-semibold underline">
                        See all journeys
                      </Link>
                    ) : null}
                  </div>
                  {items.length === 0 ? <JourneysEmpty /> : <JourneyList items={items.slice(0, RECENT)} />}
                </section>
              </>
            );
          }}
        </ResourceView>
      </div>
    </>
  );
}
