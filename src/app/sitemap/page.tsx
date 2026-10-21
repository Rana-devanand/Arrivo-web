import type { Metadata } from "next";
import { siteConfig, type NavItem } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { LinkCard } from "@/components/ui/LinkCard";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = buildMetadata({
  title: "Sitemap",
  description:
    "Every page of the Arrivo website in one place: product, help, company and legal pages, the sections of the home page, and the files that search engines read.",
  path: "/sitemap",
});

const home: NavItem = { label: "Home", href: "/", description: "Share the journey, see how it works and download Arrivo." };

const searchFiles: NavItem[] = [
  { label: "XML sitemap", href: "/sitemap.xml", description: "The list of pages for search engines." },
  { label: "Robots file", href: "/robots.txt", description: "Tells search engines what they may read." },
];

const groups: { id: string; title: string; intro: string; items: readonly NavItem[]; file?: boolean }[] = [
  { id: "main", title: "Main pages", intro: "Start here to see what Arrivo is and how it works.", items: [home, ...siteConfig.footer.product] },
  { id: "help", title: "Help", intro: "Answers, support and account help.", items: siteConfig.footer.help },
  { id: "company", title: "Company and legal", intro: "Who we are and the rules that apply.", items: siteConfig.footer.company },
  { id: "home-sections", title: "On the home page", intro: "Jump straight to a part of the home page.", items: siteConfig.homeSections },
  { id: "search", title: "For search engines", intro: "Files for crawlers. They are not pages to read.", items: searchFiles, file: true },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero
        eyebrow="Sitemap"
        title="Every page, in one place"
        intro="This is a list of everything on the Arrivo website. If you cannot find something, start here."
        tone="muted"
      />
      {groups.map((group, index) => (
        <Section key={group.id} id={group.id} title={group.title} intro={group.intro} align="left" tone={index % 2 === 0 ? "default" : "muted"}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <li key={item.href}>
                <LinkCard item={item} file={group.file} />
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
