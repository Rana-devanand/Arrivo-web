/** The Arrivo mark: a house in a circle, drawn once and not animated (the animated one is `AnimatedLogo`). */
export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-[55%]">
        <path d="M4 11l8-7 8 7" />
        <path d="M6 9.5V20h12V9.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    </span>
  );
}
