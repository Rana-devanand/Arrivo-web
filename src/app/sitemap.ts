import type { MetadataRoute } from "next";
import { siteConfig, sitemapPaths } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
