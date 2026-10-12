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
 * Re-captured 2026-10-11 from the same owner console: 22 reviews. Five are
 * new (Shawn Wheldon of Junk Matters, SanJuan, Awaiz Charoliya, Eric
 * Pizzingrilli, Adriana Davis) and Root 86 Coffee's review is GONE from the
 * profile, so its quote came out: /reviews promises every entry is on
 * Google, and the ReviewPull and case-study links point there.
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
export const REVIEW_COUNT = 22;

export type Testimonial = {
  quote: string;
  author: string;
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
  },
  {
    quote:
      "⭐️⭐️⭐️⭐️⭐️ Working with Sem and VDT SITES has been one of the best decisions I’ve made for Junk Matters. Sem didn’t simply build us a website—he took the time to understand our business, our customers, our service areas, and what we needed to grow. Sem completely rebuilt and improved our website, strengthened our local SEO, set up redirects from the previous site, helped with Google Ads conversion tracking, and has been developing a customized business-management system specifically for our operation. He has listened carefully to every request and continued improving the system as our needs have evolved. What stands out most is Sem’s patience, responsiveness, and genuine commitment to getting things right. Whenever I notice an issue or think of a new feature, he takes it seriously, explains the options clearly, and works toward a practical solution. He doesn’t disappear once the initial project is finished—he continues supporting the business and finding ways to make everything work better. It is rare to find someone who combines technical knowledge, creativity, reliability, and such a strong understanding of small-business needs. Sem has gone above and beyond what I originally expected, and his work has given Junk Matters a much stronger and more professional online presence. I would confidently recommend Sem and VDT SITES to any business owner looking for website development, SEO, online advertising support, or a customized business-management system. Sem truly cares about the success of his clients, and it shows in the quality of his work. Thank you, Sem, for everything you have done and continue to do for Junk Matters.",
    author: "Shawn Wheldon",
  },
  {
    quote:
      "I had an excellent experience working with VDTSites on the development of my campaign website. They were responsive, patient, professional, and easy to work with throughout the entire process. What I appreciated most was their ability to listen carefully, understand the tone and purpose I was trying to create, and translate that into a website that feels clear, polished, and true to who I am. They were also quick to make revisions, offered helpful guidance, and made the process feel straightforward from beginning to end. I am very pleased with the final result and would not hesitate to recommend VDTSites to anyone looking for thoughtful, reliable, and high-quality website development.",
    author: "Paul Van Ryssel",
  },
  {
    quote:
      "An absolute website wizard! Sem was incredibly helpful and accommodating with all of our requests, and he was so easy to communicate with. He delivers high-quality work in an impressively short amount of time and pays attention to every little detail that others might easily overlook. We’re extremely happy with the final result and would highly recommend Sem for all your web design needs!",
    author: "Awaiz Charoliya",
  },
  {
    quote:
      "VDT sites was fantastic to work with, they delivered fast, responded very quick for any other problems I had and delivered an amazing website!",
    author: "Adriana Davis",
  },
  {
    quote:
      "Sem and Phillip were super great to work with. They were responsive, kept their word on time frames and created us an excellent website!",
    author: "SanJuan",
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
      "Great guy to work with, very professional and efficient with his work. Would recommend to anyone!",
    author: "Eric Pizzingrilli",
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

/** Look a review up by the name it is signed with. */
export function getTestimonialByAuthor(author: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.author === author);
}

/**
 * Left 5 stars without writing anything. Named on /reviews so the page
 * accounts for every review without inventing words for them.
 */
export const RATING_ONLY = ["Adriane Fugaban", "Kennry Manapat", "Julia Geiger"];

/**
 * Long enough to carry a row of its own. Below this a quote is a one-liner
 * and reads better in the compact grid than stranded in a wide row.
 */
export const LONG_QUOTE_CHARS = 100;
