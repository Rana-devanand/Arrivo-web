import { testimonials } from "@/config/content";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

const tones = [1, 2, 3] as const;

export function Testimonials() {
  return (
    <Section id="testimonials" title="What people will say" intro="Real words from real travellers and trusted contacts will appear here once you have them.">
      <ul className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <li key={index}>
            <Card as="figure" className="flex h-full flex-col items-start gap-4">
              <Badge>Sample, replace before launch</Badge>
              <blockquote className="text-lg text-foreground">{item.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <Avatar tone={tones[index % tones.length]} />
                <span>
                  <span className="block font-semibold">{item.author}</span>
                  <span className="block text-sm text-muted-foreground">{item.role}</span>
                </span>
              </figcaption>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
