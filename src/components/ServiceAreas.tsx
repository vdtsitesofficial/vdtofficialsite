/**
 * Sitewide internal-link block for the local landing pages, rendered
 * directly above the cream-page footer so the two read as one muted
 * footer band (its border-t plus the footer's own makes the hairline
 * pair, per the house no-boxes rule).
 *
 * Exists for the internal-link mesh (SEO Plan, Phase 0): before it,
 * /services was the only page linking to the city and SEO landing
 * pages, and nothing linked between them. Anchors are deliberately
 * descriptive ("Nanaimo SEO", "Website design in Victoria") because
 * the anchor text is the ranking signal, so don't shorten them to
 * bare city names.
 *
 * "Website design in Nanaimo" pointed at the HOMEPAGE until 2026-08-17,
 * because /web-design-nanaimo was then a noindex Google Ads landing page
 * and the homepage was the elected organic owner of that term. Both halves
 * of that stopped being true on 2026-08-15, when the noindex was reversed
 * and /web-design-nanaimo became the owner (its own file explains why:
 * the homepage ranked nowhere in the top 100 for it, and its H1 carries no
 * city). The link kept pointing at the homepage anyway, which left the home
 * city with one inbound internal link while every sibling city had ten.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const AREAS = [
  { label: "Website design in Nanaimo", href: "/web-design-nanaimo" },
  {
    label: "Web design across Vancouver Island",
    href: "/web-design-vancouver-island",
  },
  { label: "Website design in Victoria", href: "/web-design-victoria" },
  { label: "Website design in Duncan", href: "/web-design-duncan" },
  { label: "Website design in Parksville", href: "/web-design-parksville" },
  {
    label: "Web design in the Comox Valley",
    href: "/web-design-comox-valley",
  },
  {
    label: "Website design in Campbell River",
    href: "/web-design-campbell-river",
  },
  { label: "Nanaimo SEO", href: "/seo-nanaimo" },
  { label: "Victoria SEO", href: "/seo-victoria" },
  { label: "Logo design in Nanaimo", href: "/logo-design-nanaimo" },
  {
    label: "Non-profit website design",
    href: "/non-profit-website-design-vancouver",
  },
];

export default function ServiceAreas({
  current,
}: {
  /** Href of the page rendering this block; that entry renders as plain text. */
  current?: string;
}) {
  return (
    // mt-auto: this block takes over the footer's push-to-bottom job on
    // short pages; the page's <footer> below it must NOT also carry
    // mt-auto or the leftover space splits between the two margins.
    <nav
      aria-label="Local services"
      className="mt-auto border-t border-black/10 px-6 py-5 md:px-14"
    >
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[12px]">
        <span className="font-semibold uppercase tracking-[0.18em] text-[#0d0d0d]/40">
          Across Vancouver Island
        </span>
        {AREAS.map((a) =>
          a.href === current ? (
            <span key={a.href} className="text-[#0d0d0d]/40">
              {a.label}
            </span>
          ) : (
            <a
              key={a.href}
              href={a.href}
              className="text-[#0d0d0d]/55 underline decoration-black/15 decoration-1 underline-offset-4 transition-colors hover:text-[#0d0d0d] hover:decoration-[#dc2626]"
            >
              {a.label}
            </a>
          ),
        )}
      </div>
    </nav>
  );
}
