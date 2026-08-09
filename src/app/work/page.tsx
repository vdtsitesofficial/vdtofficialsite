import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/caseStudies";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";

/**
 * /work — case study index. Links every project page and carries
 * CollectionPage + ItemList structured data so crawlers see the set.
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

export const metadata: Metadata = {
  title: "Our Work: Small Business Websites on Vancouver Island",
  description:
    "Case studies of websites we designed and built for Vancouver Island small businesses: coffee roasters, food trucks, counsellors, importers, campaigns and more.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Our Work: Small Business Websites on Vancouver Island",
    description:
      "Case studies of websites we designed and built for Vancouver Island small businesses.",
    images: [`${SITE}/work-case/isle-air-chicken-hero.webp`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work: Small Business Websites on Vancouver Island",
    description:
      "Case studies of websites we designed and built for Vancouver Island small businesses.",
    images: [`${SITE}/work-case/isle-air-chicken-hero.webp`],
  },
};

export default function WorkIndexPage() {
  const [featured, ...rest] = CASE_STUDIES;

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE}/work`,
            name: "VDT Sites work and case studies",
            isPartOf: { "@id": `${SITE}/#website` },
            about: { "@id": `${SITE}/#business` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: CASE_STUDIES.map((c, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: c.name,
                url: `${SITE}/work/${c.slug}`,
              })),
            },
          }),
        }}
      />

      {/* header */}
      <PageHeader activeHref="/work" />

      <main className="flex-1">
        {/* hero — headline + CTA only, left aligned, ghost wordmark filling
            the space. Matches /services and /about; see Shared/Design
            Preferences on eyebrow kickers and hero paragraphs. */}
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
              className="max-w-[15ch] text-[40px] font-bold leading-[1.02] md:text-[76px]"
              style={{ fontFamily: SYNE }}
            >
              Work we&rsquo;re proud to sign.
            </h1>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href="/contact"
                className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
              >
                Get a free quote
              </a>
              <a
                href="/services"
                className="text-[15px] font-semibold underline decoration-black/25 decoration-2 underline-offset-[6px] transition-colors hover:decoration-[#dc2626]"
              >
                or see what we do
              </a>
            </div>
          </div>
        </section>

        {/* lead-in, moved out of the hero */}
        <section className="px-6 pt-16 md:px-14 md:pt-20">
          <Reveal>
            <p
              className="mx-auto max-w-4xl text-[21px] leading-[1.55] md:text-[30px]"
              style={{ fontFamily: SYNE }}
            >
              Every site here was designed and built from scratch for a real
              small business.{" "}
              <span className="text-[#0d0d0d]/45">
                Click any project for the full story: what they needed, what we
                built and what it changed.
              </span>
            </p>
          </Reveal>
        </section>

        {/* The lead project runs full width before the grid picks up. Eight
            identical tiles is the "perfectly uniform card grid" tell from
            Shared/Design Preferences; giving the first one a different shape
            breaks the pattern and gives the page somewhere to start. */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <Reveal>
            <a
              href={`/work/${featured.slug}`}
              className="group mx-auto block max-w-6xl overflow-hidden rounded-[18px] rounded-br-[64px] border border-black/10 bg-white/55 p-4 transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-5"
            >
              <div className="grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/work-case/${featured.slug}-hero.webp`}
                  alt={`${featured.name} website by VDT Sites`}
                  className="w-full rounded-xl border border-black/10"
                  decoding="async"
                  width={1200}
                  height={900}
                />
                <div className="px-2 pb-2 md:pr-6">
                  <h2
                    className="text-[26px] font-bold leading-[1.1] md:text-[36px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {featured.name}
                  </h2>
                  <p className="mt-3 text-[15.5px] leading-[1.7] text-[#0d0d0d]/65">
                    {featured.intro}
                  </p>
                  <span className="mt-5 inline-block text-[14.5px] font-semibold text-[#dc2626] underline decoration-2 underline-offset-[6px] decoration-[#dc2626]/30 transition-colors group-hover:decoration-[#dc2626]">
                    Read the case study
                  </span>
                </div>
              </div>
            </a>
          </Reveal>
        </section>

        <section className="px-6 pb-20 pt-8 md:px-14 md:pt-10">
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 70}>
                <a
                  href={`/work/${c.slug}`}
                  className="group block h-full rounded-2xl border border-black/10 bg-white/55 p-4 transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/work-case/${c.slug}-hero.webp`}
                    alt={`${c.name} website by VDT Sites`}
                    className="w-full rounded-xl border border-black/10"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={900}
                  />
                  <div className="px-2 pb-2 pt-4">
                    <h2 className="text-[19px] font-bold" style={{ fontFamily: SYNE }}>
                      {c.name}
                    </h2>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-[#0d0d0d]/65">
                      {c.intro}
                    </p>
                    <span className="mt-3 inline-block text-[13.5px] font-semibold text-[#dc2626] underline decoration-2 underline-offset-[5px] decoration-[#dc2626]/25 transition-colors group-hover:decoration-[#dc2626]">
                      Read the case study
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Mirrors the /about page's "See our work" CTA in the opposite
            direction, so the two proof pages point at each other instead of
            both dead-ending at /contact. Reuses the /about headshots. */}
        <section className="px-6 pb-20 md:px-14">
          <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white/55 px-6 py-9 text-center">
            <div className="flex items-center justify-center -space-x-3">
              {/* Dedicated 168px square crops, NOT the 800x1000 portraits.
                  Letting the browser squeeze a 4:5 portrait into a 56px
                  circle downscaled ~14x (aliased and soft) and, with
                  object-top, framed head-through-chest so the face was
                  tiny. These are cropped tight on the face at 3x the
                  display size instead. */}
              {[
                { src: "/team/sem-avatar.webp", alt: "Sem van Duist" },
                { src: "/team/phillip-avatar.webp", alt: "Phillip Treitel" },
              ].map((p) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={168}
                  height={168}
                  className="size-14 rounded-full border-2 border-[#f4efe6] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <h2
              className="mt-4 text-[22px] font-bold md:text-[26px]"
              style={{ fontFamily: SYNE }}
            >
              Who you&rsquo;d actually be working with
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#0d0d0d]/70">
              Every project above was designed and built by the two of us, no
              subcontractors and no account managers in between.
            </p>
            <a
              href="/about"
              className="mt-5 inline-block text-[14px] font-semibold text-[#dc2626] hover:underline"
            >
              Meet Sem and Phillip &rarr;
            </a>
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
