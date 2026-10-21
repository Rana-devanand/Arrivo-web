import type { Faq } from "@/config/content";
import { Heading } from "./Heading";
import { Icon } from "./Icon";

export function FaqList({ items }: { items: readonly Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((faq) => (
        <details key={faq.question} className="group rounded-lg border border-border bg-card px-5 text-card-foreground">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
            <Heading level={3}>{faq.question}</Heading>
            <Icon name="chevron" className="size-5 text-foreground group-open:rotate-90" />
          </summary>
          <p className="pb-5 text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
