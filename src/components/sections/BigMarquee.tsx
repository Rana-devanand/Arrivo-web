import { marqueePhrases } from "@/config/content";

const dots = ["bg-primary", "bg-highlight", "bg-spot"] as const;

function Phrases({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="marquee-copy flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
      {marqueePhrases.map((phrase, index) => (
        <div key={phrase} className="flex items-center gap-10 sm:gap-16">
          <span>{phrase}</span>
          <i className={`size-4 shrink-0 rounded-full sm:size-6 lg:size-8 ${dots[index % dots.length]}`} />
        </div>
      ))}
    </div>
  );
}

/** A full-screen band with big two-word values that drift slowly across the middle. The second copy only exists to make the loop seamless. */
export function BigMarquee() {
  return (
    <section aria-label="What Arrivo stands for" className="flex min-h-svh items-center overflow-hidden">
      <div className="marquee-track flex w-max font-heading text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl xl:text-9xl">
        <Phrases />
        <Phrases hidden />
      </div>
    </section>
  );
}
