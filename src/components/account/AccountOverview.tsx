"use client";

import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { bestOffer, journeyCounts, parseJourneys, parseOffers } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { BodyLoader } from "./BodyLoader";
import { ContactsCard } from "./ContactsCard";
import { JourneyList } from "./JourneyList";
import { JourneyStats } from "./JourneyStats";
import { JourneysEmpty } from "./JourneysEmpty";
import { OfferCard } from "./OfferCard";
import { ResourceView } from "./ResourceView";
import { SubscriptionCard } from "./SubscriptionCard";
import { useAccountResource } from "./useAccountResource";

const RECENT = 5;

/** The dashboard: a live offer if there is one, the subscription and contacts, journey numbers, and the latest journeys. */
export function AccountOverview() {
  const { billing, reloadBilling } = useAccount();
  const journeys = useAccountResource("/journeys?limit=50", parseJourneys);
  const offers = useAccountResource("/billing/offers", parseOffers);
  const offer = offers.state.status === "ready" ? bestOffer(offers.state.data) : null;

  // One loader for the whole body, not one per card.
  if (billing.status === "loading" || journeys.state.status === "loading") return <BodyLoader />;

  return (
    <div className="grid gap-5">
      <ResourceView state={billing} onRetry={reloadBilling}>
        {(b) => (
          <>
            {/* An offer only helps someone who has not paid yet: a paid plan is changed in Manage subscription. */}
            {offer && (b.plan === "free" || b.familyOwner) ? <OfferCard offer={offer} href="/account/plan" actionLabel="Upgrade with this offer" /> : null}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SubscriptionCard billing={b} />
              </div>
              <ContactsCard billing={b} />
            </div>
          </>
        )}
      </ResourceView>

      <ResourceView state={journeys.state} onRetry={journeys.reload}>
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
                  <Heading level={2} size={6} id="recent-title" className="text-muted-foreground">
                    Latest journeys
                  </Heading>
                  {items.length > RECENT ? (
                    <Link href="/account/journeys" className="text-xs font-semibold underline">
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
  );
}
