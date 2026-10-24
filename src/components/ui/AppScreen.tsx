import Image from "next/image";

export const screenCatalog = {
  home: "Arrivo home screen with the Start a journey card, Timer, Watch link, Invite and SOS shortcuts",
  setup: "Trip details screen: starting point, destination, travel mode and arrival time",
  search: "Place search sheet with current location, map pin and saved places",
  live: "Active journey screen showing the route on the map, arrival time and who is following",
  arrived: "You arrived safely screen with trip time, distance and people notified",
  overdue: "Are you okay check-in screen with I'm fine and I need help buttons",
  contacts: "Trusted contacts list with accepted, waiting and declined people",
  invitation: "Invitation screen asking someone to become a trusted contact",
  watch: "Contact view following a traveller on the map with a Call button",
  history: "Journey history with one trip expanded to show duration, distance and who it was shared with",
  timer: "Safety timer sheet to check in before time runs out",
  privacy: "Privacy and data screen explaining location, retention and deletion",
  profile: "Profile and settings screen",
  notifications: "Notification settings with journey reminders and quiet hours",
  faq: "Help and FAQ screen",
  signin: "Welcome to Arrivo sign-in screen with Google and Apple",
  splash: "Arrivo splash screen",
  "onboarding-1": "Onboarding page one: share your journey",
  "onboarding-2": "Onboarding page two: contacts follow along",
  "onboarding-3": "Onboarding page three: arrive safely",
} as const;

export type ScreenVariant = keyof typeof screenCatalog;

const widths = { lg: "w-72", md: "w-60", sm: "w-40" } as const;

type AppScreenProps = {
  variant: ScreenVariant;
  className?: string;
  priority?: boolean;
  size?: "lg" | "md" | "sm";
};

/**
 * A screenshot inside the phone frame (public/phone-frame.webp, 1152 x 2048, transparent screen). The frame is
 * drawn as a 9-slice border so its corners and bezel keep their shape while the middle stretches to the
 * screenshot's own proportions. Widths are in container units so everything scales with the phone.
 */
export function AppScreen({ variant, className = "", priority = false, size = "md" }: AppScreenProps) {
  return (
    <div className={`${widths[size]} max-w-full drop-shadow-xl ${className}`}>
      <div className="relative aspect-[1/2.0645] [container-type:inline-size]">
        <div className="absolute inset-x-[4.2cqw] inset-y-[4.1cqw] overflow-hidden rounded-[7cqw]">
          <Image
            src={`/screens/${variant}.webp`}
            alt={`Screenshot: ${screenCatalog[variant]}`}
            width={780}
            height={1688}
            sizes={size === "sm" ? "160px" : size === "lg" ? "(min-width: 640px) 288px, 75vw" : "(min-width: 640px) 240px, 70vw"}
            priority={priority}
            className="size-full object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-solid border-transparent"
          style={{ borderWidth: "11.3cqw", borderImage: "url(/phone-frame.webp) 130 / 11.3cqw stretch" }}
        />
      </div>
    </div>
  );
}
