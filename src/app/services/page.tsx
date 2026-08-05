import type { Metadata } from "next";
import { Cloud, Monitor, Palette, PhoneCall } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { getTestimonialByAuthor } from "@/lib/testimonials";

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

/**
 * The big price numeral only. Syne is the page's display face, but its figures
 * are eccentric (wide, squarish, odd terminals) and at 84px the "$899" read as
 * a different typeface from the neutral grotesque in Sem's mockup. Inter 800 is
 * the match — note the font link above has to request 800 explicitly, or the
 * browser synthesises it from 700 and the strokes smear at this size.
 */
const NUMERAL = "'Inter', system-ui, sans-serif";
const SITE = "https://vdtsites.com";

/** Starting price. Kept in one place so it cannot drift between sections. */
const FROM_PRICE = "$899";
const BRAND_PRICE = "$1299";
const MONTHLY = "$40";

/**
 * Shared surface for the price block's cards. Sem's mockup 2026-08-03 replaced
 * the old dark grain slab with white cards on the cream page, so the noise
 * texture that made a flat #0d0d0d panel read as a printed surface is gone
 * along with it. Soft shadow rather than a hard border: at this size a 1px
 * outline reads as a wireframe.
 */
const CARD = "rounded-[14px] bg-white shadow-card";

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
      "A site and a brand that were designed apart always look it. We do both, so yours match.",
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

/**
 * What the build fee buys. This list did not exist before: the page showed a
 * price and, five sections later, what the *monthly* covered, so a visitor
 * could see the $899 but never what it bought. The two lists now sit side by
 * side in the price slab so both halves of the offer read in one glance.
 */
const BUILD_INCLUDED = [
  "A custom built 6 page website",
  "Built to be responsive on every device, desktop and mobile",
  "An admin editor so you can change text and images yourself",
  "A contact form that lands straight in your inbox",
  // Indexing, NOT ranking. "Submitted so your pages appear" is a thing we
  // actually do (sitemap + IndexNow ping on deploy) and can promise. Never
  // let this drift into implying a position in the results.
  "Your pages submitted to Google and Bing the day you launch",
  "Everything set up, tested and taken live for you",
];

/**
 * The $1299 tier. Wording is deliberately careful on three points that are
 * accuracy or licensing problems rather than style (see Shared/Client Process
 * & Pricing): the cards are a DESIGN, not printing; the invoice is a Word
 * template, not software; and typefaces must be open-licensed, because most
 * commercial font licences are per-user and cannot be passed to a client.
 */
const BRAND_INCLUDED = [
  "A custom logo, in every format you need for web, print and signage",
  "Print-ready business card design, ready to be professionally printed",
  "A branded, editable invoice template",
  "Brand typefaces chosen and set up across your site",
];

/**
 * The costs that normally arrive as separate bills. Framed as a contrast
 * because "all inclusive" is the actual competitive edge and stating it as a
 * feature list buries it.
 *
 * Ranges are deliberately generic and conservative. Do NOT name a competitor
 * or quote a specific rival's price here: a comparison you cannot evidence is
 * misleading advertising, and the point lands without one.
 */
const USUALLY_EXTRA = [
  { item: "Domain name", typical: "$15 to $25 a year" },
  { item: "Website hosting", typical: "$15 to $40 a month" },
  { item: "SSL security certificate", typical: "often an upsell" },
  { item: "Backups and monitoring", typical: "usually an add-on plan" },
  { item: "Someone to actually call", typical: "a ticket queue" },
];

/**
 * The four phases, with timings. Sourced from the real process in
 * Shared/Client Process & Pricing. The internal "estimate plus 5 days of
 * leniency" padding rule stays internal.
 *
 * ⚠️ The clock starts when the CLIENT'S CONTENT ARRIVES, not at enquiry, and
 * every published timing has to keep saying so. Three to four days is what Sem
 * controls; waiting on photos and copy is not, and a bare "live in 3 days"
 * becomes a broken promise the moment someone sits on their content for a
 * fortnight. Same wording lives in lib/faqs.ts, the hand-written FAQ JSX in
 * app/page.tsx, /llms.txt and the how-long-does-it-take blog post — change all
 * five together or the site contradicts itself (it did, until 2026-08-03: five
 * places said "one to three weeks" and two said "one to two").
 */
const PHASES = [
  {
    n: "01",
    when: "Day one",
    title: "Free quote and consult",
    body: "A call or an email about the business, what it needs and which pages it takes. You get a fixed written price back. No charge, and no pressure attached to it.",
  },
  {
    n: "02",
    when: "Day one",
    title: "Your homepage design",
    body: "The homepage gets designed first and we go through it together. That is where the look of the whole site gets settled, so nothing else gets built until you are happy with it.",
  },
  {
    n: "03",
    when: "Days two and three",
    title: "Build and review",
    body: "The rest of the site gets built out, checking in as it goes so you watch it take shape instead of waiting weeks for a reveal you either love or quietly do not.",
  },
  {
    n: "04",
    when: "Day three or four",
    title: "Launch",
    body: "The site goes live and your domain points at it. One more run through for final edits, then we show you how to keep it up to date yourself.",
  },
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

  // Interleaved reviews, looked up by author so the wording stays canonical
  // in lib/testimonials (that file forbids paraphrasing or shortening these).
  // Sherri sits under the price because hers is about cost; Enrico sits under
  // the timeline because his is about delivery time.
  const sherri = getTestimonialByAuthor("Sherri K");
  const enrico = getTestimonialByAuthor("Enrico Del Mundo");

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@600;700;800&display=swap"
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
      <PageHeader activeHref="/services" />

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

        {/* Price block. Light cards from Sem's mockup 2026-08-03.
            Restructured the same day into TWO SELF-CONTAINED OFFERS: each
            white box holds its own price AND its own inclusions, so a reader
            can see where one package stops and the next starts. The earlier
            version split price and inclusions across separate cards, which
            read as four loose panels rather than two things you can buy.
            The monthly sits below both because it applies to either. */}
        <section className="px-5 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="max-w-3xl text-[16px] leading-[1.75] text-[#0d0d0d]/80 md:text-[17px]">
                Two ways to start, both fixed price. Bigger builds cost more
                and we tell you the number before any work begins, so nothing
                arrives as a surprise on an invoice.
              </p>
            </Reveal>

            {/* the two offers */}
            <div className="mt-9 grid gap-7 md:mt-11 md:grid-cols-2 md:gap-8">
              {[
                {
                  name: "Website",
                  price: FROM_PRICE,
                  Icon: Monitor,
                  listTitle: "What's included",
                  items: BUILD_INCLUDED,
                },
                {
                  name: "Full Brand Kit",
                  price: BRAND_PRICE,
                  Icon: Palette,
                  listTitle: "Everything in the website, plus",
                  items: BRAND_INCLUDED,
                },
              ].map(({ name, price, Icon, listTitle, items }, i) => (
                <Reveal key={name} delay={i * 80}>
                  <div
                    className={`relative h-full ${CARD} px-7 py-9 md:px-9 md:py-10`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[5px] rounded-l-[14px] bg-[#dc2626]"
                    />
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#dc2626]">
                      {name}
                    </h2>
                    <p
                      className="mt-4 text-[60px] font-extrabold leading-[0.9] tracking-[-0.035em] md:text-[76px]"
                      style={{ fontFamily: NUMERAL }}
                    >
                      {price}
                    </p>
                    <p className="mt-4 text-[15px] text-[#0d0d0d]/55">
                      one time, then {MONTHLY} a month
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-6 block h-[3px] w-[76px] rounded-full bg-[#dc2626]"
                    />

                    <div className="mt-8 flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#dc2626]"
                      >
                        <Icon size={22} strokeWidth={2} className="text-white" />
                      </span>
                      <h3
                        className="text-[18px] font-bold leading-[1.15] md:text-[21px]"
                        style={{ fontFamily: SYNE }}
                      >
                        {listTitle}
                      </h3>
                    </div>
                    <hr className="mt-6 border-black/10" />
                    <ul className="mt-6 space-y-3.5">
                      {items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[15.5px] leading-[1.6] text-[#0d0d0d]/80"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#dc2626]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* the monthly, shared by both offers */}
            <Reveal>
              <div className={`mt-7 ${CARD} px-7 py-8 md:px-9 md:py-9`}>
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#dc2626]"
                  >
                    <Cloud size={24} strokeWidth={2} className="text-white" />
                  </span>
                  <h2
                    className="text-[21px] font-bold leading-[1.15] md:text-[25px]"
                    style={{ fontFamily: SYNE }}
                  >
                    What the {MONTHLY} a month covers
                  </h2>
                </div>
                <hr className="mt-6 border-black/10" />
                <ul className="mt-6 grid gap-x-12 gap-y-3.5 sm:grid-cols-2">
                  {INCLUDED.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15.5px] leading-[1.6] text-[#0d0d0d]/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#dc2626]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/55">
                  Whichever you pick, the monthly is what keeps it running.
                  There is no separate hosting bill and no renewal spike in
                  year two.
                </p>
              </div>
            </Reveal>

            {/* getting started */}
            <Reveal>
              <div
                className={`mt-7 flex flex-col items-center gap-5 ${CARD} px-7 py-8 text-center sm:flex-row sm:gap-6 sm:text-left md:px-9`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#dc2626]"
                >
                  <PhoneCall size={24} strokeWidth={2} className="text-white" />
                </span>
                <div>
                  <h2
                    className="text-[19px] font-bold md:text-[22px]"
                    style={{ fontFamily: SYNE }}
                  >
                    Getting started
                  </h2>
                  <p className="mt-2.5 text-[15.5px] leading-[1.7] text-[#0d0d0d]/70">
                    Tell us about the business, by phone or email, and we will
                    come back with a fixed written price. If it suits you it is
                    50% to start and the balance when the site goes live. The
                    quote is free and there is nothing to sign to get one.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Social proof immediately after the price. Sherri's review is the
            one that talks about cost against her previous website builders,
            which is exactly the objection the slab above just raised. Pulled
            by author so the text stays single-sourced in lib/testimonials. */}
        {sherri && (
          <section className="px-6 pt-16 md:px-14 md:pt-24">
            <Reveal>
              <figure className="mx-auto max-w-4xl">
                <blockquote
                  className="border-l-2 border-[#dc2626] pl-6 text-[19px] leading-[1.65] md:pl-9 md:text-[24px]"
                  style={{ fontFamily: SYNE }}
                >
                  {sherri.quote}
                </blockquote>
                <figcaption className="mt-5 pl-6 text-[14px] text-[#0d0d0d]/50 md:pl-9">
                  {sherri.author}
                </figcaption>
              </figure>
            </Reveal>
          </section>
        )}

        {/* How it works. Hairline rows with a big ghosted number, matching the
            service-group pattern below rather than four identical cards
            (uniform card grids are ruled out in Shared/Design Preferences). */}
        <section className="px-6 pt-20 md:px-14 md:pt-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2
                className="max-w-[16ch] text-[30px] font-bold leading-[1.1] md:text-[52px]"
                style={{ fontFamily: SYNE }}
              >
                How it works, start to live.
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#0d0d0d]/65">
                Once we have your content, most sites are live in three to four
                days. The main variable is how fast we get your photos and
                feedback, not the build.
              </p>
            </Reveal>

            <div className="mt-12 border-t border-black/10 md:mt-16">
              {PHASES.map((p, i) => (
                <Reveal key={p.n} delay={i * 60}>
                  <article className="grid gap-3 border-b border-black/10 py-7 md:grid-cols-[minmax(0,80px)_minmax(0,200px)_1fr] md:items-baseline md:gap-10 md:py-9">
                    <span
                      aria-hidden="true"
                      className="text-[34px] font-extrabold leading-none text-[#dc2626]/20 md:text-[46px]"
                      style={{ fontFamily: SYNE }}
                    >
                      {p.n}
                    </span>
                    <div>
                      <h3
                        className="text-[19px] font-bold md:text-[22px]"
                        style={{ fontFamily: SYNE }}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#dc2626]">
                        {p.when}
                      </p>
                    </div>
                    <p className="max-w-2xl text-[15px] leading-[1.75] text-[#0d0d0d]/65">
                      {p.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
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

        {/* All-inclusive contrast. The monthly's inclusions moved up into the
            price slab; what lives here now is the point they were making but
            never said out loud, which is that these normally arrive as
            separate bills from separate companies. */}
        <section className="px-6 pt-24 md:px-14 md:pt-32">
          <Reveal>
            <div className="mx-auto max-w-6xl rounded-[18px] rounded-br-[64px] border border-black/10 bg-white/60 px-7 py-10 md:px-14 md:py-14">
              <h2
                className="max-w-[20ch] text-[24px] font-bold leading-[1.15] md:text-[34px]"
                style={{ fontFamily: SYNE }}
              >
                The bills you do not get.
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#0d0d0d]/65">
                These normally turn up as separate charges from separate
                companies, each renewing on its own date. All of them are inside
                the {MONTHLY}.
              </p>
              <ul className="mt-9">
                {/* Two columns on a phone (name + Included on one line, the
                    struck-through cost beneath via order-3), three across on
                    desktop. A plain flex-wrap row stranded "Included" alone on
                    a third line at 375px. */}
                {USUALLY_EXTRA.map(({ item, typical }) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-black/[0.07] py-4 md:grid-cols-[minmax(0,320px)_1fr_auto]"
                  >
                    <span className="text-[16px] font-semibold text-[#0d0d0d]/85">
                      {item}
                    </span>
                    <span className="order-3 text-[14px] text-[#0d0d0d]/45 line-through decoration-[#0d0d0d]/25 md:order-none">
                      {typical}
                    </span>
                    <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#dc2626] md:justify-self-end">
                      Included
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Second review, placed against the delivery-time claim above. */}
        {enrico && (
          <section className="px-6 pt-20 md:px-14 md:pt-28">
            <Reveal>
              <figure className="mx-auto max-w-4xl">
                <blockquote
                  className="border-l-2 border-[#dc2626] pl-6 text-[19px] leading-[1.65] md:pl-9 md:text-[24px]"
                  style={{ fontFamily: SYNE }}
                >
                  {enrico.quote}
                </blockquote>
                <figcaption className="mt-5 pl-6 text-[14px] text-[#0d0d0d]/50 md:pl-9">
                  {enrico.author}
                </figcaption>
              </figure>
            </Reveal>
          </section>
        )}

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
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-[#0d0d0d]/55">
                Once we have your content, most sites are live in three to four
                days.
              </p>
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
