import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  distanceText,
  formatAgo,
  formatWhen,
  freshnessNote,
  haversineKm,
  headline,
  modeLabel,
  type Freshness,
  type LatLng,
  type WatchData,
} from "@/lib/watch";

type Props = {
  data: WatchData;
  freshness: Freshness;
  /** Seconds since the position was recorded. */
  age: number;
  now: number;
  /** The last answer is on screen and a newer one could not be fetched. */
  reconnecting: boolean;
  position: LatLng | null;
  following: boolean;
  onFollow: () => void;
  /** Only the one-line summary is shown, so the whole map can be seen. */
  collapsed: boolean;
  onToggle: () => void;
};

type Badge = { label: string; icon: IconName; tone: string };

const TONES = {
  good: "bg-success text-success-foreground",
  warn: "bg-warning text-warning-foreground",
  bad: "bg-danger text-danger-foreground",
  quiet: "bg-secondary text-secondary-foreground",
} as const;

/** One word and one icon for how things stand. Colour is never the only signal. */
function badge(data: WatchData, freshness: Freshness): Badge {
  switch (data.status) {
    case "completed":
      return { label: "Arrived", icon: "check", tone: TONES.good };
    case "cancelled":
      return { label: "Ended", icon: "close", tone: TONES.quiet };
    case "overdue":
      return { label: "Late", icon: "bell", tone: TONES.bad };
    default:
      switch (freshness) {
        case "live":
          return { label: "Live", icon: "signal", tone: TONES.good };
        case "delayed":
          return { label: "Delayed", icon: "clock", tone: TONES.warn };
        case "stale":
          return { label: "Not updating", icon: "clock", tone: TONES.warn };
        case "paused":
          return { label: "Paused", icon: "pause", tone: TONES.warn };
        default:
          return { label: "Waiting", icon: "clock", tone: TONES.warn };
      }
  }
}

function Fact({ label, children, className = "" }: { label: string; children: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[0.7rem] font-medium text-muted-foreground sm:text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold sm:text-base">{children}</dd>
    </div>
  );
}

/** Who is travelling, how they are doing, and when they will arrive: the part of the page that reads as text. It can fold down to one line. */
export function WatchPanel({ data, freshness, age, now, reconnecting, position, following, onFollow, collapsed, onToggle }: Props) {
  const status = badge(data, freshness);
  const open = data.status === "active" || data.status === "overdue";
  const note = open ? freshnessNote(freshness, data.travellerName, age) : null;
  const toGo = open && position && data.destination ? haversineKm(position, data.destination) : null;
  const vehicle = [modeLabel(data.mode), data.vehicle].filter(Boolean).join(" · ");
  const updated = open && data.last && freshness !== "paused" ? `Updated ${formatAgo(age)}` : null;
  const canFollow = open && position && !following;

  const toggle = (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-controls="watch-details"
      className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold text-highlight hover:bg-muted"
    >
      {collapsed ? "Show details" : "Hide"}
      <Icon name="chevron" className={`size-4 transition-transform motion-reduce:transition-none ${collapsed ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );

  if (collapsed) {
    return (
      <div className="pointer-events-auto flex max-w-xl items-center gap-2 rounded-2xl bg-card py-1 pl-3 pr-1 text-card-foreground shadow-lg" id="watch-details">
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.tone}`}>
          <Icon name={status.icon} className="size-3.5" />
          {status.label}
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">{headline(data, freshness)}</p>
        {canFollow ? (
          <button type="button" onClick={onFollow} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold text-highlight hover:bg-muted">
            Follow
          </button>
        ) : null}
        {toggle}
      </div>
    );
  }

  return (
    <div id="watch-details" className="pointer-events-auto max-w-xl rounded-2xl bg-card p-4 text-card-foreground shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${status.tone}`}>
          <Icon name={status.icon} className="size-3.5 sm:size-4" />
          {status.label}
        </span>
        {updated ? <span className="text-xs text-muted-foreground sm:text-sm">{updated}</span> : null}
        {toggle}
      </div>

      <Heading level={1} size={4} className="mt-1">
        {headline(data, freshness)}
      </Heading>

      <div role="status" aria-live="polite">
        {note ? <p className="mt-2 text-sm text-muted-foreground sm:text-base">{note}</p> : null}
        {data.status === "overdue" ? (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            They were expected at {formatWhen(data.expectedArrival, now)}. If you are worried, try calling them first.
          </p>
        ) : null}
        {data.status === "completed" && data.arrivedAt ? (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Arrived at {formatWhen(data.arrivedAt, now)}.</p>
        ) : null}
        {reconnecting ? (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Having trouble reaching Arrivo. Showing the last update and trying again.</p>
        ) : null}
      </div>

      {open ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:mt-4 sm:gap-x-6 sm:gap-y-3">
          <Fact label="Expected at">{formatWhen(data.expectedArrival, now)}</Fact>
          {toGo !== null ? <Fact label="Straight-line distance">{distanceText(toGo)}</Fact> : null}
          {vehicle ? <Fact label="Travelling">{vehicle}</Fact> : null}
          {data.startedAt ? <Fact label="Started" className="hidden sm:block">{formatWhen(data.startedAt, now)}</Fact> : null}
        </dl>
      ) : null}

      {data.note ? (
        <p className="mt-3 rounded-lg bg-muted p-2.5 text-xs sm:mt-4 sm:p-3 sm:text-sm">
          <span className="font-semibold">Note from {data.travellerName}: </span>
          {data.note}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-5">
        {canFollow ? (
          <Button variant="primary" size="sm" onClick={onFollow}>
            {`Follow ${data.travellerName}`}
          </Button>
        ) : null}
        <a href="/for-contacts" className="text-xs font-medium text-highlight underline underline-offset-4 sm:text-sm">
          What is Arrivo?
        </a>
      </div>
    </div>
  );
}
