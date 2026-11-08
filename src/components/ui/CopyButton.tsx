"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/** A small icon button that copies a piece of text. `label` says what is copied ("payment id"); it turns into a tick for 2 seconds. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `Copied the ${label}` : `Copy the ${label}`}
      title={copied ? "Copied" : `Copy the ${label}`}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
    >
      <Icon name={copied ? "check" : "copy"} className="size-3.5" />
    </button>
  );
}
