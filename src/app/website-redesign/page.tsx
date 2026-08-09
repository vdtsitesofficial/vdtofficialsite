import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import ReviewPull from "@/components/ReviewPull";
import ServiceAreas from "@/components/ServiceAreas";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /website-redesign
 *
 * Organic landing page for the redesign cluster (Semrush ca, Aug 2026):
 *   website redesign services   480/mo  KD 13
 *   website redesign cost        (folded into FAQ)
 *   redesign my website          (folded into copy)
 *
 * SEO Plan Phase 1 (vault: Projects/VDT Sites/SEO Plan.md). This is the
 * organic twin of the demo-outreach pitch: the visitor already knows
 * their site is dated, the page's job is to make the rebuild feel safe.
 * The technical differentiator is rankings safety (audit what ranks,
 * keep or 301 every URL, keep the domain), because "will a redesign
 * lose my Google standing" is the fear that stalls these buyers.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/website-redesign`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Website Redesign Services at a Fixed Price",
  description: `Website redesign that keeps your Google standing: we audit what ranks, keep or redirect every URL, and rebuild fast and modern. Fixed quote from ${PRICE_BUILD_FROM} ${CURRENCY}. Call 250-616-2087.`,
  keywords: [
    "website redesign services",
    "website redesign cost",
    "redesign my website",
    "website rebuild",
    "small business website redesign",
  ],
  alternates: { canonical: "/website-redesign" },
  openGraph: {
    title: "Website Redesign Services at a Fixed Price | VDT Sites",
    description:
      "A redesign that keeps your Google standing: audit what ranks, keep or redirect every URL, rebuild fast and modern. Fixed quote up front.",
    url: "/website-redesign",
  },
  twitter: {
    title: "Website Redesign Services at a Fixed Price | VDT Sites",
    description:
      "A redesign that keeps your Google standing: audit what ranks, keep or redirect every URL, rebuild fast and modern. Fixed quote up front.",
  },
};

const SIGNS = [
  {
    title: "It looks fine on your desktop and broken on their phone",
    body: "Most of your visitors are on a phone, and a site built even five years ago usually was not designed for one. If you have to pinch and zoom, so do your customers, and most of them do not bother.",
  },
  {
    title: "You cannot change anything yourself",
    body: "The person who built it moved on, the login is lost, and updating your hours means a favour or an invoice. A site you cannot touch stops being updated, and a site that stops being updated slowly stops being true.",
  },
  {
    title: "It is slow, and Google noticed",
    body: "Speed is a ranking factor and an abandonment factor at the same time. A slow site loses twice: fewer people find it, and fewer of the ones who do stay long enough to call.",
  },
  {
    title: "It no longer matches the business",
    body: "Prices changed, services changed, photos are a decade old, and the site still introduces the business you used to be. Visitors take the mismatch as a signal about how the rest of the operation runs.",
  },
];

const FAQS = [
  {
    q: "How much does a website redesign cost?",
    a: `Ours start at ${PRICE_BUILD_FROM} ${CURRENCY}, the same as a new build, because that is what a proper redesign is. You get a fixed quote before any work starts, based on what your current site has that needs carrying over. Anyone quoting a redesign without looking at the existing site first is guessing.`,
  },
  {
    q: "Will a redesign hurt my Google rankings?",
    a: "Done carelessly, yes, and this is the most common way businesses lose rankings they spent years earning. Done properly, no. Before we touch anything we record what your site ranks for and which pages earn it. Every URL is either kept or permanently redirected to its replacement, the domain stays yours and stays put, and the new site ships with the structure and speed Google rewards. That work is part of every redesign, not an add-on.",
  },
  {
    q: "Can I keep my domain name?",
    a: "Yes, always. The domain is your business's address and it never changes hands or location during a redesign. If it is currently registered under someone else's account, which is depressingly common, getting it back into your name becomes part of the job.",
  },
  {
    q: "How long does a redesign take?",
    a: "Once we have your content, most sites are live in three to four days. The longer pole is usually gathering what the new site needs from you: current photos, current prices, the words you actually want. We tell you the realistic timeline with the quote, and then hit it.",
  },
  {
    q: "My site is on Wix or WordPress. Can you redesign it?",
    a: "Yes. We rebuild rather than patch, because stacking a new coat of paint on a slow platform keeps the slowness. Whatever ranks and whatever matters carries over, and what you get back is a site you own outright with no platform subscription underneath it.",
  },
  {
    q: "Can AI redesign my website?",
    a: "Honestly, yes, and it is worth knowing about. There are plenty of AI website builders around now, and they will design you a decent looking site. The catch is search: AI tools have no SEO specialization, they do not know what ranks and what does not, so the result tends to look fine and stay invisible. If you are considering the DIY route it is definitely worth a shot. And if you want the speed without the invisible part, that is roughly what we sell: we can rebuild your site from little more than photos, do the search groundwork properly, host it and stand behind it. Contact us and ask.",
  },
  {
    q: "What if my site just needs small fixes, not a redesign?",
    a: `Then that is what we will tell you. Sometimes the honest answer is a few hours of repair and our ${PRICE_MONTHLY} a month care plan, not a rebuild. We would rather keep a working site alive cheaply than sell you a redesign it does not need, and we put that in writing on the quote.`,
  },
];

export default function WebsiteRedesignPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Redesign Services at a Fixed Price",
        description:
          "Website redesign that keeps your Google standing: audit what ranks, keep or redirect every URL, rebuild fast and modern. Fixed quote up front.",
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
              name: "Website Redesign",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Redesign",
        serviceType:
          "Website redesign and rebuild: rankings-safe migration, modern responsive design, speed and SEO groundwork",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "Place", name: "Vancouver Island" },
          { "@type": "Country", name: "Canada" },
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
              Redesign
            </p>
            <h1
              className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              A redesign that keeps what Google knows about you.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Website redesign services for businesses whose site stopped
                pulling its weight. We rebuild it fast, modern and editable,
                and we carry your rankings across on purpose rather than by
                luck. Fixed quote before anything starts, from{" "}
                {PRICE_BUILD_FROM} {CURRENCY}.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <a
                  href="#contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a fixed quote
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

        {/* ── Signs it is time ─────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                How to know it is time
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Nobody redesigns a website for fun. These are the four
                signals we hear on the phone, and any one of them is reason
                enough to look.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {SIGNS.map((s, i) => (
                <div key={s.title} className="max-w-3xl">
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
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How rankings survive ─────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The method
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  How your rankings survive the move
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    First, we record what you are about to risk.
                  </strong>{" "}
                  Which searches your site shows up for, which pages earn
                  them, and which other sites link to yours. That list is the
                  redesign's safety rail, and it exists before a single pixel
                  moves.
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    Then every address is kept or redirected.
                  </strong>{" "}
                  Any page that earns visits either keeps its exact URL or
                  permanently redirects to its replacement, so Google and
                  every link on the internet follow the move instead of
                  hitting a dead end. This is the step careless redesigns
                  skip, and it is why they bleed.
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    The new site ships faster than the old one.
                  </strong>{" "}
                  Modern stack, proper titles and structure, structured data,
                  a submitted sitemap, and load times the old site could not
                  reach. A redesign done this way usually gains ground on
                  Google rather than defending it.
                </p>
                <p className="border-l-2 border-[#dc2626] pl-5">
                  Afterwards, the{" "}
                  <Link
                    href="/website-maintenance"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    {PRICE_MONTHLY} a month care plan
                  </Link>{" "}
                  takes over: hosting, domain, SSL, backups and small updates
                  in one flat fee, so the new site never ages the way the old
                  one did. See{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the case studies
                  </Link>{" "}
                  for what the before and after looks like on real
                  businesses.
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
                Find out what a redesign would cost.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Send us your website address. We will look at what is
                  there, tell you honestly whether it needs a rebuild or just
                  repairs, and give you a fixed number either way. If the
                  site is better than you think, we will say that too.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a fixed quote
                  </a>
                  <a
                    href="tel:+12506162087"
                    className="text-[15px] font-semibold text-[#0d0d0d] underline underline-offset-4"
                  >
                    250-616-2087
                  </a>
                </div>
                <p className="mt-6 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                  <Link
                    href="/about"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    See who you&rsquo;d be working with!
                  </Link>
                </p>
                {/* Sherri's review IS the redesign pitch: she left two
                    website builders and cut her yearly costs. */}
                <ReviewPull author="Sherri K" />
              </div>
            </div>
          </div>
        </section>
        {/* The enquiry form itself, so visitors at peak intent convert here
            instead of spending a click on /contact. Needs the GSAP +
            contact-card assets loaded above. */}
        <ContactCard paddingTop={64} paddingBottom={72} />
      </main>

      <MobileActionBar />

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
