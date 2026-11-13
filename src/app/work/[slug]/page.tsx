import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy, getCaseReview } from "@/lib/caseStudies";
import { siteShotAlt } from "@/lib/imageAlt";
import { GOOGLE_REVIEWS_URL } from "@/lib/testimonials";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import Stars from "@/components/Stars";
import ZohoPartnerBadge from "@/components/ZohoPartnerBadge";

/**
 * /work/[slug] — one case study per portfolio project.
 *
 * SEO intent: each page owns one long-tail local query ("food truck website
 * Vancouver Island" etc.) with genuine first-hand build detail, which is the
 * content profile the 2026 core updates reward. Structured data ties every
 * page back to the ProfessionalService entity declared on the homepage
 * (@id https://vdtsites.com/#business) so the case studies feed the same
 * entity Google already knows.
 *
 * Fully static: generateStaticParams covers every slug, so these prerender
 * and serve from the edge cache like the rest of the public site.
 */

/** Display face (headings 30px+). Bebas Neue is caps-only with one weight,
 * so the inline weight pins it to 400 over any font-bold class. */
const DISPLAY = { fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontWeight: 400, letterSpacing: "0.01em" } as const;
/** Body and small headings: Roboto. */
const BODY = "'Roboto', system-ui, sans-serif";
const BODY_STYLE = { fontFamily: BODY } as const;
const SITE = "https://vdtsites.com";
/** Chapter headings (The brand / The website / The app) on multi-part projects. */
const CHAPTER_H2 = "text-[48px] leading-[0.95] md:text-[72px]";
/** Reviews longer than this render as body text rather than a pull quote. */
const LONG_QUOTE = 600;

/** Star emoji some reviewers open with; the real stars sit under the quote. */
const cleanQuote = (q: string) => q.replace(/^(?:\s*⭐️?)+\s*/u, "").trim();
/** Grain for the dark result slab. Matches /services. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  if (!cs) return {};
  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: cs.metaTitle,
      description: cs.metaDescription,
      images: [`${SITE}/work-case/${cs.slug}-hero.webp`],
    },
    // Without this, the layout's static twitter title/description win the
    // metadata merge and every case study shares one generic card.
    twitter: {
      card: "summary_large_image",
      title: cs.metaTitle,
      description: cs.metaDescription,
      images: [`${SITE}/work-case/${cs.slug}-hero.webp`],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();

  const review = getCaseReview(cs);
  const i = CASE_STUDIES.findIndex((c) => c.slug === cs.slug);
  const prev = CASE_STUDIES[(i + CASE_STUDIES.length - 1) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]" style={BODY_STYLE}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300..900&display=swap"
        rel="stylesheet"
      />

      {/* CreativeWork + breadcrumbs, tied to the #business entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `${SITE}/work/${cs.slug}`,
              name: cs.metaTitle,
              description: cs.metaDescription,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: {
                "@type": "CreativeWork",
                name: cs.brand || cs.app ? `${cs.name} logo, website and app` : `${cs.name} website`,
                about: cs.kicker,
                url: cs.liveUrl ?? `${SITE}/work/${cs.slug}`,
                dateCreated: cs.year,
                image: `${SITE}/work-case/${cs.slug}-hero.webp`,
                creator: { "@id": `${SITE}/#business` },
                // A multi-part project lists each deliverable, so the logo and the
                // app are entities in their own right, not just words on the page.
                ...(cs.brand || cs.app
                  ? {
                      hasPart: [
                        ...(cs.brand
                          ? [
                              {
                                "@type": "ImageObject",
                                name: `${cs.name} logo`,
                                contentUrl: `${SITE}${cs.brand.logos[0].src}`,
                                creator: { "@id": `${SITE}/#business` },
                              },
                            ]
                          : []),
                        ...(cs.liveUrl
                          ? [{ "@type": "WebSite", name: `${cs.name} website`, url: cs.liveUrl, creator: { "@id": `${SITE}/#business` } }]
                          : []),
                        ...(cs.app
                          ? [
                              {
                                "@type": "SoftwareApplication",
                                name: `${cs.name} job app`,
                                applicationCategory: "BusinessApplication",
                                operatingSystem: "Web, iOS, Android",
                                creator: { "@id": `${SITE}/#business` },
                              },
                            ]
                          : []),
                      ],
                    }
                  : {}),
              },
            },
            ...(cs.faq?.length
              ? [
                  {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: cs.faq.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  },
                ]
              : []),
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/work` },
                { "@type": "ListItem", position: 3, name: cs.name, item: `${SITE}/work/${cs.slug}` },
              ],
            },
          ]),
        }}
      />

      {/* header

          data-nosnippet: Google was building the /work/* sitelink snippets out
          of this chrome instead of the meta description, so the SERP read
          "VDT SITES All workGet a quote Home/Work/...". The wrapper is
          display:contents so the flex layout is untouched; it exists purely so
          the attribute sits on a <div>, which is one of the three elements
          (div/span/section) Google actually honours it on. */}
      {/* "Work" in the shared row is the old "All work" link. */}
      <PageHeader activeHref="/work" noSnippet />

      <main className="flex-1">
        {/* breadcrumb (visible) — also nosnippet, see the header note above */}
        <nav aria-label="Breadcrumb" className="px-6 pt-2 text-[13px] text-[#0d0d0d]/50 md:px-14">
          <span data-nosnippet>
            <a href="/" className="hover:text-[#0d0d0d]">Home</a>
            <span className="mx-2">/</span>
            <a href="/work" className="hover:text-[#0d0d0d]">Work</a>
            <span className="mx-2">/</span>
            <span className="text-[#0d0d0d]/80">{cs.name}</span>
          </span>
        </nav>

        {/* hero */}
        <section className="px-6 pt-8 md:px-14 md:pt-12">
          <div className="mx-auto max-w-6xl">
            {/* The kicker used to sit above the H1 as an uppercase eyebrow,
                which Shared/Design Preferences rules out. It carries real
                information though, so it moves below the headline and joins
                the stack line as a meta row rather than being deleted. */}
            <h1
              className="max-w-3xl text-[44px] font-bold leading-[1.05] md:text-[73px]"
              style={DISPLAY}
            >
              {cs.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#0d0d0d]/70 md:text-[17px]">
              {cs.intro}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              {cs.liveUrl && (
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
                >
                  Visit the live site
                </a>
              )}
              {cs.retiredNote && (
                <p className="w-full text-[14px] font-medium text-[#0d0d0d]/70">{cs.retiredNote}</p>
              )}
              <span className="text-[13.5px] text-[#0d0d0d]/50">
                {cs.kicker} · {cs.stackLine}
              </span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-hero.webp`}
              alt={siteShotAlt(cs.name, cs.kicker)}
              className="mt-10 w-full rounded-2xl border border-black/10 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
              width={1200}
              height={900}
            />
          </div>
        </section>

        {/* story */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="text-[20px] font-bold" style={BODY_STYLE}>
                The client
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.client}</p>
            </div>
            <div>
              <h2 className="text-[20px] font-bold" style={BODY_STYLE}>
                What they needed
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.needed}</p>
            </div>
          </div>
          {/* Service pages this project used: internal links up to the money pages. */}
          {cs.services?.length ? (
            <p className="mx-auto mt-8 max-w-6xl text-[13.5px] leading-[1.9] text-[#0d0d0d]/55">
              Services in this project:{" "}
              {cs.services.map((l, k) => (
                <span key={l.href}>
                  {k > 0 && <span aria-hidden="true"> · </span>}
                  <a
                    href={l.href}
                    className="font-medium text-[#0d0d0d]/80 underline decoration-[#dc2626]/40 decoration-2 underline-offset-[5px] transition-colors hover:text-[#dc2626] hover:decoration-[#dc2626]"
                  >
                    {l.label}
                  </a>
                </span>
              ))}
            </p>
          ) : null}
        </section>

        {/* the brand (only for projects that included a logo and print) */}
        {cs.brand && (
          <section className="px-6 pt-16 md:px-14 md:pt-24" aria-labelledby="chapter-brand">
            <div className="mx-auto max-w-6xl">
              <h2 id="chapter-brand" className={CHAPTER_H2} style={DISPLAY}>
                {cs.brand.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70 md:text-[16px]">
                {cs.brand.intro}
              </p>

              {/* Logo on both grounds; the small-size icon sits on the seam
                  between them rather than floating loose (Design Preferences:
                  overlays anchor to an edge or seam). */}
              <div className="relative mt-10 grid gap-5 md:mt-16 md:grid-cols-2">
                {cs.brand.logos.map((l) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={l.src}
                    src={l.src}
                    alt={l.alt}
                    width={l.width}
                    height={l.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-[24px] shadow-[0_22px_48px_-22px_rgba(0,0,0,0.45)]"
                  />
                ))}
                {cs.brand.icon && (
                  <figure className="flex items-center gap-4 md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 md:flex-col md:gap-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cs.brand.icon.src}
                      alt={cs.brand.icon.alt}
                      width={cs.brand.icon.width}
                      height={cs.brand.icon.height}
                      loading="lazy"
                      decoding="async"
                      className="size-16 shrink-0 rounded-[22%] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] ring-4 ring-[#f4efe6] md:size-24"
                    />
                    <figcaption className="text-[13px] leading-snug text-[#0d0d0d]/60 md:sr-only">
                      {cs.brand.icon.caption}
                    </figcaption>
                  </figure>
                )}
              </div>
              {cs.brand.icon && (
                <p className="mt-4 hidden text-center text-[13px] text-[#0d0d0d]/55 md:block">{cs.brand.icon.caption}</p>
              )}

              {/* Business cards: the back tucked behind the front, one stack per colourway. */}
              <div className="mt-14 grid gap-12 md:mt-12 md:grid-cols-2 md:gap-10">
                {cs.brand.cards.map((c) => (
                  <figure key={c.label} className="group">
                    <div className="relative pr-[10%] pt-[12%]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.back.src}
                        alt={c.back.alt}
                        width={c.back.width}
                        height={c.back.height}
                        loading="lazy"
                        decoding="async"
                        className="absolute right-0 top-0 w-[90%] rotate-[3deg] rounded-[12px] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.45)] transition-transform duration-500 motion-safe:group-hover:translate-x-2 motion-safe:group-hover:-translate-y-2"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.front.src}
                        alt={c.front.alt}
                        width={c.front.width}
                        height={c.front.height}
                        loading="lazy"
                        decoding="async"
                        className="relative w-[90%] -rotate-[2deg] rounded-[12px] shadow-[0_26px_50px_-18px_rgba(0,0,0,0.55)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1"
                      />
                    </div>
                    <figcaption className="mt-6 text-[13.5px] text-[#0d0d0d]/55">
                      <span className="font-semibold text-[#0d0d0d]">{c.label}</span> business card, front and back
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
                {cs.brand.notes.map((n) => (
                  <div key={n.title}>
                    <h3 className="text-[16px] font-bold">{n.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.7] text-[#0d0d0d]/70">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* what we built */}
        <section className="px-6 pt-14 md:px-14 md:pt-20" aria-labelledby="chapter-website">
          <div className="mx-auto max-w-6xl">
            {cs.websiteHeading ? (
              <h2 id="chapter-website" className={CHAPTER_H2} style={DISPLAY}>
                {cs.websiteHeading}
              </h2>
            ) : (
              <h2 id="chapter-website" className="text-[24px] font-bold" style={BODY_STYLE}>
                What we built
              </h2>
            )}
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70">
              {cs.builtIntro}
            </p>
            {/* Four cards sit best as 2 x 2; five or six use the wider page as threes. */}
            <div className={`mt-8 grid gap-7 md:grid-cols-2 ${cs.built.length === 4 ? "" : "lg:grid-cols-3"}`}>
              {cs.built.map((f) => (
                <div key={f.title} className="rounded-xl border border-black/10 bg-white/55 p-6">
                  <h3 className="text-[16px] font-bold" style={BODY_STYLE}>
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.7] text-[#0d0d0d]/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* screenshots */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-desktop.webp`}
              alt={siteShotAlt(cs.name, cs.kicker, "shown on a desktop screen")}
              className="w-full rounded-xl border border-black/10 md:w-[68%]"
              loading="lazy"
              decoding="async"
              width={1400}
              height={875}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-mobile.webp`}
              alt={siteShotAlt(cs.name, cs.kicker, "shown on a phone")}
              className="w-full max-w-[240px] self-center rounded-xl border border-black/10 md:w-[26%] md:self-start"
              loading="lazy"
              decoding="async"
              width={640}
              height={1385}
            />
          </div>
        </section>

        {/* the app (only for projects that included one) */}
        {cs.app && (
          <section className="px-6 pt-16 md:px-14 md:pt-24" aria-labelledby="chapter-app">
            <div className="mx-auto max-w-6xl">
              <h2 id="chapter-app" className={CHAPTER_H2} style={DISPLAY}>
                {cs.app.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70 md:text-[16px]">
                {cs.app.intro}
              </p>

              {/* The desktop view sits behind; the phones stand on its lower
                  edge, so the two read as one product at two sizes. */}
              {cs.app.desktop && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cs.app.desktop.src}
                  alt={cs.app.desktop.alt}
                  width={cs.app.desktop.width}
                  height={cs.app.desktop.height}
                  loading="lazy"
                  decoding="async"
                  className="mt-10 w-full rounded-[24px] border border-black/10 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)]"
                />
              )}
              <div
                className={`relative grid grid-cols-2 gap-x-4 gap-y-8 px-2 md:grid-cols-4 md:gap-6 md:px-8 ${
                  cs.app.desktop ? "-mt-[10%] md:-mt-[13%]" : "mt-10"
                }`}
              >
                {cs.app.phones.map((ph) => (
                  <figure key={ph.src}>
                    <div className="rounded-[30px] bg-[#111] p-[5px] shadow-[0_26px_50px_-20px_rgba(0,0,0,0.6)] md:rounded-[38px] md:p-[7px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ph.src}
                        alt={ph.alt}
                        width={ph.width}
                        height={ph.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-[25px] md:rounded-[31px]"
                      />
                    </div>
                    <figcaption className="mt-3 text-[13px] leading-snug text-[#0d0d0d]/60">{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
              {cs.app.note && <p className="mt-6 text-[12.5px] text-[#0d0d0d]/45">{cs.app.note}</p>}

              <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3">
                {cs.app.features.map((f) => (
                  <div key={f.title}>
                    <h3 className="text-[16px] font-bold">{f.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.7] text-[#0d0d0d]/70">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* design notes */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-[20px] font-bold" style={BODY_STYLE}>
              Design notes
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.design}</p>
          </div>
        </section>

        {/* results */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[18px] bg-[#0d0d0d] px-7 py-10 text-white md:rounded-[24px] md:rounded-br-[72px] md:px-10 md:py-12"
            style={{ backgroundImage: GRAIN, backgroundBlendMode: "overlay" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent opacity-70"
            />
            <h2 className="text-[20px] font-bold" style={BODY_STYLE}>
              The result
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {cs.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[22px] font-bold text-[#ff6b5e] md:text-[24px]" style={BODY_STYLE}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-white/65">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-[15px] leading-[1.75] text-white/80">{cs.result}</p>
          </div>
        </section>

        {/* What the client said

            Only renders when this client actually reviewed us on the Business
            Profile (`reviewAuthor` on the case study). Sits after "The result"
            on purpose: our account of the outcome, then theirs, then the CTA.

            Deliberately no Review / aggregateRating JSON-LD here, same as
            everywhere else these render - see the note in lib/testimonials.ts.
            The link goes to the Business Profile so the stars are earned there. */}
        {review && (
          <section className="px-6 pt-14 md:px-14 md:pt-20">
            <figure className="mx-auto max-w-6xl">
              <h2 className="text-[20px] font-bold" style={BODY_STYLE}>
                What the client said
              </h2>
              {/* A short review reads as a pull quote in Syne. A long one (Junk
                  Matters' runs past 1,600 characters) is a wall in a wide
                  display face, so it drops to body type across the full section
                  width (Sem: match the width of the sections above). */}
              {(() => {
                const quote = cleanQuote(review.quote);
                if (quote.length <= LONG_QUOTE) {
                  return (
                    <blockquote
                      className="mt-5 max-w-3xl text-[19px] leading-[1.6] text-[#0d0d0d]/85 md:text-[22px] md:leading-[1.55]"
                      style={BODY_STYLE}
                    >
                      <span aria-hidden="true" className="text-[#dc2626]">&ldquo;</span>
                      {quote}
                      <span aria-hidden="true" className="text-[#dc2626]">&rdquo;</span>
                    </blockquote>
                  );
                }
                return (
                  <blockquote className="mt-5 text-[16px] leading-[1.75] text-[#0d0d0d]/80 md:text-[17px]">
                    <span aria-hidden="true" className="text-[#dc2626]">&ldquo;</span>
                    {quote}
                    <span aria-hidden="true" className="text-[#dc2626]">&rdquo;</span>
                  </blockquote>
                );
              })()}
              <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
                <Stars />
                <span className="font-semibold">{review.displayAuthor}</span>
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-[#0d0d0d]/55 underline decoration-[#dc2626] decoration-2 underline-offset-[5px] transition-colors hover:text-[#dc2626]"
                >
                  Read it on Google
                </a>
              </figcaption>
            </figure>
          </section>
        )}

        {/* FAQ: the one quiet hairline list on the page; FAQPage data is in the head script */}
        {cs.faq?.length ? (
          <section className="px-6 pt-14 md:px-14 md:pt-20" aria-labelledby="case-faq">
            <div className="mx-auto max-w-6xl">
              <h2 id="case-faq" className="text-[20px] font-bold">
                Common questions
              </h2>
              <div className="mt-4 max-w-3xl border-t border-black/10">
                {cs.faq.map((f) => (
                  <details key={f.q} className="group border-b border-black/10 py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15.5px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                      <h3 className="font-semibold">{f.q}</h3>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 text-[20px] leading-none text-[#dc2626] transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.75] text-[#0d0d0d]/70">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <section className="px-6 pb-6 pt-14 text-center md:pt-20">
          <h2 className="mx-auto max-w-xl text-[34px] font-bold leading-[1.15] md:text-[44px]" style={DISPLAY}>
            {cs.brand || cs.app ? "Want a brand, site or app like this?" : "Want a site like this for your business?"}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#0d0d0d]/65">
            Every project is quoted up front, based on what your business actually needs.
            It starts with a conversation, and the quote is free.
          </p>
          {/* One button plus a call link, not two buttons side by side. */}
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

        {/* prev / next */}
        <nav aria-label="More projects" className="px-6 pb-16 pt-10 md:px-14">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-black/10 pt-6 text-[14px] font-semibold">
            <a href={`/work/${prev.slug}`} className="hover:text-[#dc2626]">
              ← {prev.name}
            </a>
            <a href="/work" className="text-[#0d0d0d]/60 hover:text-[#dc2626]">
              All work
            </a>
            <a href={`/work/${next.slug}`} className="text-right hover:text-[#dc2626]">
              {next.name} →
            </a>
          </div>
        </nav>
      </main>

      <ServiceAreas />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
        <span>© {new Date().getFullYear()} VDT Sites · Built in Nanaimo, BC</span>
        <ZohoPartnerBadge className="hover:text-[#0d0d0d]" />
        <nav aria-label="Legal" className="flex gap-5">
          <a href="/terms-of-service" className="hover:text-[#0d0d0d]">Terms</a>
          <a href="/privacy-policy" className="hover:text-[#0d0d0d]">Privacy</a>
          <a href="/cookie-policy" className="hover:text-[#0d0d0d]">Cookies</a>
        </nav>
      </footer>
    </div>
  );
}
