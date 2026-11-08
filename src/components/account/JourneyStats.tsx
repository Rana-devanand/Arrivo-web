import { StatGrid } from "@/components/ui/StatGrid";
import type { JourneyCounts } from "@/lib/account";

type JourneyStatsProps = {
  counts: JourneyCounts;
  /** More journeys exist than were loaded, so the totals are "at least". */
  more: boolean;
};

/** Three numbers: journeys, arrived safely, and in progress now. */
export function JourneyStats({ counts, more }: JourneyStatsProps) {
  return (
    <StatGrid
      stats={[
        { label: more ? "Latest journeys" : "Journeys", value: `${counts.total}${more ? "+" : ""}`, icon: "map" },
        { label: "Arrived safely", value: String(counts.completed), icon: "checkCircle" },
        { label: "In progress", value: String(counts.inProgress), icon: "navigation" },
      ]}
    />
  );
}
