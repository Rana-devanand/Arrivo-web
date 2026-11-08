"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Dropdown } from "@/components/ui/Dropdown";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatGrid } from "@/components/ui/StatGrid";
import { StatusPill } from "@/components/ui/StatusPill";
import { Table, type Column } from "@/components/ui/Table";
import { formatDayTime } from "@/lib/account";
import { chargeTypeLabel, filterPayments, formatMoney, parseAdminPayments, paymentLook, revenueSummary, type AdminPayment } from "@/lib/admin";
import { AdminOnly } from "./AdminOnly";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "succeeded", label: "Paid" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "In progress" },
];

/** "credit" becomes "Credit". Dodo names the way of paying in its own words; we only tidy the case. */
const method = (m: string | null) => (m ? m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, " ") : "-");

const columns: readonly Column<AdminPayment>[] = [
  {
    key: "person",
    header: "Person",
    className: "min-w-44",
    cell: (p) => (
      <div>
        <p className="font-medium">{p.customerName || "Someone"}</p>
        {p.customerEmail ? <p className="text-muted-foreground">{p.customerEmail}</p> : null}
      </div>
    ),
  },
  { key: "amount", header: "Amount", className: "whitespace-nowrap", cell: (p) => <span className="font-semibold tabular-nums">{formatMoney(p.amountMinor, p.currency)}</span> },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap",
    cell: (p) => {
      const look = paymentLook(p);
      return <StatusPill label={look.label} tone={look.tone} icon={look.icon} />;
    },
  },
  { key: "kind", header: "Kind", className: "whitespace-nowrap", cell: (p) => chargeTypeLabel(p.chargeType) },
  { key: "method", header: "Paid with", className: "whitespace-nowrap", cell: (p) => method(p.method) },
  { key: "date", header: "Date", className: "whitespace-nowrap", cell: (p) => <time dateTime={p.createdAt}>{formatDayTime(p.createdAt)}</time> },
];

/** Admin: every payment, with who paid, how much, whether it went through, and the totals above. Read from the payment partner. */
export function AdminRevenue() {
  return (
    <AdminOnly>
      <Revenue />
    </AdminOnly>
  );
}

function Revenue() {
  const { state, reload } = useAccountResource("/admin/payments", parseAdminPayments);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");

  return (
    <ResourceView state={state} onRetry={reload}>
      {({ payments, truncated }) => {
        const summary = revenueSummary(payments);
        const shown = filterPayments(payments, query, group);
        const collected = summary.collected.length === 0 ? "$0.00" : summary.collected.map((c) => formatMoney(c.amountMinor, c.currency)).join(" + ");
        return (
          <div className="grid gap-4">
            <StatGrid
              columns="sm:grid-cols-2 lg:grid-cols-4"
              stats={[
                { label: "Collected", value: collected, icon: "creditCard" },
                { label: "Paid", value: String(summary.paid), icon: "checkCircle" },
                { label: "Failed", value: String(summary.failed), icon: "circleX" },
                { label: "Refunded", value: String(summary.refunded), icon: "alert" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1 basis-56 sm:max-w-xs">
                <SearchInput size="sm" label="Search payments" value={query} onChange={setQuery} placeholder="Search person, amount or id" />
              </div>
              <Dropdown label="Status" showLabel value={group} onChange={setGroup} options={STATUS_OPTIONS} />
              <p className="ml-auto text-xs text-muted-foreground" role="status">
                {shown.length === payments.length ? `${payments.length} payments` : `${shown.length} of ${payments.length}`}
              </p>
            </div>
            <Table
              caption="Payments"
              columns={columns}
              rows={shown}
              rowKey={(p) => p.id}
              resetKey={`${query}|${group}`}
              actions={(p) => <CopyButton text={p.id} label="payment id" />}
              empty={
                <>
                  <p className="font-semibold">{payments.length === 0 ? "No payments yet" : "Nothing here"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{payments.length === 0 ? "Payments show here as soon as someone pays." : "No payment matches. Try other words or another status."}</p>
                </>
              }
            />
            <p className="text-xs text-muted-foreground">
              Read from Dodo Payments, newest first{truncated ? " (the newest 500 only)" : ""}. Collected is paid payments that were not refunded; each currency is counted on its own and
              never converted.
            </p>
          </div>
        );
      }}
    </ResourceView>
  );
}
