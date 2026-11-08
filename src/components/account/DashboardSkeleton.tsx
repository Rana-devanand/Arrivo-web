import { Skeleton } from "@/components/ui/Skeleton";
import { AccountFrame } from "./AccountFrame";
import { BodyLoader } from "./BodyLoader";

/** The dashboard's frame in grey blocks and the loader in the middle of the body, shown while we find out whether someone is signed in. */
export function DashboardSkeleton() {
  return (
    <AccountFrame
      mobileBar={
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="size-11" />
        </div>
      }
      menu={
        <div className="grid grid-cols-1 gap-3">
          <Skeleton className="h-7 w-28" />
          <div className="grid gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      }
      user={<Skeleton className="h-14 w-full" />}
      header={
        <div className="border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
            <Skeleton className="size-10 shrink-0" />
            <div className="grid gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      }
    >
      <h1 className="sr-only">Your Arrivo account</h1>
      <BodyLoader />
    </AccountFrame>
  );
}
