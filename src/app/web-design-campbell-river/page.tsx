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
 * /web-design-campbell-river
 *
 * Split out of /web-design-comox-valley 2026-08-10 (SEO Plan Phase 2).
 * Campbell River's terms are the biggest small-town cluster on the
 * island and deserve an exact-match page (Semrush ca, Aug 2026):
 *   campbell river web design     140/mo  KD 41
 *   web design campbell river     140/mo  KD 41
 *   web designer campbell river    40/mo  KD 0
 *   website design campbell river  10/mo  KD 0
 * The KD 41 pair needs authority to land; the KD 0 pair is winnable
 * now and pays the rent while the big two mature.
 *
 * ── Honesty constraint (do not "improve" this away)
 * There is NO Campbell River client yet. Same rule as Victoria and
 * Comox: describe the real work, link /work and /reviews, never imply
 * a local client, and do not volunteer the gap unprompted. The local
 * anchor is real geography (same island, no ferry, a morning's drive)
 * and the seasonal/tourism economy angle, which is true of the market
 * whether or not we have a client in it yet.
 *
 * ── Tone: no swipes at other agencies (see Copy & Messaging, 2026-08-08).
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-campbell-river`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Website Design in Campbell River, BC",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "Website design for Campbell River businesses: charters, trades, tourism and shops. Fixed price, hosting included, built on-island. Call 250-616-2087.",
  keywords: [
    "campbell river web design",
    "web design campbell river",
    "website design campbell river",
    "web designer campbell river",
    "campbell river website design",
  ],
  alternates: { canonical: "/web-design-campbell-river" },
  openGraph: {
    title: "Website Design in Campbell River, BC | VDT Sites",
    description:
      "Website design for Campbell River businesses: charters, trades, tourism and shops. Fixed price, hosting included, built on-island in Nanaimo.",
    url: "/web-design-campbell-river",
  },
  twitter: {
    title: "Website Design in Campbell River, BC | VDT Sites",
    description:
      "Website design for Campbell River businesses. Fixed price, hosting included, built on-island.",
  },
};

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Do you really work with businesses as far up as Campbell River?",
    a: "Yes. Our clients are spread across Vancouver Island and almost none of them have ever needed us in the room: everything runs by phone, email and video call, and questions get answered within a day by the person who built the site. Campbell River is a morning's drive up the highway from us in Nanaimo, same island, no ferry, so if a meeting ever genuinely matters, it happens.",
  },
  {
    q: "How much does a website cost in Campbell River?",
    a: `Ours start at ${PRICE_BUILD_FROM} ${CURRENCY} for the build, plus ${PRICE_MONTHLY} a month covering hosting, your domain, SSL, backups, monitoring and support. The price is fixed and quoted in writing before any work begins, and it is the same in Campbell River as it is two blocks from our desk in Nanaimo.`,
  },
  {
    q: "Can a website really bring in tourists and visitors?",
    a: "For a Campbell River business it is often the whole game. A visitor planning a fishing trip, a whale watching tour or a week on the North Island books from a phone, weeks ahead, from somewhere else entirely. If your site loads fast, shows real photos, answers the obvious questions and takes the booking or the call, you win trips that were decided before anyone reached town. That is exactly the kind of site we build.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. The slow part is almost never the build, it is waiting on text, photos and approvals, so the fastest projects are the ones where the owner has those ready. For seasonal businesses we plan around your calendar: the right time to build is before the season, not during it.",
  },
];

const REASONS = [
  {
    title: "Built for a seasonal, visitor-driven town",
    body: "Campbell River businesses live on two clocks: locals year-round and visitors in season, planning from far away. We structure sites for both, so a local finds your hours and phone number instantly, and a visitor researching the Salmon Capital from another province gets photos, prices and a way to book before they arrive.",
  },
  {
    title: "One call away, same island",
    body: "We are a small company by choice, and the thing we sell hardest is service. When you have a question, you reach the person who actually built your site, by one email or one phone call, and you hear back within a day. No ticket queue, no account manager relaying messages up and down the island.",
  },
  {
    title: "Built to be found, not just to look good",
    body: "A site that never appears in search is a poster. Every build ships with the search groundwork already in it: clean page structure, fast loading on a phone, proper titles and descriptions, structured data and a sitemap submitted the week you launch. Not an upsell on a later invoice.",
  },
  {
    title: "You can update it yourself",
    body: "Change text and images directly on your live page: click the text, type the new version, save. Swap the catch photos, update the season's prices, mark the boat as booked. No dashboard to learn, and no invoice for a five minute edit.",
  },
];

export default function WebDesignCampbellRiverPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Design in Campbell River, BC",
        description:
          "Website design for Campbell River, BC businesses. Fixed price, hosting included, built on-island in Nanaimo.",
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
              name: "Website Design in Campbell River",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Design in Campbell River, BC",
        serviceType:
          "Custom website design and development for small businesses in Campbell River and the North Island",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Campbell River" },
          { "@type": "Place", name: "Quadra Island" },
          { "@type": "Place", name: "Discovery Islands" },
          { "@type": "Place", name: "North Vancouver Island" },
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
              Campbell River · North Island
            </p>
            <h1
              className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] md:text-[60px]"
              style={{ fontFamily: SYNE }}
            >
              Website design for Campbell River businesses.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom websites for charters, trades, tourism operators and
                shops in Campbell River, from {PRICE_BUILD_FROM} {CURRENCY}{" "}
                plus {PRICE_MONTHLY} a month with hosting, domain and support
                included. Built on-island in Nanaimo, priced in writing
                before we start, and made to be found by locals and visitors
                alike.
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
                Built for how Campbell River does business
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                The Salmon Capital runs on seasons, bookings and word of
                mouth. A website here has a different job than one downtown
                Vancouver, and we build for that job.
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
                  Every one of those businesses reaches us the same way you
                  would from Campbell River: one message, answered by the
                  person who built their site. We also serve the{" "}
                  <Link
                    href="/web-design-comox-valley"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Comox Valley
                  </Link>{" "}
                  just down the highway, and the rest of{" "}
                  <Link
                    href="/web-design-vancouver-island"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Vancouver Island
                  </Link>
                  .
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
                Tell us about your Campbell River business.
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

      <ServiceAreas current="/web-design-campbell-river" />

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
