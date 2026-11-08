"use client";

import { useEffect, useState } from "react";

/**
 * The height of an element in pixels, kept up to date as its content changes. Zero until it has been
 * measured. Give the returned function to the element's `ref`: it works even when the element only
 * appears later, which a plain ref object would miss.
 */
export function useElementHeight(): [ref: (element: HTMLElement | null) => void, height: number] {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setHeight(Math.round(entry.contentRect.height)));
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, height];
}
