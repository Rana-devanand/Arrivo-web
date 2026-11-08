"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** The account area is its own place: the website's navbar, footer and full-screen loader are left out there. */
export function HideInAccount({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/account" || pathname.startsWith("/account/")) return null;
  return <>{children}</>;
}
