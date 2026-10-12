/**
 * Default share image for every page that has no picture of its own.
 *
 * Next merges `openGraph` shallowly: a page that sets its own openGraph
 * object replaces the layout's whole block, images included. So the
 * layout default alone never reached the service, city or blog pages, and
 * 29 of them shared as a bare text card (crawl, 2026-10-11). Each of those
 * pages spreads this in explicitly.
 *
 * Source art: .images/gbp-posts/final/extra/ad-vdtsites-landscape-1200x628.png
 * (no price in it, so it stays evergreen). Replace the image under a NEW
 * filename, never in place: scrapers and browsers cache by URL.
 */
export const OG_IMAGE = {
  url: "/og-vdtsites.jpg",
  width: 1200,
  height: 628,
  alt: "VDT Sites: websites for local businesses in Nanaimo and across Vancouver Island",
};
