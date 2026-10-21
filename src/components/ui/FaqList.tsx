import type { Faq } from "@/config/content";
import { Heading } from "./Heading";
import { Icon } from "./Icon";

type FaqListProps = {
  items: readonly Faq[];
  /** Opens the first answer so the list does not look closed and empty. */
  openFirst?: boolean;
};

export function FaqList({ items, openFirst = false }: FaqListProps) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
      {items.map((faq, index) => (
        <details key={faq.question} open={openFirst && index === 0} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <Heading level={3} className="font-sans! text-base! font-bold!">
              {faq.question}
            </Heading>
            <Icon name="chevron" className="size-5 rotate-90 text-foreground transition-transform group-open:-rotate-90" />
          </summary>
          <p className="max-w-2xl pb-6 text-base text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
