import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /affordable-web-design
 *
 * Organic landing page for the affordability cluster (Semrush ca, Aug 2026):
 *   affordable web design       720/mo  KD 14
 *   affordable website design   260/mo  KD 30
 *   cheap website design         (addressed head-on in copy, not targeted)
 *
 * SEO Plan Phase 1 (vault: Projects/VDT Sites/SEO Plan.md). The SERP for
 * this term is unusually weak (Reddit threads, chamber directory pages,
 * single-page brochure sites), and VDT's real price IS the affordable
 * tier, so this page tells the truth loudly instead of dancing around
 * the word. The line to hold: affordable because of structure (solo
 * studio, no office, efficient stack), never because corners get cut.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/affordable-web-design`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: `Affordable Web Design: Custom Sites From ${PRICE_BUILD_FROM} ${CURRENCY}`,
  description: `Affordable web design without the template look: custom-built sites from ${PRICE_BUILD_FROM} ${CURRENCY}, hosting and care for ${PRICE_MONTHLY} a month. The price is public. Call 250-616-2087.`,
  keywords: [
    "affordable web design",
    "affordable website design",
    "affordable web design canada",
    "budget website design",
    "small business web design prices",
  ],
  alternates: { canonical: "/affordable-web-design" },
  openGraph: {
    title: `Affordable Web Design: Custom Sites From ${PRICE_BUILD_FROM} ${CURRENCY} | VDT Sites`,
    description: `Custom-built websites from ${PRICE_BUILD_FROM} ${CURRENCY}, hosting and care for ${PRICE_MONTHLY} a month. Affordable by structure, not by cutting corners.`,
    url: "/affordable-web-design",
  },
  twitter: {
    title: `Affordable Web Design: Custom Sites From ${PRICE_BUILD_FROM} ${CURRENCY} | VDT Sites`,
    description: `Custom-built websites from ${PRICE_BUILD_FROM} ${CURRENCY}, hosting and care for ${PRICE_MONTHLY} a month. Affordable by structure, not by cutting corners.`,
  },
};

const REASONS = [
  {
    title: "No office to pay for",
    body: "Agencies bill you for their downtown lease, their account managers and their sales team, none of which touch your website. This studio is one person on Vancouver Island with a very good toolchain, and the price reflects what the work costs rather than what the overhead costs.",
  },
  {
    title: "No hourly meter running",
    body: "Hourly billing rewards slowness and punishes questions. Every build here is a fixed price quoted up front, so efficiency belongs to you rather than being a threat to the invoice.",
  },
  {
    title: "A stack that does not waste money",
    body: "The sites are built on modern infrastructure that costs little to run and almost nothing to keep fast. No bloated page builder licences, no plugin subscriptions, no platform tax passed on to you.",
  },
];

const FAQS = [
  {
    q: "How can custom web design be this affordable?",
    a: `Structure, not shortcuts. There is no office, no account manager and no sales commission inside the ${PRICE_BUILD_FROM} ${CURRENCY}, just the build. The stack we use costs very little to run, and fixed pricing means we get faster with every site instead of billing slower. The work is the same work that costs four figures more at an agency, minus the parts of an agency that are not work.`,
  },
  {
    q: `What does ${PRICE_BUILD_FROM} actually include?`,
    a: `A custom-designed site built for your business, not a template with your logo dropped in. Mobile-first layout, fast loading, the SEO groundwork done properly, legal pages, and a site you can edit yourself. The full breakdown is on the pricing page, in public, because affordable should be checkable.`,
  },
  {
    q: "Is it a template?",
    a: "No. Every site is designed from your business: your colours, your photos, your customers, your one thing that competitors do not have. Templates are how cheap providers hit their price. We hit ours by keeping overhead near zero, which leaves the design work honest.",
  },
  {
    q: "Are there hidden costs afterwards?",
    a: `One number, and you see it before you start: ${PRICE_MONTHLY} ${CURRENCY} a month, which is the whole running cost. Hosting, your domain, SSL, backups, monitoring and small updates are all inside it. No renewal surprises, no support invoices, no upsells scheduled for month three.`,
  },
  {
    q: "What about really cheap website builders?",
    a: "DIY builders are genuinely the affordable option if your time is free and the result only needs to exist. The honest tradeoffs: the monthly platform fees quietly pass the custom price within a couple of years, the site is rented rather than owned, and the SEO groundwork mostly does not happen. We wrote up the comparison without the scare tactics, so you can decide with real numbers.",
  },
  {
    q: "Is affordable web design worth it for a small business?",
    a: "A website is worth it when it earns more than it costs, which for most service businesses means one or two new customers a year. Affordable pricing just lowers that bar. The mistake worth avoiding is not spending too little, it is paying monthly forever for a site that cannot rank or convert, at any price.",
  },
];

export default function AffordableWebDesignPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: `Affordable Web Design: Custom Sites From ${PRICE_BUILD_FROM} ${CURRENCY}`,
        description: `Affordable web design without the template look: custom-built sites from ${PRICE_BUILD_FROM} ${CURRENCY}, hosting and care for ${PRICE_MONTHLY} a month.`,
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
              name: "Affordable Web Design",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Affordable Custom Web Design",
        serviceType:
          "Custom website design for small businesses at a fixed published price",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "Place", name: "Vancouver Island" },
          { "@type": "Country", name: "Canada" },
        ],
        offers: {
          "@type": "Offer",
          price: PRICE_BUILD_FROM.replace("$", ""),
          priceCurrency: CURRENCY,
          description: `Custom website builds from ${PRICE_BUILD_FROM} ${CURRENCY}, one time`,
        },
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
              Fixed price
            </p>
            <h1
              className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Affordable web design that does not look it.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom-built websites from {PRICE_BUILD_FROM} {CURRENCY}, one
                time, with everything it takes to run one for{" "}
                {PRICE_MONTHLY} a month. Not a template, not a page builder,
                and not a teaser price with the real one waiting behind a
                sales call. The numbers are public.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a fixed quote
                </Link>
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

        {/* ── Why it is affordable ─────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Where the affordability comes from
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                A low price is either a structure or a trap. Here is the
                structure, so you can tell the difference when you shop
                around.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {REASONS.map((r, i) => (
                <div key={r.title} className="max-w-3xl">
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

        {/* ── Affordable vs cheap ──────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The difference
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Affordable is not the same word as cheap
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    Cheap cuts the invisible work.
                  </strong>{" "}
                  A cheap site is a template filled in fast: no SEO
                  groundwork, no speed work, stock photos, and hosting that
                  holds your site hostage when you try to leave. It costs
                  less on day one and more every day after, because a site
                  nobody finds is a decoration.
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    Affordable keeps the work and cuts the overhead.
                  </strong>{" "}
                  Every site here ships with the groundwork that makes it
                  findable: proper titles and structure, structured data,
                  fast loading on a phone, a submitted sitemap, and your{" "}
                  <Link
                    href="/seo-nanaimo"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    local search
                  </Link>{" "}
                  basics tied in. The full list of what is in the build is
                  published on{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the pricing page
                  </Link>
                  , next to the numbers.
                </p>
                <p className="border-l-2 border-[#dc2626] pl-5">
                  The proof is checkable: every site in{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the case studies
                  </Link>{" "}
                  was built at these prices, for real businesses, and{" "}
                  <Link
                    href="/reviews"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the reviews
                  </Link>{" "}
                  are reproduced word for word. Affordable that cannot show
                  its work is just cheap with better marketing.
                </p>
              </div>
            </div>
          </div>
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
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                See what {PRICE_BUILD_FROM} gets your business.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Tell us what your business does and what you have now, even
                  if that is nothing. You get a fixed quote and a plain
                  answer about what the site should do for you. If a DIY
                  builder honestly fits your situation better, we have been
                  known to say so.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a fixed quote
                  </Link>
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
      </main>

      <ServiceAreas />

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
