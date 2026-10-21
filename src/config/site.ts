export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string };

const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://arrivo.example").replace(/\/$/, "");

const product = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
  { label: "For contacts", href: "/for-contacts" },
] satisfies NavItem[];

const help = [
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
  { label: "Delete your account", href: "/delete-account" },
] satisfies NavItem[];

const company = [
  { label: "About Arrivo", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
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
  downloadHref: "/#download",
} as const;

export const sitemapPaths: readonly string[] = [
  "/",
  ...siteConfig.footer.product.map((item) => item.href),
  ...siteConfig.footer.help.map((item) => item.href),
  ...siteConfig.footer.company.map((item) => item.href),
];
