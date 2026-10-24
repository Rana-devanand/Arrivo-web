import { FadeIn } from "./FadeIn";
import { Icon } from "./Icon";

type CheckListProps = {
  items: readonly string[];
  icon?: "check" | "close";
  /** Each point slides up one after another, starting after this many milliseconds. Leave out for a plain list. */
  animateFrom?: number;
};

export function CheckList({ items, icon = "check", animateFrom }: CheckListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const row = (
          <>
            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name={icon} className="size-3.5" />
            </span>
            <span>{item}</span>
          </>
        );
        return (
          <li key={item}>
            {animateFrom === undefined ? (
              <div className="flex items-start gap-3">{row}</div>
            ) : (
              <FadeIn delay={animateFrom + index * 110} className="flex items-start gap-3">
                {row}
              </FadeIn>
            )}
          </li>
        );
      })}
    </ul>
  );
}
