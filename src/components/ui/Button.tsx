import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "outline" | "inverse" | "inverseOutline";
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
};

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-85",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-85",
  outline: "border-2 border-primary bg-transparent text-foreground hover:bg-secondary",
  inverse: "bg-primary-foreground text-primary hover:opacity-85",
  inverseOutline: "border-2 border-primary-foreground bg-transparent text-primary-foreground hover:opacity-85",
} as const;

const sizes = {
  md: "min-h-12 gap-2 px-6 py-2.5 text-base",
  sm: "min-h-10 gap-2 px-4 py-1.5 text-sm",
} as const;

export function Button({ href, variant = "primary", size = "md", className = "", children }: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full font-semibold transition-opacity ${sizes[size]} ${variants[variant]} ${className}`;
  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href === "#") {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
