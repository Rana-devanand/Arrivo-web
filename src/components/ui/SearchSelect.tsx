"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";

export type SearchSelectOption = { value: string; label: string; /** Shown small on the right, such as a currency code. */ hint?: string };

type SearchSelectProps = {
  label: string;
  options: readonly SearchSelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  searchLabel?: string;
  emptyText?: string;
  className?: string;
  /** A plain look (thin borders, no inset shadow) for the account dashboard. */
  flat?: boolean;
};

/** A dropdown with a search box: type to narrow the list, arrows and Enter to choose, Esc to close. */
export function SearchSelect({ label, options, value, onChange, searchLabel = "Search", emptyText = "Nothing matches your search.", className = "", flat = false }: SearchSelectProps) {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const listId = `${id}-list`;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = options.find((option) => option.value === value);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => `${option.label} ${option.hint ?? ""} ${option.value}`.toLowerCase().includes(q));
  }, [options, query]);

  // Opening puts the cursor in the search box; the chosen row is brought into view.
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  // A tap or click anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    function away(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function show() {
    setQuery("");
    setActive(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function choose(option: SearchSelectOption | undefined) {
    if (!option) return;
    onChange(option.value);
    close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const last = shown.length - 1;
    if (event.key === "ArrowDown") setActive((index) => Math.min(index + 1, last));
    else if (event.key === "ArrowUp") setActive((index) => Math.max(index - 1, 0));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(Math.max(last, 0));
    else if (event.key === "Enter") choose(shown[active]);
    else if (event.key === "Escape") close();
    else if (event.key === "Tab") setOpen(false);
    else return;
    if (event.key !== "Tab") event.preventDefault();
  }

  return (
    <div ref={root} className={`relative ${className}`}>
      <label htmlFor={triggerId} className="block text-sm font-semibold">
        {label}
      </label>
      <button
        ref={trigger}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : show())}
        className={`mt-1 flex min-h-12 w-full items-center justify-between gap-2 rounded-xl px-3 text-left text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${flat ? "border border-border bg-card" : "bg-background shadow-press"}`}
      >
        <span className="truncate">{selected ? (selected.hint ? `${selected.label} (${selected.hint})` : selected.label) : "Choose"}</span>
        <Icon name="chevron" className={`size-4 rotate-90 text-muted-foreground transition-transform ${open ? "-rotate-90" : ""}`} />
      </button>

      {open ? (
        <div className={`absolute inset-x-0 z-30 mt-2 rounded-2xl p-2 ${flat ? "border border-border bg-card shadow-md" : "bg-background shadow-raise"}`}>
          <input
            ref={input}
            type="search"
            role="combobox"
            aria-label={searchLabel}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={shown[active] ? `${id}-opt-${active}` : undefined}
            autoComplete="off"
            placeholder={searchLabel}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className={`min-h-11 w-full rounded-xl px-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${flat ? "border border-border bg-card" : "bg-background shadow-press"}`}
          />
          <ul id={listId} role="listbox" aria-label={label} className="mt-2 max-h-64 overflow-y-auto overscroll-contain">
            {shown.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => choose(option)}
                onPointerMove={() => setActive(index)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm ${index === active ? "bg-primary text-primary-foreground" : "text-foreground"}`}
              >
                <span className="flex items-center gap-2">
                  {option.value === value ? <Icon name="check" className="size-4" /> : <span className="size-4" aria-hidden="true" />}
                  {option.label}
                </span>
                {option.hint ? <span className="text-xs">{option.hint}</span> : null}
              </li>
            ))}
          </ul>
          <p role="status" className={shown.length === 0 ? "px-3 py-3 text-sm text-muted-foreground" : "sr-only"}>
            {shown.length === 0 ? emptyText : `${shown.length} results`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
