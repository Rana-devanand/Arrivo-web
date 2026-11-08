import type { ReactNode } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  /** How big it looks, when that is not the size of its level (a page title inside a compact panel is still the h1). */
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** `inverse` is white, for a dark background. */
  tone?: "default" | "inverse";
  id?: string;
  className?: string;
  children: ReactNode;
};

const sizes = {
  1: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
  2: "text-3xl font-bold tracking-tight sm:text-4xl",
  3: "text-lg font-semibold",
  4: "text-lg font-bold leading-snug tracking-tight sm:text-2xl",
  5: "text-xl font-bold leading-snug tracking-tight",
  /** A small label above a value, in the dashboard cards. */
  6: "text-[11px] font-semibold uppercase leading-snug tracking-[0.12em]",
  /** The page title in the dashboard top bar. */
  7: "text-lg font-bold leading-tight tracking-tight",
} as const;

/** The labels and the dashboard title are set in the plain sans font; the other sizes keep the serif heading font. */
const sans = (size: number) => size >= 6;

export function Heading({ level, size = level, tone = "default", id, className = "", children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={`${sans(size) ? "font-sans" : "font-heading"} text-balance ${tone === "inverse" ? "text-primary-foreground" : "text-foreground"} ${sizes[size]} ${className}`}>
      {children}
    </Tag>
  );
}
