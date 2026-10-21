"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig } from "@/config/site";

/** The loader stays at least this long on every page, and never longer than the failsafe. */
const MIN_VISIBLE_MS = 2000;
const FAILSAFE_MS = 10000;

export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  // performance.now() when the loader last appeared. 0 means the page itself just started loading.
  const shownAt = useRef(0);
  const currentPath = useRef(pathname);
  // Only one timer is ever pending, so an old one cannot hide the loader of a newer navigation.
  const timer = useRef<number | undefined>(undefined);

  const hideAfter = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), ms);
  }, []);

  const hideSoon = useCallback(
    () => hideAfter(Math.max(0, MIN_VISIBLE_MS - (performance.now() - shownAt.current))),
    [hideAfter],
  );

  // First visit: wait for the page to finish loading, and for the minimum time.
  useEffect(() => {
    if (document.readyState === "complete") {
      hideSoon();
    } else {
      window.addEventListener("load", hideSoon, { once: true });
    }
    return () => {
      window.removeEventListener("load", hideSoon);
      window.clearTimeout(timer.current);
    };
  }, [hideSoon]);

  // Show the loader as soon as a link to another page is clicked, or back/forward is used.
  useEffect(() => {
    const show = () => {
      shownAt.current = performance.now();
      setVisible(true);
      hideAfter(FAILSAFE_MS);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      show();
    };
    const onPop = () => {
      if (window.location.pathname !== currentPath.current) show();
    };
    // Capture phase: Next.js stops the click for its own links before it bubbles up.
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [hideAfter]);

  // The new page has arrived. Keep the loader for whatever is left of the minimum time.
  useEffect(() => {
    if (pathname === currentPath.current) return;
    currentPath.current = pathname;
    hideSoon();
  }, [pathname, hideSoon]);

  return (
    <div id="page-loader" role="status" aria-live="polite" className={`page-loader ${visible ? "" : "is-hidden"}`}>
      <div className="flex flex-col items-center gap-8">
        <div className="page-loader-mark" aria-hidden="true">
          <span className="page-loader-ring" />
          <span className="page-loader-ring" />
          <span className="page-loader-ring" />
          <span className="page-loader-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="size-7">
              <path d="M4 11l8-7 8 7" />
              <path d="M6 9.5V20h12V9.5" />
              <path d="M10 20v-5h4v5" />
            </svg>
          </span>
        </div>
        <div className="page-loader-text text-2xl font-extrabold tracking-tight" aria-hidden="true">
          {[...siteConfig.name].map((letter, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <span className="sr-only">Loading {siteConfig.name}</span>
      </div>
    </div>
  );
}
