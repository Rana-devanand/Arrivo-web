import type { ElementType, ReactNode } from "react";

type PanelProps = {
  as?: ElementType;
  className?: string;
  "aria-labelledby"?: string;
  role?: "alert" | "status";
  children: ReactNode;
};

/** A plain card: white, a thin border, softly rounded. No shadow and no hover effect. Used in the account dashboard. */
export function Panel({ as: Tag = "div", className = "", children, ...rest }: PanelProps) {
  return (
    <Tag {...rest} className={`rounded-2xl border border-border bg-card p-5 text-card-foreground ${className}`}>
      {children}
    </Tag>
  );
}
