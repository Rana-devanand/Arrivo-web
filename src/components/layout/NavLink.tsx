"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "relative inline-flex items-center whitespace-nowrap rounded-full font-medium text-nav transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none";

const sizes = {
  /** The links in the header bar. */
  sm: "min-h-10 px-3.5 text-sm",
  /** The links in the menu sheet on phones: bigger to tap. */
  lg: "min-h-12 w-full px-4 text-base",
} as const;

export function NavLink({ href, label, size = "sm" }: { href: string; label: string; size?: keyof typeof sizes }) {
  const active = usePathname() === href;
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={`${base} ${sizes[size]} ${active ? "bg-card shadow-sm" : ""}`}>
      {label}
      {active && <span aria-hidden="true" className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-highlight" />}
    </Link>
  );
}
