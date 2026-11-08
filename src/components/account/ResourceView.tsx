"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import type { Resource } from "./useAccountResource";

type ResourceViewProps<T> = {
  state: Resource<T>;
  onRetry: () => void;
  /** What to show while loading: grey blocks the shape of the real thing. */
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
};

/** Loading (a skeleton), error (with a retry) and data for something fetched from the API. */
export function ResourceView<T>({ state, onRetry, skeleton, children }: ResourceViewProps<T>) {
  if (state.status === "loading") {
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          Loading
        </p>
        {skeleton}
      </div>
    );
  }
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
