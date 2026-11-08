import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { contactsLeft, contactsPercent, type BillingInfo } from "@/lib/account";

/** How many trusted contacts are used and how many are left on this plan. */
export function ContactsCard({ billing }: { billing: BillingInfo }) {
  const left = contactsLeft(billing);
  return (
    <Panel as="section" aria-labelledby="contacts-title" className="h-full">
      <div className="flex items-center gap-3">
        <IconTile name="users" />
        <div>
          <Heading level={2} size={3} id="contacts-title" className="text-sm text-muted-foreground">
            Trusted contacts
          </Heading>
          <p className="text-xl font-bold">
            {billing.contactsUsed}
            <span className="text-base font-semibold text-muted-foreground"> of {billing.contactLimit} used</span>
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label="Trusted contacts used"
        aria-valuemin={0}
        aria-valuemax={billing.contactLimit}
        aria-valuenow={Math.min(billing.contactsUsed, billing.contactLimit)}
        className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${contactsPercent(billing)}%` }} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {left === 0 ? `You have used every contact on ${billing.name}.` : `${left} more ${left === 1 ? "contact" : "contacts"} you can add.`}
      </p>
      {left === 0 && billing.plan === "free" ? (
        <div className="mt-4">
          <Button href="/account/plan" size="sm" variant="outline">
            Get more contacts
          </Button>
        </div>
      ) : null}
    </Panel>
  );
}
