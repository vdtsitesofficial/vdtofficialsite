import type { ReactNode } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";

/**
 * Shared layout for the cream "[service] in Nanaimo" landing pages.
 *
 * Added 2026-10-11 for the service clusters Search Console showed VDT
 * getting impressions for with no dedicated page (web development,
 * branding packages, hosting and domains). The older landing pages
 * (logo-design-nanaimo, seo-nanaimo, the city pages) each carry their own
 * copy of this markup; new pages use this component so the house layout
 * lives in one place. The visual language is identical on purpose: same
 * hero, hairline-split sections, numbered items, FAQ grid, CTA, footer.
 *
 * Every page passes its own FAQ list and the component emits the matching
 * FAQPage JSON-LD, so the visible questions and the structured data can
 * never drift apart.
 *
 * Voice: no em dashes or en dashes, and never the word "real" (house copy
 * rules, see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export type LandingItem = { title: string; body: ReactNode };

export type LandingSection = {
  eyebrow?: string;
  heading: string;
  /** Lead paragraph(s) on the right of the split. */
  body?: ReactNode;
  /** Optional numbered list under the split. */
  items?: LandingItem[];
  /** Optional tick list on the right of the split, under the body. */
  ticks?: string[];
};

export type LandingFaq = { q: string; a: string };

export default function ServiceLanding({
  path,
  eyebrow,
  h1,
  intro,
  breadcrumbName,
  serviceName,
  serviceType,
  description,
  sections,
  faqs,
  ctaHeading,
  ctaBody,
}: {
  /** Route, e.g. "/web-development-nanaimo". */
  path: string;
  eyebrow: string;
  h1: string;
  intro: ReactNode;
  breadcrumbName: string;
  serviceName: string;
  serviceType: string;
  /** Plain-text summary for the WebPage node. */
  description: string;
  sections: LandingSection[];
  faqs: LandingFaq[];
  ctaHeading: string;
  ctaBody: string;
}) {
  const url = `${SITE}${path}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        name: breadcrumbName,
        description,
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
            { "@type": "ListItem", position: 3, name: breadcrumbName, item: url },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: serviceName,
        serviceType,
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Nanaimo" },
          { "@type": "Place", name: "Vancouver Island" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((f) => ({
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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Montserrat:ital,wght@0,600;1,500&family=Fraunces:wght@500&display=swap"
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
              {eyebrow}
            </p>
            <h1
              className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              {h1}
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                {intro}
              </div>
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

        {sections.map((s) => (
          <section
            key={s.heading}
            className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20"
          >
            <div className="mx-auto max-w-6xl">
              <div className={SPLIT}>
                <div>
                  {s.eyebrow && (
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                      {s.eyebrow}
                    </p>
                  )}
                  <h2
                    className="text-3xl font-bold leading-tight md:text-[40px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {s.heading}
                  </h2>
                </div>
                <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                  {s.body}
                  {s.ticks && (
                    <ul className="space-y-4">
                      {s.ticks.map((t) => (
                        <li key={t} className="flex gap-3">
                          <span className="mt-0.5 text-[#dc2626]" aria-hidden>
                            &#10003;
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {s.items && (
                <div className="mt-12 space-y-10">
                  {s.items.map((it, i) => (
                    <div key={it.title} className="max-w-3xl">
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
                          {it.title}
                        </h3>
                      </div>
                      <div className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                        {it.body}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}

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
              {faqs.map((f) => (
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
                {ctaHeading}
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  {ctaBody}
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

      <ServiceAreas current={path} />

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

/** Inline link in the house style, for use inside section bodies. */
export function InLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-[#dc2626] underline underline-offset-2"
    >
      {children}
    </Link>
  );
}
