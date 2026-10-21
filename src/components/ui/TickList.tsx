type TickListProps = {
  items: readonly string[];
  variant: "bad" | "good";
};

export function TickList({ items, variant }: TickListProps) {
  const good = variant === "good";
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full ${
              good ? "bg-primary-foreground text-primary" : "border-2 border-current text-muted-foreground"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <path d={good ? "m5 12.5 4.5 4.5L19 7" : "M7 7l10 10M17 7 7 17"} />
            </svg>
            <span className="sr-only">{good ? "Yes:" : "No:"}</span>
          </span>
          <span className={`text-lg ${good ? "font-medium" : "text-muted-foreground"}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
