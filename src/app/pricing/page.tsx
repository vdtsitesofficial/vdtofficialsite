import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import {
  PRICE_BUILD_FROM,
  PRICE_BRAND_FROM,
  PRICE_MONTHLY,
  CURRENCY,
} from "@/lib/pricing";

/**
 * /pricing
 *
 * Organic landing page for the pricing cluster (Semrush ca, Aug 2026):
 *   small business website packages   260/mo  KD 23
 *   website design pricing            210/mo  KD 30
 *   how much does a website cost      210/mo  KD 43 (informational, the
 *     blog post small-business-website-cost-2026 targets it; this page
 *     links there rather than competing with it)
 *
 * SEO Plan Phase 1 (vault: Projects/VDT Sites/SEO Plan.md). Publishing
 * real numbers IS the differentiator: nearly every competitor hides
 * pricing behind a quote form, so a page that just says the numbers
 * earns the click and the trust in one move. All figures come from
 * lib/pricing, never hardcode them here.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/pricing`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Website Design Pricing & Packages, Published",
  description: `Real website design pricing, in public: custom builds from ${PRICE_BUILD_FROM} ${CURRENCY}, site plus brand kit from ${PRICE_BRAND_FROM}, everything monthly for ${PRICE_MONTHLY}. No quote form required to see a number.`,
  keywords: [
    "website design pricing",
    "small business website packages",
    "website design packages",
    "how much does a website cost",
    "web design prices canada",
  ],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Website Design Pricing & Packages, Published | VDT Sites",
    description: `Custom builds from ${PRICE_BUILD_FROM} ${CURRENCY}, site plus brand kit from ${PRICE_BRAND_FROM}, everything monthly for ${PRICE_MONTHLY}. The numbers, in public.`,
    url: "/pricing",
  },
  twitter: {
    title: "Website Design Pricing & Packages, Published | VDT Sites",
    description: `Custom builds from ${PRICE_BUILD_FROM} ${CURRENCY}, site plus brand kit from ${PRICE_BRAND_FROM}, everything monthly for ${PRICE_MONTHLY}. The numbers, in public.`,
  },
};

const PACKAGES = [
  {
    name: "Website",
    price: `from ${PRICE_BUILD_FROM}`,
    per: "one time",
    schemaPrice: PRICE_BUILD_FROM.replace("$", ""),
    body: "A custom-designed site built for your business: mobile-first, fast, editable by you, with the SEO groundwork and legal pages done properly. This is the package most small businesses need, and the quote is fixed before work starts.",
  },
  {
    name: "Website + brand kit",
    price: `from ${PRICE_BRAND_FROM}`,
    per: "one time",
    schemaPrice: PRICE_BRAND_FROM.replace("$", ""),
    body: "The build above plus the brand underneath it: logo, colours, type and print-ready assets, designed together so the site and the business match. The right pick when the logo is a placeholder or a memory.",
  },
  {
    name: "Hosting and care",
    price: PRICE_MONTHLY,
    per: "per month",
    schemaPrice: PRICE_MONTHLY.replace("$", ""),
    body: "The whole running cost, flat: hosting, your domain, SSL, backups, uptime monitoring, updates and small content changes. Month to month, no contract. Every build includes it, and it is the only recurring number.",
  },
];

const FAQS = [
  {
    q: "How much does a website cost?",
    a: `Here, ${PRICE_BUILD_FROM} ${CURRENCY} one time for a custom build, plus ${PRICE_MONTHLY} a month to run it. Across the industry the honest range for a small business site is anywhere from a few hundred dollars on a DIY builder to five figures at an agency, and the differences are real but rarely explained. We published a full breakdown of what moves the number so you can compare quotes properly.`,
  },
  {
    q: "Why publish prices when everyone else says 'get a quote'?",
    a: "Hidden pricing is a negotiation tactic: it lets the number match the customer instead of the work. Publishing ours costs us the occasional job we were never right for, and in exchange you arrive knowing whether we fit your budget, which is a better first conversation for both sides. The quote step still exists, but only to fix the number for your specific site, never to discover your pain threshold.",
  },
  {
    q: "Are there packages for small businesses?",
    a: `The three above are the packages, and they were built for small businesses because that is who we build for. Website from ${PRICE_BUILD_FROM}, website plus brand kit from ${PRICE_BRAND_FROM}, and ${PRICE_MONTHLY} a month covering everything it takes to run the site. No silver, gold and platinum theatre, because three honest options beat five padded ones.`,
  },
  {
    q: "Do you charge per page?",
    a: "No. Per-page pricing turns every design decision into a billing decision and quietly rewards bloated sites. The quote is for the site your business needs, and if that need changes mid-build we talk about it in numbers before anything is built.",
  },
  {
    q: "What costs extra?",
    a: "Things that are genuinely separate jobs: online stores and booking systems, a local SEO setup for an existing site, and unusually large builds. Each gets its own fixed quote up front. What never costs extra is the ordinary running of the site: small updates, questions, and fixes are inside the monthly fee.",
  },
  {
    q: "Is there a cheaper option if money is tight?",
    a: "Honestly, the DIY builders are the cheaper option, and for some situations they are the right call. The tradeoffs are your evenings, platform fees that accumulate past the custom price within a couple of years, and SEO groundwork that mostly does not happen. If you tell us your budget we will tell you plainly what fits it, including options that are not us.",
  },
];

export default function PricingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Design Pricing & Packages, Published",
        description: `Real website design pricing: custom builds from ${PRICE_BUILD_FROM} ${CURRENCY}, site plus brand kit from ${PRICE_BRAND_FROM}, everything monthly for ${PRICE_MONTHLY}.`,
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
            { "@type": "ListItem", position: 3, name: "Pricing", item: URL },
          ],
        },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${URL}#packages`,
        name: "VDT Sites packages",
        provider: { "@id": `${SITE}/#business` },
        itemListElement: PACKAGES.map((p) => ({
          "@type": "Offer",
          name: p.name,
          price: p.schemaPrice,
          priceCurrency: CURRENCY,
          description: p.body,
        })),
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
              Pricing
            </p>
            <h1
              className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              The price list, in public.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Website design pricing should not require a discovery call to
                discover. These are the real numbers, in {CURRENCY}, the same
                ones every business in{" "}
                <Link
                  href="/work"
                  className="font-semibold text-[#dc2626] underline underline-offset-2"
                >
                  the case studies
                </Link>{" "}
                paid. The only thing a quote changes is fixing the exact
                figure for your site before work starts.
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

        {/* ── The packages ─────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Small business website packages
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Three options, no tiers theatre. Two are one-time builds, one
                is the flat monthly that runs everything. Prices reviewed
                against what we actually quote, and updated here first.
              </p>
            </div>

            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {PACKAGES.map((p) => (
                <div
                  key={p.name}
                  className="grid gap-4 py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.5fr)_minmax(0,1.6fr)] md:items-baseline"
                >
                  <h3
                    className="text-xl font-bold leading-snug"
                    style={{ fontFamily: SYNE }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-lg">
                    <span
                      className="font-bold text-[#dc2626]"
                      style={{ fontFamily: SYNE }}
                    >
                      {p.price}
                    </span>{" "}
                    <span className="text-[13px] text-[#0d0d0d]/55">
                      {CURRENCY} · {p.per}
                    </span>
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-[#0d0d0d]/60">
              Separate jobs with their own fixed quotes: online stores,
              booking systems, a{" "}
              <Link
                href="/seo-nanaimo"
                className="font-semibold text-[#dc2626] underline underline-offset-2"
              >
                local SEO setup
              </Link>{" "}
              for an existing site, a{" "}
              <Link
                href="/website-redesign"
                className="font-semibold text-[#dc2626] underline underline-offset-2"
              >
                redesign
              </Link>{" "}
              of a site someone else built, or a{" "}
              <Link
                href="/logo-design-nanaimo"
                className="font-semibold text-[#dc2626] underline underline-offset-2"
              >
                logo on its own
              </Link>
              . The number always arrives before the work does.
            </p>

            {/* Prominent on purpose (Sem, 2026-08-09): a reader who just
                scanned the packages is at peak intent, so this is a real
                CTA, not a text link. */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <p
                className="text-xl font-bold md:text-[24px]"
                style={{ fontFamily: SYNE }}
              >
                Want to get started?
              </p>
              <Link
                href="/contact"
                className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
              >
                Contact us here!
              </Link>
            </div>
          </div>
        </section>

        {/* ── How the quote works ──────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The model
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Fixed means fixed
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    The quote is the price you pay.
                  </strong>{" "}
                  Not an estimate, not a floor, not hourly with a forecast.
                  We look at what your business needs, put one number on it,
                  and that number survives the project. If you ask for more
                  mid-build, the addition gets its own number first.
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    The monthly fee is the entire running cost.
                  </strong>{" "}
                  Everything the{" "}
                  <Link
                    href="/website-maintenance"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    care plan
                  </Link>{" "}
                  covers, hosting to small updates, inside {PRICE_MONTHLY} a
                  month. No renewal invoices, no surprise line items, and no
                  charge for calling us.
                </p>
                <p className="border-l-2 border-[#dc2626] pl-5">
                  Wondering why the industry's numbers are all over the map?
                  We wrote the honest breakdown:{" "}
                  <Link
                    href="/blog/small-business-website-cost-2026"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    how much a small business website costs
                  </Link>
                  , including the options that are not us. And if the budget
                  is the whole question,{" "}
                  <Link
                    href="/affordable-web-design"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    affordable web design
                  </Link>{" "}
                  explains where our price comes from.
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
                Get your number.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Tell us what your business does and what you need. You get
                  one fixed figure, what it includes, and how long it takes.
                  If the answer is that you do not need us yet, you get that
                  instead, free.
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
                <p className="mt-6 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                  <Link
                    href="/about"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    See who you&rsquo;d be working with!
                  </Link>
                </p>
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
