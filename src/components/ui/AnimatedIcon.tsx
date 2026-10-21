import type { ReactNode } from "react";
import { lordiconKeys } from "@/config/lordicons";
import { Icon, type IconName } from "./Icon";
import { LordIcon } from "./LordIcon";

/** Each drawing is split into parts. A part with an `ai-*` class gets its animation from globals.css. */
const drawings: Partial<Record<IconName, ReactNode>> = {
  bell: (
    <>
      <g className="ai-swing">
        <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" />
      </g>
      <path className="ai-clapper" d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  pin: (
    <>
      <g className="ai-hop">
        <path d="M12 19s7-5.2 7-10a7 7 0 1 0-14 0c0 4.8 7 10 7 10Z" />
        <circle cx="12" cy="9" r="2.5" />
      </g>
      <ellipse className="ai-ping" cx="12" cy="21.5" rx="5" ry="1.3" />
    </>
  ),
  navigation: <path className="ai-nudge" d="m3 11 18-8-8 18-2-8-8-2Z" />,
  route: (
    <>
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path className="ai-dash" d="M8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
      <circle className="ai-beat" cx="12" cy="11" r="1.6" fill="currentColor" />
    </>
  ),
  users: (
    <>
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <g className="ai-wave">
        <path d="M22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" />
      </g>
    </>
  ),
  userCheck: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path className="ai-draw" pathLength="1" d="m16 11 2 2 4-4" />
    </>
  ),
  shieldCheck: (
    <>
      <path className="ai-pulse" d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
      <path className="ai-draw" pathLength="1" d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  shield: (
    <>
      <path className="ai-pulse" d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
      <path className="ai-draw" pathLength="1" d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path className="ai-hand-fast" d="M12 12V6" />
      <path className="ai-hand-slow" d="m12 12 3.5 2" />
    </>
  ),
  train: (
    <g className="ai-rumble">
      <path d="M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2ZM4 11h16" />
      <path d="M8 21l2-3m6 3-2-3" />
    </g>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" />
      <circle className="ai-lens" cx="12" cy="13" r="4" />
    </>
  ),
  signal: (
    <>
      <path className="ai-grow" style={{ animationDelay: "0s" }} d="M5 20v-4" />
      <path className="ai-grow" style={{ animationDelay: "0.12s" }} d="M10 20v-8" />
      <path className="ai-grow" style={{ animationDelay: "0.24s" }} d="M15 20V8" />
      <path className="ai-grow" style={{ animationDelay: "0.36s" }} d="M20 20V4" />
    </>
  ),
  lock: (
    <>
      <path d="M5 11h14v10H5V11Z" />
      <g className="ai-lift">
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      </g>
    </>
  ),
  bolt: <path className="ai-flicker" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  share: (
    <>
      <path d="M4 12v7h16v-7" />
      <g className="ai-rise">
        <path d="M12 3v12M8 7l4-4 4 4" />
      </g>
    </>
  ),
  heart: <path className="ai-beat" d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" />,
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <g className="ai-qmark">
        <path d="M9 10a3 3 0 1 1 4.5 2.6c-.9.6-1.5 1-1.5 2.4m0 3h.01" />
      </g>
    </>
  ),
  check: <path className="ai-draw" pathLength="1" d="m5 12 5 5 9-10" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle className="ai-pupil" cx="12" cy="12" r="3" />
    </>
  ),
  battery: (
    <>
      <path d="M3 8h15v8H3V8Zm18 3v2" />
      <rect className="ai-charge" x="5" y="10" width="11" height="4" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  phone: (
    <g className="ai-ringing">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </g>
  ),
};

type AnimatedIconProps = {
  name: IconName;
  className?: string;
  /** Plays all the time. By default it plays while the nearest `.group` ancestor is hovered or focused. */
  loop?: boolean;
};

export function AnimatedIcon({ name, className = "size-5", loop = false }: AnimatedIconProps) {
  const drawing = drawings[name];
  const cssIcon = drawing ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-loop={loop}
      className={`ai shrink-0 ${className}`}
    >
      {drawing}
    </svg>
  ) : (
    <Icon name={name} className={className} />
  );
  const key = lordiconKeys[name];
  if (!key) return cssIcon;
  return (
    <LordIcon iconKey={key} loop={loop} className={className}>
      {cssIcon}
    </LordIcon>
  );
}
