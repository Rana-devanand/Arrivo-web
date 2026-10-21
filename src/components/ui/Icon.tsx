const paths = {
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  shield: "M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z",
  bell: "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Zm4 10a2 2 0 0 0 4 0",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5V11Z",
  apple: "M16.5 3c0 1.7-1.2 3.3-3 3.5-.2-1.7 1.1-3.3 3-3.5ZM19 17.5c-.8 1.8-1.7 3.5-3.2 3.5-1.2 0-1.5-.8-3-.8s-1.9.8-3 .8C7.4 21 5 17.7 5 13.5 5 10.3 7 8.5 9 8.5c1.3 0 2.2.8 3 .8s1.8-.8 3.2-.8c1 0 2.3.5 3.1 1.8-2.5 1.4-2.1 5 .7 6.2Z",
  play: "M6 3.5v17l14-8.5L6 3.5Z",
  pause: "M8 5v14m8-14v14",
  shieldCheck: "M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Zm-3.5 9 2.5 2.5 4.5-5",
  userCheck: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 3 2 2 4-4",
  navigation: "m3 11 18-8-8 18-2-8-8-2Z",
  radar: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3h.01",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "m5 12 5 5 9-10",
  chevron: "m9 6 6 6-6 6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  map: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  camera: "M4 8h3l2-3h6l2 3h3v11H4V8Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-7-4a7 7 0 0 0 14 0m-7 7v4",
  train: "M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2ZM4 11h16M8 21l2-3m6 3-2-3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  flag: "M5 21V4m0 0h12l-2 4 2 4H5",
  trash: "M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  battery: "M3 8h15v8H3V8Zm18 3v2",
  signal: "M5 20v-4m5 4v-8m5 8V8m5 12V4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  share: "M4 12v7h16v-7M12 3v12M8 7l4-4 4 4",
  home: "m3 11 9-8 9 8M5 10v10h14V10",
  heart: "M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-12a3 3 0 1 1 4.5 2.6c-.9.6-1.5 1-1.5 2.4m0 3h.01",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={paths[name]} />
    </svg>
  );
}
