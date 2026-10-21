import type { ReactNode } from "react";

type HeadingProps = {
  level: 1 | 2 | 3;
  id?: string;
  className?: string;
  children: ReactNode;
};

const sizes = {
  1: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
  2: "text-3xl font-bold tracking-tight sm:text-4xl",
  3: "text-lg font-semibold",
} as const;

export function Heading({ level, id, className = "", children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={`font-heading text-balance text-foreground ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
}
