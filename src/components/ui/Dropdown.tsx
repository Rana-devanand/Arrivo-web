"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  /** Read by screen readers, and shown before the value when `showLabel` is set. */
  label: string;
  value: string;
  options: readonly DropdownOption[];
  onChange: (value: string) => void;
  showLabel?: boolean;
  /** `sm` is the compact filter size (36px tall); `md` matches the form boxes (44px). */
  size?: "sm" | "md";
  /** Where the list opens: under the button (default) or above it, for a drop-down at the foot of a table. */
  placement?: "below" | "above";
  className?: string;
};

const SIZES = { sm: "min-h-9 text-xs", md: "min-h-11 text-sm" } as const;

/**
 * The dashboard's one drop-down: a button that opens a short list, with a small corner radius. Works with the keyboard
 * (arrows, Home, End, Enter, Escape, type a letter to jump) and closes when you click elsewhere. Use it instead of a
 * native `select` for filters and choices.
 */
export function Dropdown({ label, value, options, onChange, showLabel = false, size = "sm", placement = "below", className = "" }: DropdownProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selected = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selected];

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  function openList() {
    setActive(selected);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    button.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.min(last, Math.max(0, i + (event.key === "ArrowDown" ? 1 : -1))));
        return;
      }
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(event.key === "Home" ? 0 : last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      default: {
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
        const from = open ? active + 1 : selected + 1;
        const letter = event.key.toLowerCase();
        const next = [...options.keys()].map((n) => (n + from) % options.length).find((n) => options[n].label.toLowerCase().startsWith(letter));
        if (next === undefined) return;
        if (open) setActive(next);
        else onChange(options[next].value);
      }
    }
  }

  return (
    <div ref={root} className={`relative inline-block ${className}`}>
      <button
        ref={button}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-2.5 font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${SIZES[size]}`}
      >
        <span className="truncate">
          {showLabel ? <span className="font-normal text-muted-foreground">{label}: </span> : null}
          {current?.label ?? ""}
        </span>
        <Icon name="chevron" className={`size-3.5 text-muted-foreground transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className={`absolute left-0 z-30 max-h-64 ${placement === "above" ? "bottom-full mb-1" : "top-full mt-1"} min-w-full overflow-y-auto rounded-md border border-border bg-card py-1 text-foreground shadow-soft`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-${index}`}
              role="option"
              aria-selected={option.value === value}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className={`flex min-h-9 cursor-pointer items-center justify-between gap-3 whitespace-nowrap px-2.5 text-xs ${index === active ? "bg-secondary" : ""} ${option.value === value ? "font-semibold" : ""}`}
            >
              {option.label}
              {option.value === value ? <Icon name="check" className="size-3.5" /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
