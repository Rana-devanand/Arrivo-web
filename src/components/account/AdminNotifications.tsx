"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { SearchInput } from "@/components/ui/SearchInput";
import { Table, type Column } from "@/components/ui/Table";
import { formatDayTime } from "@/lib/account";
import { filterNotifications, notificationLook, notificationTypes, parseAdminNotifications, type AdminNotification } from "@/lib/admin";
import { AdminOnly } from "./AdminOnly";
import { ResourceView } from "./ResourceView";
import { useAccountResource } from "./useAccountResource";

const columns: readonly Column<AdminNotification>[] = [
  {
    key: "kind",
    header: "Kind",
    className: "whitespace-nowrap",
    cell: (n) => {
      const look = notificationLook(n.type);
      return (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Icon name={look.icon} className="size-3.5 text-muted-foreground" />
          {look.label}
          {n.read ? null : (
            <span className="size-2 rounded-full bg-primary" role="img" aria-label="Unread" title="Unread" />
          )}
        </span>
      );
    },
  },
  {
    key: "message",
    header: "Message",
    className: "min-w-64",
    cell: (n) => (
      <div>
        <p className="font-semibold">{n.title}</p>
        {n.body ? <p className="mt-0.5 text-muted-foreground">{n.body}</p> : null}
        {n.hasAttachment ? (
          <p
            title="A ride photo was shared with the contacts. The dashboard never shows the photo itself."
            className="mt-1 inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-secondary-foreground"
          >
            <Icon name="camera" className="size-3" />
            Photo attached
          </p>
        ) : null}
      </div>
    ),
  },
  {
    key: "to",
    header: "To",
    className: "min-w-40",
    cell: (n) => (
      <div>
        <p className="font-medium">{n.recipientName || "Someone"}</p>
        {n.recipientEmail ? <p className="text-muted-foreground">{n.recipientEmail}</p> : null}
      </div>
    ),
  },
  { key: "about", header: "About", cell: (n) => n.travellerName || <span className="text-muted-foreground">-</span> },
  { key: "place", header: "Place", cell: (n) => n.place || <span className="text-muted-foreground">-</span> },
  {
    key: "time",
    header: "Sent",
    className: "whitespace-nowrap",
    cell: (n) => <time dateTime={n.createdAt}>{formatDayTime(n.createdAt)}</time>,
  },
];

/** Admin: every notification that was sent, who got it, who it was about and from which place, the way the phone shows them. */
export function AdminNotifications() {
  return (
    <AdminOnly>
      <Notifications />
    </AdminOnly>
  );
}

function Notifications() {
  const { state, reload } = useAccountResource("/admin/notifications?limit=300", parseAdminNotifications);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  return (
    <ResourceView state={state} onRetry={reload}>
      {(rows) => {
        const shown = filterNotifications(rows, query, type);
        return (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1 basis-56 sm:max-w-xs">
                <SearchInput size="sm" label="Search notifications" value={query} onChange={setQuery} placeholder="Search person, place or words" />
              </div>
              <Dropdown
                label="Kind"
                showLabel
                value={type}
                onChange={setType}
                options={[{ value: "", label: "All" }, ...notificationTypes(rows).map((t) => ({ value: t, label: notificationLook(t).label }))]}
              />
              <p className="ml-auto text-xs text-muted-foreground" role="status">
                {shown.length === rows.length ? `${rows.length} notifications` : `${shown.length} of ${rows.length}`}
              </p>
            </div>
            <Table
              caption="Notifications that were sent"
              columns={columns}
              rows={shown}
              rowKey={(n) => n.id}
              resetKey={`${query}|${type}`}
              actions={(n) => (n.recipientEmail ? <CopyButton text={n.recipientEmail} label={`email of ${n.recipientName || "the person"}`} /> : null)}
              empty={
                <>
                  <p className="font-semibold">Nothing here</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{rows.length === 0 ? "No notification has been sent yet." : "No notification matches. Try other words or another kind."}</p>
                </>
              }
            />
            {rows.length >= 300 ? <p className="text-xs text-muted-foreground">Showing the newest 300.</p> : null}
          </div>
        );
      }}
    </ResourceView>
  );
}
