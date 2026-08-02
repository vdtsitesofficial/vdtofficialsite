/**
 * Every real 5-star Google review VDT Sites has on file. Sources, because
 * they were scattered across three places before this file existed:
 *   - the saved review cards in `C:\Websites\VDT\.images\..ADVERT\Reviews`
 *     (Yoko Ho, Enrico Del Mundo, Jay Cool, Peter S.)
 *   - the Root 86 Coffee review left 2026-07-29
 *   - the home page carousel in `public/lab/testimonials.js`, which was the
 *     only place carrying Brady Kozubal and Heinz R
 *
 * ⚠️ The home page counter says 8 reviews on the Google Business Profile
 * and only 7 are transcribed here. One has never been captured. When it is,
 * save the card to the Reviews folder and add it below.
 *
 * ⚠️ `public/lab/testimonials.js` renders Enrico's review with a single
 * trailing "!" where the saved card clearly shows "!!". The card is the
 * source of truth and this file matches it. Fix the lab copy (and its
 * mirror in `C:\Websites\VDT\laptop-zoom-v2`) when that file is next
 * touched, rather than "correcting" this one to match.
 *
 * Do NOT paraphrase, tidy or invent entries here. These are attributed to
 * real people and have to match what they actually wrote, punctuation,
 * smileys and stray emoji included.
 *
 * Deliberately no `aggregateRating` or `Review` JSON-LD wherever these
 * render. Google disallows self-serving review markup for Organization /
 * LocalBusiness (reviews about you, hosted by you): it earns no star rich
 * result and is a guidelines violation. The stars come from the Google
 * Business Profile instead, which the home page ties to this site via
 * `sameAs` + the CID URL below.
 *
 * Lives in lib/ rather than in a page because /about and /reviews both
 * render these and they must never drift apart.
 */

/** Stable CID form. Never a `share.google/...` short link - those rot. */
export const GOOGLE_REVIEWS_URL =
  "https://maps.google.com/?cid=10419426377693999665";

export type Testimonial = {
  quote: string;
  author: string;
};

/**
 * Ordered strongest-first. /about shows a subset from the top of this list
 * and links through; /reviews shows all of them.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Super happy with my experience! Super friendly, knowledgeable, and paid attention to all wants and needs! The whole process felt smooth and stress-free. Highly recommend to anyone looking for quality work and great service :)",
    author: "Yoko Ho",
  },
  {
    quote:
      "Great service, top level skills and quick personal responses to requests. Highly recommended for your business website and online advertisement.",
    author: "Root 86 Coffee",
  },
  {
    quote:
      "We're really happy with the service & product they made us. The team was easy to work with, responsive, and delivered exactly what we wanted. Highly recommend!",
    author: "Jay Cool",
  },
  {
    quote:
      "Really happy with the overall experience. Everything was smooth, communication was great, and the final result looked very professional.",
    author: "Peter S.",
  },
  {
    quote: "Super professional support, and very customer friendly website.",
    author: "Brady Kozubal",
  },
  {
    quote:
      "Definitely recommend these two amazing guys. Great delivery time and performance!!",
    author: "Enrico Del Mundo",
  },
  {
    quote: "Excellent service and highly recommended ⭐⭐⭐⭐⭐",
    author: "Heinz R",
  },
];
