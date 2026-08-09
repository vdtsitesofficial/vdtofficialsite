/* -----------------------------------------------------------------------
 * Canonical prices. Change them HERE and nowhere else.
 *
 * ── Why this file exists
 * Before it, "$899" was written out by hand in six places: three consts in
 * app/services/page.tsx and five string literals inside blog post copy in
 * lib/blog.ts. Changing the price meant remembering all of them, and the
 * blog post is exactly the one you would forget, because it reads as prose
 * rather than as configuration. A public post quoting a price you no longer
 * charge is worse than having no price on it at all.
 *
 * ── Consumers (keep this list current)
 *   - app/services/page.tsx          pricing cards, metadata, body copy
 *   - lib/blog.ts                    websiteCostPost body + FAQ answers
 *   - app/pricing/page.tsx           packages, metadata, schema offers
 *   - app/website-maintenance/page.tsx   fee in copy, metadata, schema
 *   - app/website-redesign/page.tsx      from-price in copy + FAQ
 *   - app/affordable-web-design/page.tsx prices in copy, metadata, schema
 *
 * ── When you change a price
 * Every number above updates automatically, so the site can never quote two
 * different figures. What does NOT update is prose that describes a number
 * qualitatively. Search the repo for phrases like "under a thousand", "a few
 * hundred", "less than X" and re-read them, then bump `updatedAt` on
 * websiteCostPost so the post does not claim to be current when its
 * surrounding argument has moved.
 *
 * ── Currency
 * Stated as CAD on purpose. The cost post targets Canadian queries
 * ("how much does a website cost in canada", KD 8) and an unqualified "$"
 * is ambiguous to both a reader and to an AI summarising the page.
 * --------------------------------------------------------------------- */

/** Entry price for a custom build, one time. */
export const PRICE_BUILD_FROM = "$899";

/** Build plus the brand kit (logo, colours, type, print-ready assets). */
export const PRICE_BRAND_FROM = "$1299";

/** Flat monthly: hosting, domain, SSL, backups, monitoring, support. */
export const PRICE_MONTHLY = "$40";

/** Currency label. Used where the figure needs to be unambiguous. */
export const CURRENCY = "CAD";

/**
 * Last time the prices above were reviewed against what is actually being
 * quoted. If this is more than a year stale, check before trusting the post.
 */
export const PRICES_REVIEWED = "2026-08-05";
