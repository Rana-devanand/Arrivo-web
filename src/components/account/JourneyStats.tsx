import type { IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import type { JourneyCounts } from "@/lib/account";

type JourneyStatsProps = {
  counts: JourneyCounts;
  /** More journeys exist than were loaded, so the totals are "at least". */
  more: boolean;
};

/** Three numbers: journeys, arrived safely, and in progress now. */
export function JourneyStats({ counts, more }: JourneyStatsProps) {
  const tiles: { label: string; value: string; icon: IconName }[] = [
    { label: more ? "Latest journeys" : "Journeys", value: `${counts.total}${more ? "+" : ""}`, icon: "map" },
    { label: "Arrived safely", value: String(counts.completed), icon: "checkCircle" },
    { label: "In progress", value: String(counts.inProgress), icon: "navigation" },
  ];
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiles.map((tile) => (
        <Panel key={tile.label} className="flex items-center gap-3">
          <IconTile name={tile.icon} />
          <div>
            <dt className="text-sm text-muted-foreground">{tile.label}</dt>
            <dd className="text-2xl font-bold leading-tight">{tile.value}</dd>
          </div>
        </Panel>
      ))}
    </dl>
  );
}
