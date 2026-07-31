import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/lib/caseStudies";

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

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

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

  const i = CASE_STUDIES.findIndex((c) => c.slug === cs.slug);
  const prev = CASE_STUDIES[(i + CASE_STUDIES.length - 1) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
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
                name: `${cs.name} website`,
                about: cs.kicker,
                url: cs.liveUrl,
                dateCreated: cs.year,
                image: `${SITE}/work-case/${cs.slug}-hero.webp`,
                creator: { "@id": `${SITE}/#business` },
              },
            },
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

      {/* header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-14 md:py-6">
        <a href="/" className="inline-flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vdt-glass-logo.png" alt="VDT Sites" className="h-8 w-8 md:h-[34px] md:w-[34px]" />
          <span
            className="text-[12px] font-extrabold tracking-[0.10em] md:text-[13px]"
            style={{ fontFamily: SYNE }}
          >
            VDT&nbsp;SITES
          </span>
        </a>
        <nav className="flex items-center gap-5 text-[13px] font-semibold md:text-[14px]">
          <a href="/work" className="hover:text-[#dc2626]">All work</a>
          <a
            href="/contact"
            className="rounded-full bg-[#dc2626] px-4 py-2 text-white transition-colors hover:bg-[#b91c1c] md:px-6 md:py-2.5"
          >
            Get a quote
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* breadcrumb (visible) */}
        <nav aria-label="Breadcrumb" className="px-6 pt-2 text-[13px] text-[#0d0d0d]/50 md:px-14">
          <a href="/" className="hover:text-[#0d0d0d]">Home</a>
          <span className="mx-2">/</span>
          <a href="/work" className="hover:text-[#0d0d0d]">Work</a>
          <span className="mx-2">/</span>
          <span className="text-[#0d0d0d]/80">{cs.name}</span>
        </nav>

        {/* hero */}
        <section className="px-6 pt-8 md:px-14 md:pt-12">
          <div className="mx-auto max-w-4xl">
            {/* The kicker used to sit above the H1 as an uppercase eyebrow,
                which Shared/Design Preferences rules out. It carries real
                information though, so it moves below the headline and joins
                the stack line as a meta row rather than being deleted. */}
            <h1
              className="max-w-3xl text-[34px] font-bold leading-[1.05] md:text-[56px]"
              style={{ fontFamily: SYNE }}
            >
              {cs.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#0d0d0d]/70 md:text-[17px]">
              {cs.intro}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={cs.liveUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
              >
                Visit the live site
              </a>
              <span className="text-[13.5px] text-[#0d0d0d]/50">
                {cs.kicker} · {cs.stackLine}
              </span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-hero.webp`}
              alt={`${cs.name} website, designed and built by VDT Sites`}
              className="mt-10 w-full rounded-2xl border border-black/10 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
              width={1200}
              height={900}
            />
          </div>
        </section>

        {/* story */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
              <h2 className="mt-4 text-[20px] font-bold" style={{ fontFamily: SYNE }}>
                The client
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.client}</p>
            </div>
            <div>
              <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
              <h2 className="mt-4 text-[20px] font-bold" style={{ fontFamily: SYNE }}>
                What they needed
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.needed}</p>
            </div>
          </div>
        </section>

        {/* what we built */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto max-w-4xl">
            <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
            <h2 className="mt-4 text-[24px] font-bold" style={{ fontFamily: SYNE }}>
              What we built
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70">
              {cs.builtIntro}
            </p>
            <div className="mt-8 grid gap-7 md:grid-cols-2">
              {cs.built.map((f) => (
                <div key={f.title} className="rounded-xl border border-black/10 bg-white/55 p-6">
                  <h3 className="text-[16px] font-bold" style={{ fontFamily: SYNE }}>
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
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-desktop.webp`}
              alt={`${cs.name} website on desktop`}
              className="w-full rounded-xl border border-black/10 md:w-[68%]"
              loading="lazy"
              decoding="async"
              width={1400}
              height={875}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/work-case/${cs.slug}-mobile.webp`}
              alt={`${cs.name} website on a phone`}
              className="w-full max-w-[240px] self-center rounded-xl border border-black/10 md:w-[26%] md:self-start"
              loading="lazy"
              decoding="async"
              width={640}
              height={1385}
            />
          </div>
        </section>

        {/* design notes */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto max-w-4xl">
            <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
            <h2 className="mt-4 text-[20px] font-bold" style={{ fontFamily: SYNE }}>
              Design notes
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/70">{cs.design}</p>
          </div>
        </section>

        {/* results */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div
            className="relative mx-auto max-w-4xl overflow-hidden rounded-[18px] bg-[#0d0d0d] px-7 py-10 text-white md:rounded-[24px] md:rounded-br-[72px] md:px-10 md:py-12"
            style={{ backgroundImage: GRAIN, backgroundBlendMode: "overlay" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent opacity-70"
            />
            <h2 className="text-[20px] font-bold" style={{ fontFamily: SYNE }}>
              The result
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {cs.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[22px] font-bold text-[#ff6b5e] md:text-[24px]" style={{ fontFamily: SYNE }}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-white/65">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-[15px] leading-[1.75] text-white/80">{cs.result}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-6 pt-14 text-center md:pt-20">
          <h2 className="mx-auto max-w-xl text-[26px] font-bold leading-[1.15] md:text-[34px]" style={{ fontFamily: SYNE }}>
            Want a site like this for your business?
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
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 border-t border-black/10 pt-6 text-[14px] font-semibold">
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
