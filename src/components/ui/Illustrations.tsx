const svgProps = {
  viewBox: "0 0 200 140",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-32 w-auto",
} as const;

/** A phone surrounded by waiting, clocks and question marks. */
export function WorryIllustration() {
  return (
    <svg {...svgProps}>
      <rect x="75" y="10" width="50" height="120" rx="11" />
      <path d="M90 20h20" />
      <rect x="84" y="38" width="32" height="18" rx="6" fill="currentColor" fillOpacity=".12" />
      <path d="M84 70h22M84 82h30M84 94h16" />
      <circle cx="34" cy="48" r="17" />
      <path d="M34 39v10l7 4" />
      <path d="M150 34c0-8 6-13 14-13s14 5 14 13c0 11-14 11-14 21" />
      <path d="M164 71h.01" strokeWidth="5" />
      <path d="M22 100c6-4 12-4 18 0s12 4 18 0" strokeDasharray="1 7" />
      <path d="M148 108c6-4 12-4 18 0s12 4 18 0" strokeDasharray="1 7" />
    </svg>
  );
}

/** The same phone, now with a route, a pin and a tick. */
export function CalmIllustration() {
  return (
    <svg {...svgProps}>
      <rect x="75" y="10" width="50" height="120" rx="11" />
      <path d="M90 20h20" />
      <path d="M100 84s-14-10-14-22a14 14 0 0 1 28 0c0 12-14 22-14 22Z" fill="currentColor" fillOpacity=".12" />
      <circle cx="100" cy="62" r="5" />
      <path d="M86 108h28" />
      <path d="M20 112c14 0 22-12 34-12" strokeDasharray="1 7" />
      <path d="M180 112c-14 0-22-12-34-12" strokeDasharray="1 7" />
      <circle cx="160" cy="44" r="20" />
      <path d="m150 44 7 7 13-14" />
      <circle cx="38" cy="50" r="14" />
      <path d="M31 50l5 5 9-10" />
    </svg>
  );
}
