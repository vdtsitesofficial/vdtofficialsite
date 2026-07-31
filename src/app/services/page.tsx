import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

/**
 * /services — the full menu of what VDT actually sells.
 *
 * Copy source: the 16 service descriptions written for the Google Business
 * Profile (vault: Projects/VDT/Google Business Profile). Reusing them keeps
 * the site and the GBP saying the same thing, which is what Google's "Ask
 * Maps" AI reads when it answers questions about the business.
 *
 * Two GBP entries ("Website Development", "Website Developer") are keyword
 * variants of the same offering rather than distinct services, so they are
 * covered by the Websites group instead of getting their own cards. A menu
 * that lists the same thing three times reads as padding.
 *
 * SEO intent: this page targets "web design services" / "website services
 * Vancouver Island", NOT "web design Nanaimo" — that query belongs to the
 * homepage, and /web-design-nanaimo is already noindexed for competing on
 * it. Keep the H1 and title off the homepage's exact query.
 *
 * Layout follows Shared/Design Preferences, which rules out three things
 * the first cut of this page did wrong: eyebrow kickers above headings
 * ("very AI"), a hero description paragraph (heroes are headline + CTA
 * only), and perfectly uniform card grids. Services are therefore listed
 * as hairline-divided editorial rows under a sticky group column, not as
 * fourteen identical boxes.
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

/** Starting price. Kept in one place so it cannot drift between sections. */
const FROM_PRICE = "$899";
const MONTHLY = "$40";

/**
 * Grain for the dark slabs. A flat #0d0d0d panel reads cheap at this size;
 * fractal noise at very low opacity is the difference between "a black box"
 * and a printed surface. Inline SVG so it costs no request.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Service = { name: string; body: string };
type ServiceGroup = {
  id: string;
  title: string;
  intro: string;
  services: Service[];
};

const GROUPS: ServiceGroup[] = [
  {
    id: "websites",
    title: "Websites",
    intro:
      "Every site is built for your business rather than assembled from a template. Fixed price quoted up front, so you know the number before anyone starts.",
    services: [
      {
        name: "Custom website design",
        body: "A website designed from scratch around your business, not a template with your logo dropped in. We plan the layout, write the structure and build a site that looks like nobody else's, then make sure it loads fast on every phone.",
      },
      {
        name: "Website redesign",
        body: "Turn a slow, dated or hard-to-edit website into something modern. We rebuild the site, keep the pages and rankings you already have, and move you onto hosting that does not break every time something updates.",
      },
      {
        name: "Small business websites",
        body: "Complete websites for local businesses, from a clean one-page site to a full multi-page build. Fixed price quoted up front, built to load fast and turn visitors into phone calls, with everything set up and ready to go live.",
      },
      {
        name: "Online stores",
        body: "Online stores with secure payments, product management and a checkout that works properly on a phone. We set up the products, shipping and payment processing, then show you how to manage orders yourself.",
      },
      {
        name: "Landing pages",
        body: "A single focused page built to convert, for a campaign, a new service or an ad. Fast loading, mobile first, with one clear call to action and a contact form that lands straight in your inbox.",
      },
    ],
  },
  {
    id: "hosting",
    title: "Hosting and care",
    intro:
      "The monthly fee covers everything it takes to keep the site online, current and safe. One bill, one person to call.",
    services: [
      {
        name: "Website hosting",
        body: "Fast, secure hosting on Cloudflare's global network. Your domain, SSL certificate, backups, security monitoring and ongoing support are all included in one flat monthly fee, with no surprise renewal spikes.",
      },
      {
        name: "Website maintenance",
        body: "Ongoing updates, edits, security patches and support so your site never goes stale. Text and image changes handled for you, plus monitoring so problems get fixed before your customers notice them.",
      },
      {
        name: "Domain registration",
        body: "We register and manage your domain name for you, including DNS setup, renewals and email routing. No juggling logins with a registrar you signed up for years ago and can no longer get into.",
      },
    ],
  },
  {
    id: "seo",
    title: "Local SEO and search",
    intro:
      "A site nobody can find is a poster. The search groundwork is built into every project, and we go further when you need to compete locally.",
    services: [
      {
        name: "Local SEO",
        body: "Get found by customers searching in your own city. We optimise your website and Google listing for local searches, fix the technical basics, and build the location signals that get you into Google's map results.",
      },
      {
        name: "Google Business Profile setup",
        body: "Claim, verify and fully build out your Google listing: categories, services, service areas, description, photos and posts. This is what decides whether you appear when someone nearby searches for what you sell.",
      },
      {
        name: "Search engine optimisation",
        body: "On-page SEO built into every site: clean page structure, fast load times, proper titles and descriptions, structured data and a sitemap Google can actually read. The groundwork that lets you rank at all.",
      },
    ],
  },
  {
    id: "brand",
    title: "Logo and brand",
    intro:
      "A logo is free with any website build, because a site and a brand that were designed apart always look it.",
    services: [
      {
        name: "Logo design",
        body: "A custom logo built for your business, delivered in every format you need for web, print and social. Designed to sit properly on your website rather than as a separate file that never quite matches.",
      },
      {
        name: "Brand identity design",
        body: "Colours, typography and visual style pulled together into one consistent look across your website, signage and social media, so your business is recognisable wherever a customer runs into it.",
      },
    ],
  },
  {
    id: "apps",
    title: "App development",
    intro:
      "VDT is two people. Sem runs the websites side, Phillip runs the app side, so a project that outgrows a website does not have to change companies.",
    services: [
      {
        name: "Mobile app development",
        body: "If what you need is closer to an app than a website, tell us what it has to do and we will scope it with you properly. That includes telling you when a website would do the same job for less, which is more often than most agencies will admit.",
      },
    ],
  },
];

/** What the monthly fee actually buys. Mirrors the FAQ answer on the homepage. */
const INCLUDED = [
  "Hosting on Cloudflare's global network",
  "Your domain name registered and managed",
  "SSL security certificate",
  "Backups and security monitoring",
  "Ongoing support from the person who built it",
  "Minor text and image edits free for the first month",
];

export const metadata: Metadata = {
  title: "Web Design Services & Pricing",
  description: `Websites, hosting, local SEO, logos and app development for small businesses on Vancouver Island. Custom sites from ${FROM_PRICE} plus ${MONTHLY} a month, quoted up front.`,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Web Design Services & Pricing | VDT Sites",
    description: `Websites, hosting, local SEO, logos and app development for small businesses on Vancouver Island. Custom sites from ${FROM_PRICE} plus ${MONTHLY} a month.`,
  },
  // Without this the layout's static twitter card wins the metadata merge.
  twitter: {
    card: "summary_large_image",
    title: "Web Design Services & Pricing | VDT Sites",
    description: `Websites, hosting, local SEO, logos and app development for small businesses on Vancouver Island.`,
  },
};

export default function ServicesPage() {
  const allServices = GROUPS.flatMap((g) => g.services);

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Service catalogue + breadcrumbs, tied to the #business entity so
          these feed the same entity Google already knows. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `${SITE}/services`,
              name: "Web design services and pricing",
              isPartOf: { "@id": `${SITE}/#website` },
              about: { "@id": `${SITE}/#business` },
              mainEntity: {
                "@type": "OfferCatalog",
                name: "VDT Sites services",
                itemListElement: GROUPS.map((g) => ({
                  "@type": "OfferCatalog",
                  name: g.title,
                  itemListElement: g.services.map((s) => ({
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: s.name,
                      description: s.body,
                      provider: { "@id": `${SITE}/#business` },
                    },
                  })),
                })),
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: `${SITE}/services`,
                },
              ],
            },
          ]),
        }}
      />

      {/* header — mirrors /work and /about so the chrome is identical */}
      <header className="flex items-center justify-between px-4 py-4 md:px-14 md:py-6">
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
      </header>

      <main className="flex-1">
        {/* breadcrumb (visible) */}
        <nav
          aria-label="Breadcrumb"
          className="px-6 pt-2 text-[13px] text-[#0d0d0d]/50 md:px-14"
        >
          <a href="/" className="hover:text-[#0d0d0d]">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-[#0d0d0d]/80">Services</span>
        </nav>

        {/* hero — headline + one CTA. No eyebrow, no description paragraph:
            both are called out in Shared/Design Preferences. The oversized
            faded wordmark is the "ghost text" treatment for the empty space
            rather than leaving a bare band. */}
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
              Everything a small business needs online.
            </h1>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href="/contact"
                className="group rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
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
          </div>
        </section>

        {/* price slab. Near full bleed with an asymmetric radius and a red
            hairline along the top edge, so the cream-to-dark change happens
            on a shaped seam instead of a flat colour meeting another. */}
        <section className="px-3 pt-14 md:px-6 md:pt-20">
          <Reveal>
            <div
              className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[18px] bg-[#0d0d0d] px-7 py-11 text-white md:rounded-[24px] md:rounded-br-[96px] md:px-16 md:py-16"
              style={{ backgroundImage: GRAIN, backgroundBlendMode: "overlay" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent opacity-70"
              />
              <div className="grid gap-10 md:grid-cols-[minmax(0,auto)_1fr] md:items-end md:gap-20">
                <div>
                  <p
                    className="text-[64px] font-bold leading-[0.95] md:text-[104px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {FROM_PRICE}
                  </p>
                  <p className="mt-3 text-[15px] text-white/60">
                    to build, then {MONTHLY} a month
                  </p>
                </div>
                <div className="max-w-2xl">
                  <p className="text-[16px] leading-[1.8] text-white/80 md:text-[17px]">
                    That is the starting point for a custom small business
                    site, not a stripped back version of one. Bigger builds
                    cost more and we tell you the number before any work
                    begins, so nothing arrives as a surprise on an invoice.
                  </p>
                  <p className="mt-5 text-[16px] leading-[1.8] text-white/80 md:text-[17px]">
                    The monthly fee is what keeps it running. There is no
                    separate hosting bill and no renewal spike in year two.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* positioning copy. Lives here rather than under the H1 so the hero
            stays headline + CTA. */}
        <section className="px-6 pt-20 md:px-14 md:pt-28">
          <Reveal>
            <p
              className="mx-auto max-w-4xl text-[21px] leading-[1.55] md:text-[30px]"
              style={{ fontFamily: SYNE }}
            >
              Most people come to us for a website. What they usually need is
              the website, somewhere reliable to host it, a logo that matches,
              and to actually show up when someone nearby searches.{" "}
              <span className="text-[#0d0d0d]/45">
                We do all of it, so you are not stitching together four
                suppliers who each blame the other three.
              </span>
            </p>
          </Reveal>
        </section>

        {/* service groups. Sticky group column on the left, hairline-divided
            rows on the right. Deliberately not a card grid. */}
        {GROUPS.map((group, gi) => (
          <section
            key={group.id}
            id={group.id}
            className="px-6 pt-20 md:px-14 md:pt-28"
          >
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
              <Reveal className="md:sticky md:top-12 md:self-start">
                <div className="flex items-baseline gap-4 md:block">
                  <span
                    aria-hidden="true"
                    className="text-[42px] font-extrabold leading-none text-[#dc2626]/20 md:text-[64px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-[27px] font-bold leading-[1.1] md:mt-4 md:text-[36px]"
                    style={{ fontFamily: SYNE }}
                  >
                    {group.title}
                  </h2>
                </div>
                <p className="mt-4 max-w-sm text-[15px] leading-[1.75] text-[#0d0d0d]/60">
                  {group.intro}
                </p>
              </Reveal>

              <div className="border-t border-black/10">
                {group.services.map((s, si) => (
                  <Reveal key={s.name} delay={si * 60}>
                    <article className="group border-b border-black/10 py-7 transition-colors duration-300 hover:bg-black/[0.025] md:py-8">
                      <div className="flex items-start gap-4 md:gap-6">
                        <span
                          aria-hidden="true"
                          className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#dc2626] transition-transform duration-300 group-hover:scale-[1.7]"
                        />
                        <div>
                          <h3
                            className="text-[18px] font-bold md:text-[20px]"
                            style={{ fontFamily: SYNE }}
                          >
                            {s.name}
                          </h3>
                          <p className="mt-2.5 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/65">
                            {s.body}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* what the monthly covers — floating inset slab */}
        <section className="px-6 pt-24 md:px-14 md:pt-32">
          <Reveal>
            <div className="mx-auto max-w-6xl rounded-[18px] rounded-br-[64px] border border-black/10 bg-white/60 px-7 py-10 md:px-14 md:py-14">
              <h2
                className="text-[24px] font-bold md:text-[30px]"
                style={{ fontFamily: SYNE }}
              >
                What the {MONTHLY} a month covers
              </h2>
              <ul className="mt-8 grid gap-x-14 gap-y-4 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-black/[0.07] pb-4 text-[15.5px] leading-[1.6] text-[#0d0d0d]/75"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#dc2626]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/55">
                You own the site. Once a project is paid in full it is yours,
                and we hand over a full export of the code on request. We would
                rather keep you because the work is good than because you are
                locked in.
              </p>
            </div>
          </Reveal>
        </section>

        {/* CTA — single confident button plus a text link, not two buttons */}
        <section className="px-6 py-24 md:py-32">
          <Reveal>
            <div className="mx-auto max-w-6xl">
              <h2
                className="max-w-[18ch] text-[30px] font-bold leading-[1.1] md:text-[52px]"
                style={{ fontFamily: SYNE }}
              >
                Not sure which of these you need?
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#0d0d0d]/65">
                Tell us about the business and we will come back with a
                straight answer on what it needs and what it costs. The quote
                is free and there is no pressure attached to it.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                <a
                  href="/contact"
                  className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
                >
                  Get a free quote
                </a>
                <a
                  href="/work"
                  className="text-[15px] font-semibold underline decoration-black/25 decoration-2 underline-offset-[6px] transition-colors hover:decoration-[#dc2626]"
                >
                  or see our work
                </a>
              </div>
              <p className="mt-10 text-[13px] text-[#0d0d0d]/40">
                {allServices.length} services · Nanaimo and across Vancouver
                Island
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
        <span>© {new Date().getFullYear()} VDT Sites · Built in Nanaimo, BC</span>
        <nav aria-label="Legal" className="flex gap-5">
          <a href="/terms-of-service" className="hover:text-[#0d0d0d]">
            Terms
          </a>
          <a href="/privacy-policy" className="hover:text-[#0d0d0d]">
            Privacy
          </a>
          <a href="/cookie-policy" className="hover:text-[#0d0d0d]">
            Cookies
          </a>
        </nav>
      </footer>
    </div>
  );
}
