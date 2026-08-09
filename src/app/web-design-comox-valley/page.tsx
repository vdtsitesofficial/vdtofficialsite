import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import WorkCarousel from "@/components/WorkCarousel";
import { WORK_ITEMS } from "@/lib/workItems";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /web-design-comox-valley
 *
 * Region page: Comox Valley (Courtenay, Comox, Cumberland) + Campbell
 * River. One page, not four, because the volumes are small and the intent
 * is identical (Semrush ca, Aug 2026):
 *   courtenay web design          40/mo  KD 0
 *   web design comox valley       40/mo  KD 0
 *   web designer campbell river   40/mo  KD 0
 *   web design courtenay          30/mo  KD 0
 *   comox valley web design       20/mo  KD 0
 *   website design campbell river 10/mo  KD 0
 *   ------------------------------------------
 *   ~180/mo winnable now at KD 0, PLUS the growth target:
 *   campbell river web design    140/mo  KD 41
 *   web design campbell river    140/mo  KD 41
 *   Those two come into reach as authority grows; the page sits ready.
 *
 * ── Honesty constraint (do not "improve" this away)
 * There is NO Comox Valley or Campbell River client. Same rule as the
 * Victoria page: describe the real work, link to /work and /reviews,
 * never imply a local client, and do not volunteer the gap unprompted.
 * The local anchor is geographic (up-island, same island, no ferry) and
 * the service model (remote-first, one call away), both true.
 *
 * ── Tone: no swipes at other agencies (see Copy & Messaging, 2026-08-08).
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-comox-valley`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Web Design in the Comox Valley & Campbell River",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "Website design for Courtenay, Comox and Campbell River businesses. Fixed price, hosting included, built on-island. Free quote: 250-616-2087.",
  keywords: [
    "web design comox valley",
    "courtenay web design",
    "web design courtenay",
    "web designer campbell river",
    "website design campbell river",
  ],
  alternates: { canonical: "/web-design-comox-valley" },
  openGraph: {
    title: "Web Design in the Comox Valley & Campbell River | VDT Sites",
    description:
      "Website design for Courtenay, Comox and Campbell River businesses. Fixed price, hosting included, built on-island in Nanaimo.",
    url: "/web-design-comox-valley",
  },
  twitter: {
    title: "Web Design in the Comox Valley & Campbell River | VDT Sites",
    description:
      "Website design for Courtenay, Comox and Campbell River businesses. Fixed price, hosting included, built on-island.",
  },
};

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Do you actually work with businesses this far up-island?",
    a: "Yes. Our clients are spread across Vancouver Island and beyond, and almost none of them have ever needed us in the room: everything runs by phone, email and video call, and questions get answered within a day by the person who built the site. Courtenay is about ninety minutes up the highway from us in Nanaimo, so if a meeting ever genuinely matters, it is a drive, not a flight.",
  },
  {
    q: "How much does a website cost in the Comox Valley?",
    a: `Ours start at ${PRICE_BUILD_FROM} ${CURRENCY} for the build, plus ${PRICE_MONTHLY} a month covering hosting, your domain, SSL, backups, monitoring and support. The price is fixed and quoted in writing before any work begins, and it is the same in Courtenay, Comox, Cumberland or Campbell River.`,
  },
  {
    q: "Can you help my business show up on Google here?",
    a: "The search groundwork is built into every site we make: clean structure, fast load, proper titles and descriptions, structured data and a sitemap that actually gets submitted. For a local business in a market this size, that groundwork plus a well set up Google Business Profile is most of the battle.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. The slow part is almost never the build, it is waiting on text, photos and approvals, so the fastest projects are the ones where the owner has those ready.",
  },
];

const REASONS = [
  {
    title: "One call away, wherever you are on the island",
    body: "We are a small company by choice, and the thing we sell hardest is service. When you have a question, you reach the person who actually built your site, by one email or one phone call, and you hear back within a day, usually the same one. No ticket queue, no account manager relaying messages.",
  },
  {
    title: "Same island, same understanding",
    body: "A business in Courtenay or Campbell River lives on local customers, seasonal rhythms and word of mouth, and we build for that every week across Vancouver Island. Your site gets structured around how island customers actually find and choose a local business, not a template built for nowhere in particular.",
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

export default function WebDesignComoxValleyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Web Design in the Comox Valley & Campbell River",
        description:
          "Website design for Courtenay, Comox, Cumberland and Campbell River businesses. Fixed price, hosting included, built on-island in Nanaimo.",
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
              name: "Web Design in the Comox Valley",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Web Design in the Comox Valley & Campbell River",
        serviceType:
          "Custom website design and development for small businesses in the Comox Valley and Campbell River",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Courtenay" },
          { "@type": "City", name: "Comox" },
          { "@type": "City", name: "Cumberland" },
          { "@type": "City", name: "Campbell River" },
          { "@type": "Place", name: "Comox Valley Regional District" },
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
      {/* <ContactCard> renders unstyled and cannot submit without these. */}
      <link rel="stylesheet" href={`/lab/contact-card.css?v=${LAB_V}`} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script src={`/lab/contact-card.js?v=${LAB_V}`} strategy="afterInteractive" />
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
              Courtenay · Comox · Campbell River
            </p>
            <h1
              className="mt-4 max-w-[19ch] text-4xl font-bold leading-[1.05] md:text-[60px]"
              style={{ fontFamily: SYNE }}
            >
              Website design for the Comox Valley and Campbell River.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom websites for businesses in Courtenay, Comox, Cumberland
                and Campbell River, from {PRICE_BUILD_FROM} {CURRENCY} plus{" "}
                {PRICE_MONTHLY} a month with hosting, domain and support
                included. Built on-island in Nanaimo, delivered the way we
                deliver everywhere: fast, personal, and priced in writing
                before we start.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                {/* Scrolls to the form at the foot of this page rather than
                    spending a click on /contact. */}
                <a
                  href="#contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a free quote
                </a>
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

        {/* ── Why us ───────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Why hire us from an hour down-island
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Because distance stopped mattering for this work years ago,
                and service never did.
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
                  A coffee roaster with a real online store. A Japanese vehicle
                  importer. A counselling practice that left Squarespace, a
                  food truck run from the owner&rsquo;s phone, and an
                  accounting firm whose old site had been invisible to Google
                  for years.{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Every build is written up properly
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
                  Every one of those businesses reaches us the same way you
                  would from Courtenay or Campbell River: one message, answered
                  by the person who built their site. That is the part of the
                  work you cannot see in a portfolio, and it is the part our
                  reviews keep coming back to.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Work carousel ────────────────────────────────── */}
        <section className="border-t border-black/10 py-16 md:py-20">
          <WorkCarousel items={WORK_ITEMS} />
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
                    {f.link && (
                      <>
                        {" "}
                        <Link
                          href={f.link.href}
                          className="font-semibold text-[#dc2626] underline underline-offset-2"
                        >
                          {f.link.label}
                        </Link>
                        .
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        {/* id="contact" now belongs to <ContactCard> below, which is the
            thing worth scrolling to. MobileActionBar hides against that. */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Tell us about your business.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  What you do, who you want to reach, and what your current
                  site is getting wrong if you have one. You get a fixed
                  written quote back, free, with no obligation attached to it.
                  If we are not the right fit we will tell you and point you
                  somewhere that is.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a free quote
                  </a>
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

        {/* The enquiry form itself, so paid and organic traffic can convert
            here instead of spending a click on /contact. Needs the GSAP +
            contact-card assets loaded above. */}
        <ContactCard paddingTop={64} paddingBottom={72} />
      </main>

      <MobileActionBar />

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
