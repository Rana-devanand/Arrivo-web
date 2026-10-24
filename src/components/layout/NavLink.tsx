"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "relative inline-flex min-h-11 whitespace-nowrap items-center rounded-full px-5 text-base font-medium text-nav transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none";

export function NavLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${base} ${active ? "bg-card shadow-sm" : ""} ${className}`}
    >
      {label}
      {active && <span aria-hidden="true" className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-highlight" />}
    </Link>
  );
}
