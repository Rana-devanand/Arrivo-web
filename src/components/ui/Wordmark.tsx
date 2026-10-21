import { siteConfig } from "@/config/site";

/** The brand name set in the Anton brand font. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-brand font-normal tracking-wide ${className}`}>{siteConfig.name}</span>;
}
