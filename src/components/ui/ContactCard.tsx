import Link from "next/link";
import { Icon, type IconName } from "./Icon";

type ContactCardProps = {
  href: string;
  icon: IconName;
  label: string;
  value: string;
  /** Opens in a new tab. */
  external?: boolean;
};

/** One way to reach us: icon, small label, the value in bold and an arrow that turns on hover. */
export function ContactCard({ href, icon, label, value, external = false }: ContactCardProps) {
  const classes =
    "group flex items-center gap-4 rounded-[22px] bg-background p-4 shadow-soft transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-raise sm:p-5";
  const body = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-full text-highlight shadow-press">
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <small className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</small>
        <span className="block break-words font-semibold text-foreground">{value}</span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-45">
        <Icon name="arrow" className="size-4 -rotate-45" />
      </span>
    </>
  );
  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}
