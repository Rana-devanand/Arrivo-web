import type { ReactNode } from "react";

/** The look of a text box, a number box, a date box or a drop-down in the dashboard. It sets no width: add `w-full`, `w-24` or `w-auto`. */
export const fieldClass =
  "min-h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight";

/** A label above a box (put the box inside), with an optional line of help under it. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid content-start gap-1.5 text-xs font-semibold text-foreground">
      {label}
      {children}
      {hint ? <span className="font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
