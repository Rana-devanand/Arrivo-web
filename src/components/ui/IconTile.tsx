import { Icon, type IconName } from "./Icon";

/** An icon on a small rounded square, to lead a card or a row. */
export function IconTile({ name }: { name: IconName }) {
  return (
    <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
      <Icon name={name} className="size-5" />
    </span>
  );
}
