import type { Feature } from "@/config/content";
import { Card } from "./Card";
import { Heading } from "./Heading";
import { Icon } from "./Icon";

type FeatureGridProps = {
  items: readonly Feature[];
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <ul className={`grid gap-6 ${columnClasses[columns]}`}>
      {items.map((item) => (
        <li key={item.title}>
          <Card as="article" className="h-full">
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon name={item.icon} className="size-6" />
            </span>
            <Heading level={3}>{item.title}</Heading>
            <p className="mt-2 text-muted-foreground">{item.text}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
