import type { ReactNode } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  /** How big it looks, when that is not the size of its level (a page title inside a compact panel is still the h1). */
  size?: 1 | 2 | 3 | 4 | 5;
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
} as const;

export function Heading({ level, size = level, id, className = "", children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={`font-heading text-balance text-foreground ${sizes[size]} ${className}`}>
      {children}
    </Tag>
  );
}
