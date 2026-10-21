import Image from "next/image";
import { steps } from "@/config/content";
import { AppScreen } from "@/components/ui/AppScreen";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export function HowItWorks() {
  return (
    <Section id="how-it-works" title="How it works" intro="Plan, travel, arrive. That is the whole idea.">
      <ol className="grid gap-12 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col items-center text-center">
            <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {index + 1}
            </span>
            <Heading level={3}>{step.title}</Heading>
            <p className="mb-6 mt-2 max-w-xs text-muted-foreground">{step.text}</p>
            {step.photo ? (
              <Image
                src={step.photo.src}
                alt={step.photo.alt}
                width={step.photo.width}
                height={step.photo.height}
                unoptimized
                className="h-auto w-full max-w-64 drop-shadow-2xl"
              />
            ) : step.screen ? (
              <AppScreen variant={step.screen} />
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
