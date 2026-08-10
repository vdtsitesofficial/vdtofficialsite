import type { MetadataRoute } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { SITE_PAGES } from "@/lib/pages";

/**
 * Generates /sitemap.xml — lists every indexable URL so search engines
 * discover the home page, every standalone page, the blog index, every
 * post, and the /work case studies.
 *
 * The standalone pages come from lib/pages.ts, which /llms.txt reads too.
 * They used to be a hand-written array here and a second hand-written array
 * there, and the two drifted for two months. Add a page in lib/pages.ts and
 * both files pick it up.
 *
 * Deliberately NOT listed: /web-design-nanaimo. It is the Google Ads
 * landing page and carries robots noindex on purpose, so that the homepage
 * (not the ad page) owns "web design Nanaimo" organically. Listing a
 * noindex URL here is a contradictory signal. See the note at the top of
 * app/web-design-nanaimo/page.tsx before changing this.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITE_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const work = CASE_STUDIES.map((c) => ({
    url: `${SITE_URL}/work/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...pages, ...work, ...posts];
}
