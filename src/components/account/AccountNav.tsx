import { BrandMark } from "@/components/ui/BrandMark";
import { AccountMenuLinks } from "./AccountMenuLinks";

/** The top of the sidebar on wide screens: the brand, then the account menu. */
export function AccountNav() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center gap-2.5 px-1 py-1">
        <BrandMark />
        <p className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-nav">Arrivo</p>
      </div>
      <nav aria-label="Account">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Menu</p>
        <AccountMenuLinks />
      </nav>
    </div>
  );
}
