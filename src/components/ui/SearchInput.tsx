import { fieldClass } from "./Field";
import { Icon } from "./Icon";

type SearchInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** `sm` is the compact filter size: 36px tall with a small corner radius, like `Dropdown`. */
  size?: "sm" | "md";
};

/** A search box with a magnifier. The label is read by screen readers only. */
export function SearchInput({ label, value, onChange, placeholder, size = "md" }: SearchInputProps) {
  const look = size === "sm" ? "min-h-9 rounded-md border border-border bg-card pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight" : `${fieldClass} pl-9`;
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Icon name="search" className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${size === "sm" ? "left-2.5 size-3.5" : "left-3 size-4"}`} />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" className={`${look} w-full`} />
    </label>
  );
}
