"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";
import { NavLink } from "./NavLink";

type Pill = { left: number; width: number } | null;

/** The desktop links. A soft pill glides to whichever link the pointer is on, and the link rises a little. */
export function NavMenu({ items }: { items: readonly { label: string; href: string }[] }) {
  const [pill, setPill] = useState<Pill>(null);

  function glide(event: PointerEvent<HTMLElement> | React.FocusEvent<HTMLElement>) {
    const el = event.currentTarget;
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }

  const style: CSSProperties = pill ? { left: pill.left, width: pill.width, opacity: 1 } : { opacity: 0 };

  return (
    <ul onPointerLeave={() => setPill(null)} onBlur={() => setPill(null)} className="relative hidden items-center gap-1 lg:flex">
      <span
        aria-hidden="true"
        style={style}
        className="pointer-events-none absolute inset-y-0 rounded-full bg-card/80 shadow-sm transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none"
      />
      {items.map((item) => (
        <li key={item.href} onPointerEnter={glide} onFocus={glide} className="relative">
          <NavLink href={item.href} label={item.label} />
        </li>
      ))}
    </ul>
  );
}
