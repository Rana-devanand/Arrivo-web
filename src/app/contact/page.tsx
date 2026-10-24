import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ContactCard } from "@/components/ui/ContactCard";
import { OfficeMap } from "@/components/ui/OfficeMap";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Arrivo: send a message about the app, report a problem, ask about partnerships or press, or find our office. We read every message and reply by email.",
  path: "/contact",
});

const { office } = siteConfig;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you."
        intro="A question, an idea or a problem in the app? Tell us in a few quick steps and we will come back to you by email."
      />
      <section aria-label="Ways to reach us" className="pb-16 sm:pb-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="grid gap-4">
            <FadeIn>
              <ContactCard href={`mailto:${siteConfig.supportEmail}`} icon="mail" label="Email" value={siteConfig.supportEmail} />
            </FadeIn>
            <FadeIn delay={100}>
              <ContactCard
                href={`https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`}
                icon="pin"
                label="Office"
                value={office.address}
                external
              />
            </FadeIn>
            <FadeIn delay={200}>
              <ContactCard href="/support" icon="shield" label="Quick fixes" value="Visit the support page" />
            </FadeIn>
            <FadeIn delay={300}>
              <ContactCard href="/faq" icon="help" label="Answers" value="Read the frequently asked questions" />
            </FadeIn>
            <p className="mt-2 text-muted-foreground">
              Please keep exact addresses and coordinates out of your message. Arrivo never needs them to help you.
            </p>
          </div>
          <FadeIn delay={150}>
            <ContactForm />
          </FadeIn>
        </Container>
      </section>
      <Section id="find-us" eyebrow="Visit us" title="Find us" intro="Prefer to talk in person? Our office address is below.">
        <OfficeMap />
      </Section>
    </>
  );
}
