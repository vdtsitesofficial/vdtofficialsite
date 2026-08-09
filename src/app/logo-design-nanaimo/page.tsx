import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import { PRICE_BRAND_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /logo-design-nanaimo
 *
 * Service page for "logo design nanaimo" (90/mo, KD 6, Semrush ca Aug
 * 2026), with "graphic design nanaimo" (70/mo) as the secondary.
 *
 * ── Positioning (Sem, 2026-08-05): kit-led.
 * The logo is sold as part of the Full Brand Kit at PRICE_BRAND_FROM,
 * which includes the website. No standalone logo price is shown on this
 * page. Someone who truly only wants a logo is pointed at /contact
 * without a number, on purpose.
 *
 * The kit contents wording MIRRORS the BRAND_INCLUDED list on /services
 * exactly (custom logo in every format / print-ready card design ready to
 * be professionally printed / branded editable invoice template / brand
 * typefaces). Those phrasings were settled deliberately (commit 1b614b9,
 * cards are a print-ready DESIGN, not printing). Do not "improve" them
 * here into promises /services does not make.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/logo-design-nanaimo`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Logo Design in Nanaimo, BC: Full Brand Kit",
  description:
    "Custom logo design in Nanaimo as part of the Full Brand Kit: logo, card design, invoice template, typefaces and your website, one price. Call 250-616-2087.",
  keywords: [
    "logo design nanaimo",
    "graphic design nanaimo",
    "brand identity design nanaimo",
    "business card design nanaimo",
  ],
  alternates: { canonical: "/logo-design-nanaimo" },
  openGraph: {
    title: "Logo Design in Nanaimo, BC | VDT Sites",
    description:
      "Custom logo design in Nanaimo as part of the Full Brand Kit: logo, cards, invoice template, typefaces and your website in one price.",
    url: "/logo-design-nanaimo",
  },
  twitter: {
    title: "Logo Design in Nanaimo, BC | VDT Sites",
    description:
      "Custom logo design in Nanaimo as part of the Full Brand Kit: logo, cards, invoice template, typefaces and your website in one price.",
  },
};

/* Mirrors BRAND_INCLUDED on /services. Change both or neither. */
const KIT = [
  "A custom logo, in every format you need for web, print and signage",
  "Print-ready business card design, ready to be professionally printed",
  "A branded, editable invoice template",
  "Brand typefaces chosen and set up across your site",
  "And the website itself, designed around the brand rather than bolted onto it",
];

const FAQS = [
  {
    q: "How much does logo design cost in Nanaimo?",
    a: `On its own, anywhere from fifty dollars on a freelance marketplace to several thousand from a branding agency, which is exactly why the number is confusing. We sell the logo as part of the Full Brand Kit at ${PRICE_BRAND_FROM} ${CURRENCY}: the logo in every format, business card design, a branded invoice template, brand typefaces, and the website itself, all designed together. If you genuinely only need a logo, get in touch and we will quote it straight.`,
  },
  {
    q: "What files do I actually get?",
    a: "Every format you need for web, print and signage: vector files that scale to any size, transparent versions, and web-ready files. The practical test is that you should never have to email your designer because a print shop asked for a file you do not have.",
  },
  {
    q: "Do I own the logo?",
    a: "Yes. Once the project is paid in full the logo and its files are yours outright, the same as the website. No licensing fee, no asking permission to put it on a truck.",
  },
  {
    q: "Can you redesign an existing logo?",
    a: "Yes, and it is often the better brief. A refresh keeps the recognition your business has already earned while fixing what has dated. Bring what you have and we will tell you honestly whether it needs a refresh or a restart.",
  },
  {
    q: "Why buy the logo and website together?",
    a: "Because a site and a brand designed apart always look it. When the same people design both, the logo is built to sit properly on the site, the colours and typefaces carry through, and your business looks like one thing everywhere a customer runs into it. It is also one bill instead of two vendors pointing at each other.",
  },
];

export default function LogoDesignNanaimoPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Logo Design in Nanaimo, BC",
        description:
          "Custom logo design in Nanaimo as part of the VDT Full Brand Kit: logo, business card design, invoice template, typefaces and website in one price.",
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
              name: "Logo Design in Nanaimo",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Logo and Brand Identity Design",
        serviceType:
          "Custom logo design and brand identity for small businesses, delivered as part of the Full Brand Kit with the website",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Nanaimo" },
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
              Logo &amp; Brand
            </p>
            <h1
              className="mt-4 max-w-[16ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Logo design in Nanaimo that comes with the brand attached.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                A logo on its own is a file. What a Nanaimo business actually
                needs is the whole surface a customer sees: the logo, the
                cards, the invoice, the typefaces and the website, designed
                together so they read as one company. That is what the Full
                Brand Kit is, at {PRICE_BRAND_FROM} {CURRENCY} with the
                website included.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a free quote
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

        {/* ── The kit ──────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The Full Brand Kit · {PRICE_BRAND_FROM}
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  One price, the whole identity
                </h2>
              </div>
              <div className="md:pt-2">
                <ul className="space-y-4">
                  {KIT.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 text-[#dc2626]" aria-hidden>
                        &#10003;
                      </span>
                      <span className="text-[16px] leading-relaxed text-[#0d0d0d]/75">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 text-[15px] leading-relaxed text-[#0d0d0d]/60">
                  Hosting, your domain and support stay {PRICE_MONTHLY} a
                  month, same as every VDT site. Full details and what the
                  website itself includes are on the{" "}
                  <Link
                    href="/services"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    services and pricing page
                  </Link>
                  . Genuinely only need a logo? Ask anyway, and we will quote
                  it straight rather than upsell you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why together ─────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Why the logo and the website are one job
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  The most common brand problem we see in Nanaimo is not a bad
                  logo. It is a decent logo, a website built by someone else
                  two years later, social templates from a third place, and an
                  invoice that matches none of it. Every piece was fine. The
                  company still looks assembled from parts.
                </p>
                <p>
                  Designing the identity and the site together fixes that at
                  the root: the logo is drawn knowing where it will sit, the
                  palette and typefaces are chosen once and used everywhere,
                  and the next thing you print or post has an answer before
                  the question comes up.
                </p>
                <p>
                  You can see the approach across{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    our client builds
                  </Link>
                  : sites where the brand carries from the hero to the favicon
                  to the case study, because nobody had to guess what matched.
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
                Show us what your business looks like today.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Send whatever exists: the current logo, the site, a photo of
                  the truck. We will tell you honestly what is worth keeping,
                  what is dating you, and exactly what the kit would cost.
                  Free, and no obligation attached to it.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a free quote
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

      <ServiceAreas current="/logo-design-nanaimo" />

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
