/**
 * Homepage FAQ text, in one place.
 *
 * Consumed by the FAQPage structured data on the homepage and by /llms.txt.
 * The visible <details> list in app/page.tsx is still hand-written JSX (it
 * carries <strong> emphasis this plain text can't), so when you change an
 * answer, change it in both places. Google's guidance is that FAQ markup
 * must match content the reader can actually see.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

export type Faq = { q: string; a: string };

export const HOME_FAQS: Faq[] = [
  {
    q: "How much does a small business website cost?",
    a: "Every project is quoted individually based on how many pages and features you need. You get a fixed price up front, so there are no hourly surprises. Most small business sites include design, build, hosting setup and launch. Get in touch and we'll put a quote together for free.",
  },
  {
    q: "Do you work with businesses outside Nanaimo?",
    a: "Yes. We work with businesses right across Vancouver Island (Parksville, Qualicum Beach, Ladysmith, Duncan, Courtenay, Campbell River and Victoria), as well as the Vancouver area. Everything can be handled remotely by phone, email and video call, so distance is never an issue.",
  },
  {
    q: "Can I edit my own website after it's built?",
    a: "Yes. We build in an editor that lets you change text and images directly on your live page: click the text, type the new version, save. No technical knowledge and no separate dashboard to learn. Bigger changes we handle for you.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Once we have your content, most sites are live in three to four days. The main variable is how quickly we get your text, photos and feedback, not the build. Projects that run longer are almost always waiting on something from the business rather than something from us.",
  },
  {
    q: "What does the monthly fee cover?",
    a: "Hosting, your domain name, SSL security, backups, monitoring and ongoing support, all in one flat monthly fee. No separate hosting bill, no renewal surprises, and no chasing three different companies when something breaks.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. Once your project is paid in full the site is yours, and we'll hand over a full export of the code on request. We'd rather keep you because the work is good than because you're locked in.",
  },
];
