import { Icon, type IconName } from "./Icon";

export type PillTone = "good" | "warn" | "bad" | "quiet";

const TONES: Record<PillTone, string> = {
  good: "bg-success text-success-foreground",
  warn: "bg-warning text-warning-foreground",
  bad: "bg-danger text-danger-foreground",
  quiet: "bg-secondary text-secondary-foreground",
};

/** A status as an icon and a word on a coloured pill. Colour is never the only signal. */
export function StatusPill({ label, tone, icon }: { label: string; tone: PillTone; icon: IconName }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${TONES[tone]}`}>
      <Icon name={icon} className="size-3.5" />
      {label}
    </span>
  );
}
