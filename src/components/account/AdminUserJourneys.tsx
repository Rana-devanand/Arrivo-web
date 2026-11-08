"use client";

import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { durationText, formatDayTime, journeyLook, journeyMinutes, modeIcon } from "@/lib/account";
import type { AdminJourney, AdminUserRow } from "@/lib/admin";
import { modeLabel } from "@/lib/watch";
import { BodyLoader } from "./BodyLoader";

export type Activity = { state: "loading" } | { state: "error" } | { state: "ready"; journeys: AdminJourney[] };

function JourneyRow({ j }: { j: AdminJourney }) {
  const look = journeyLook(j.status);
  const minutes = journeyMinutes(j);
  const bits = [modeLabel(j.mode), formatDayTime(j.startedAt), minutes !== null ? durationText(minutes) : null, j.distanceKm > 0 ? `${j.distanceKm.toFixed(1)} km` : null, j.vehicle || null]
    .filter(Boolean)
    .join(" · ");
  return (
    <li className="rounded-xl border border-border bg-background p-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <IconTile name={modeIcon(j.mode)} />
        <div className="min-w-0 flex-1 basis-48">
          <p className="break-words text-[13px] font-semibold">
            {j.originName ? `${j.originName} to ` : "To "}
            {j.destinationName || "a destination"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{bits}</p>
        </div>
        <StatusPill label={look.label} tone={look.tone} icon={look.icon} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Shared with {j.contactCount} {j.contactCount === 1 ? "contact" : "contacts"}
        {j.notificationCount > 0 ? ` · ${j.notificationCount} notifications to ${j.recipientCount} ${j.recipientCount === 1 ? "person" : "people"}` : ""}
      </p>
      {j.places.length > 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Updates went out from: <span className="font-medium text-foreground">{j.places.join(", ")}</span>
        </p>
      ) : null}
    </li>
  );
}

/** The journeys of the person chosen in the Users table: where they went, how, and which places their updates went out from. */
export function AdminUserJourneys({ user, activity, onClose }: { user: AdminUserRow; activity: Activity; onClose: () => void }) {
  return (
    <Panel as="section" aria-labelledby="user-journeys-title" className="grid gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="user-journeys-title" className="text-sm font-semibold">
          Journeys of {user.name || user.email || "this person"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold transition-colors hover:bg-secondary"
        >
          <Icon name="close" className="size-3.5" />
          Close
        </button>
      </div>
      {activity.state === "loading" ? (
        <BodyLoader variant="inline" />
      ) : activity.state === "error" ? (
        <p role="alert" className="text-xs text-muted-foreground">
          We could not load the journeys. Reload this page to try again.
        </p>
      ) : activity.journeys.length === 0 ? (
        <p className="text-xs text-muted-foreground">No journeys yet.</p>
      ) : (
        <ul className="grid gap-2">
          {activity.journeys.map((j) => (
            <JourneyRow key={j.id} j={j} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
