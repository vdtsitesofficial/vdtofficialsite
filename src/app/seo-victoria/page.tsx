import type { Metadata } from "next";
import Link from "next/link";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";

/**
 * /seo-victoria
 *
 * Service page for the Victoria SEO cluster (Semrush ca, Aug 2026):
 *   seo victoria                            880/mo  KD 15
 *   victoria seo                            720/mo  KD 15
 *   seo victoria bc                         480/mo  KD 27
 *   victoria seo company                    480/mo  KD 24
 *   search engine optimization victoria bc  390/mo  KD  9
 *   seo agency victoria                     170/mo  KD 18
 *   seo services victoria                   140/mo  KD 11
 *   seo services victoria bc                110/mo  KD 13
 *   victoria seo services                    90/mo  KD  8
 *   ----------------------------------------------------
 *   ~3,500/mo, all one intent, so ONE page. Roughly 8x the
 *   /seo-nanaimo cluster.
 *
 * Mirrors /seo-nanaimo deliberately: same offer (one-time Local SEO Setup,
 * NO retainer), same three pillars, same structure. That page is the one
 * page Semrush shows ranking, so this copies what works.
 *
 * ── Tone (Sem, 2026-08-08): softened from the first cut. The anti-retainer
 * copy ("nobody honest sells those", "why no retainer, in a city full of
 * agencies selling them") read too aggressive; the hero jab, the pillars
 * intro and the bordered why-no-retainer paragraph were removed. The offer
 * still leads with one-time fixed price, and the retainer nuance lives in
 * the FAQ where it reads as an answer, not a punch. Do not reintroduce
 * swipes at other agencies here.
 *
 * ── Anti-cannibalization (why this page exists at all)
 * /web-design-victoria owns build intent ("web design victoria bc").
 * This page owns SEO intent ("seo victoria bc"). Different SERPs,
 * different competitors. This page must NOT restate the design pitch;
 * build-intent visitors get a sideways link to /web-design-victoria.
 *
 * ── Honesty constraints (do not "improve" these away)
 * - There is NO Victoria client (see /web-design-victoria header note).
 *   Describe the real work, link to /work and /reviews, never imply a
 *   Victoria one. Do not volunteer the gap unprompted either.
 * - No ranking guarantees anywhere on this page, ever. Google decides
 *   rankings; the FAQ says exactly that.
 * - Victoria is more competitive than up-island markets. The copy says
 *   so plainly (timeline FAQ, retainer FAQ) instead of pretending the
 *   Nanaimo numbers transfer.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/seo-victoria`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "SEO Services in Victoria, BC",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "SEO for Victoria businesses: get found on Google by people searching for what you do. One-time setup, fixed price, no retainer. Call 250-616-2087.",
  keywords: [
    "seo victoria bc",
    "seo services victoria",
    "victoria seo company",
    "local seo victoria",
    "search engine optimization victoria bc",
  ],
  alternates: { canonical: "/seo-victoria" },
  openGraph: {
    title: "SEO Services in Victoria, BC | VDT Sites",
    description:
      "Get found on Google by Victoria customers searching for what you do. One-time setup, fixed price, no monthly retainer.",
    url: "/seo-victoria",
  },
  twitter: {
    title: "SEO Services in Victoria, BC | VDT Sites",
    description:
      "Get found on Google by Victoria customers searching for what you do. One-time setup, fixed price, no retainer.",
  },
};

const FAQS = [
  {
    q: "How much does SEO cost in Victoria?",
    a: "Victoria SEO agencies mostly sell monthly packages, and the common range runs from several hundred to a few thousand dollars a month before anyone can tell you what changed. Ours is a one-time setup at a fixed price, quoted before any work starts, and the number depends on the state of your current site rather than on a menu. A site that just needs its basics fixed costs less than one that needs pages rebuilt.",
  },
  {
    /* Added 2026-08-15. "victoria seo company" (480/mo KD 24) and "seo agency
       victoria" (170-210/mo KD 12-18) are real queries the page carried no
       wording for. Answered honestly rather than claiming the label: per the
       header note this is NOT a swipe at agencies, and it ends by conceding
       the agency model suits some people. */
    q: "Are you an SEO agency?",
    a: "Not in the usual sense, and it is worth knowing before you compare quotes. Most SEO companies working in Victoria are built around a monthly retainer and put an account manager between you and whoever does the work. We are a small studio up-island in Nanaimo, so the person who audits your site is the person who fixes it and the person who replies when you ask what changed. If what you want is a large agency with a dedicated account team and a monthly report, that is a real thing to want and we are honestly not it.",
  },
  {
    q: "Do you guarantee a first page ranking?",
    a: "No, and you should walk away from anyone who does. Google decides rankings and nobody outside Google controls them. What we can honestly promise is the work: a site Google can read, a Google Business Profile set up properly, accurate listings, and measurement so you can see for yourself what changed.",
  },
  {
    q: "How long does SEO take to work in Victoria?",
    a: "It depends which problem you have, and Victoria is a more competitive market than most of the island, so the honest answer is slower here. If your site is invisible because of a technical fault, fixing it can show results within days. If you are indexed but ranking below established competitors, expect months, because that is reviews, content and authority accumulating. Anyone quoting a fixed timeline before looking at your site is guessing.",
  },
  {
    q: "Do I need to pay for SEO every month?",
    a: "For most local Victoria service businesses, no. The setup work is one-time: fix the site, set up the profile, get the listings consistent, connect the measurement. The ongoing part that genuinely moves local rankings is a steady trickle of reviews and keeping your information current, and that is owner work. If you are fighting for the most contested terms in the city, ongoing content and authority work can genuinely help, and if that is your situation we will say so plainly rather than default you into a retainer.",
  },
  {
    q: "Can I do SEO myself?",
    a: "A good chunk of it, yes. Checking whether Google has indexed your site, setting up Search Console, submitting a sitemap and claiming your Google Business Profile are all free and need no developer. We wrote up the full checklist so you can try it before paying anyone, including us.",
  },
  {
    q: "What about AI search, like ChatGPT and Google's AI answers?",
    a: "It changes where answers appear, not what earns them. AI answers overwhelmingly cite pages that already rank in normal search, so the groundwork is the same: clean structure, real content, structured data, and a strong profile. We also set up the newer pieces, like an llms.txt file and schema markup, that make a site easier for AI systems to read and cite.",
  },
];

const PILLARS = [
  {
    title: "Your Google Business Profile",
    body: "The map with three businesses pinned on it sits above the normal results for most local searches, and it is fed by your profile, not your website. Category choice, service areas, real photos, accurate hours and a steady flow of reviews decide who appears there. In a city with as many competing profiles as Victoria, the finished ones win, and most are not finished.",
  },
  {
    title: "A site Google can actually read",
    body: "Titles that say what you do and where, one clear heading per page, fast loading on a phone, structured data, a sitemap that is actually submitted, and no stray settings telling Google to stay away. None of it is glamorous. All of it is the difference between existing in search and not.",
  },
  {
    title: "Consistent listings and reviews",
    body: "Google decides how established you are partly from the rest of the internet: your name, address and phone matching everywhere they appear, listings in the directories that matter locally, and reviews arriving steadily rather than in bursts. This is slow, unglamorous, and the reason long-standing Victoria businesses outrank better websites.",
  },
];

export default function SeoVictoriaPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "SEO Services in Victoria, BC",
        description:
          "SEO for Victoria businesses: Google Business Profile, on-page fixes, listings and measurement. One-time setup at a fixed price, no retainer.",
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
              name: "SEO in Victoria",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Local SEO Setup",
        serviceType:
          "Local search engine optimization for small businesses: Google Business Profile, on-page SEO, local listings and measurement",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Victoria" },
          { "@type": "City", name: "Saanich" },
          { "@type": "City", name: "Langford" },
          { "@type": "City", name: "Sidney" },
          { "@type": "City", name: "Sooke" },
          { "@type": "City", name: "Colwood" },
          { "@type": "City", name: "Esquimalt" },
          { "@type": "City", name: "Oak Bay" },
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
              Local SEO
            </p>
            <h1
              className="mt-4 max-w-[18ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              SEO in Victoria, without the retainer.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              {/* "Search engine optimization" is spelled out here on purpose.
                  The acronym was the only form on the page until 2026-08-15,
                  and the spelled-out phrase is a separate query: "search
                  engine optimization victoria bc" is 390/mo at KD 9 and the
                  highest CPC in the whole cluster ($9.37). Do not compress it
                  back to "SEO" for tidiness. */}
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Search engine optimization for Victoria businesses that want to
                be found by people searching for what they do, not just for
                their name. SEO services across Victoria and the Capital
                Regional District, as a one-time setup at a fixed quoted price.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a fixed quote
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

        {/* ── What local SEO actually is ───────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2
              className="text-3xl font-bold leading-tight md:text-[40px]"
              style={{ fontFamily: SYNE }}
            >
              What local SEO actually is
            </h2>

            <div className="mt-12 space-y-10">
              {PILLARS.map((p, i) => (
                <div key={p.title} className="max-w-3xl">
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
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it is sold ───────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The offer
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Two ways to buy it, neither one monthly
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    If we build your website, the SEO groundwork is already in
                    it.
                  </strong>{" "}
                  Proper titles and headings, fast loading on a phone,
                  structured data, a submitted sitemap, and your site tied to
                  your Google Business Profile. Not an add-on with its own line
                  on the invoice. Just how{" "}
                  <Link
                    href="/services"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    every site we build
                  </Link>{" "}
                  ships. And if the site itself is the problem, that is a
                  different page:{" "}
                  <Link
                    href="/web-design-victoria"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    website design in Victoria
                  </Link>
                  .
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    If you already have a website, we sell a one-time Local SEO
                    Setup.
                  </strong>{" "}
                  We audit what exists, fix the on-page basics, set up or
                  repair your Google Business Profile, get your listings
                  consistent, and connect Search Console so results are
                  measured rather than claimed. Fixed price, quoted up front,
                  finished in days rather than billed for months.
                </p>
                <p>
                  Want to try the free half yourself first? Fair. We published
                  the checklist:{" "}
                  <Link
                    href="/blog/why-isnt-my-business-showing-up-on-google"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    how to get your site to show up on Google
                  </Link>
                  . If you get through it and still want help, the quote is
                  free too.
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
                We eat our own cooking
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  We rebuilt our own Google Business Profile from scratch and
                  watched it go from invisible to competitive on local
                  searches, without touching the website. Our profile sits at
                  5.0 stars from the businesses we have built for, every review
                  real and{" "}
                  <Link
                    href="/reviews"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    reproduced word for word here
                  </Link>
                  .
                </p>
                <p>
                  And this page practices what it sells: structured data,
                  honest headings, fast load, and no claim on it we could not
                  defend on the phone. If you want to see the same approach
                  applied to client work,{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the case studies
                  </Link>{" "}
                  are all real builds for businesses in Nanaimo, Parksville and
                  across Vancouver Island, and we work with Victoria the same
                  way we work with everyone: by phone, email and video call,
                  ninety minutes up the highway.
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
        {/* id="contact" so MobileActionBar hides while this section is on
            screen (it observes that id) instead of covering the buttons. */}
        <section
          id="contact"
          className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Find out what is holding your site back.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Tell us your business name and your website if you have one.
                  We will look at what exists, tell you plainly whether you
                  have a technical fault or a slow-burn ranking problem, and
                  quote a fixed price for fixing what we find. If the honest
                  answer is that you do not need us, that is the answer you
                  will get.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a fixed quote
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

      <MobileActionBar messageHref="/contact" />

      <ServiceAreas current="/seo-victoria" />

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
