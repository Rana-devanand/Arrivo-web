/** A grey block that pulses while something loads. Hidden from screen readers; the loading region says so in words. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-secondary motion-reduce:animate-none ${className}`} />;
}
