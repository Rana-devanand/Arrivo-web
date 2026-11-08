import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { durationText, formatDayTime, journeyLook, journeyMinutes, modeIcon, type JourneyItem } from "@/lib/account";
import { modeLabel } from "@/lib/watch";

function details(j: JourneyItem): string {
  const parts = [modeLabel(j.mode), formatDayTime(j.startedAt)];
  const minutes = journeyMinutes(j);
  if (minutes !== null) parts.push(durationText(minutes));
  else if (j.expectedArrival) parts.push(`Expected ${formatDayTime(j.expectedArrival)}`);
  if (j.distanceKm > 0) parts.push(`${j.distanceKm.toFixed(1)} km`);
  return parts.filter(Boolean).join(" · ");
}

/** Journeys as rows: how, where to, when and how it ended. Place names only: no coordinates, routes or photos. */
export function JourneyList({ items }: { items: readonly JourneyItem[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((j) => {
        const look = journeyLook(j.status);
        return (
          <Panel as="li" key={j.id} className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <IconTile name={modeIcon(j.mode)} />
            <div className="min-w-0 flex-1 basis-48">
              <p className="break-words text-sm font-semibold">
                {j.originName ? `${j.originName} to ` : "To "}
                {j.destinationName || "your destination"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{details(j)}</p>
            </div>
            <StatusPill label={look.label} tone={look.tone} icon={look.icon} />
          </Panel>
        );
      })}
    </ul>
  );
}
