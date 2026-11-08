import type { Metadata } from "next";
import { WatchLive } from "@/components/watch/WatchLive";

/**
 * A watch link looks like /watch#<secret>. The secret sits after the #, which a browser never sends to
 * a server: this website cannot see it, log it, cache it, or pass it on in a Referer header. It is read in
 * the browser and sent only to the Arrivo API. The page is never listed by search engines.
 */
export const metadata: Metadata = {
  title: "Live journey",
  description:
    "Follow a trusted traveller on a live Arrivo map: where they are now, where they are going, when they expect to arrive, and how recent the latest update is.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function WatchPage() {
  return <WatchLive />;
}
