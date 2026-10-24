import type { Feature } from "@/config/content";
import { AnimatedIcon } from "./AnimatedIcon";
import { Heading } from "./Heading";
import { TiltCard } from "./TiltCard";

type FeatureGridProps = {
  items: readonly Feature[];
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Soft raised cards that fade up, tilt toward the pointer and show a growing underline on hover. */
export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <ul className={`grid gap-6 lg:gap-8 ${columnClasses[columns]}`}>
      {items.map((item, index) => (
        <TiltCard
          key={item.title}
          index={index % columns}
          className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-[26px] bg-background p-6 text-foreground shadow-soft transition-shadow duration-500 hover:shadow-raise sm:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-48 rounded-full bg-highlight/5 blur-2xl transition-all duration-500 group-hover:bg-highlight/10"
          />
          <AnimatedIcon name={item.icon} className="relative z-10 size-14 text-highlight transition-transform duration-300 group-hover:scale-110" />
          <Heading level={3} className="relative z-10 text-xl font-semibold leading-tight tracking-tight">
            {item.title}
          </Heading>
          <p className="relative z-10 text-[15px] text-muted-foreground">{item.text}</p>
          <span aria-hidden="true" className="relative z-10 mt-2 h-0.5 w-0 rounded-full bg-highlight transition-all duration-300 group-hover:w-12" />
        </TiltCard>
      ))}
    </ul>
  );
}
