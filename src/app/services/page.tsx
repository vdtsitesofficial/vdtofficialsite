import type { Metadata } from "next";

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
 * Vancouver Island", NOT "web design Nanaimo" — that belongs to the
 * homepage, and /web-design-nanaimo is already noindexed for competing on
 * it. Keep the H1 and title off the homepage's exact query.
 *
 * Fully static, mirrors the /work and /about chrome so the site reads as
 * one thing.
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

/** Starting price. Kept in one place so it cannot drift between sections. */
const FROM_PRICE = "$899";
const MONTHLY = "$40";

type Service = { name: string; body: string };
type ServiceGroup = {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  services: Service[];
};

const GROUPS: ServiceGroup[] = [
  {
    id: "websites",
    kicker: "The main thing",
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
    kicker: "After launch",
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
    kicker: "Getting found",
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
    kicker: "How you look",
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
    kicker: "Beyond the website",
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
    title: "Web Design Services & Pricing",
    description: `Websites, hosting, local SEO, logos and app development for small businesses on Vancouver Island. Custom sites from ${FROM_PRICE} plus ${MONTHLY} a month.`,
  },
  // Without this the layout's static twitter card wins the metadata merge.
  twitter: {
    card: "summary_large_image",
    title: "Web Design Services & Pricing",
    description: `Websites, hosting, local SEO, logos and app development for small businesses on Vancouver Island.`,
  },
};

export default function ServicesPage() {
  const allServices = GROUPS.flatMap((g) => g.services);

  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
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

        {/* hero */}
        <section className="px-6 pt-8 text-center md:pt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
            What we do
          </p>
          <h1
            className="mx-auto mt-4 max-w-3xl text-[34px] font-bold leading-[1.05] md:text-[54px]"
            style={{ fontFamily: SYNE }}
          >
            Everything a small
            <br />
            business needs online.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#0d0d0d]/70 md:text-[17px]">
            Most people come to us for a website. What they usually need is the
            website, somewhere reliable to host it, a logo that matches, and to
            actually show up when someone nearby searches. We do all of it, so
            you are not stitching together four suppliers who each blame the
            other three.
          </p>
        </section>

        {/* price anchor */}
        <section className="px-6 pt-12 md:px-14 md:pt-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-[#0d0d0d] px-7 py-9 text-white md:px-10 md:py-11">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff6b5e]">
                  Starting at
                </p>
                <p
                  className="mt-3 text-[42px] font-bold leading-none md:text-[52px]"
                  style={{ fontFamily: SYNE }}
                >
                  {FROM_PRICE}
                </p>
                <p className="mt-2 text-[14px] text-white/65">
                  plus {MONTHLY} a month
                </p>
              </div>
              <div>
                <p className="text-[15px] leading-[1.75] text-white/80">
                  That is the starting point for a custom small business site,
                  not a stripped back version of one. Bigger builds cost more
                  and we tell you the number before any work begins, so nothing
                  arrives as a surprise on an invoice.
                </p>
                <p className="mt-4 text-[15px] leading-[1.75] text-white/80">
                  The monthly fee is what keeps it running. There is no separate
                  hosting bill and no renewal spike in year two.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* service groups */}
        {GROUPS.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="px-6 pt-16 md:px-14 md:pt-24"
          >
            <div className="mx-auto max-w-4xl">
              <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                {group.kicker}
              </p>
              <h2
                className="mt-2 text-[26px] font-bold md:text-[32px]"
                style={{ fontFamily: SYNE }}
              >
                {group.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.75] text-[#0d0d0d]/70">
                {group.intro}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {group.services.map((s) => (
                  <article
                    key={s.name}
                    className="rounded-xl border border-black/10 bg-white/55 p-6"
                  >
                    <h3
                      className="text-[16.5px] font-bold"
                      style={{ fontFamily: SYNE }}
                    >
                      {s.name}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] leading-[1.7] text-[#0d0d0d]/70">
                      {s.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* what the monthly covers */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white/55 px-7 py-9 md:px-10">
            <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
            <h2
              className="mt-4 text-[22px] font-bold md:text-[26px]"
              style={{ fontFamily: SYNE }}
            >
              What the {MONTHLY} a month covers
            </h2>
            <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-[1.6] text-[#0d0d0d]/75"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#dc2626]"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[14.5px] leading-[1.7] text-[#0d0d0d]/60">
              You own the site. Once a project is paid in full it is yours, and
              we hand over a full export of the code on request. We would rather
              keep you because the work is good than because you are locked in.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 text-center md:py-28">
          <h2
            className="mx-auto max-w-2xl text-[26px] font-bold leading-[1.15] md:text-[36px]"
            style={{ fontFamily: SYNE }}
          >
            Not sure which of these you need?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-[#0d0d0d]/70">
            Tell us about the business and we will come back with a straight
            answer on what it needs and what it costs. The quote is free and
            there is no pressure attached to it.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-full bg-[#dc2626] px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#b91c1c]"
            >
              Get a free quote
            </a>
            <a
              href="/work"
              className="rounded-full border border-black/15 px-7 py-3 text-[14px] font-semibold text-[#0d0d0d] transition-colors hover:bg-black/5"
            >
              See our work
            </a>
          </div>
          <p className="mt-6 text-[13px] text-[#0d0d0d]/50">
            {allServices.length} services · Nanaimo and across Vancouver Island
          </p>
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
