import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import MobileActionBar from "@/components/MobileActionBar";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";
import TeamCard from "@/components/TeamCard";
import WorkCarousel from "@/components/WorkCarousel";
import { WORK_ITEMS } from "@/lib/workItems";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";

/**
 * /web-design-parksville
 *
 * Parksville city page. The cluster is tiny (Semrush ca, Aug 2026):
 *   web design parksville        20/mo  KD 0
 *   website design parksville    10/mo  KD 0
 *   parksville web design        10/mo  KD 0
 *   ~40/mo total; phrase_related returns NOTHING else. Every one of those
 *   searches is a business shopping for a website, and KD 0 means the page
 *   should sit top-3 quickly, so it earns its keep on intent, not volume.
 *
 * ── The angle: this page has what Victoria could not have — a REAL
 * Parksville client. Morky Auto Imports is a Parksville business, so the
 * proof section tells that story specifically and the carousel leads with
 * it. Plus literal proximity: Parksville is 20 minutes from Nanaimo.
 * That combination is the anti-doorway substance; do not water it down
 * into generic city-swap copy.
 *
 * ── Tone: no swipes at other agencies (see Copy & Messaging, 2026-08-08).
 * Lead with what we offer, never with what competitors do wrong.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/web-design-parksville`;

const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

/* Morky is the Parksville client, so the track leads with it here. */
const WORK = [
  ...WORK_ITEMS.filter((w) => w.name === "Morky Auto Imports"),
  ...WORK_ITEMS.filter((w) => w.name !== "Morky Auto Imports"),
];

export const metadata: Metadata = {
  title: "Website Design in Parksville, BC",
  // Kept under ~155 chars so the phone number survives SERP truncation.
  description:
    "Website design for Parksville businesses, built 20 minutes away in Nanaimo. We already build for Parksville. Fixed price. Free quote: 250-616-2087.",
  keywords: [
    "web design parksville",
    "website design parksville",
    "parksville web design",
    "web designer parksville",
    "web design qualicum beach",
  ],
  alternates: { canonical: "/web-design-parksville" },
  openGraph: {
    title: "Website Design in Parksville, BC | VDT Sites",
    description:
      "Website design for Parksville businesses, built 20 minutes away in Nanaimo. Fixed price, hosting included, and we already build for Parksville.",
    url: "/web-design-parksville",
  },
  twitter: {
    title: "Website Design in Parksville, BC | VDT Sites",
    description:
      "Website design for Parksville businesses, built 20 minutes away in Nanaimo. Fixed price, hosting included.",
  },
};

const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "Have you actually built for a Parksville business?",
    a: "Yes. Morky Auto Imports, a Japanese vehicle import business in Parksville, runs on a site we designed and built from scratch, and the full write-up of that project is on this page. Most of our other clients are in Nanaimo and around Vancouver Island, so Parksville is not a market we are reaching for. It is next door.",
    link: { href: "/work/morky-auto-imports", label: "Read the Morky case study" },
  },
  {
    q: "How much does a website cost in Parksville?",
    a: `Ours start at ${PRICE_BUILD_FROM} ${CURRENCY} for the build, plus ${PRICE_MONTHLY} a month covering hosting, your domain, SSL, backups, monitoring and support. The price is fixed and quoted in writing before any work begins, and it is the same whether you are in Parksville, Qualicum Beach or Nanoose Bay.`,
  },
  {
    q: "Do we need to meet in person?",
    a: "Almost never, and most of our clients never have. Everything runs by phone, email and video call. That said, Parksville is a twenty minute drive from us, so if sitting down over a coffee genuinely helps, that is the easiest meeting on our calendar.",
  },
  {
    q: "How long does it take?",
    a: "Once we have your content, most sites are live in three to four days. The slow part is almost never the build, it is waiting on text, photos and approvals, so the fastest projects are the ones where the owner has those ready.",
  },
];

const REASONS = [
  {
    title: "We already build here",
    body: "Morky Auto Imports in Parksville trusted us with their site, and it is live, fast and bringing in enquiries. That matters more than anything we could claim about ourselves: you can look at a real Parksville business we built, click through it, and judge the work directly.",
  },
  {
    title: "Twenty minutes away, one call away",
    body: "We are a small company based in Nanaimo, and the thing we sell hardest is service. When you have a question, you reach Sem or Phillip, the two of us who actually built your site, by one email or one phone call, and you hear back within a day. And because we are just down the highway, close is not a figure of speech.",
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

export default function WebDesignParksvillePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Website Design in Parksville, BC",
        description:
          "Website design for Parksville, BC businesses. Fixed price, hosting included, built 20 minutes away in Nanaimo.",
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
              name: "Website Design in Parksville",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Website Design in Parksville, BC",
        serviceType:
          "Custom website design and development for small businesses in Parksville and Oceanside",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Parksville" },
          { "@type": "City", name: "Qualicum Beach" },
          { "@type": "Place", name: "Nanoose Bay" },
          { "@type": "Place", name: "Coombs" },
          { "@type": "Place", name: "Errington" },
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
              Parksville · Oceanside
            </p>
            <h1
              className="mt-4 max-w-[17ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Website design in Parksville, from just up the road.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Custom websites for Parksville and Qualicum Beach businesses,
                from {PRICE_BUILD_FROM} {CURRENCY} plus {PRICE_MONTHLY} a month
                with hosting, domain and support included. We build twenty
                minutes away in Nanaimo, and one of our favourite builds is a
                Parksville business you may already know.
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

        {/* ── Proof: the Morky story ───────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                We already build for Parksville
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  <strong className="font-semibold text-[#0d0d0d]">
                    Morky Auto Imports
                  </strong>{" "}
                  imports Japanese vehicles right here in Parksville, and their
                  website is one of ours: a custom build with a browsable
                  inventory, built to make a specialised business easy to
                  understand and easy to contact.{" "}
                  <Link
                    href="/work/morky-auto-imports"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    The full case study is here
                  </Link>
                  , and the live site is one click further.
                </p>
                <p>
                  The rest of our work is spread across Vancouver Island: a
                  coffee roaster with a real online store, a counselling
                  practice, an accounting firm, a food truck.{" "}
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
              </div>
            </div>
          </div>
        </section>

        {/* ── Work carousel (Morky leads) ──────────────────── */}
        <section className="border-t border-black/10 py-16 md:py-20">
          <WorkCarousel items={WORK} />
        </section>

        {/* ── The team: faces under the proof (Sem, 2026-08-10) ── */}
        <section className="px-6 pb-16 md:px-14 md:pb-20">
          <TeamCard />
        </section>

        {/* ── Why us ───────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                What you get, and why it works
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                One fixed price agreed up front, a site you can edit yourself,
                and the person who built it answering when you call.
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
                Tell us about your Parksville business.
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

      <ServiceAreas current="/web-design-parksville" />

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
