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
 * /web-design-vancouver-island
 *
 * The island-wide hub page (SEO Plan Phase 2, 2026-08-10). Targets the
 * umbrella terms the homepage title mentions but no page owns outright
 * (Semrush ca, Aug 2026):
 *   website design vancouver island  210/mo  KD 46
 *   web design vancouver island      170/mo  KD 41
 *   vancouver island web design      (variant, folded in)
 * KD 40+ means this matures with authority; its second job is being the
 * hub that passes link equity to every city page below it, so it earns
 * its keep from day one either way.
 *
 * ── Structure note: the Regions list is the point of the page. It is
 * a real navigation hub (every city page linked with a one-line local
 * claim), not decoration; keep the links and their anchors descriptive.
 *
 * ── Tone: no swipes at other agencies (see Copy & Messaging, 2026-08-08).
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-vancouver-island`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Web Design Across Vancouver Island",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "Website design for Vancouver Island businesses, from Victoria to Campbell River. One studio, one fixed price, hosting included. Call 250-616-2087.",
  keywords: [
    "web design vancouver island",
    "website design vancouver island",
    "vancouver island web design",
    "web designer vancouver island",
    "vancouver island website design",
  ],
  alternates: { canonical: "/web-design-vancouver-island" },
  openGraph: {
    title: "Web Design Across Vancouver Island | VDT Sites",
    description:
      "Website design for Vancouver Island businesses, from Victoria to Campbell River. One studio in Nanaimo, one fixed price, hosting included.",
    url: "/web-design-vancouver-island",
  },
  twitter: {
    title: "Web Design Across Vancouver Island | VDT Sites",
    description:
      "Website design for Vancouver Island businesses, from Victoria to Campbell River. One fixed price, hosting included.",
  },
};

/* The hub: every city page, with the one-line reason it exists. */
const REGIONS = [
  {
    name: "Nanaimo",
    href: "/",
    anchor: "Website design in Nanaimo",
    line: "Home base. The studio is here, most of our clients are here, and the homepage tells that story.",
  },
  {
    name: "Victoria & the CRD",
    href: "/web-design-victoria",
    anchor: "Website design in Victoria",
    line: "The island's biggest market, served without the downtown office premium.",
  },
  {
    name: "Duncan & the Cowichan Valley",
    href: "/web-design-duncan",
    anchor: "Website design in Duncan",
    line: "Forty five minutes south: Duncan, Ladysmith, Chemainus and the valley's farms and makers.",
  },
  {
    name: "Parksville & Oceanside",
    href: "/web-design-parksville",
    anchor: "Website design in Parksville",
    line: "Twenty minutes north, and home to one of our favourite builds, Morky Auto Imports.",
  },
  {
    name: "The Comox Valley",
    href: "/web-design-comox-valley",
    anchor: "Web design in the Comox Valley",
    line: "Courtenay, Comox and Cumberland, an hour up the highway.",
  },
  {
    name: "Campbell River & the North Island",
    href: "/web-design-campbell-river",
    anchor: "Website design in Campbell River",
    line: "The Salmon Capital's charters, trades and tourism operators, built for two kinds of customer at once.",
  },
];

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Do you serve the whole island?",
    a: "Yes. We are based in Nanaimo, which puts most of the island's population within about an hour of us, and the work itself runs by phone, email and video call, so Port Alberni or Tofino are as easy to serve as our own street. Same island, same understanding of how island businesses find their customers.",
  },
  {
    q: "Is the price different depending on where I am?",
    a: `No. ${PRICE_BUILD_FROM} ${CURRENCY} for the build and ${PRICE_MONTHLY} a month for hosting, domain, SSL, backups, monitoring and support, whether you are in Victoria, Duncan or Campbell River. The quote is fixed in writing before any work begins, and geography has never been a line item on it.`,
  },
  {
    q: "Why hire an island studio instead of a big city agency?",
    a: "Because your customers are here. An island business lives on local search, seasonal rhythms, tourists planning from far away and word of mouth, and we build for those realities every week. You also get the person who built your site answering your emails, which is a service model that gets rarer the bigger the shop.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. The slow part is almost never the build, it is waiting on text, photos and approvals, so the fastest projects are the ones where the owner has those ready.",
  },
];

export default function WebDesignVancouverIslandPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Web Design Across Vancouver Island",
        description:
          "Website design for Vancouver Island businesses, from Victoria to Campbell River. One studio in Nanaimo, one fixed price, hosting included.",
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
              name: "Web Design Across Vancouver Island",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Web Design Across Vancouver Island",
        serviceType:
          "Custom website design and development for small businesses across Vancouver Island",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "Place", name: "Vancouver Island" },
          { "@type": "City", name: "Nanaimo" },
          { "@type": "City", name: "Victoria" },
          { "@type": "City", name: "Duncan" },
          { "@type": "City", name: "Parksville" },
          { "@type": "City", name: "Courtenay" },
          { "@type": "City", name: "Campbell River" },
          { "@type": "City", name: "Port Alberni" },
          { "@type": "Place", name: "Tofino" },
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
              Victoria to Campbell River
            </p>
            <h1
              className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] md:text-[60px]"
              style={{ fontFamily: SYNE }}
            >
              Web design for the whole of Vancouver Island.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                One studio in Nanaimo, building custom websites for
                businesses across Vancouver Island, from {PRICE_BUILD_FROM}{" "}
                {CURRENCY} plus {PRICE_MONTHLY} a month with hosting, domain
                and support included. Every client, Victoria to Campbell
                River, gets the same fixed written price and the same person
                answering the phone.
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

        {/* ── The regions hub ──────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Where we build
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Every region below has its own page, because every region
                does business a little differently. Find yours.
              </p>
            </div>

            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {REGIONS.map((r) => (
                <div
                  key={r.href}
                  className="grid gap-2 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:items-baseline"
                >
                  <h3
                    className="text-lg font-bold leading-snug"
                    style={{ fontFamily: SYNE }}
                  >
                    <Link
                      href={r.href}
                      className="underline decoration-black/15 decoration-2 underline-offset-4 transition-colors hover:decoration-[#dc2626]"
                    >
                      {r.anchor}
                    </Link>
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {r.line}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-[#0d0d0d]/60">
              Somewhere else on the island, Port Alberni to Tofino to Port
              Hardy? Same service, same price, no page needed:{" "}
              <a
                href="#contact"
                className="font-semibold text-[#dc2626] underline underline-offset-2"
              >
                just get in touch
              </a>
              .
            </p>
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
                Island businesses we have built for
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  A Nanaimo coffee roaster with a real online store. A
                  Japanese vehicle importer in Parksville. A counselling
                  practice serving clients across BC, a food truck run from
                  the owner&rsquo;s phone, an electrician, an accounting
                  firm.{" "}
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
                  The prices those businesses paid are the prices on{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the pricing page
                  </Link>
                  , in public. That is deliberate: an island this size runs
                  on reputation, and quoting one neighbour double what the
                  other paid is how you lose one.
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
                Tell us about your island business.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  What you do, where you are, and what your current site is
                  getting wrong if you have one. You get a fixed written
                  quote back, free, with no obligation attached to it. If we
                  are not the right fit we will tell you and point you
                  somewhere that is.
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

      <ServiceAreas current="/web-design-vancouver-island" />

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
