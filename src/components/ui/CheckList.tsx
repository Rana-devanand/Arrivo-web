import { FadeIn } from "./FadeIn";
import { Icon } from "./Icon";

type CheckListProps = {
  items: readonly string[];
  icon?: "check" | "close";
  /** `sm` for tight spots such as the pricing cards. */
  size?: "md" | "sm";
  /** Each point slides up one after another, starting after this many milliseconds. Leave out for a plain list. */
  animateFrom?: number;
};

const sizes = {
  md: { list: "space-y-3", row: "gap-3", tile: "size-6", icon: "size-3.5", text: "" },
  sm: { list: "space-y-2.5", row: "gap-2.5", tile: "size-5", icon: "size-3", text: "text-sm" },
} as const;

export function CheckList({ items, icon = "check", size = "md", animateFrom }: CheckListProps) {
  const s = sizes[size];
  return (
    <ul className={s.list}>
      {items.map((item, index) => {
        const row = (
          <>
            <span className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ${s.tile}`}>
              <Icon name={icon} className={s.icon} />
            </span>
            <span className={s.text}>{item}</span>
          </>
        );
        return (
          <li key={item}>
            {animateFrom === undefined ? (
              <div className={`flex items-start ${s.row}`}>{row}</div>
            ) : (
              <FadeIn delay={animateFrom + index * 110} className={`flex items-start ${s.row}`}>
                {row}
              </FadeIn>
            )}
          </li>
        );
      })}
    </ul>
  );
}
