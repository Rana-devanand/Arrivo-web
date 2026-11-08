import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { siteConfig } from "@/config/site";

/** Shown when there are no journeys yet: how to start one. */
export function JourneysEmpty() {
  return (
    <Panel className="flex flex-wrap items-center gap-4">
      <IconTile name="map" />
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-semibold">No journeys yet</p>
        <p className="text-sm text-muted-foreground">Start a journey in the Arrivo app and it shows up here, with how it ended.</p>
      </div>
      <Button href={siteConfig.downloadHref} size="sm" variant="outline">
        Get the Arrivo app
      </Button>
    </Panel>
  );
}
