/* -----------------------------------------------------------------------
 * Post authors.
 *
 * ── Why a named human and not "VDT Sites"
 * Posts were bylined to the brand. Google's E-E-A-T guidance, and the
 * August 2026 read on how AI answers pick sources, both weight content that
 * demonstrates firsthand experience by an identifiable person with relevant
 * background. A brand byline forfeits that signal for nothing: the articles
 * already contain firsthand client work, they just were not attributed.
 *
 * It also makes the client stories land differently. "We found a noindex tag
 * on a Nanaimo accounting firm's site" reads as a real anecdote when a named
 * person is standing behind it.
 *
 * ── What this feeds
 *   - the visible byline + bio block on each post (blog/[slug]/page.tsx)
 *   - Person author schema inside the BlogPosting JSON-LD
 *   - Open Graph article:author
 *
 * Spelling note: Sem writes his surname "van Duist", lowercase particle,
 * which is the Dutch convention. app/about/page.tsx currently renders
 * "Sem Van Duist". Entity consistency matters for exactly this kind of
 * signal, so those should be made to match. Flagged 2026-08-05.
 * --------------------------------------------------------------------- */

export type Author = {
  /** Display name, used in the byline and as the schema Person name. */
  name: string;
  /** Short credential line under the name. Keep it factual. */
  role: string;
  /**
   * One or two sentences. This is the E-E-A-T payload, so it should say
   * why this person is worth listening to on this subject, not sell.
   */
  bio: string;
  /** Canonical page describing the author. Used as schema Person url. */
  url: string;
};

export const AUTHORS: Record<string, Author> = {
  "Sem van Duist": {
    name: "Sem van Duist",
    role: "Accounting and Computer Science, Vancouver Island University",
    bio: "Sem van Duist runs VDT Sites out of Nanaimo, BC, building websites for small businesses across Vancouver Island. He studies accounting and computer science at VIU, which is a large part of why these articles talk about what a website actually costs and what it actually earns rather than only how it looks. Everything here comes from client work, not research.",
    url: "https://vdtsites.com/about",
  },
};

/** Default byline for new posts. */
export const DEFAULT_AUTHOR = "Sem van Duist";

export function getAuthor(name: string): Author | undefined {
  return AUTHORS[name];
}
