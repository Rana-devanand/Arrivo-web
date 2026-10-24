import { testimonials } from "@/config/content";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { TiltCard } from "@/components/ui/TiltCard";

const tones = [1, 2, 3] as const;

export function Testimonials() {
  return (
    <Section id="testimonials" eyebrow="Kind words" title="What people will say" intro="Real words from real travellers and trusted contacts will appear here once you have them.">
      <ul className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {testimonials.map((item, index) => (
          <TiltCard
            key={index}
            index={index}
            className="flex flex-col items-start gap-4 rounded-[26px] bg-background p-6 text-foreground shadow-soft transition-shadow duration-500 hover:shadow-raise sm:p-7"
          >
            <figure className="flex h-full flex-col items-start gap-4">
              <Badge>ARRIVO USERS</Badge>
              <blockquote className="text-lg text-foreground">{item.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <Avatar tone={tones[index % tones.length]} />
                <span>
                  <span className="block font-semibold">{item.author}</span>
                  <span className="block text-sm text-muted-foreground">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          </TiltCard>
        ))}
      </ul>
    </Section>
  );
}
