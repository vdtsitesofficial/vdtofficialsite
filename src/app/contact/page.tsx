import type { Metadata } from "next";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";
import ContactCard from "@/components/ContactCard";
import PageHeader from "@/components/PageHeader";

/**
 * Standalone /contact page — the direct route to a conversation for people
 * who already know who we are. Skips the full lab scroll experience: header
 * → cards → slim footer, form above the fold, no zoom hero and no mobile
 * tap-gate.
 *
 * NOT the Google Ads destination any more — that's /web-design-nanaimo,
 * which adds the message match, proof and objection handling that cold paid
 * traffic needs before being asked for its details. This page's H1 assumes
 * the visitor already decided.
 *
 * The card markup lives in components/ContactCard.tsx so this page and the
 * landing page can't drift apart.
 */

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact VDT Sites for website design in Nanaimo, BC. Call 250-616-2087 or send a message and we'll reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | VDT Sites",
    description:
      "Call 250-616-2087 or send a message. Website design in Nanaimo & across Vancouver Island.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Us | VDT Sites",
    description:
      "Call 250-616-2087 or send a message. Website design in Nanaimo & across Vancouver Island.",
  },
};

const SYNE = "'Syne', 'Inter', sans-serif";

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#f4efe6] text-[#0d0d0d]">
      {/* Contact card fonts (Inter body, Syne display) — same faces the
          card uses on the homepage. */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href={`/lab/contact-card.css?v=${LAB_V}`} />

      {/* GSAP first, then the card's interactions (entry animation,
          magnetic hover, form submit → /api/contact, GA4 lead event). */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script src={`/lab/contact-card.js?v=${LAB_V}`} strategy="afterInteractive" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: "https://vdtsites.com/contact",
            about: { "@id": "https://vdtsites.com/#business" },
          }),
        }}
      />

      <PageHeader activeHref="/contact" />

      {/* Compact intro — h1 for the page, phone front and centre. */}
      <div className="px-6 pt-6 text-center md:pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
          Contact
        </p>
        <h1
          className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: SYNE }}
        >
          Let&rsquo;s talk about your website.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#0d0d0d]/65">
          Call{" "}
          <a href="tel:+12506162087" className="font-semibold text-[#dc2626] underline underline-offset-2">
            250-616-2087
          </a>{" "}
          or send a message below. We reply within one business day.
        </p>
      </div>

      <main className="flex-1">
        <ContactCard />
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
