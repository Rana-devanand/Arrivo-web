export type NavItem = { label: string; href: string; description?: string };
export type SocialLink = { label: string; href: string };

const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryarrivo.com").replace(/\/$/, "");

const product = [
  { label: "Features", href: "/features", description: "Everything Arrivo can do, with real screens from the app." },
  { label: "How it works", href: "/how-it-works", description: "Six steps from setting off to arriving safely." },
  { label: "Safety", href: "/safety", description: "Honest status, the late-arrival check-in, and what Arrivo never does." },
  { label: "For contacts", href: "/for-contacts", description: "What a trusted contact sees and how to accept an invite." },
] satisfies NavItem[];

const help = [
  { label: "FAQ", href: "/faq", description: "Answers on privacy, safety, battery and your account." },
  { label: "Support", href: "/support", description: "Quick fixes and how to reach us." },
  { label: "Delete your account", href: "/delete-account", description: "The steps in the app and what is removed." },
] satisfies NavItem[];

const company = [
  { label: "About Arrivo", href: "/about", description: "Why we built it and what we believe." },
  { label: "Privacy Policy", href: "/privacy-policy", description: "What we collect, why, and for how long." },
  { label: "Terms of Service", href: "/terms", description: "The rules for using the app and website." },
  { label: "Sitemap", href: "/sitemap", description: "Every page of this website in one place." },
] satisfies NavItem[];

/** The parts of the home page that have their own link. */
const homeSections = [
  { label: "Why Arrivo", href: "/#why", description: "Worrying should not be part of the journey." },
  { label: "Live route map", href: "/#live-route", description: "A sample journey on a free OpenStreetMap map." },
  { label: "How it works", href: "/#how-it-works", description: "Plan, travel, arrive." },
  { label: "Features", href: "/#features", description: "The main things Arrivo does." },
  { label: "Safety", href: "/#safety", description: "A safety net that respects your privacy." },
  { label: "For contacts", href: "/#for-contacts", description: "Peace of mind for the people who care." },
  { label: "More ways to feel looked after", href: "/#tools", description: "Safety timer, watch link and SOS." },
  { label: "Testimonials", href: "/#testimonials", description: "What people will say." },
  { label: "FAQ", href: "/#faq", description: "Frequently asked questions." },
  { label: "Download", href: "/#download", description: "Get Arrivo from the App Store or Google Play." },
] satisfies NavItem[];

export const siteConfig = {
  name: "Arrivo",
  url,
  tagline: "Share the journey. Celebrate the arrival.",
  description:
    "Arrivo is a travel-safety app for Android and iOS. Share a journey and live location with trusted contacts, and let them know the moment you arrive safely.",
  category: "LifestyleApplication",
  copyrightYear: 2026,
  supportEmail: "[PLACEHOLDER: support email]",
  stores: {
    appStore: { label: "Download Arrivo on the App Store", href: "#" },
    playStore: { label: "Get Arrivo on Google Play", href: "#" },
  },
  socials: [
    { label: "Instagram", href: "#" },
    { label: "X (Twitter)", href: "#" },
    { label: "LinkedIn", href: "#" },
  ] satisfies SocialLink[],
  nav: [...product, { label: "FAQ", href: "/faq" }] satisfies NavItem[],
  footer: { product, help, company },
  homeSections,
  downloadHref: "/#download",
} as const;

export const sitemapPaths: readonly string[] = [
  "/",
  ...siteConfig.footer.product.map((item) => item.href),
  ...siteConfig.footer.help.map((item) => item.href),
  ...siteConfig.footer.company.map((item) => item.href),
];
