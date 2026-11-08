import { Skeleton } from "@/components/ui/Skeleton";
import { AccountFrame } from "./AccountFrame";

/** The dashboard's shape in grey blocks, shown while we find out whether someone is signed in. */
export function DashboardSkeleton() {
  return (
    <AccountFrame
      topBar={
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
    >
      <div aria-busy="true">
        <h1 className="sr-only">Your Arrivo account</h1>
        <p role="status" className="sr-only">
          Loading your account
        </p>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-10 w-56" />
        <Skeleton className="mt-3 h-5 w-72 max-w-full" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-44 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    </AccountFrame>
  );
}
