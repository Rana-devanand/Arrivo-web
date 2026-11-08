"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LoginButton } from "./LoginButton";
import { NavLink } from "./NavLink";

/** The menu on phones: a burger button that opens a sheet from the bottom with the links and the Download button. */
export function MobileMenu({ items }: { items: readonly { label: string; href: string }[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A link to another page: the sheet closes once the new page is shown.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  // The page behind the sheet does not scroll while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // A link to the part of this page we are already on does not change the address, so close on the tap too.
  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) dialog.current?.close();
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
        className="inline-flex size-11 items-center justify-center rounded-full bg-card text-nav shadow-sm"
      >
        <Icon name="menu" className="size-6" />
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        // A tap on the dimmed page (the dialog's own backdrop) closes it.
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88svh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[28px] border-0 bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-foreground shadow-lg backdrop:bg-foreground/40 open:animate-sheet-up motion-reduce:animate-none"
      >
        <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-border" />
        <div className="mb-2 flex items-center justify-between pl-4">
          <p className="font-heading text-lg font-bold">Menu</p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => dialog.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-full bg-card text-nav shadow-sm"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <ul onClick={closeOnLink} className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} size="lg" />
            </li>
          ))}
        </ul>
        <div onClick={closeOnLink} className="mt-5 grid gap-3">
          <LoginButton size="md" className="w-full" />
          <Button href={siteConfig.downloadHref} arrow className="w-full">
            Download
          </Button>
        </div>
      </dialog>
    </div>
  );
}
