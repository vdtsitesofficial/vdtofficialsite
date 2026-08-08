import type { Metadata } from "next";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import PageHeader from "@/components/PageHeader";
import WorkCarousel from "@/components/WorkCarousel";
import { WORK_ITEMS } from "@/lib/workItems";

/**
 * Google Ads landing page.
 *
 * Built because /contact, while fast and ad-friendly, asks for the enquiry
 * without earning it: its H1 is "Let's talk about your website", which suits
 * someone who already decided. Paid traffic arrives cold, comparing four
 * tabs, and needs message match ("web design Nanaimo" — the phrase they
 * searched), proof, and objection handling BEFORE the form.
 *
 * Deliberate constraints, all of which exist to protect cost per lead:
 *  - No lab main.js, no zoom hero, and critically NO mobile tap-to-enter
 *    overlay. Most local paid clicks are mobile; an interstitial between a
 *    $15 click and the content is the most expensive thing on the site.
 *  - Phone number tappable above the fold. Half of local service enquiries
 *    are calls, not forms.
 *  - Images are WebP at ~35-50KB, not the 1MB source PNGs.
 *  - noindex: this competes with the homepage for the exact query the whole
 *    GBP/schema effort targets. One page should own "web design Nanaimo"
 *    organically, and it should be the homepage. Remove the noindex only if
 *    that decision is deliberately reversed.
 *
 * Conversion tracking is inherited, not re-implemented: tel: clicks are
 * caught site-wide by the delegated listener in components/Analytics.tsx,
 * and the form fires GA4 `generate_lead` from public/lab/contact-card.js.
 */

export const metadata: Metadata = {
  title: "Website Design in Nanaimo, BC",
  description:
    "Custom website design for small businesses in Nanaimo and across Vancouver Island. Fixed pricing, hosting included, and you own the site. Free quote: call 250-616-2087.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/web-design-nanaimo" },
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

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
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
