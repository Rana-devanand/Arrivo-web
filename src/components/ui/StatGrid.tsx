import type { IconName } from "./Icon";
import { IconTile } from "./IconTile";
import { Panel } from "./Panel";

export type Stat = { label: string; value: string; icon: IconName };

/** A row of small number cards: an icon, a label and a figure each. */
export function StatGrid({ stats, columns = "sm:grid-cols-3" }: { stats: readonly Stat[]; columns?: string }) {
  return (
    <dl className={`grid grid-cols-1 gap-3 ${columns}`}>
      {stats.map((stat) => (
        <Panel key={stat.label} className="flex items-center gap-3 px-4 py-3.5">
          <IconTile name={stat.icon} />
          <div className="min-w-0">
            <dt className="truncate text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="text-xl font-bold leading-tight">{stat.value}</dd>
          </div>
        </Panel>
      ))}
    </dl>
  );
}
