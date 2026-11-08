"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { BodyLoader } from "./BodyLoader";
import type { Resource } from "./useAccountResource";

type ResourceViewProps<T> = {
  state: Resource<T>;
  onRetry: () => void;
  /** `body` (default) centres the loader in the whole body; `inline` is for a part of a screen that has other content around it. */
  loader?: "body" | "inline";
  children: (data: T) => ReactNode;
};

/** Loading (the loader), error (with a retry) and data for something fetched from the API. */
export function ResourceView<T>({ state, onRetry, loader = "body", children }: ResourceViewProps<T>) {
  if (state.status === "loading") return <BodyLoader variant={loader} />;
  if (state.status === "error") {
    return (
      <Panel role="alert" className="flex flex-wrap items-center gap-4">
        <IconTile name="alert" />
        <p className="min-w-0 flex-1 basis-56">{state.message}</p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </Panel>
    );
  }
  return <>{children(state.data)}</>;
}
