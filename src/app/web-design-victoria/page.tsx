import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /web-design-victoria
 *
 * Victoria city page. The cluster is far bigger and easier than the 210/mo
 * first estimate; Semrush ca, checked 2026-08-06:
 *
 *   victoria website design      320/mo  KD 14
 *   web designer victoria        210/mo  KD 14
 *   web design victoria bc       210/mo  KD 15
 *   web development victoria bc  210/mo  KD 15
 *   victoria web designers       110/mo  KD 14
 *   web design company victoria  110/mo  KD 18
 *   victoria web development      90/mo  KD 8
 *   web designers victoria        70/mo  KD 16
 *   victoria web designer         50/mo  KD 15
 *   ------------------------------------------
 *   ~1,380/mo at KD 8-18, all one intent, so ONE page.
 *
 * Mid-difficulty terms the same page picks up as it gains authority:
 * victoria web design 390/KD32, website design victoria bc 320/KD36,
 * victoria website designer 170/KD33, victoria bc web design 140/KD29.
 *
 * SERP check for "victoria website design" confirms the format: #2 is
 * purplepig.ca/website-designer-victoria/ and #8 is
 * webgamma.ca/.../website-design-in-victoria/. City-slug service pages
 * rank here. Directories take #4 (DesignRush) and #7 (Bark), which are
 * citation targets, not competitors.
 *
 * ── The anti-doorway angle, and why it is not swappable
 * Nanaimo to Victoria is ~110km of highway, about 90 minutes, and
 * critically NO FERRY. That is the one thing a Vancouver page could never
 * say, and it is the spine of this page: same island, same timezone,
 * reachable in person if it ever actually matters, without Victoria
 * agency overhead. Find-and-replace "Victoria" with any mainland city and
 * the page falls apart, which is the test.
 *
 * ── Honesty constraint (do not "improve" this away)
 * There is NO Victoria client. lib/caseStudies.ts is Nanaimo, Parksville,
 * Calgary, plus one island-wide and one BC-wide. The page never implies
 * otherwise: it says plainly that the work is up-island and lets the
 * reader judge. Same rule as the non-profit page.
 *
 * "wordpress developer victoria" (110/mo, KD 10) is deliberately NOT
 * targeted. VDT does not build WordPress, and ranking for it would earn
 * clicks we cannot serve.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-victoria`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Website Design in Victoria, BC",
  description: `Website design for Victoria businesses from ${PRICE_BUILD_FROM} ${CURRENCY} plus ${PRICE_MONTHLY} a month. Built up-island in Nanaimo, 90 minutes away and no ferry. Free quote: 250-616-2087.`,
  keywords: [
    "victoria website design",
    "web designer victoria",
    "web design victoria bc",
    "web development victoria bc",
    "web design company victoria",
    "victoria web designers",
  ],
  alternates: { canonical: "/web-design-victoria" },
  openGraph: {
    title: "Website Design in Victoria, BC | VDT Sites",
    description: `Website design for Victoria businesses from ${PRICE_BUILD_FROM} ${CURRENCY}. Same island, no ferry, and no downtown agency overhead in the quote.`,
    url: "/web-design-victoria",
  },
  twitter: {
    title: "Website Design in Victoria, BC | VDT Sites",
    description: `Website design for Victoria businesses from ${PRICE_BUILD_FROM} ${CURRENCY}. Same island, no ferry, no agency overhead.`,
  },
};

const FAQS = [
  {
    q: "Do you actually work with businesses in Victoria?",
    a: "We work across Vancouver Island and Victoria is on it, about ninety minutes down the highway from us. We will be straight with you though: our built-and-launched work so far is Nanaimo, Parksville and island-wide rather than Victoria specifically. If you want a designer who can point at ten Victoria storefronts they built, there are agencies downtown who can. What we can point at is every site we have built and every review from the people we built them for.",
  },
  {
    q: "How much does a website cost in Victoria?",
    a: `Our websites start at ${PRICE_BUILD_FROM} ${CURRENCY} plus ${PRICE_MONTHLY} a month for hosting, updates and support, and the price is fixed and quoted before any work begins. Victoria agency quotes for a comparable small business site commonly land several thousand higher, and a good part of that difference is downtown office space and account management rather than a better website.`,
  },
  {
    q: "Do we need to meet in person?",
    a: "Almost never, and most of our clients never have. Everything runs by phone, email and video call. The difference with Victoria specifically is that if a meeting genuinely matters, it is a drive rather than a flight or a ferry booking, so it is possible in a way it is not for a mainland client.",
  },
  {
    q: "Are you cheaper because you are not in Victoria?",
    a: "Partly, and we would rather say so than pretend the number is magic. We are two people working out of Nanaimo with no office lease, no sales team and no account managers, so there is far less overhead to cover before the actual work gets paid for. The build itself is not smaller. The business behind it is.",
  },
  {
    q: "Can you help with local SEO for a Victoria business?",
    a: "Yes. The search groundwork is built into every site we make: clean structure, fast load, proper titles, structured data and a sitemap that actually gets submitted. If you already have a site and need the local side sorted out, that is a separate one-time setup rather than a monthly retainer, and it works the same wherever on the island you are.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. That covers our website package; anything extra bought alongside it is quoted and scheduled separately. The slow part is almost never the build, it is waiting on text, photos and approvals.",
  },
];

const REASONS = [
  {
    title: "Same island, no ferry",
    body: "Victoria is about 110 kilometres down the Trans-Canada from us, roughly ninety minutes, and there is no water in between. That sounds like a small thing until you compare it to hiring on the mainland, where an in-person meeting means a ferry booking and half a day gone. Same timezone, same island, reachable if it ever actually matters.",
  },
  {
    title: "You are not paying for a downtown office",
    body: "Victoria has real agencies with real offices and real staff, and their pricing reflects that whether or not your project needs any of it. We are two people up-island. The work that goes into the site is the same; the overhead loaded on top of it is not.",
  },
  {
    title: "Built to be found, not just to look good",
    body: "A site that never appears in search is a poster. Every build ships with the search groundwork already in it: clean page structure, fast loading on a phone, proper titles and descriptions, structured data and a sitemap submitted the week you launch. Not an upsell on a later invoice.",
  },
  {
    title: "You can update it yourself",
    body: "Change text and images directly on your live page: click the text, type the new version, save. No dashboard to learn, no waiting on us for a price change or a new photo, and no invoice for a five minute edit. For anything bigger we are one message away.",
  },
];

export default function WebDesignVictoriaPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Design in Victoria, BC",
        description:
          "Website design for Victoria, BC businesses. Fixed price, hosting included, built up-island in Nanaimo.",
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
              name: "Website Design in Victoria",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Design in Victoria, BC",
        serviceType:
          "Custom website design and development for small businesses in Victoria and the Capital Regional District",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Victoria" },
          { "@type": "City", name: "Saanich" },
          { "@type": "City", name: "Langford" },
          { "@type": "City", name: "Sidney" },
          { "@type": "City", name: "Sooke" },
          { "@type": "City", name: "Colwood" },
          { "@type": "Place", name: "Capital Regional District" },
          { "@type": "Place", name: "Vancouver Island" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: FAQS.map((f) => ({
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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
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
              Victoria, BC
            </p>
            <h1
              className="mt-4 max-w-[17ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Website design in Victoria, without the downtown price tag.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom websites for Victoria businesses, from{" "}
                {PRICE_BUILD_FROM} {CURRENCY} plus {PRICE_MONTHLY} a month with
                hosting, domain and support included. We build up-island in
                Nanaimo, which is ninety minutes and no ferry away, and the
                saving on office overhead ends up in your quote instead of
                someone&rsquo;s lease.
              </p>
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

        {/* ── Why up-island ────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Why hire up-island for a Victoria website
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Four honest reasons, including the one most designers would
                rather you did not think about too hard.
              </p>
            </div>

            <div className="mt-12 grid gap-x-16 gap-y-11 md:grid-cols-2">
              {REASONS.map((r, i) => (
                <div key={r.title}>
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
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What it costs ────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The number
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  What a Victoria website actually costs
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  Ours start at{" "}
                  <strong className="font-semibold text-[#0d0d0d]">
                    {PRICE_BUILD_FROM} {CURRENCY}
                  </strong>{" "}
                  for the build, plus {PRICE_MONTHLY} a month covering hosting,
                  your domain, SSL, backups, monitoring and support. One fixed
                  price, agreed before anyone starts, and no hourly meter.
                </p>
                <p>
                  For comparison, a comparable small business site quoted by a
                  Victoria agency commonly lands several thousand higher. That
                  is not a knock on them. It is what an office, a sales team and
                  account management cost, and someone has to pay for it.
                </p>
                <p>
                  We wrote up the whole Canadian pricing picture, including what
                  the real ranges look like and what drives them, in{" "}
                  <Link
                    href="/blog/small-business-website-cost-2026"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    how much a website costs in Canada
                  </Link>
                  . The full service and pricing list lives on{" "}
                  <Link
                    href="/services"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    our services page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Proof ────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                What we have actually built
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  Straight answer first: our launched work is Nanaimo,
                  Parksville and island-wide rather than Victoria specifically.
                  We are not going to dress that up. What we can show you is
                  every build and every review that came with it, which is more
                  than most sites in this market will put in front of you.
                </p>
                <p>
                  A coffee roaster with a real online store. A counselling
                  practice that left Squarespace. A Japanese import business, a
                  food truck run from the owner&rsquo;s phone, a city council
                  campaign taking donations on two rails, and an accounting firm
                  whose old site had been invisible to Google for years.{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    All eight are written up properly
                  </Link>
                  , and{" "}
                  <Link
                    href="/reviews"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the reviews are reproduced word for word
                  </Link>
                  .
                </p>
                <p>
                  If being first in Victoria bothers you, say so on the call and
                  we will talk about it honestly rather than talk you out of it.
                </p>
              </div>
            </div>
          </div>
        </section>

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
              {FAQS.map((f) => (
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
                Tell us about your Victoria business.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  What you do, who you want to reach, and what your current site
                  is getting wrong if you have one. You get a fixed written
                  quote back, free, with no obligation attached to it. If we are
                  not the right fit we will tell you and point you somewhere
                  that is.
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
