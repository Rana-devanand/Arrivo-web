"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatGrid } from "@/components/ui/StatGrid";
import { Table, type Column } from "@/components/ui/Table";
import { formatDay, initials } from "@/lib/account";
import { countryFlag, countryName, filterUsers, parseAdminActivity, parseAdminUsers, userStats, type AdminUserRow } from "@/lib/admin";
import { AdminOnly } from "./AdminOnly";
import { AdminUserJourneys, type Activity } from "./AdminUserJourneys";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

const ROLE_OPTIONS = [
  { value: "", label: "All" },
  { value: "ADMIN", label: "Admins" },
  { value: "USER", label: "People" },
];

const dash = <span className="text-muted-foreground">-</span>;

const columns: readonly Column<AdminUserRow>[] = [
  {
    key: "person",
    header: "Person",
    className: "min-w-48",
    cell: (u) => (
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {initials(u.name, u.email ?? "")}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 font-semibold">
            {u.name || "No name yet"}
            {u.role === "ADMIN" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                <Icon name="shieldCheck" className="size-3" />
                Admin
              </span>
            ) : null}
            {u.deletionRequested ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
                <Icon name="alert" className="size-3" />
                Deletion requested
              </span>
            ) : null}
          </p>
          <p className="truncate text-muted-foreground">{u.email ?? "No email"}</p>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "Phone", className: "whitespace-nowrap", cell: (u) => u.phone ?? dash },
  {
    key: "country",
    header: "Country",
    className: "whitespace-nowrap",
    cell: (u) => (u.countryCode ? `${countryFlag(u.countryCode)} ${countryName(u.countryCode)}`.trim() : dash),
  },
  {
    key: "journeys",
    header: "Journeys",
    className: "min-w-28",
    cell: (u) => (
      <div>
        <p className="font-semibold tabular-nums">{u.total}</p>
        {u.total > 0 ? (
          <p className="text-muted-foreground">
            {[u.completed && `${u.completed} arrived`, u.active && `${u.active} in progress`, u.overdue && `${u.overdue} late`, u.cancelled && `${u.cancelled} ended`].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
    ),
  },
  { key: "last", header: "Last trip", className: "whitespace-nowrap", cell: (u) => (u.lastStartedAt ? formatDay(u.lastStartedAt) : dash) },
  { key: "joined", header: "Joined", className: "whitespace-nowrap", cell: (u) => (u.createdAt ? formatDay(u.createdAt) : dash) },
];

/** Admin: everyone who has signed up, with their country, role and journeys, in a table; "Journeys" opens one person's trips below it. */
export function AdminUsers() {
  return (
    <AdminOnly>
      <Users />
    </AdminOnly>
  );
}

function Users() {
  const users = useAccountResource("/admin/users", parseAdminUsers);
  const activity = useAccountResource("/admin/journey-activity", parseAdminActivity);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ResourceView state={users.state} onRetry={users.reload}>
      {(rows) => {
        const stats = userStats(rows);
        const shown = filterUsers(rows, query, countryName).filter((u) => !role || u.role === role);
        const byUser = activity.state.status === "ready" ? activity.state.data : null;
        const opened = rows.find((u) => u.id === openId) ?? null;
        const journeys: Activity = byUser ? { state: "ready", journeys: opened ? (byUser[opened.id] ?? []) : [] } : activity.state.status === "error" ? { state: "error" } : { state: "loading" };
        return (
          <div className="grid gap-4">
            <StatGrid
              columns="sm:grid-cols-3 lg:grid-cols-5"
              stats={[
                { label: "People", value: String(stats.total), icon: "users" },
                { label: "Admins", value: String(stats.admins), icon: "shieldCheck" },
                { label: "Countries", value: String(stats.countries), icon: "map" },
                { label: "Journeys", value: String(stats.journeys), icon: "navigation" },
                { label: "Deletion requests", value: String(stats.deletionRequests), icon: "trash" },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1 basis-56 sm:max-w-xs">
                <SearchInput size="sm" label="Search people" value={query} onChange={setQuery} placeholder="Search name, email, phone or country" />
              </div>
              <Dropdown label="Role" showLabel value={role} onChange={setRole} options={ROLE_OPTIONS} />
              <p className="ml-auto text-xs text-muted-foreground" role="status">
                {shown.length === rows.length ? `${rows.length} people` : `${shown.length} of ${rows.length} people`}
              </p>
            </div>
            <Table
              caption="People who have signed up"
              columns={columns}
              rows={shown}
              rowKey={(u) => u.id}
              resetKey={`${query}|${role}`}
              actions={(u) => (
                <>
                  <button
                    type="button"
                    onClick={() => setOpenId((current) => (current === u.id ? null : u.id))}
                    aria-pressed={openId === u.id}
                    aria-label={`Journeys of ${u.name || u.email || "this person"}`}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors ${openId === u.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
                  >
                    <Icon name="map" className="size-3.5" />
                    Journeys
                  </button>
                  {u.email ? <CopyButton text={u.email} label={`email of ${u.name || "the person"}`} /> : null}
                </>
              )}
              empty={
                <>
                  <p className="font-semibold">Nobody matches</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Try a different name, email, phone number, country or role.</p>
                </>
              }
            />
            {opened ? <AdminUserJourneys user={opened} activity={journeys} onClose={() => setOpenId(null)} /> : null}
          </div>
        );
      }}
    </ResourceView>
  );
}
