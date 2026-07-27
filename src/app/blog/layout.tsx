import Link from "next/link";

/**
 * Shared chrome for all /blog routes. Loads the lab's design tokens
 * (--canvas, --ink, --accent, etc.) plus the matching Google Fonts,
 * then renders the same #site-chrome header used on the homepage so
 * the brand mark + nav read identically.
 *
 * The homepage's main.js fades the chrome in during the laptop-zoom
 * (.is-visible toggled by scroll). On blog routes there's no zoom,
 * so we hard-code is-visible + is-stuck for a permanent static header.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Lab fonts + tokens. Loaded here so admin/api/etc. don't inherit them. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/lab/style.css" />

      {/* Blog styles — hover states, drop caps, marginalia grid, and the
          editorial typographic system. Inline styles in pages can't do
          :hover, ::first-letter, :first-of-type, or @media, so anything
          requiring those lives here.

          Aesthetic: refined editorial magazine. Cormorant Garamond does
          most of the heavy lifting; Inter handles body. Generous leading,
          warm cream, sparing accent. Drop cap on the first paragraph,
          roman-numeral kickers on section headings, em-dash bullets,
          section-break fleurons. */}
      <style>{`
        /* ============================================================
         *  Index cards (already in use on /blog)
         * ============================================================ */
        .vdt-blog-card { will-change: transform, background; }
        .vdt-blog-card:hover {
          background: #fbf7ee;
          transform: translateY(-2px);
        }
        .vdt-blog-card--featured:hover {
          box-shadow: 0 22px 50px -28px rgba(26, 26, 26, 0.22);
        }
        .vdt-blog-card:hover .vdt-blog-arrow {
          transform: translateX(4px);
        }
        .vdt-blog-arrow {
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        /* ============================================================
         *  Editorial article — the long-form reader.
         *  All selectors prefixed .vdt-article / .vdt-prose so nothing
         *  leaks into other routes.
         * ============================================================ */

        /* Hairline reading-progress bar — driven by BlogReadingChrome. */
        .vdt-article__progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: #b85a3e;
          width: 0%;
          z-index: 200;
          transition: width 0.08s linear;
          pointer-events: none;
        }

        /* Page-level article frame. Single column on mobile; on wide
           screens, a 3-column grid with marginalia (TOC) on the left,
           prose in the center, breathing room on the right. */
        .vdt-article {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 96px;
        }
        @media (min-width: 1024px) {
          .vdt-article {
            grid-template-columns: 220px minmax(0, 680px) 220px;
            gap: 56px;
            padding: 80px 32px 120px;
          }
        }

        .vdt-article__header {
          grid-column: 1 / -1;
          margin-bottom: 48px;
        }
        @media (min-width: 1024px) {
          .vdt-article__header { margin-bottom: 72px; }
        }

        .vdt-article__aside {
          grid-column: 1 / -1;
          margin-bottom: 28px;
        }
        @media (min-width: 1024px) {
          .vdt-article__aside {
            grid-column: 1 / 2;
            grid-row: 2 / span 4;
            position: sticky;
            top: 120px;
            align-self: start;
            margin-bottom: 0;
          }
        }

        .vdt-article__body {
          grid-column: 1 / -1;
        }
        @media (min-width: 1024px) {
          .vdt-article__body { grid-column: 2 / 3; }
        }

        .vdt-article__coda {
          grid-column: 1 / -1;
          margin-top: 96px;
        }
        @media (min-width: 1024px) {
          .vdt-article__coda { grid-column: 2 / 3; }
        }

        /* Breadcrumb across top of header. */
        .vdt-article__crumbs {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6f6a60;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .vdt-article__crumbs a { color: #6f6a60; text-decoration: none; }
        .vdt-article__crumbs a:hover { color: #b85a3e; }
        .vdt-article__crumbs .sep { opacity: 0.35; }
        .vdt-article__crumbs .here {
          color: #1a1a1a;
          font-weight: 600;
        }

        /* The eyebrow category above the title. */
        .vdt-article__kicker {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #b85a3e;
          margin-bottom: 28px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .vdt-article__kicker::after {
          content: '';
          display: inline-block;
          width: 36px;
          height: 1px;
          background: #b85a3e;
        }

        /* The title — big, serif, slightly italic emphasis. */
        .vdt-article__title {
          font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
          font-weight: 500;
          font-size: clamp(2.4rem, 6vw, 4.4rem);
          line-height: 1.02;
          letter-spacing: -0.015em;
          color: #1a1a1a;
          margin: 0 0 28px;
          max-width: 18ch;
        }

        /* The italic kicker subtitle (uses post.description). */
        .vdt-article__lede {
          font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.15rem, 1.8vw, 1.45rem);
          line-height: 1.5;
          color: #4d4a44;
          max-width: 38ch;
          margin: 0 0 40px;
        }

        /* Byline strip with a circular monogram avatar. */
        .vdt-article__byline {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 28px;
          border-top: 1px solid rgba(26, 26, 26, 0.10);
        }
        .vdt-article__avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #f4efe6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .vdt-article__byline-text {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.4;
          color: #1a1a1a;
        }
        .vdt-article__byline-text strong {
          font-weight: 600;
        }
        .vdt-article__byline-meta {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6f6a60;
          margin-top: 2px;
          display: block;
        }

        /* ── TOC marginalia ────────────────────────────────────── */
        .vdt-toc__label {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #6f6a60;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(26, 26, 26, 0.12);
        }
        .vdt-toc__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .vdt-toc__item a {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          line-height: 1.3;
          color: #6f6a60;
          text-decoration: none;
          display: block;
          padding-left: 14px;
          border-left: 1px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease, padding-left 0.2s ease;
        }
        .vdt-toc__item a:hover {
          color: #1a1a1a;
          padding-left: 18px;
        }
        .vdt-toc__item.is-active a {
          color: #1a1a1a;
          border-left-color: #b85a3e;
          font-style: italic;
        }

        /* On narrow screens collapse TOC into a tasteful card. */
        @media (max-width: 1023px) {
          .vdt-toc {
            background: #fbf6ec;
            border: 1px solid rgba(26, 26, 26, 0.10);
            border-radius: 14px;
            padding: 22px 24px;
          }
        }

        /* ============================================================
         *  Prose body — the long-form reading experience itself.
         * ============================================================ */

        .vdt-prose {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 18px;
          line-height: 1.78;
          color: #2a2823;
          font-feature-settings: "kern", "liga", "calt";
        }
        @media (max-width: 640px) {
          .vdt-prose { font-size: 17px; line-height: 1.72; }
        }

        .vdt-prose > * + * { margin-top: 1.4em; }

        /* Body paragraphs. */
        .vdt-prose p {
          color: #2a2823;
        }

        /* Drop cap on the very first paragraph. */
        .vdt-prose > p:first-of-type::first-letter {
          font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-size: 5.8em;
          float: left;
          line-height: 0.82;
          padding: 0.04em 0.1em 0 0;
          margin: 0.05em 0.04em 0 -0.04em;
          color: #b85a3e;
        }

        /* Section heading (h2) — large serif, with a small mono roman
           numeral kicker and a sectional ornament above. */
        .vdt-prose h2 {
          margin-top: 3em;
          margin-bottom: 0.5em;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: clamp(1.7rem, 3.2vw, 2.2rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          scroll-margin-top: 120px;
          position: relative;
        }
        .vdt-prose h2::before {
          content: attr(data-num);
          display: block;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.32em;
          color: #b85a3e;
          margin-bottom: 14px;
          font-style: normal;
          font-weight: 700;
        }

        /* Section break fleuron — sits before every h2 except the first. */
        .vdt-prose h2:not(:first-child)::after {
          /* Use ::after on the h2 placed visually before via negative margin.
             Better: render as a separate ornament block in JSX (we do this). */
        }
        .vdt-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 4em auto 3em;
          color: #b85a3e;
          opacity: 0.7;
        }
        .vdt-ornament::before,
        .vdt-ornament::after {
          content: '';
          flex: 0 0 56px;
          height: 1px;
          background: currentColor;
        }
        .vdt-ornament__mark {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.4rem;
          line-height: 1;
          letter-spacing: 0.1em;
        }

        /* Subsection (h3). */
        .vdt-prose h3 {
          margin-top: 2em;
          margin-bottom: 0.4em;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(1.25rem, 1.8vw, 1.5rem);
          line-height: 1.3;
          color: #1a1a1a;
          scroll-margin-top: 120px;
        }

        /* Bulleted list — em-dash bullets, hanging indent, serif italics. */
        .vdt-prose ul {
          list-style: none;
          margin: 1.6em 0;
          padding: 0;
        }
        .vdt-prose ul li {
          position: relative;
          padding-left: 36px;
          margin-bottom: 0.7em;
          color: #2a2823;
          font-size: 1em;
          line-height: 1.7;
        }
        .vdt-prose ul li::before {
          content: '—';
          position: absolute;
          left: 0;
          top: -0.05em;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.35em;
          color: #b85a3e;
          line-height: 1;
        }

        /* Inline links — slow underline that grows from left. */
        .vdt-prose a {
          color: #1a1a1a;
          text-decoration: none;
          background-image: linear-gradient(#b85a3e, #b85a3e);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
          transition: color 0.25s ease;
        }
        .vdt-prose a:hover { color: #b85a3e; }

        /* Inline strong — slightly heavier, ink color. */
        .vdt-prose strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ============================================================
         *  Coda — signature, CTA, back link.
         * ============================================================ */
        .vdt-coda__sig {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: #6f6a60;
          letter-spacing: 0.02em;
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid rgba(26, 26, 26, 0.12);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .vdt-coda__sig .stamp {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-style: normal;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6f6a60;
        }

        .vdt-coda__cta {
          margin-top: 56px;
          background: #fbf6ec;
          border: 1px solid rgba(26, 26, 26, 0.10);
          border-radius: 18px;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
        }
        @media (min-width: 720px) {
          .vdt-coda__cta {
            padding: 56px 56px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .vdt-coda__cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 2.6vw, 1.95rem);
          line-height: 1.15;
          color: #1a1a1a;
          font-weight: 500;
          margin: 0;
          max-width: 28ch;
        }
        .vdt-coda__cta-btn {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #f4efe6;
          background: #1a1a1a;
          padding: 16px 28px;
          border-radius: 999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1),
                      background 0.3s ease;
        }
        .vdt-coda__cta-btn:hover {
          background: #b85a3e;
          transform: translateY(-2px);
        }
        .vdt-coda__cta-btn .arrow {
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .vdt-coda__cta-btn:hover .arrow {
          transform: translateX(4px);
        }

        .vdt-coda__back {
          margin-top: 56px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #6f6a60;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s ease, gap 0.2s ease;
        }
        .vdt-coda__back:hover { color: #b85a3e; gap: 14px; }
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "var(--canvas)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Same #site-chrome markup as the homepage, but always-visible
            (no scroll-driven fade-in). Portfolio + Contact Us point back
            to the homepage's section anchors. */}
        <header
          id="site-chrome"
          className="site-chrome is-visible is-stuck"
          style={{ opacity: 1, pointerEvents: "auto" }}
        >
          {/* Plain <a> on cross-route links so navigation back to the
              homepage triggers a full reload — required because next/script
              dedupes by src and the lab modules (initVdtHero, etc.) won't
              re-execute on soft navigation, and the importmap can only be
              parsed before any module loads. */}
          <a className="dest-brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="dest-mark" src="/vdt-glass-logo.png" alt="VDT Sites" />
            <span>VDT&nbsp;SITES</span>
          </a>
          <nav className="dest-nav">
            <a href="/">Home</a>
            <Link href="/blog">Blog</Link>
            <a href="/#portfolio">Portfolio</a>
            <a href="/contact" className="dest-cta">
              Contact&nbsp;Us
            </a>
          </nav>
        </header>

        {/* Pad past the fixed header (~96px total). */}
        <div className="flex-1" style={{ paddingTop: "96px" }}>
          {children}
        </div>

        <footer
          className="mt-24"
          style={{ borderTop: "1px solid var(--rule)" }}
        >
          <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div
              className="flex items-center gap-5"
              style={{
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span>&copy; {new Date().getFullYear()} VDT Sites</span>
              <a href="/" className="hover:underline">
                Home
              </a>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </div>
            <a
              href="https://vdtsites.com"
              target="_blank"
              rel="noreferrer"
              className="font-mono uppercase tracking-[0.18em] text-[10px] transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)", opacity: 0.7 }}
            >
              Site by VDTSITES.COM
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
