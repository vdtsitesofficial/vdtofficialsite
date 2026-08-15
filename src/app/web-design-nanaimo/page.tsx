import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import PageHeader from "@/components/PageHeader";
import WorkCarousel from "@/components/WorkCarousel";
import { WORK_ITEMS } from "@/lib/workItems";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /web-design-nanaimo
 *
 * Nanaimo city page, and also the Google Ads landing page. Those were two
 * jobs on two pages until 2026-08-15; they are one page now, and the note
 * below says why, because the previous decision was deliberate and someone
 * will otherwise "restore" it.
 *
 * ── Why the ads page exists at all (unchanged)
 * /contact, while fast and ad-friendly, asks for the enquiry without earning
 * it: its H1 is "Let's talk about your website", which suits someone who
 * already decided. Paid traffic arrives cold, comparing four tabs, and needs
 * message match ("web design Nanaimo", the phrase they searched), proof, and
 * objection handling BEFORE the form.
 *
 * ── The noindex, and why it was reversed 2026-08-15
 * This page used to carry robots noindex. The reasoning was sound: it would
 * compete with the homepage for the exact query the GBP and schema effort
 * targets, and one page should own "web design Nanaimo" organically. The
 * elected owner was the homepage.
 *
 * Semrush ca, measured 2026-08-15, says that never happened:
 *  - The homepage ranks for "web design Nanaimo" NOWHERE in the top 100.
 *    Nothing was being cannibalised, because nothing was ranking.
 *  - The homepage H1 is "Website Design". No city. Its strongest on-page
 *    signal does not contain the term it was elected to own, and it is a
 *    canvas/zoom showcase at an 8.9% text-to-HTML ratio, so fixing that
 *    means dismantling the hero the whole brand rests on.
 *  - Meanwhile every OTHER island city already has an indexable city page
 *    (victoria, parksville, duncan, comox-valley, campbell-river, plus the
 *    island hub). Nanaimo, the home city and the biggest cluster, was the
 *    only hole in the set. /web-design-victoria is one of only two pages on
 *    the whole site that ranks for anything, which is the pattern working.
 *
 * So the owner is this page: the slug matches the query, the H1 already
 * carries the city, and the homepage keeps its showcase job and targets
 * brand plus generic terms. One page, one term, no new page added.
 *
 * The cluster this page targets (Semrush ca, 2026-08-15):
 *
 *   web design nanaimo         390/mo  KD 14
 *   website design nanaimo     260/mo  KD 33
 *   nanaimo web design         210/mo  KD 12
 *   web design nanaimo bc      170/mo  KD 20
 *   web development nanaimo    170/mo  KD 16
 *   web designer nanaimo       140/mo  KD 52
 *   -----------------------------------------
 *   ~1,340/mo, one intent, so ONE page.
 *
 * ── Constraints that still hold (they protect cost per lead)
 *  - No lab main.js, no zoom hero, and critically NO mobile tap-to-enter
 *    overlay. Most local paid clicks are mobile; an interstitial between a
 *    $15 click and the content is the most expensive thing on the site.
 *  - Phone number tappable above the fold. Half of local service enquiries
 *    are calls, not forms.
 *  - Images are WebP at ~35-50KB, not the 1MB source PNGs.
 *  - The body copy added for organic sits BELOW the fold and below the
 *    form. Text costs a few KB gzipped and no JS, so depth for search and
 *    speed for ads are not actually in tension. Adding SCRIPTS would be.
 *
 * ── Honesty note
 * Unlike /web-design-victoria, this page may name local clients, because
 * there genuinely are four in Nanaimo: Sherri Kozubal, MO Coffee, Paul Van
 * Ryssel and UniSol Accounting. Do not extend that list beyond what
 * lib/caseStudies.ts actually contains.
 *
 * Conversion tracking is inherited, not re-implemented: tel: clicks are
 * caught site-wide by the delegated listener in components/Analytics.tsx,
 * and the form fires GA4 `generate_lead` from public/lab/contact-card.js.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SITE = "https://vdtsites.com";
const PAGE_URL = `${SITE}/web-design-nanaimo`;

export const metadata: Metadata = {
  title: "Website Design in Nanaimo, BC",
  description:
    "Custom website design for small businesses in Nanaimo and across Vancouver Island. Fixed pricing, hosting included, and you own the site. Free quote: call 250-616-2087.",
  alternates: { canonical: "/web-design-nanaimo" },
  openGraph: {
    title: "Website Design in Nanaimo, BC | VDT Sites",
    description:
      "Custom websites for Nanaimo small businesses from $899 CAD plus $40 a month. Built in Nanaimo, not outsourced.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design in Nanaimo, BC | VDT Sites",
    description:
      "Custom websites for Nanaimo small businesses. Fixed price, hosting included.",
  },
};

const SYNE = "'Syne', 'Inter', sans-serif";

/* Card list lives in lib/workItems.ts, shared with /web-design-victoria. */

const REASONS = [
  {
    title: "A fixed price, up front",
    body: "You get one number before we start, based on the pages and features you actually need. No hourly billing, no invoice that grows halfway through.",
  },
  {
    title: "You edit it yourself",
    body: "Change text and images directly on your live page: click, type, save. No dashboard to learn, and no emailing us to update a phone number.",
  },
  {
    title: "You own it",
    body: "Once the project is paid in full the site is yours, and we hand over the code on request. We'd rather keep you because the work is good.",
  },
];

/* `link` renders as a visible link after the answer text; the FAQPage schema
   uses only `a`, so the JSON-LD stays plain text. Same shape as
   /web-design-victoria, deliberately, so the two pages stay comparable. */
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "How much does a website cost in Nanaimo?",
    a: `Our websites start at ${PRICE_BUILD_FROM} ${CURRENCY} plus ${PRICE_MONTHLY} a month for hosting, domain, updates and support. The number is fixed and quoted before any work starts, so there is no hourly meter and no invoice that grows halfway through. Every price is published rather than hidden behind a quote form.`,
    link: { href: "/pricing", label: "See the full pricing" },
  },
  {
    q: "Are you actually based in Nanaimo?",
    a: "Yes, and the work is done here rather than passed to a contractor somewhere else. That matters less for the build than people expect and more for everything after it: when something needs changing, the person who wrote the code picks up. Four of our clients are Nanaimo businesses, and you can see all of their sites on the work page.",
    link: { href: "/work", label: "See the work" },
  },
  {
    q: "What is the difference between web design and web development?",
    a: "In most quotes you will read locally, nothing. We do both on every project, so the site is designed and then genuinely built rather than assembled from a theme: custom layout, custom code, and whatever the business actually needs behind it, like online booking, e-commerce, a donation form or a calculator. If you have been told a custom feature is not possible on your current site, that is usually a platform limit rather than a real one.",
  },
  {
    q: "Do you work with businesses outside Nanaimo?",
    a: "Yes. We cover Vancouver Island from Victoria to Campbell River, and we have built for clients on the mainland and in Alberta as well. Nanaimo is simply where we are, so local work is a short drive rather than a flight.",
    link: { href: "/web-design-vancouver-island", label: "Vancouver Island coverage" },
  },
  {
    q: "Can you help my Nanaimo business show up on Google?",
    a: "The search groundwork is built into every site we make: clean structure, fast load, proper titles, structured data and a sitemap that actually gets submitted. If you already have a site and need the local side sorted out, including your Google Business Profile and listings, that is a separate one-time setup rather than a monthly retainer.",
    link: { href: "/seo-nanaimo", label: "Local SEO in Nanaimo" },
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. That covers our website package; anything extra bought alongside it is quoted and scheduled separately. The slow part is almost never the build, it is waiting on text, photos and approvals.",
  },
  {
    q: "I already have a website. Can you rebuild it without losing my Google ranking?",
    a: "Yes, and that is a specific piece of work rather than an afterthought. We audit what already ranks, keep or redirect every existing URL, then rebuild. UniSol Accounting came off WordPress this way, domain move included, with the old URLs redirected.",
    link: { href: "/website-redesign", label: "How a redesign works" },
  },
];

export default function LandingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "Website Design in Nanaimo, BC",
        description:
          "Website design for Nanaimo, BC businesses. Fixed price, hosting included, built in Nanaimo.",
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
              name: "Website Design in Nanaimo",
              item: PAGE_URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Website Design in Nanaimo, BC",
        serviceType:
          "Custom website design and development for small businesses in Nanaimo and across Vancouver Island",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Nanaimo" },
          { "@type": "City", name: "Parksville" },
          { "@type": "City", name: "Qualicum Beach" },
          { "@type": "City", name: "Ladysmith" },
          { "@type": "City", name: "Duncan" },
          { "@type": "City", name: "Courtenay" },
          { "@type": "City", name: "Campbell River" },
          { "@type": "Place", name: "Vancouver Island" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href={`/lab/contact-card.css?v=${LAB_V}`} />

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script src={`/lab/contact-card.js?v=${LAB_V}`} strategy="afterInteractive" />

      {/* header — same chrome as every other page. This page used to carry a
          tel: pill here instead; the number is still above the fold in the
          hero and repeated through the body, so the CTA isn't lost. */}
      <PageHeader />

      <main className="flex-1">
        {/* hero — message match with the search query, phone above the fold */}
        <section className="px-6 pb-4 pt-8 text-center md:pt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
            Nanaimo · Vancouver Island
          </p>
          <h1
            className="mx-auto mt-4 max-w-3xl text-[34px] font-bold leading-[1.05] md:text-[58px]"
            style={{ fontFamily: SYNE }}
          >
            Website design in Nanaimo, built from scratch.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#0d0d0d]/70 md:text-[17px]">
            Custom sites for small businesses across Vancouver Island, designed around
            what your business actually does, not a template with your logo dropped in.
            Fixed pricing, hosting included.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+12506162087"
              className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#b91c1c]"
            >
              Call 250-616-2087
            </a>
            <a
              href="#contact"
              className="rounded-full border border-black/20 px-8 py-3.5 text-[15px] font-semibold transition-colors hover:border-black/50"
            >
              Get a free quote
            </a>
          </div>

          <p className="mt-5 text-[13px] text-[#0d0d0d]/50">
            Free quotes · No pressure · We reply within one day
          </p>
        </section>

        {/* proof — real client work, above the objections */}
        <section className="pt-10 md:pt-16">
          <WorkCarousel items={WORK_ITEMS} />
        </section>

        {/* the three objections that actually close */}
        <section className="px-6 pt-16 md:pt-24">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title}>
                <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
                <h3 className="mt-5 text-[19px] font-bold" style={{ fontFamily: SYNE }}>
                  {r.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#0d0d0d]/65">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* areas served — reinforces local relevance before the ask */}
        <section className="px-6 pt-16 text-center md:pt-24">
          <p className="mx-auto max-w-2xl text-[15px] leading-[1.8] text-[#0d0d0d]/60">
            We work with trades, cafes, retail, accounting, auto and home-service
            businesses in <strong className="font-semibold text-[#0d0d0d]/80">Nanaimo</strong>,
            Parksville, Qualicum Beach, Ladysmith, Duncan, Courtenay, Campbell River
            and Victoria.
          </p>
        </section>

        <ContactCard paddingTop={64} paddingBottom={72} />

        {/* ── Everything below here is for organic ────────────────────────
            It sits AFTER the form on purpose. Paid traffic converts or
            leaves above this line, so none of it delays the ad click, and
            it is text rather than script so it costs a few KB and no JS.
            Do not move it above <ContactCard>. */}

        <section className="border-t border-black/10 px-6 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl">
            <h2
              className="text-[26px] font-bold leading-tight md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              Website design in Nanaimo, done by people who live here
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] text-[#0d0d0d]/70">
              Most of what gets sold as web design in Nanaimo is a template with a
              logo dropped into it, or a job quietly passed to a contractor in
              another timezone. We build custom sites from scratch, in Nanaimo, and
              the person who writes the code is the person who answers when you call
              about it later. That is the whole difference, and it shows up months
              after launch rather than on day one.
            </p>
            <p className="mt-4 text-[16px] leading-[1.8] text-[#0d0d0d]/70">
              Four of our clients are Nanaimo businesses:{" "}
              <Link href="/work/sherri-kozubal" className="underline underline-offset-2 hover:text-[#dc2626]">
                Sherri Kozubal
              </Link>
              , a clinical hypnotherapist who came off Squarespace;{" "}
              <Link href="/work/mo-coffee" className="underline underline-offset-2 hover:text-[#dc2626]">
                MO Coffee
              </Link>
              , a coffee roaster with a full online store;{" "}
              <Link href="/work/unisol-accounting" className="underline underline-offset-2 hover:text-[#dc2626]">
                UniSol Accounting
              </Link>
              , rebuilt off WordPress with every old URL redirected; and{" "}
              <Link href="/work/paul-van-ryssel" className="underline underline-offset-2 hover:text-[#dc2626]">
                Paul Van Ryssel
              </Link>
              , a city council campaign site built to a hard deadline with donations
              and volunteer sign-up. None of those are templates.
            </p>
          </div>
        </section>

        <section className="px-6 pt-14 md:pt-20">
          <div className="mx-auto max-w-3xl">
            <h2
              className="text-[26px] font-bold leading-tight md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              Design and development, not one or the other
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] text-[#0d0d0d]/70">
              Plenty of Nanaimo web design quotes cover the look and stop there, which
              is why so many local sites are attractive and cannot do anything. We do
              the development too, on every project, so the things a business actually
              needs are on the table: online ordering and payments, booking, donations
              and e-transfer, mailing lists, calculators, member areas. MO Coffee sells
              beans through theirs and UniSol has a GST calculator on theirs, because
              both were built rather than assembled.
            </p>
            <p className="mt-4 text-[16px] leading-[1.8] text-[#0d0d0d]/70">
              Every site is also editable by you. Click the text on the live page,
              type, save. No dashboard to learn and no emailing us to change a phone
              number or a price, which is the part that quietly costs money everywhere
              else.
            </p>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────
            Rendered from FAQS, which also feeds the FAQPage schema above,
            so the two can never disagree. */}
        <section className="px-6 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl">
            <h2
              className="text-[26px] font-bold leading-tight md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              Common questions
            </h2>
            <dl className="mt-8 divide-y divide-black/10 border-t border-black/10">
              {FAQS.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="text-[17px] font-bold" style={{ fontFamily: SYNE }}>
                    {f.q}
                  </dt>
                  <dd className="mt-3 text-[15.5px] leading-[1.8] text-[#0d0d0d]/70">
                    {f.a}
                    {f.link ? (
                      <>
                        {" "}
                        <Link
                          href={f.link.href}
                          className="font-semibold text-[#dc2626] underline underline-offset-2"
                        >
                          {f.link.label}
                        </Link>
                      </>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="px-6 pb-4 pt-14 text-center md:pt-20">
          <p className="mx-auto max-w-2xl text-[15px] leading-[1.8] text-[#0d0d0d]/60">
            Ready to talk about it? Call{" "}
            <a href="tel:+12506162087" className="font-semibold text-[#dc2626]">
              250-616-2087
            </a>{" "}
            or{" "}
            <a href="#contact" className="font-semibold underline underline-offset-2">
              send us a message
            </a>
            . Free quote, no pressure, and we reply within one business day.
          </p>
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
