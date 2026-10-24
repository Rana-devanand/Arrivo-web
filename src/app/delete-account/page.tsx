import type { Metadata } from "next";
import { deleteSteps, deleteTable } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Delete Your Account",
  description:
    "How to delete your Arrivo account: the steps in the app, what happens to an active journey, which data is removed, and how long location history is kept.",
  path: "/delete-account",
});

export default function DeleteAccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Your data"
        title="Delete your Arrivo account"
        intro="You can delete your account and data at any time, from inside the app. Here is exactly what happens, step by step." screen="privacy"

      />
      <Section id="steps" title="Four steps">
        <Timeline steps={deleteSteps} />
      </Section>
      <Section id="what-is-removed" title="What gets removed" tone="muted">
        <DataTable caption="What happens to your data" headers={deleteTable.headers} rows={deleteTable.rows} />
      </Section>
      <Section id="no-access" title="Cannot open the app?">
        <Card className="max-w-2xl">
          <Heading level={3}>Ask us to delete it for you</Heading>
          <p className="mt-2 text-muted-foreground">
            Email {siteConfig.supportEmail} from the address you signed in with and ask us to delete your account. We will confirm before anything is removed.
          </p>
        </Card>
      </Section>
    </>
  );
}
