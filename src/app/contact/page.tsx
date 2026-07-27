import type { Metadata } from "next";
import Script from "next/script";
import { LAB_V } from "@/lib/labVersion";

/**
 * Standalone /contact page — the ad-friendly, direct route to a
 * conversation. Reuses the homepage's contact card verbatim (same
 * markup, contact-card.css, and contact-card.js interactions) so
 * the two stay visually identical, but skips the full lab scroll
 * experience: header → cards → slim footer, form above the fold.
 *
 * This URL is what Google Ads points at ("Add Page" / final URL),
 * so keep it fast and self-contained — no lab main.js, no zoom hero.
 */

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact VDT Sites — website design in Nanaimo, BC. Call 250-616-2087 or send a message and we'll reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | VDT Sites",
    description:
      "Call 250-616-2087 or send a message — website design in Nanaimo & across Vancouver Island.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Us | VDT Sites",
    description:
      "Call 250-616-2087 or send a message — website design in Nanaimo & across Vancouver Island.",
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

      {/* Ink-on-cream header — same layout/typography as the lab's
          zoom-header, recolored for the cream page (the lab header is
          white text for the photo hero and would vanish here). */}
      <header className="flex items-center justify-between px-4 py-4 md:px-14 md:py-6">
        <a href="/" className="inline-flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vdt-glass-logo.png" alt="VDT Sites" className="h-8 w-8 md:h-[34px] md:w-[34px]" />
          <span
            className="text-[12px] font-extrabold tracking-[0.10em] md:text-[13px]"
            style={{ fontFamily: SYNE }}
          >
            VDT&nbsp;SITES
          </span>
        </a>
        <nav className="flex items-center gap-5 text-[13px] font-medium md:gap-9">
          <a href="/" className="opacity-75 transition-opacity hover:opacity-100">Home</a>
          <a href="/blog" className="opacity-75 transition-opacity hover:opacity-100">Blog</a>
          <a href="/#portfolio" className="hidden opacity-75 transition-opacity hover:opacity-100 sm:inline">
            Portfolio
          </a>
          <a href="/contact" className="font-semibold text-[#dc2626]">Contact&nbsp;Us</a>
        </nav>
      </header>

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
          or send a message below — we reply within one business day.
        </p>
      </div>

      {/* VDT Contact Card — markup mirrors src/app/page.tsx's #contact
          section; contact-card.js drives both. Tighter vertical padding
          here so the form sits high on the page. */}
      <main className="flex-1">
        <section
          id="contact"
          className="vdt-contact-card"
          style={{ minHeight: "auto", paddingTop: 48, paddingBottom: 72 }}
        >
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <defs>
              <linearGradient id="cc-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>

          <div className="cc-bg"></div>

          <div className="cards-row">
            <div className="cc-card">
              <div className="cc-color-splash"></div>
              <div className="cc-name">
                <span>VDT</span>
                <span>SITES</span>
              </div>
              <div className="cc-role">Website Designer</div>
              <div className="cc-divider"></div>

              <div className="cc-info">
                <div className="cc-item">
                  <svg className="cc-icon" viewBox="0 0 24 24">
                    <path d="M4 6h16v12H4z" />
                    <path d="M4 6l8 7 8-7" />
                  </svg>
                  <span>vdtsites@gmail.com</span>
                </div>
                <a className="cc-item cc-item--link" href="tel:+12506162087">
                  <svg className="cc-icon" viewBox="0 0 24 24">
                    <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  <span>250-616-2087</span>
                </a>
                <div className="cc-item">
                  <svg className="cc-icon" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                  </svg>
                  <span>@vdtsites</span>
                </div>
                <a
                  className="cc-item cc-item--link"
                  href="https://maps.google.com/?cid=10419426377693999665"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="cc-icon" viewBox="0 0 24 24">
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.6" />
                  </svg>
                  <span>Read our Google reviews</span>
                </a>
              </div>

              <div className="cc-watermark cc-watermark--sites">SITES</div>
            </div>

            <div className="cc-card cc-form-card">
              <div className="cc-color-splash"></div>
              <div className="cc-name">
                <span>Contact</span>
                <span>Us</span>
              </div>
              <div className="cc-role">Start a conversation</div>
              <div className="cc-divider"></div>

              <form className="cc-form" noValidate>
                <div className="cc-field">
                  <label htmlFor="cc-name-input">Name</label>
                  <input id="cc-name-input" name="name" type="text" required autoComplete="name" />
                </div>
                <div className="cc-field">
                  <label htmlFor="cc-email-input">Email</label>
                  <input id="cc-email-input" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="cc-field">
                  <label htmlFor="cc-msg-input">Message</label>
                  <textarea id="cc-msg-input" name="message" rows={3} required></textarea>
                </div>

                {/* honeypot */}
                <input
                  type="text"
                  name="website"
                  className="cc-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <button type="submit" className="cc-send-btn">
                  <span className="cc-send-label">Send message</span>
                  <svg className="cc-send-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path
                      d="M5 12 L19 12 M13 6 L19 12 L13 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>

              <div className="cc-watermark">VDT</div>
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
