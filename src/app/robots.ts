import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog";

/**
 * Generates /robots.txt — allows all crawlers and points them at the
 * sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin area and API endpoints out of search indexes.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
