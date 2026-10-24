import type { ElementType, ReactNode } from "react";

type CardProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** A soft raised surface. It lifts a little on hover. */
export function Card({ as: Tag = "div", className = "", children }: CardProps) {
  return (
    <Tag
      className={`rounded-[26px] bg-background p-6 text-foreground shadow-soft transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-raise sm:p-7 ${className}`}
    >
      {children}
    </Tag>
  );
}
