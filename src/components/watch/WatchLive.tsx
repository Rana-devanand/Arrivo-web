"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { WatchMap } from "@/components/watch/WatchMap";
import { WatchPanel } from "@/components/watch/WatchPanel";
import { useElementHeight } from "@/components/watch/useElementHeight";
import { useNow } from "@/components/watch/useNow";
import { useWatch } from "@/components/watch/useWatch";
import { ageSeconds, freshness as freshnessOf } from "@/lib/watch";

/** A page with only a message: loading, link not found, or the connection is down. */
function Message({ title, children, retry }: { title: string; children?: string; retry?: boolean }) {
  return (
    <section className="py-24">
      <Container className="max-w-2xl text-center">
        <Heading level={1} size={4}>
          {title}
        </Heading>
        {children ? <p className="mt-3 text-lg text-muted-foreground">{children}</p> : null}
        <div className="mt-6 flex justify-center gap-3">
          {retry ? (
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try again
            </Button>
          ) : null}
          <Button variant="outline" href="/for-contacts">
            What is Arrivo?
          </Button>
        </div>
      </Container>
    </section>
  );
}

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The secret after the # in the address. Null while the page is built on the server, where there is no address. */
function useLinkSecret(): string | null {
  return useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => null,
  );
}

/**
 * The live page behind a watch link: the traveller on a map, where they are going, and how fresh the
 * position is. The link's secret stays in the browser: it is read here, never on the server.
 */
export function WatchLive() {
  const secret = useLinkSecret();
  const state = useWatch(secret);
  const now = useNow();
  const [following, setFollowing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const stopFollowing = useCallback(() => setFollowing(false), []);
  const [panelRef, panelHeight] = useElementHeight();

  if (secret === "") {
    return <Message title="This link is incomplete">Open the whole link you were sent, including the part after the # sign.</Message>;
  }
  if (state.kind === "loading") return <Message title="Finding the journey">One moment.</Message>;
  if (state.kind === "offline") {
    return (
      <Message title="Cannot reach Arrivo right now" retry>
        Check your connection. This page keeps trying by itself.
      </Message>
    );
  }
  if (state.kind === "gone") return <Message title="This link is not available">{state.message}</Message>;

  const { data, receivedAt, trail, reconnecting } = state;
  const position = data.last?.position ?? null;
  const age = data.last ? ageSeconds(data.last.recordedAt, data.serverTime, receivedAt, now) : 0;
  const freshness = freshnessOf(data, age);
  const open = data.status === "active" || data.status === "overdue";

  return (
    <section aria-label={`${data.travellerName}'s journey`} className="relative isolate h-[calc(100svh-5rem)] min-h-[620px] bg-muted">
      <WatchMap
        destination={data.destination}
        destinationName={data.destinationName}
        route={open ? data.route : []}
        trail={open ? trail : []}
        traveller={open ? position : null}
        mode={data.mode}
        live={freshness === "live"}
        follow={following}
        insetBottom={panelHeight}
        onUserMoved={stopFollowing}
        label={`Map showing where ${data.travellerName} is`}
      />
      <div className="pointer-events-none absolute inset-0 z-[1100] flex flex-col justify-end p-2 sm:p-5">
        <div ref={panelRef}>
        <WatchPanel
          data={data}
          freshness={freshness}
          age={age}
          now={now}
          reconnecting={reconnecting}
          position={position}
          following={following}
          onFollow={() => setFollowing(true)}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        </div>
      </div>
    </section>
  );
}
