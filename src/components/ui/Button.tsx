import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type ButtonProps = {
  /** A link. Leave out to get a real button that runs `onClick` or submits a form. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "inverse" | "inverseOutline" | "soft";
  size?: "md" | "sm";
  /** Adds a round arrow at the end that turns when the button is hovered. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-85",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-85",
  outline: "border-2 border-primary bg-transparent text-foreground hover:bg-secondary",
  inverse: "bg-primary-foreground text-primary hover:opacity-85",
  inverseOutline: "border-2 border-primary-foreground bg-transparent text-primary-foreground hover:opacity-85",
  soft: "bg-background text-foreground shadow-soft hover:shadow-raise",
} as const;

const arrowTiles = {
  primary: "bg-primary-foreground text-primary",
  secondary: "bg-primary text-primary-foreground",
  outline: "bg-primary text-primary-foreground",
  inverse: "bg-primary text-primary-foreground",
  inverseOutline: "bg-primary-foreground text-primary",
  soft: "bg-primary text-primary-foreground",
} as const;

const sizes = {
  md: "min-h-12 gap-2 py-2.5 text-base",
  sm: "min-h-10 gap-2 py-1.5 text-sm",
} as const;

/** Link or button, depending on whether `href` is given. */
export function Button({ href, onClick, type = "button", disabled = false, variant = "primary", size = "md", arrow = false, className = "", children }: ButtonProps) {
  const padding = arrow ? "pl-6 pr-1.5" : size === "md" ? "px-6" : "px-4";
  const classes = `group/arrow inline-flex items-center justify-center rounded-full font-semibold transition-[opacity,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${padding} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow ? (
        <span className={`inline-flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover/arrow:rotate-45 ${arrowTiles[variant]}`}>
          <Icon name="arrow" className="size-4 -rotate-45" />
        </span>
      ) : null}
    </>
  );
  if (href === undefined) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={classes}>
        {content}
      </button>
    );
  }
  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  if (href === "#" || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
