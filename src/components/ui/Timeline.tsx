import type { Step } from "@/config/content";
import { AppScreen } from "./AppScreen";
import { Heading } from "./Heading";

export function Timeline({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="relative mx-auto max-w-4xl space-y-14 border-l-2 border-border pl-8 sm:pl-12">
      {steps.map((step, index) => (
        <li key={step.title} className="relative grid items-start gap-6 sm:grid-cols-[1fr_auto]">
          <span className="absolute -left-[3.05rem] top-0 inline-flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground sm:-left-[4.05rem]">
            {index + 1}
          </span>
          <div>
            <Heading level={3} className="text-xl">
              {step.title}
            </Heading>
            <p className="mt-2 text-lg text-muted-foreground">{step.text}</p>
          </div>
          {step.screen ? <AppScreen variant={step.screen} size="sm" /> : null}
        </li>
      ))}
    </ol>
  );
}
