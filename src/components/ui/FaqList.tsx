"use client";

import { useId, useState } from "react";
import type { Faq } from "@/config/content";

type FaqListProps = {
  items: readonly Faq[];
  /** Opens the first answer so the list does not look closed and empty. */
  openFirst?: boolean;
};

/** Soft cards with a plus that turns into a minus. Several can be open at once. Answers stay in the page for search engines. */
export function FaqList({ items, openFirst = false }: FaqListProps) {
  const base = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set(openFirst ? [0] : []));

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }

  return (
    <div className="grid gap-3">
      {items.map((faq, index) => {
        const isOpen = open.has(index);
        const panel = `${base}-${index}`;
        return (
          <div key={faq.question} className={`overflow-hidden rounded-[22px] bg-background transition-shadow duration-500 ${isOpen ? "shadow-raise" : "shadow-soft"}`}>
            <h3 className="font-sans text-base font-bold tracking-tight sm:text-lg">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className={`relative size-10 shrink-0 rounded-full transition-all duration-500 group-hover:scale-105 ${
                    isOpen ? "rotate-180 bg-highlight shadow-[0_10px_22px_-8px_var(--highlight)]" : "bg-background shadow-press"
                  }`}
                >
                  <span className={`absolute left-1/2 top-1/2 -ml-[7px] -mt-[1.25px] h-[2.5px] w-3.5 rounded-sm transition-colors duration-300 ${isOpen ? "bg-primary-foreground" : "bg-foreground"}`} />
                  <span
                    className={`absolute left-1/2 top-1/2 -ml-[7px] -mt-[1.25px] h-[2.5px] w-3.5 rounded-sm transition-all duration-500 ${
                      isOpen ? "rotate-0 bg-primary-foreground" : "rotate-90 bg-foreground"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div id={panel} role="region" inert={!isOpen} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-[64ch] px-5 pb-5 text-muted-foreground sm:px-6 sm:pb-6">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
