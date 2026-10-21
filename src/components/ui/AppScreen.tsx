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

type AppScreenProps = {
  variant: ScreenVariant;
  className?: string;
  priority?: boolean;
  size?: "md" | "sm";
};

export function AppScreen({ variant, className = "", priority = false, size = "md" }: AppScreenProps) {
  return (
    <div className={`w-full ${size === "sm" ? "max-w-40" : "max-w-64"} rounded-[2rem] bg-foreground p-[7px] shadow-lg ${className}`}>
      <div className="relative aspect-[390/844] overflow-hidden rounded-[1.5rem]">
        <Image
          src={`/screens/${variant}.webp`}
          alt={`Screenshot: ${screenCatalog[variant]}`}
          width={780}
          height={1688}
          sizes={size === "sm" ? "160px" : "(min-width: 640px) 256px, 70vw"}
          priority={priority}
          className="size-full object-cover"
        />
      </div>
    </div>
  );
}
