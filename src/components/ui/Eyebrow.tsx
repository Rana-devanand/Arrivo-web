import type { ReactNode } from "react";

/** Small mono label with two dots before it, used above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-highlight before:mr-6 before:size-2 before:rounded-full before:bg-highlight before:shadow-[14px_0_0_-1px_var(--spot)] before:content-['']">
      {children}
    </span>
  );
}
