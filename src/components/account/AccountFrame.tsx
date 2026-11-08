import type { ReactNode } from "react";

type AccountFrameProps = {
  /** Phones only: the bar across the top (the brand and the burger). */
  topBar: ReactNode;
  /** Wide screens only, the top of the sidebar: the brand and the menu. */
  menu: ReactNode;
  /** Wide screens only, the bottom of the sidebar: who is signed in, and Log out. */
  user: ReactNode;
  children: ReactNode;
};

/**
 * The dashboard's whole screen. On wide screens the sidebar is a fixed column with the menu at the top and the person at the
 * bottom. On phones there is a slim top bar with a burger (the menu, the person and Log out are in its sheet) and the content
 * fills the rest. Only the content scrolls.
 */
export function AccountFrame({ topBar, menu, user, children }: AccountFrameProps) {
  return (
    <div className="fixed inset-0 z-30 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] bg-background lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]">
      <div className="min-w-0 border-b border-border bg-card px-4 py-2.5 lg:hidden">{topBar}</div>
      <aside className="hidden min-w-0 border-r border-border bg-card p-4 lg:col-start-1 lg:row-start-1 lg:block">{menu}</aside>
      <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:p-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </div>
      <div className="hidden min-w-0 border-r border-t border-border bg-card p-4 lg:col-start-1 lg:row-start-2 lg:block">{user}</div>
    </div>
  );
}
