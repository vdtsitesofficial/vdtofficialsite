import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import ReviewPull from "@/components/ReviewPull";
import ServiceAreas from "@/components/ServiceAreas";
import { PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /website-maintenance
 *
 * Organic landing page for the maintenance cluster (Semrush ca, Aug 2026):
 *   website maintenance services   1000/mo  KD 11
 *   website maintenance cost        (folded into FAQ)
 *   website care plan               (folded into copy)
 *
 * SEO Plan Phase 1 (vault: Projects/VDT Sites/SEO Plan.md). The offer is
 * the existing monthly care plan, priced from lib/pricing: one flat fee,
 * month to month, covering hosting, domain, SSL, backups, monitoring and
 * small updates. The differentiator against the SERP's retainer shops is
 * the same one /seo-nanaimo uses: a real number in public and no hourly
 * meter.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/website-maintenance`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

const MONTHLY_NUM = PRICE_MONTHLY.replace("$", "");

export const metadata: Metadata = {
  title: `Website Maintenance Services for ${PRICE_MONTHLY} a Month, Flat`,
  description: `Website maintenance for one flat fee: hosting, domain, SSL, backups, monitoring and small updates, ${PRICE_MONTHLY} ${CURRENCY} a month, no contract. Call 250-616-2087.`,
  keywords: [
    "website maintenance services",
    "website maintenance cost",
    "website care plan",
    "website hosting and maintenance",
    "small business website maintenance",
  ],
  alternates: { canonical: "/website-maintenance" },
  openGraph: {
    title: `Website Maintenance Services for ${PRICE_MONTHLY} a Month | VDT Sites`,
    description: `One flat monthly fee covers hosting, domain, SSL, backups, monitoring and small updates. No contract, no hourly meter.`,
    url: "/website-maintenance",
  },
  twitter: {
    title: `Website Maintenance Services for ${PRICE_MONTHLY} a Month | VDT Sites`,
    description: `One flat monthly fee covers hosting, domain, SSL, backups, monitoring and small updates. No contract, no hourly meter.`,
  },
};

const FAQS = [
  {
    q: "How much does website maintenance cost?",
    a: `Ours is ${PRICE_MONTHLY} ${CURRENCY} a month, flat. That is the whole number: hosting, the domain renewal, the SSL certificate, backups, uptime monitoring and small content updates are all inside it. Agencies typically charge somewhere between $50 and $300 a month for the same list, usually itemised so it is hard to compare. We publish ours so you can.`,
  },
  {
    q: "What does website maintenance actually include?",
    a: "The unglamorous work that keeps a site alive: hosting on fast infrastructure, the domain and SSL renewals that take sites down when someone forgets them, automatic backups, monitoring that tells us the site is down before you do, security and software updates, and small content changes when you need them. If a request is genuinely a new build rather than upkeep, we say so and quote it separately before touching anything.",
  },
  {
    q: "Can you maintain a website you did not build?",
    a: "Usually, yes. We look at what exists first, because a site we cannot work on honestly is not one we should charge for monthly. If it is workable, we move it onto our hosting, take a full backup, fix anything dangerous, and from then on it is the same flat fee as everyone else. If it is not workable, we tell you that, and what a rebuild would cost instead.",
  },
  {
    q: "Do I have to sign a contract?",
    a: "No. The care plan is month to month and you can leave whenever you want. Your domain is registered to you, not to us, and if you go we hand over everything cleanly. Businesses stay because the site keeps working, which is the only retention scheme we are comfortable with.",
  },
  {
    q: "What happens if my site goes down?",
    a: "Monitoring pings the site around the clock, so most outages are being worked on before anyone notices. The honest caveat is that nobody can promise a specific response time at this price, and anyone who does has not been woken by an outage yet. What we can say is that the stack we host on is built for uptime, and the record so far backs it.",
  },
  {
    q: "How long does website maintenance take?",
    a: "Depends what you mean. Small fixes, swapping photos, changing hours, repairing something that broke, usually take less than a day. A full rebuild of an aging site is three to four days once we have your content. If you are not sure which side your site falls on, ask us, it is free: send the address and we will tell you honestly what it needs.",
  },
  {
    q: "Are small updates really included?",
    a: "Yes. Swapping photos, changing hours, updating prices, adding a review, that class of change is included, and most sites we build let you do it yourself from the page anyway. Bigger jobs, like a new page or a new feature, get a fixed quote first, so the monthly fee never quietly grows.",
  },
];

const COVERED = [
  {
    title: "Hosting, domain and SSL",
    body: "The three renewals that silently take small business websites offline every day, handled and paid for inside the fee. Fast global hosting, your domain kept in your name, and a certificate that never lapses.",
  },
  {
    title: "Backups and monitoring",
    body: "Automatic backups you never have to think about, and uptime monitoring that tells us the moment the site misbehaves. When something breaks, the fix starts with a recent copy and a timestamp, not with panic.",
  },
  {
    title: "Updates and small changes",
    body: "Software kept current so the site stays secure and fast, and small content changes included when you need a hand. New hours, new photos, a new review. Ask, and it is done, with no invoice following it.",
  },
];

export default function WebsiteMaintenancePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: `Website Maintenance Services for ${PRICE_MONTHLY} a Month, Flat`,
        description: `Website maintenance for one flat monthly fee: hosting, domain, SSL, backups, monitoring and small updates. No contract.`,
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
              name: "Website Maintenance",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Care Plan",
        serviceType:
          "Website maintenance: hosting, domain, SSL, backups, uptime monitoring, software updates and small content changes",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "Place", name: "Vancouver Island" },
          { "@type": "Country", name: "Canada" },
        ],
        offers: {
          "@type": "Offer",
          price: MONTHLY_NUM,
          priceCurrency: CURRENCY,
          description: `${PRICE_MONTHLY} ${CURRENCY} per month, flat, no contract`,
        },
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
              Care plan
            </p>
            <h1
              className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Website maintenance, one flat fee, no meter.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Website maintenance services for {PRICE_MONTHLY} {CURRENCY} a
                month. Hosting, your domain, SSL, backups, monitoring and
                small updates, all inside one number that does not change.
                Month to month, no contract, and no invoice for asking us to
                fix a typo.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <a
                  href="#contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get on the plan
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

        {/* ── What the fee covers ──────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                What {PRICE_MONTHLY} a month covers
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Maintenance is not a mystery, it is a short list of chores
                that go badly when nobody owns them. The fee exists so that
                somebody does.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {COVERED.map((c, i) => (
                <div key={c.title} className="max-w-3xl">
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
                      {c.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why flat, not hourly ─────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The model
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Why the fee is flat
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    An hourly meter punishes you for calling.
                  </strong>{" "}
                  When every question costs money, owners stop asking, small
                  problems sit until they are big ones, and the site quietly
                  rots. A flat fee removes the hesitation. You notice
                  something, you tell us, it gets fixed, and the number on the
                  bill is the same one it was last month.
                </p>
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    It also keeps us honest about scope.
                  </strong>{" "}
                  If something you want is genuinely a project rather than
                  upkeep, we say so out loud and{" "}
                  <Link
                    href="/pricing"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    quote it as a fixed price
                  </Link>{" "}
                  before starting. The monthly fee never quietly grows into a
                  retainer.
                </p>
                <p className="border-l-2 border-[#dc2626] pl-5">
                  Every site we build includes this plan, and it is the whole
                  hosting bill. There is no separate hosting invoice, no
                  domain renewal surprise in February, and no charge for the
                  ten minute favour. One number, one person to call.
                </p>
                <p>
                  Already have a website someone else built? We take those on
                  too, after an honest look at what is there. And if the look
                  says the site needs more than upkeep, the answer might be a{" "}
                  <Link
                    href="/website-redesign"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    redesign
                  </Link>
                  , with a real number attached, rather than a monthly fee
                  spent propping it up.
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
                Stop being your own webmaster.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  Tell us where your site lives and who built it. We will look
                  at what is there, tell you plainly whether it is worth
                  maintaining or worth replacing, and either way you get a
                  fixed number before anything starts.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get on the plan
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
                <ReviewPull author="Root 86 Coffee" />
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
