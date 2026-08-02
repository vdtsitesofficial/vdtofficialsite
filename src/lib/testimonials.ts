/**
 * Every review on the VDT Sites Google Business Profile, captured 2026-08-02
 * from the Business Profile Manager (business.google.com/u/0/reviews, the
 * owner view), which paginates "1-10 of 18" then "11-18 of 18". That is the
 * authoritative source: the public Maps view only exposes three reviews to a
 * signed-out visitor, and the two long ones (Paul Van Ryssel, Sherri K) are
 * truncated with a "More" link everywhere except the owner console.
 *
 * 18 reviews, all 5 stars. 15 wrote something; 3 left a rating with no text
 * (see RATING_ONLY below) and therefore cannot be quoted.
 *
 * Do NOT paraphrase, tidy, shorten or invent entries. These are attributed
 * to real people and have to match what they actually wrote: punctuation,
 * smileys, curly apostrophes and stray star emoji included. When a new
 * review lands, re-read the owner console rather than a screenshot.
 *
 * This is the ONLY place review text lives. The home page carousel gets it
 * injected via `initVdtTestimonials({ testimonials })` from page.tsx rather
 * than keeping its own copy - the array still in public/lab/testimonials.js
 * is a fallback for when the module is used standalone, and having it
 * diverge (6 of 18 reviews, and Enrico misquoted with one "!") is exactly
 * what this file exists to prevent.
 *
 * Deliberately no `aggregateRating` or `Review` JSON-LD wherever these
 * render. Google disallows self-serving review markup for Organization /
 * LocalBusiness (reviews about you, hosted by you): it earns no star rich
 * result and is a guidelines violation. The stars come from the Business
 * Profile instead, which the home page ties to this site via `sameAs` +
 * the CID URL below.
 */

/** Stable CID form. Never a `share.google/...` short link - those rot. */
export const GOOGLE_REVIEWS_URL =
  "https://maps.google.com/?cid=10419426377693999665";

/** Total reviews on the profile, written and rating-only combined. */
export const REVIEW_COUNT = 18;

export type Testimonial = {
  quote: string;
  author: string;
  /** Case-study slug, when the reviewer is a client with a /work page. */
  slug?: string;
  /**
   * Self-hosted avatar crop for the home page carousel. Optional: the
   * carousel falls back to a red letter-initial tile, so a new review does
   * not need artwork before it can ship.
   */
  avatar?: string;
};

/**
 * Ordered strongest-first rather than by date. /about shows a couple from
 * the top and links through; /reviews shows all of them, splitting long
 * from short by character count so the short ones do not sit in a row
 * layout built for paragraphs.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Super happy with my experience! Super friendly, knowledgeable, and paid attention to all wants and needs! The whole process felt smooth and stress-free. Highly recommend to anyone looking for quality work and great service :)",
    author: "Yoko Ho",
    avatar: "/avatars/yoko.svg",
  },
  {
    quote:
      "I had the pleasure of working with Sem on my website recently. I had mentioned how much I was paying on two previous website builder companies. Not only did he help me reduce my yearly costs, but he completely upgraded my website. It's not just a website anymore. It's an experience for my potential clients. Finally I have a place where people can get a feel for what I do. That's not an easy thing to portray as a Medical Intuitive and Hypnotherapist but Sem nailed it. Finally knowing I have a company I can talk to about any issues and additions to the site in the future is invaluable. I like talking to real people again!",
    author: "Sherri K",
    slug: "sherri-kozubal",
  },
  {
    quote:
      "I had an excellent experience working with VDTSites on the development of my campaign website. They were responsive, patient, professional, and easy to work with throughout the entire process. What I appreciated most was their ability to listen carefully, understand the tone and purpose I was trying to create, and translate that into a website that feels clear, polished, and true to who I am. They were also quick to make revisions, offered helpful guidance, and made the process feel straightforward from beginning to end. I am very pleased with the final result and would not hesitate to recommend VDTSites to anyone looking for thoughtful, reliable, and high-quality website development.",
    author: "Paul Van Ryssel",
    slug: "paul-van-ryssel",
  },
  {
    quote:
      "Great service, top level skills and quick personal responses to requests. Highly recommended for your business website and online advertisement.",
    author: "Root 86 Coffee",
  },
  {
    quote:
      "Really happy with the overall experience. Everything was smooth, communication was great, and the final result looked very professional.",
    author: "Peter S.",
    avatar: "/avatars/peter.svg",
  },
  {
    quote:
      "We're really happy with the service & product they made us. The team was easy to work with, responsive, and delivered exactly what we wanted. Highly recommend!",
    author: "Jay Cool",
    avatar: "/avatars/jay.svg",
  },
  {
    quote:
      "amazing work, beautiful designs and very helpful and reliable work!",
    author: "Christian Gabriel David",
  },
  {
    quote: "Super professional support, and very customer friendly website.",
    author: "Brady Kozubal",
    avatar: "/avatars/brady.svg",
  },
  {
    quote:
      "Definitely recommend these two amazing guys. Great delivery time and performance!!",
    author: "Enrico Del Mundo",
    avatar: "/avatars/enrico.svg",
  },
  {
    quote: "Exceeded my expectations! These guys are creative and geniuses!",
    author: "Ira Tagama",
  },
  {
    quote: "They do amazing work, highly recommended!",
    author: "Carson Roziere",
  },
  {
    quote: "Excellent service and highly recommended ⭐️⭐️⭐️⭐️⭐️",
    author: "Heinz R",
    avatar: "/avatars/heinz.svg",
  },
  {
    quote: "Quality service! Would recommend.",
    author: "Nikita T",
  },
  {
    quote: "they make really good websites!!!",
    author: "Angela",
  },
  {
    quote: "Good website maker",
    author: "Diem",
  },
];

/**
 * Left 5 stars without writing anything. Named on /reviews so the page
 * accounts for all 18 without inventing words for them.
 */
export const RATING_ONLY = ["Adriane Fugaban", "Kennry Manapat", "Julia Geiger"];

/**
 * Long enough to carry a row of its own. Below this a quote is a one-liner
 * and reads better in the compact grid than stranded in a wide row.
 */
export const LONG_QUOTE_CHARS = 100;
