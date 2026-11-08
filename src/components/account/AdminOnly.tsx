"use client";

import type { ReactNode } from "react";
import { IconTile } from "@/components/ui/IconTile";
import { Panel } from "@/components/ui/Panel";
import { useAccount } from "./AccountProvider";
import { BodyLoader } from "./BodyLoader";

/**
 * Shows its content to admins only. This is a courtesy, not security: the server checks the role on every admin request and
 * answers anyone else with "forbidden", so nothing here depends on this check.
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin, rolePending } = useAccount();
  if (rolePending) return <BodyLoader />;
  if (!isAdmin) {
    return (
      <Panel role="alert" className="flex items-center gap-3">
        <IconTile name="lock" />
        <p>Only administrators can open this.</p>
      </Panel>
    );
  }
  return <>{children}</>;
}
