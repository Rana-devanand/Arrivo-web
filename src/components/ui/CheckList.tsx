import { Icon } from "./Icon";

type CheckListProps = {
  items: readonly string[];
  icon?: "check" | "close";
};

export function CheckList({ items, icon = "check" }: CheckListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icon name={icon} className="size-3.5" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
