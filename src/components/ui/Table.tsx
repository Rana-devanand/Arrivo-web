"use client";

import { useState, type ReactNode } from "react";
import { paginate } from "@/lib/admin";
import { Dropdown } from "./Dropdown";
import { Icon } from "./Icon";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Extra classes for the header and the cells, for example a minimum width. */
  className?: string;
};

type TableProps<T> = {
  /** Names the table for screen readers (it is not drawn). */
  caption: string;
  columns: readonly Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  /** A last column of buttons for each row. Leave out for none. */
  actions?: (row: T) => ReactNode;
  actionsLabel?: string;
  pageSize?: number;
  pageSizes?: readonly number[];
  /** Shown instead of the table when there are no rows. */
  empty: ReactNode;
  /** Change this when the rows are filtered, and the table goes back to its first page. */
  resetKey?: string;
};

const cell = "px-3 py-2.5 align-middle";

/**
 * The dashboard's one table: a header, rows, an optional Actions column and a footer with "11-20 of 57", the rows per page
 * and Previous / Next. It scrolls sideways on narrow screens instead of squeezing. The rows you pass are all the rows; it
 * pages them itself.
 */
export function Table<T>({ caption, columns, rows, rowKey, actions, actionsLabel = "Actions", pageSize = 10, pageSizes = [10, 25, 50], empty, resetKey = "" }: TableProps<T>) {
  const [state, setState] = useState({ page: 0, size: pageSize, key: resetKey });
  const page = state.key === resetKey ? state.page : 0;
  const view = paginate(rows, page, state.size);
  const go = (next: number) => setState({ page: next, size: state.size, key: resetKey });

  if (rows.length === 0) return <div className="rounded-2xl border border-border bg-card p-5">{empty}</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`${cell} text-[11px] font-semibold uppercase tracking-[0.08em] ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
              {actions ? (
                <th scope="col" className={`${cell} text-right text-[11px] font-semibold uppercase tracking-[0.08em]`}>
                  {actionsLabel}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {view.rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-border transition-colors hover:bg-secondary/40">
                {columns.map((c) => (
                  <td key={c.key} className={`${cell} ${c.className ?? ""}`}>
                    {c.cell(row)}
                  </td>
                ))}
                {actions ? (
                  <td className={cell}>
                    <div className="flex justify-end gap-1.5">{actions(row)}</div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <p role="status" aria-live="polite">
          {view.from}-{view.to} of {view.total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            label="Rows per page"
            showLabel
            value={String(state.size)}
            options={pageSizes.map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(v) => setState({ page: 0, size: Number(v), key: resetKey })}
            placement="above"
          />
          <nav aria-label="Pages" className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => go(view.page - 1)}
              disabled={view.page === 0}
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="chevron" className="size-3.5 rotate-180" />
            </button>
            <span className="min-w-20 text-center font-medium text-foreground">
              Page {view.page + 1} of {view.pageCount}
            </span>
            <button
              type="button"
              onClick={() => go(view.page + 1)}
              disabled={view.page >= view.pageCount - 1}
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="chevron" className="size-3.5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
