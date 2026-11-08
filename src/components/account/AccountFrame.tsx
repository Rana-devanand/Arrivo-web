import type { ReactNode } from "react";

type AccountFrameProps = {
  /** Phones only: the bar across the top (the brand and the burger). */
  mobileBar: ReactNode;
  /** Wide screens only, the top of the sidebar: the brand and the menu. */
  menu: ReactNode;
  /** Wide screens only, the bottom of the sidebar: who is signed in, and Log out. */
  user: ReactNode;
  /** The bar above the content: the name of the screen and its details. It stays in view while the content scrolls. */
  header: ReactNode;
  children: ReactNode;
};

/**
 * The dashboard's whole screen. On wide screens the sidebar is a fixed column with the menu at the top and the person at the
 * bottom. On phones there is a slim top bar with a burger (the menu, the person and Log out are in its sheet). Beside or under
 * those, a header bar with the screen's name, and below it the content, which is the only part that scrolls.
 */
export function AccountFrame({ mobileBar, menu, user, header, children }: AccountFrameProps) {
  return (
    <div className="fixed inset-0 z-30 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] bg-background lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]">
      <div className="min-w-0 border-b border-border bg-card px-4 py-2.5 lg:hidden">{mobileBar}</div>
      <aside className="hidden min-w-0 border-r border-border bg-card p-4 lg:col-start-1 lg:row-start-1 lg:block">{menu}</aside>
      <div className="flex min-h-0 min-w-0 flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {header}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 text-sm sm:p-6 lg:p-8">
          <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">{children}</div>
        </div>
      </div>
      <div className="hidden min-w-0 border-r border-t border-border bg-card p-4 lg:col-start-1 lg:row-start-2 lg:block">{user}</div>
    </div>
  );
}
