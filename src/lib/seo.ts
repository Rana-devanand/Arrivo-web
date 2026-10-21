import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: PageSeo): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
