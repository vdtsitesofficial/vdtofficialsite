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
    "Contact VDT Sites for website design in Nanaimo, BC. Call 250-616-2087, send a message, or schedule a call and we'll phone you at the time you pick.",
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
          </a>
          , send a message, or schedule a call below and we&rsquo;ll phone you
          at the time you pick. We reply within one business day.
        </p>
      </div>

      <main className="flex-1">
        <ContactCard />

        {/* Body copy, deliberately below the card so the form stays above
            the fold. This page was 61 words of real content (Semrush audit,
            Aug 2026), which is a thin page by any measure and gave a visitor
            deciding whether to call nothing to go on. Original copy on
            purpose: the homepage FAQ is not repeated here, because trading a
            low-word-count flag for a duplicate-content one is not a fix. */}
        <section
          className="mx-auto max-w-3xl px-6 pb-20 pt-16 md:pt-24"
          aria-labelledby="what-happens-next"
        >
          <h2
            id="what-happens-next"
            className="text-2xl font-bold leading-tight md:text-3xl"
            style={{ fontFamily: SYNE }}
          >
            What happens after you get in touch
          </h2>

          <ol className="mt-8 space-y-7">
            <li className="flex gap-4">
              <span
                className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#dc2626] text-[13px] font-bold text-white"
                aria-hidden
              >
                1
              </span>
              <p className="text-[15px] leading-relaxed text-[#0d0d0d]/75">
                <strong className="font-semibold text-[#0d0d0d]">
                  We reply within one business day.
                </strong>{" "}
                Usually the same day if you catch us before mid-afternoon. If
                you asked us to call, we phone at the time you picked rather
                than whenever it suits us.
              </p>
            </li>
            <li className="flex gap-4">
              <span
                className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#dc2626] text-[13px] font-bold text-white"
                aria-hidden
              >
                2
              </span>
              <p className="text-[15px] leading-relaxed text-[#0d0d0d]/75">
                <strong className="font-semibold text-[#0d0d0d]">
                  A short, practical conversation.
                </strong>{" "}
                What your business does, who you are trying to reach, and what
                your current site is getting wrong if you have one. Fifteen
                minutes is usually enough. There is no script and no pitch deck.
              </p>
            </li>
            <li className="flex gap-4">
              <span
                className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#dc2626] text-[13px] font-bold text-white"
                aria-hidden
              >
                3
              </span>
              <p className="text-[15px] leading-relaxed text-[#0d0d0d]/75">
                <strong className="font-semibold text-[#0d0d0d]">
                  A fixed written quote, free.
                </strong>{" "}
                One price for the whole project, agreed before any work starts,
                so there is no hourly meter running and no invoice that arrives
                bigger than you expected.
              </p>
            </li>
          </ol>

          <h2
            className="mt-14 text-2xl font-bold leading-tight md:text-3xl"
            style={{ fontFamily: SYNE }}
          >
            Useful things to mention
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#0d0d0d]/75">
            None of this is required, and a one-line message is genuinely fine.
            But if you already know the answers, saying so up front means the
            first reply you get is a useful one instead of a list of questions:
          </p>
          <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-[#0d0d0d]/75">
            <li className="flex gap-3">
              <span className="text-[#dc2626]" aria-hidden>
                &bull;
              </span>
              <span>What your business does, and where you are based.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc2626]" aria-hidden>
                &bull;
              </span>
              <span>
                Whether you have a website now, and what you dislike about it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#dc2626]" aria-hidden>
                &bull;
              </span>
              <span>
                Roughly when you want to be live. Most sites take three to four
                days once the content is in hand.
              </span>
            </li>
          </ul>

          <p className="mt-10 border-t border-black/10 pt-8 text-[15px] leading-relaxed text-[#0d0d0d]/75">
            We are based in Nanaimo and work with businesses across Vancouver
            Island and the Vancouver area, so being out of town is not a
            problem. Everything can be handled by phone, email and video call if
            that is easier. And there is no obligation at the end of any of
            this: plenty of these conversations finish with some advice and no
            invoice, which is a perfectly good outcome. If we are not the right
            fit for what you need, we would rather tell you and point you
            somewhere that is.
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
