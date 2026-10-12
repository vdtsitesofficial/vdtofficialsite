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
 * /web-design-nanaimo used to be excluded here, because it was a noindex
 * ads landing page and the homepage was supposed to own "web design
 * Nanaimo" organically. As of 2026-08-15 it is the indexable Nanaimo city
 * page and comes through lib/pages.ts like every other one. See the note at
 * the top of app/web-design-nanaimo/page.tsx.
 *
 * lastModified is set only where it is TRUE (blog posts carry updatedAt).
 * Pages and case studies used to stamp `new Date()`, so 37 of 43 entries
 * claimed to have changed at every build, which teaches Google to ignore
 * the field for the whole sitemap (audit 2026-10-11). No date beats a
 * wrong one; add one back only if it comes from a real edit timestamp.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITE_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const work = CASE_STUDIES.map((c) => ({
    url: `${SITE_URL}/work/${c.slug}`,
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
