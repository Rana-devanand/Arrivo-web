import Link from "next/link";
import type { NavItem } from "@/config/site";
import { Icon } from "./Icon";

type LinkCardProps = {
  item: NavItem;
  /** Plain `<a>` for files such as sitemap.xml, which are not pages of the app. */
  file?: boolean;
};

const classes =
  "group flex h-full items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground transition-shadow hover:shadow-md";

export function LinkCard({ item, file = false }: LinkCardProps) {
  const body = (
    <>
      <span>
        <span className="block text-lg font-bold">{item.label}</span>
        {item.description ? <span className="mt-1 block text-muted-foreground">{item.description}</span> : null}
        <span className="mt-2 block text-sm text-muted-foreground">{item.href}</span>
      </span>
      <Icon name="arrow" className="mt-1 size-5 transition-transform group-hover:translate-x-1" />
    </>
  );
  return file ? (
    <a href={item.href} className={classes}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={classes}>
      {body}
    </Link>
  );
}
