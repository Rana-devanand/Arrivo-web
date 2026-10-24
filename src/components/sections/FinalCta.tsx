import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { StoreButtons } from "@/components/ui/StoreButtons";

type FinalCtaProps = {
  title?: string;
  text?: string;
};

export function FinalCta({ title = `Get ${siteConfig.name} today`, text = siteConfig.tagline }: FinalCtaProps) {
  return (
    <section id="download" aria-labelledby="download-title" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-[28px] bg-primary px-6 py-14 shadow-raise text-center text-primary-foreground">
          <Heading level={2} id="download-title" className="text-primary-foreground">
            {title}
          </Heading>
          <p className="max-w-xl text-lg">{text}</p>
          <StoreButtons inverse className="items-center" />
        </div>
      </Container>
    </section>
  );
}
