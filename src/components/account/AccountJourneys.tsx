"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { parseJourneys } from "@/lib/account";
import { AccountHeader } from "./AccountHeader";
import { JourneyList } from "./JourneyList";
import { JourneysEmpty } from "./JourneysEmpty";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

/** Every journey that was loaded, newest first. */
export function AccountJourneys() {
  const { state, reload } = useAccountResource("/journeys?limit=50", parseJourneys);
  return (
    <>
      <AccountHeader title="Journeys" subtitle="Your latest journeys, newest first. Places are shown by name only." />
      <ResourceView
        state={state}
        onRetry={reload}
        skeleton={
          <div className="grid gap-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        }
      >
        {({ items, more }) =>
          items.length === 0 ? (
            <JourneysEmpty />
          ) : (
            <div className="grid gap-4">
              <JourneyList items={items} />
              {more ? <p className="text-sm text-muted-foreground">Showing your latest {items.length} journeys. Older ones are in the Arrivo app.</p> : null}
            </div>
          )
        }
      </ResourceView>
    </>
  );
}
