import type { Metadata } from "next";
import { TESTIMONIALS, GOOGLE_REVIEWS_URL } from "@/lib/testimonials";
import Stars from "@/components/Stars";
import Reveal from "@/components/Reveal";

/**
 * /reviews - the client reviews in one place.
 *
 * Exists to own the "vdt sites reviews" query, which is what a warm lead
 * types right before they call, and to give Google's AI answers something
 * structured to read (per Shared/Site Standards: the site is now one of the
 * three sources it answers a Business Profile question from). It is NOT an
 * attempt to win a sitelink - those are picked algorithmically and cannot
 * be requested.
 *
 * No aggregateRating / Review JSON-LD, on purpose. See lib/testimonials.ts.
 *
 * Layout deliberately avoids the uniform card grid /about uses: one lead
 * review at full width, then hairline-divided editorial rows. Per
 * Shared/Design Preferences, boxes around every item is the tell and rules
 * between them is not, and a repeating grid wants one differently-shaped
 * item to break it.
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

const [LEAD, ...REST] = TESTIMONIALS;

export const metadata: Metadata = {
  title: "Reviews: What Our Clients Say",
  description:
    "Real 5-star Google reviews from the Vancouver Island small businesses we have built websites for, reproduced word for word.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Reviews: What Our Clients Say",
    description:
      "Real 5-star Google reviews from the Vancouver Island small businesses we have built websites for.",
    url: "/reviews",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviews: What Our Clients Say",
    description:
      "Real 5-star Google reviews from the Vancouver Island small businesses we have built websites for.",
  },
};

export default function ReviewsPage() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Plain WebPage only. The reviews themselves are intentionally not
          marked up - self-serving review markup earns no rich result and
          breaks Google's guidelines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE}/reviews`,
            name: "Reviews: What Our Clients Say",
            description:
              "Real 5-star Google reviews from the Vancouver Island small businesses VDT Sites has built websites for.",
            isPartOf: { "@id": `${SITE}/#website` },
            about: { "@id": `${SITE}/#business` },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Reviews",
                  item: `${SITE}/reviews`,
                },
              ],
            },
          }),
        }}
      />

      {/* header - mirrors /work and /about so the chrome is identical.
          data-nosnippet keeps Google from building the SERP snippet out of
          the nav (see the note on work/[slug]/page.tsx). */}
      <header className="flex items-center justify-between px-4 py-4 md:px-14 md:py-6">
        <div data-nosnippet className="contents">
          <a href="/" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vdt-glass-logo.png"
              alt="VDT Sites"
              className="h-8 w-8 md:h-[34px] md:w-[34px]"
            />
            <span
              className="text-[12px] font-extrabold tracking-[0.10em] md:text-[13px]"
              style={{ fontFamily: SYNE }}
            >
              VDT&nbsp;SITES
            </span>
          </a>
          <a
            href="/contact"
            className="rounded-full bg-[#dc2626] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#b91c1c] md:px-6 md:py-2.5 md:text-[14px]"
          >
            Get a quote
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* hero - headline + one CTA, left aligned, ghost wordmark filling
            the space. House pattern, matches /about and /services. */}
        <section className="relative px-6 pb-4 pt-10 md:px-14 md:pt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-0 select-none text-[128px] font-extrabold leading-none tracking-tight text-[#0d0d0d]/[0.035] md:-right-6 md:text-[230px]"
            style={{ fontFamily: SYNE }}
          >
            VDT
          </span>
          <div className="relative mx-auto max-w-6xl">
            <h1
              className="max-w-[14ch] text-[40px] font-bold leading-[1.02] md:text-[76px]"
              style={{ fontFamily: SYNE }}
            >
              What our clients say
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href="/contact"
                className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
              >
                Get a free quote
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-semibold underline decoration-[#dc2626] decoration-2 underline-offset-[6px] transition-colors hover:text-[#dc2626]"
              >
                or read them on Google
              </a>
            </div>
          </div>
        </section>

        {/* lead-in - the copy that would otherwise have sat under the H1 */}
        <section className="px-6 pt-12 md:px-14 md:pt-16">
          <div className="mx-auto max-w-6xl">
            <p className="max-w-2xl text-[17px] leading-relaxed text-[#0d0d0d]/70 md:text-[19px]">
              Every review on this page is a real 5&nbsp;star review left on our
              Google Business Profile, reproduced word for word. We have not
              edited them, shortened them or written any of them ourselves.
            </p>
          </div>
        </section>

        {/* lead review - full width, oversized, breaks the rhythm of the
            rows below so the set does not read as a repeating grid */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <figure className="relative border-t border-black/10 pt-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 left-0 select-none text-[110px] leading-none text-[#dc2626]/15 md:-top-6 md:text-[170px]"
                  style={{ fontFamily: SYNE }}
                >
                  &ldquo;
                </span>
                <div className="relative">
                  <Stars size={18} />
                  <blockquote
                    className="mt-5 max-w-4xl text-[24px] font-bold leading-[1.28] md:text-[38px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {LEAD.quote}
                  </blockquote>
                  <figcaption className="mt-6 text-[14px] font-semibold text-[#0d0d0d]/60">
                    {LEAD.author}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* the rest - hairline-divided rows, author in its own column on
            desktop. No boxes: rules between items, not boxes around them. */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-6xl">
            <ul>
              {REST.map((t, i) => (
                <li key={t.author}>
                  <Reveal delay={i * 90}>
                    <figure className="grid gap-4 border-t border-black/10 py-9 md:grid-cols-[220px_1fr] md:gap-10 md:py-11">
                      <div className="md:pt-1">
                        <Stars />
                        <figcaption className="mt-3 text-[14px] font-semibold text-[#0d0d0d]">
                          {t.author}
                        </figcaption>
                      </div>
                      <blockquote className="text-[17px] leading-[1.6] text-[#0d0d0d]/75 md:text-[19px]">
                        {t.quote}
                      </blockquote>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
            <div className="border-t border-black/10" />
          </div>
        </section>

        {/* provenance + where to leave one */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-2xl">
                <h2
                  className="text-[26px] font-bold md:text-[34px]"
                  style={{ fontFamily: SYNE }}
                >
                  Where these come from
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-[#0d0d0d]/70">
                  All of them were left on our Google Business Profile, where
                  anyone can read them alongside our star rating. We keep them
                  here as well so you do not have to go looking, but Google is
                  the source and the place to check us against.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <a
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-semibold text-[#dc2626] hover:underline"
                  >
                    Read them all on Google &rarr;
                  </a>
                  <a
                    href="/work"
                    className="text-[15px] font-semibold text-[#0d0d0d]/60 transition-colors hover:text-[#dc2626]"
                  >
                    See the work behind them &rarr;
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* cta - one button plus a call link, never two buttons */}
        <section className="px-6 py-20 text-center md:py-28">
          <h2
            className="mx-auto max-w-2xl text-[26px] font-bold leading-[1.15] md:text-[36px]"
            style={{ fontFamily: SYNE }}
          >
            Want to be the next one?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-[#0d0d0d]/70">
            Tell us about the business and we&rsquo;ll come back with a straight
            answer on what it needs and what it costs.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <a
              href="/contact"
              className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
            >
              Get a free quote
            </a>
            <a
              href="tel:+12506162087"
              className="text-[15px] font-semibold underline decoration-[#dc2626] decoration-2 underline-offset-[6px] transition-colors hover:text-[#dc2626]"
            >
              or call 250-616-2087
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
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
