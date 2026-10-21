import type { ElementType, ReactNode } from "react";

type CardProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Card({ as: Tag = "div", className = "", children }: CardProps) {
  return (
    <Tag className={`rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm ${className}`}>
      {children}
    </Tag>
  );
}
