import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // A watch link is private to whoever was sent it, and the account dashboard to whoever signs in: search engines must never list either.
    rules: { userAgent: "*", allow: "/", disallow: ["/watch", "/account"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
