/* -----------------------------------------------------------------------
 * Canonical list of standalone pages. Add a new page HERE and nowhere else.
 *
 * ── Why this file exists
 * The page list was maintained twice, by hand, in two files that look
 * generated: app/sitemap.ts and app/llms.txt/route.ts. Both pull case
 * studies and blog posts from lib/, so both read as though everything
 * self-populates. The standalone pages did not, and the two lists drifted:
 * by 2026-08-10 the sitemap carried all 21 pages while llms.txt still
 * described an 11 page site, missing every page built in the SEO blitz
 * (all four money pages included). Search engines saw the new pages and
 * AI retrieval crawlers did not, for two months of work.
 *
 * One array, two consumers, so a page cannot be in one and absent from the
 * other. Same reasoning as lib/pricing.ts.
 *
 * ── Consumers (keep this list current)
 *   - app/sitemap.ts          every entry, plus work + posts
 *   - app/llms.txt/route.ts   "Main pages" and "Legal" sections
 *
 * ── Deliberately NOT here
 *  - /web-design-nanaimo: the Google Ads landing page, robots noindex on
 *    purpose so the homepage owns "web design Nanaimo" organically. Listing
 *    it in either consumer is a contradictory signal. Read the note at the
 *    top of app/web-design-nanaimo/page.tsx before changing that.
 *  - /admin and /api/*: disallowed in robots.txt.
 *  - /book: a conversion route reached from GBP and outreach links, not a
 *    page anyone should find in search.
 *  - /work/<slug> and /blog/<slug>: those come from lib/caseStudies and
 *    lib/blog, which is exactly the pattern this file extends.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 * --------------------------------------------------------------------- */

import {
  CURRENCY,
  PRICE_BRAND_FROM,
  PRICE_BUILD_FROM,
  PRICE_MONTHLY,
} from "./pricing";

export type SitePage = {
  /**
   * Path from the site root, no trailing slash. The home page is "", which
   * makes `${SITE_URL}${path}` produce the bare origin.
   */
  path: string;
  /**
   * Link text in the llms.txt "Main pages" list. Written as a human phrase
   * rather than a slug, because a retrieval crawler reads this as the page
   * title.
   */
  label: string;
  /**
   * One sentence saying what is on the page, for llms.txt. Keep it close to
   * the page's own meta description so the two never contradict, but this
   * one has no SERP length limit to respect.
   */
  description: string;
  /** sitemap.xml changefreq. */
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** sitemap.xml priority. */
  priority: number;
  /**
   * "main" pages are the site proper. "legal" pages are indexable and
   * footer linked, but they get their own llms.txt section and a low
   * sitemap priority: nobody should land on them first.
   */
  section: "main" | "legal";
};

export const SITE_PAGES: SitePage[] = [
  {
    path: "",
    label: "Home",
    description:
      "what VDT Sites does, selected work, reviews and the enquiry form.",
    changeFrequency: "monthly",
    priority: 1,
    section: "main",
  },
  {
    path: "/services",
    label: "Services and pricing",
    description: "the full service list and how projects are quoted.",
    changeFrequency: "monthly",
    priority: 0.9,
    section: "main",
  },
  {
    path: "/pricing",
    label: "Website design pricing and packages",
    description: `every price in public: custom builds from ${PRICE_BUILD_FROM} ${CURRENCY}, the website plus brand kit from ${PRICE_BRAND_FROM}, and ${PRICE_MONTHLY} a month for hosting, domain and support. No quote form required to see a number.`,
    changeFrequency: "monthly",
    priority: 0.9,
    section: "main",
  },
  {
    path: "/work",
    label: "Work",
    description: "case studies of real client builds.",
    changeFrequency: "monthly",
    priority: 0.9,
    section: "main",
  },
  {
    path: "/reviews",
    label: "Reviews",
    description: "client reviews.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/about",
    label: "About",
    description: "who runs the studio and how projects are run.",
    changeFrequency: "yearly",
    priority: 0.7,
    section: "main",
  },
  {
    path: "/contact",
    label: "Contact",
    description: "phone, email and the enquiry form.",
    changeFrequency: "monthly",
    priority: 0.9,
    section: "main",
  },
  {
    path: "/blog",
    label: "Blog",
    description:
      "articles on small business websites, cost and local search.",
    changeFrequency: "weekly",
    priority: 0.9,
    section: "main",
  },

  // Service pages. Each targets terms nothing else on the site competes for.
  {
    path: "/website-maintenance",
    label: "Website maintenance",
    description: `the flat ${PRICE_MONTHLY} ${CURRENCY} a month care plan: hosting, domain, SSL, backups, monitoring and small updates, with no contract and no hourly meter.`,
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/website-redesign",
    label: "Website redesign",
    description: `rebuilding an existing site without losing its Google standing: audit what already ranks, keep or redirect every URL, then rebuild fast and modern. Fixed quote from ${PRICE_BUILD_FROM} ${CURRENCY}.`,
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/affordable-web-design",
    label: "Affordable web design",
    description: `custom-built sites from ${PRICE_BUILD_FROM} ${CURRENCY} rather than templates, with hosting and care at ${PRICE_MONTHLY} a month. Affordable by structure, not by cutting corners.`,
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/logo-design-nanaimo",
    label: "Logo design in Nanaimo",
    description:
      "custom logo as part of the Full Brand Kit, which includes business card design, an invoice template, brand typefaces and the website itself.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/non-profit-website-design-vancouver",
    label: "Non-profit website design in Vancouver",
    description:
      "websites for Vancouver non-profits and registered charities, including donations, volunteer-friendly editing and the website requirements behind a Google Ad Grants application.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },

  // Local SEO pages.
  {
    path: "/seo-nanaimo",
    label: "Local SEO in Nanaimo",
    description:
      "one-time local SEO setup at a fixed price, no monthly retainer. Google Business Profile, on-page fixes, listings and measurement.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/seo-victoria",
    label: "SEO services in Victoria, BC",
    description:
      "getting Victoria businesses found on Google by people searching for what they do. One-time setup, fixed price, no monthly retainer.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },

  // City and region pages. The Vancouver Island hub links all of them.
  {
    path: "/web-design-vancouver-island",
    label: "Web design across Vancouver Island",
    description:
      "the island-wide hub: what VDT Sites covers from Victoria to Campbell River, one studio and one fixed price, linking through to every city page.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/web-design-victoria",
    label: "Website design in Victoria, BC",
    description:
      "websites for Victoria and Capital Regional District businesses, built up-island in Nanaimo (90 minutes away, no ferry) without downtown agency overhead.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/web-design-parksville",
    label: "Website design in Parksville, BC",
    description:
      "websites for Parksville and Qualicum Beach businesses, built 20 minutes away in Nanaimo. Morky Auto Imports is a Parksville client.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/web-design-duncan",
    label: "Website design in Duncan and the Cowichan Valley",
    description:
      "websites for Duncan, the Cowichan Valley, Ladysmith and Chemainus businesses, built 45 minutes away in Nanaimo.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/web-design-comox-valley",
    label: "Web design in the Comox Valley",
    description:
      "websites for Courtenay, Comox and Cumberland businesses. Fixed price, hosting included, built on-island.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },
  {
    path: "/web-design-campbell-river",
    label: "Website design in Campbell River, BC",
    description:
      "websites for Campbell River businesses: charters, trades, tourism and shops. Fixed price, hosting included, built on-island.",
    changeFrequency: "monthly",
    priority: 0.8,
    section: "main",
  },

  // Legal. Indexable and footer linked, low priority on purpose.
  {
    path: "/privacy-policy",
    label: "Privacy policy",
    description: "how enquiry data and site analytics are handled.",
    changeFrequency: "yearly",
    priority: 0.3,
    section: "legal",
  },
  {
    path: "/cookie-policy",
    label: "Cookie policy",
    description: "what the site stores in the browser, and why.",
    changeFrequency: "yearly",
    priority: 0.3,
    section: "legal",
  },
  {
    path: "/terms-of-service",
    label: "Terms of service",
    description: "the terms the studio works under.",
    changeFrequency: "yearly",
    priority: 0.3,
    section: "legal",
  },
];

/** Pages in the site proper, in the order they should be listed. */
export const MAIN_PAGES = SITE_PAGES.filter((p) => p.section === "main");

/** Privacy, cookie and terms. */
export const LEGAL_PAGES = SITE_PAGES.filter((p) => p.section === "legal");
