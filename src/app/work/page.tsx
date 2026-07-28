import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/caseStudies";

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
};

export default function WorkIndexPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
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
        <a
          href="/contact"
          className="rounded-full bg-[#dc2626] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#b91c1c] md:px-6 md:py-2.5 md:text-[14px]"
        >
          Get a quote
        </a>
      </header>

      <main className="flex-1">
        <section className="px-6 pt-8 text-center md:pt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
            Nanaimo · Vancouver Island
          </p>
          <h1
            className="mx-auto mt-4 max-w-3xl text-[34px] font-bold leading-[1.05] md:text-[54px]"
            style={{ fontFamily: SYNE }}
          >
            Work we&rsquo;re proud to sign.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#0d0d0d]/70 md:text-[17px]">
            Every site here was designed and built from scratch for a real small
            business. Click any project for the full story: what they needed, what
            we built and what it changed.
          </p>
        </section>

        <section className="px-6 pb-20 pt-12 md:px-14 md:pt-16">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
            {CASE_STUDIES.map((c) => (
              <a
                key={c.slug}
                href={`/work/${c.slug}`}
                className="group rounded-2xl border border-black/10 bg-white/55 p-4 transition-shadow hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)]"
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc2626]">
                    {c.kicker}
                  </p>
                  <h2 className="mt-1.5 text-[19px] font-bold" style={{ fontFamily: SYNE }}>
                    {c.name}
                  </h2>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-[#0d0d0d]/65">
                    {c.intro}
                  </p>
                  <span className="mt-3 inline-block text-[13.5px] font-semibold text-[#dc2626] group-hover:underline">
                    Read the case study →
                  </span>
                </div>
              </a>
            ))}
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
