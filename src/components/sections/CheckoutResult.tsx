"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";

/** The payment partner adds `status` to the address when the visitor comes back. */
const FAILED = new Set(["failed", "cancelled", "canceled"]);

/** What to tell someone who has just paid (or tried to). Never claims Plus is on: the app shows that. */
export function CheckoutResult() {
  const status = useSearchParams().get("status");
  const failed = status !== null && FAILED.has(status.toLowerCase());

  return (
    <Card className="mx-auto max-w-2xl" >
      <div role="status" aria-live="polite" className="grid gap-4">
        <Heading level={2} className="text-2xl">
          {failed ? "The payment did not go through" : "Thank you. We have your payment."}
        </Heading>
        {failed ? (
          <>
            <p className="text-muted-foreground">No money was taken for this attempt. Open Arrivo and tap Upgrade to try again, or use a different card or UPI app.</p>
            <div>
              <Button href="/support" variant="outline">
                Get help with payments
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">
              Go back to the Arrivo app. Arrivo Plus switches on within a minute. If you still see Arrivo Free, open Profile, then Subscription, and pull down to refresh.
            </p>
            <p className="text-muted-foreground">An invoice is emailed to you by Dodo Payments. You can cancel any time from the app under Manage subscription.</p>
          </>
        )}
      </div>
    </Card>
  );
}
