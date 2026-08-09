import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import WorkCarousel from "@/components/WorkCarousel";
import { WORK_ITEMS } from "@/lib/workItems";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /web-design-duncan
 *
 * Duncan + Cowichan Valley city page (SEO Plan Phase 2, 2026-08-10).
 * Tiny cluster, effectively zero competition (Semrush ca, Aug 2026):
 *   web design duncan bc     20/mo  KD 0
 *   web design duncan        ~10/mo KD 0
 *   web design cowichan      ~10/mo KD 0
 * Also deliberately owns Ladysmith and Chemainus, which sit between us
 * and Duncan and have no page of their own (the homepage footer names
 * Ladysmith; this is where that mention finally points).
 *
 * ── The angle: Duncan is 45 minutes south on the Trans-Canada, closer
 * to us than Victoria, and the Cowichan Valley economy is exactly our
 * client profile: farms, wineries, artisan food, trades, practitioners.
 * No Cowichan client yet, so the same honesty constraint as Victoria
 * and Campbell River applies: real geography, real work, no implied
 * local client, and do not volunteer the gap unprompted.
 *
 * ── Tone: no swipes at other agencies (see Copy & Messaging, 2026-08-08).
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-duncan`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Website Design in Duncan & the Cowichan Valley",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "Website design for Duncan, Cowichan Valley, Ladysmith and Chemainus businesses. Fixed price, hosting included, built 45 minutes away. Call 250-616-2087.",
  keywords: [
    "web design duncan bc",
    "website design duncan bc",
    "duncan web design",
    "web design cowichan valley",
    "web design ladysmith",
  ],
  alternates: { canonical: "/web-design-duncan" },
  openGraph: {
    title: "Website Design in Duncan & the Cowichan Valley | VDT Sites",
    description:
      "Website design for Duncan, Cowichan Valley, Ladysmith and Chemainus businesses. Fixed price, hosting included, built 45 minutes up the highway in Nanaimo.",
    url: "/web-design-duncan",
  },
  twitter: {
    title: "Website Design in Duncan & the Cowichan Valley | VDT Sites",
    description:
      "Website design for Duncan and Cowichan Valley businesses. Fixed price, hosting included, built 45 minutes away.",
  },
};

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Where are you actually located?",
    a: "Nanaimo, forty five minutes up the Trans-Canada from Duncan, which makes the Cowichan Valley one of the closest markets we serve. Everything runs by phone, email and video call as standard, but if a face to face meeting genuinely helps, Duncan is an easy drive, not a promise we would quietly avoid keeping.",
  },
  {
    q: "How much does a website cost in Duncan?",
    a: `Ours start at ${PRICE_BUILD_FROM} ${CURRENCY} for the build, plus ${PRICE_MONTHLY} a month covering hosting, your domain, SSL, backups, monitoring and support. The price is fixed and quoted in writing before any work begins, and it is the same in Duncan, Ladysmith, Chemainus or Cobble Hill.`,
  },
  {
    q: "My business sells at markets and through word of mouth. Do I even need a website?",
    a: "Maybe not, and we will tell you if so. But most Cowichan businesses we talk to are past that point: customers hear the name at a market or from a neighbour, search it that evening, and either find a site that answers their questions or find nothing and move on. A simple site that shows what you make, where to buy it and how to reach you turns that search into a sale instead of a dead end.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. The slow part is almost never the build, it is waiting on text, photos and approvals, so the fastest projects are the ones where the owner has those ready.",
  },
];

const REASONS = [
  {
    title: "Closer than you think",
    body: "Duncan sits forty five minutes from our desk, closer than Victoria, and Ladysmith and Chemainus are closer still. We are the nearest custom studio for a good stretch of the valley, and one call reaches the person who actually builds your site, not a front desk.",
  },
  {
    title: "Built for how the valley sells",
    body: "Cowichan businesses run on farm gates, tasting rooms, markets and word of mouth. The website's job is to catch the person who just heard about you: what you make, where to find you, when you are open, how to order. We structure every build around that moment instead of around a template.",
  },
  {
    title: "Built to be found, not just to look good",
    body: "A site that never appears in search is a poster. Every build ships with the search groundwork already in it: clean page structure, fast loading on a phone, proper titles and descriptions, structured data and a sitemap submitted the week you launch. Not an upsell on a later invoice.",
  },
  {
    title: "You can update it yourself",
    body: "Change text and images directly on your live page: click the text, type the new version, save. New season, new stock, new market schedule, done in a minute from your phone. No dashboard to learn, and no invoice for a five minute edit.",
  },
];

export default function WebDesignDuncanPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Design in Duncan & the Cowichan Valley",
        description:
          "Website design for Duncan and Cowichan Valley businesses. Fixed price, hosting included, built 45 minutes away in Nanaimo.",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#business` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: `${SITE}/services`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Website Design in Duncan",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Design in Duncan & the Cowichan Valley",
        serviceType:
          "Custom website design and development for small businesses in Duncan and the Cowichan Valley",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Duncan" },
          { "@type": "City", name: "Ladysmith" },
          { "@type": "Place", name: "Chemainus" },
          { "@type": "Place", name: "Cowichan Bay" },
          { "@type": "Place", name: "Cobble Hill" },
          { "@type": "Place", name: "Cowichan Valley" },
          { "@type": "Place", name: "Vancouver Island" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      {/* <ContactCard> renders unstyled and cannot submit without these. */}
      <link rel="stylesheet" href={`/lab/contact-card.css?v=${LAB_V}`} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script src={`/lab/contact-card.js?v=${LAB_V}`} strategy="afterInteractive" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader noSnippet />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative px-6 pb-12 pt-10 md:px-14 md:pt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-0 select-none text-[128px] font-extrabold leading-none tracking-tight text-[#0d0d0d]/[0.035] md:-right-6 md:text-[230px]"
            style={{ fontFamily: SYNE }}
          >
            VDT
          </span>

          <div className="relative mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
              Duncan · Cowichan Valley · Ladysmith
            </p>
            <h1
              className="mt-4 max-w-[19ch] text-4xl font-bold leading-[1.05] md:text-[60px]"
              style={{ fontFamily: SYNE }}
            >
              Website design for Duncan and the Cowichan Valley.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom websites for businesses in Duncan, Ladysmith,
                Chemainus and across the valley, from {PRICE_BUILD_FROM}{" "}
                {CURRENCY} plus {PRICE_MONTHLY} a month with hosting, domain
                and support included. Built forty five minutes up the highway
                in Nanaimo, and priced in writing before we start.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                {/* Scrolls to the form at the foot of this page rather than
                    spending a click on /contact. */}
                <a
                  href="#contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a free quote
                </a>
                <a
                  href="tel:+12506162087"
                  className="text-[15px] font-semibold text-[#dc2626] underline underline-offset-4"
                >
                  Or call 250-616-2087
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why us ───────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                The nearest studio for most of the valley
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                The Cowichan Valley grows, makes and fixes things, and its
                businesses deserve websites built with the same care.
              </p>
            </div>

            <div className="mt-12 grid gap-x-16 gap-y-11 md:grid-cols-2">
              {REASONS.map((r, i) => (
                <div key={r.title}>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-[13px] font-bold text-[#dc2626]"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-xl font-bold leading-snug"
                      style={{ fontFamily: SYNE }}
                    >
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof ────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                What we have actually built
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  A coffee roaster with a real online store. A Japanese
                  vehicle importer in Parksville. A counselling practice that
                  left Squarespace, a food truck run from the owner&rsquo;s
                  phone, and an accounting firm whose old site had been
                  invisible to Google for years.{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Every build is written up properly
                  </Link>
                  , and{" "}
                  <Link
                    href="/reviews"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the reviews are reproduced word for word
                  </Link>
                  .
                </p>
                <p>
                  Heading down-island instead? We build for{" "}
                  <Link
                    href="/web-design-victoria"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Victoria
                  </Link>{" "}
                  too, and for{" "}
                  <Link
                    href="/web-design-vancouver-island"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the whole of Vancouver Island
                  </Link>
                  . Same fixed price everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Work carousel ────────────────────────────────── */}
        <section className="border-t border-black/10 py-16 md:py-20">
          <WorkCarousel items={WORK_ITEMS} />
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2
              className="text-3xl font-bold leading-tight md:text-[40px]"
              style={{ fontFamily: SYNE }}
            >
              Common questions
            </h2>
            <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt
                    className="text-lg font-bold leading-snug"
                    style={{ fontFamily: SYNE }}
                  >
                    {f.q}
                  </dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {f.a}
                    {f.link && (
                      <>
                        {" "}
                        <Link
                          href={f.link.href}
                          className="font-semibold text-[#dc2626] underline underline-offset-2"
                        >
                          {f.link.label}
                        </Link>
                        .
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        {/* id="contact" belongs to <ContactCard> below, which is the
            thing worth scrolling to. MobileActionBar hides against that. */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Tell us about your Cowichan business.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  What you do, who you want to reach, and what your current
                  site is getting wrong if you have one. You get a fixed
                  written quote back, free, with no obligation attached to
                  it. If we are not the right fit we will tell you and point
                  you somewhere that is.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a free quote
                  </a>
                  <a
                    href="tel:+12506162087"
                    className="text-[15px] font-semibold text-[#0d0d0d] underline underline-offset-4"
                  >
                    250-616-2087
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The enquiry form itself, so paid and organic traffic can convert
            here instead of spending a click on /contact. Needs the GSAP +
            contact-card assets loaded above. */}
        <ContactCard paddingTop={64} paddingBottom={72} />
      </main>

      <MobileActionBar />

      <ServiceAreas current="/web-design-duncan" />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
        <span>© {new Date().getFullYear()} VDT Sites · Built in Nanaimo, BC</span>
        <nav aria-label="Legal" className="flex gap-5">
          <a href="/terms-of-service" className="hover:text-[#0d0d0d]">Terms</a>
          <a href="/privacy-policy" className="hover:text-[#0d0d0d]">Privacy</a>
          <a href="/cookie-policy" className="hover:text-[#0d0d0d]">Cookies</a>
        </nav>
      </footer>
    </div>
  );
}
