"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/ui/BrandMark";
import { Icon } from "@/components/ui/Icon";
import { AccountMenuLinks } from "./AccountMenuLinks";
import { AccountUserBar } from "./AccountUserBar";

/** The top bar on phones: the brand and a burger that opens a sheet from the bottom with the menu, the person and Log out. */
export function AccountMobileBar() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A link to another page: the sheet closes once the new page is shown.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  // A link to the page we are already on does not change the address, so close on the tap too.
  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) dialog.current?.close();
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <BrandMark className="size-8" />
        <p className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-nav">Arrivo</p>
      </div>
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary"
      >
        <Icon name="menu" className="size-5" />
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        // A tap on the dimmed screen (the dialog's own backdrop) closes it.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88svh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[28px] border-0 bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-foreground shadow-lg backdrop:bg-foreground/40 open:animate-sheet-up motion-reduce:animate-none"
      >
        <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between pl-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Menu</p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => dialog.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <nav aria-label="Account" onClick={closeOnLink}>
          <AccountMenuLinks />
        </nav>
        <div className="mt-4 border-t border-border pt-4">
          <AccountUserBar />
        </div>
      </dialog>
    </div>
  );
}
