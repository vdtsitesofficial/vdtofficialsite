import Link from "next/link";
import { LAB_V } from "@/lib/labVersion";

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
        href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      {/* Same ?v= cache-bust the homepage uses. Without it the blog kept
          serving whatever copy of style.css a browser or the CF edge had
          already cached, so lab CSS fixes never reached repeat visitors. */}
      <link rel="stylesheet" href={`/lab/style.css?v=${LAB_V}`} />

      {/* Blog styles — hover states, drop caps, marginalia grid, and the
          editorial typographic system. Inline styles in pages can't do
          :hover, ::first-letter, :first-of-type, or @media, so anything
          requiring those lives here.

          Type is the site's own pairing — Syne for display, Inter for body
          and the small tracked labels. It used to run a separate editorial
          system (Cormorant Garamond headings, JetBrains Mono labels, italic
          throughout), which read as a different website; Cormorant is no
          longer fetched and the mono was never loaded here at all, so those
          labels were falling back to system mono.

          Syne ships 600/700/800 only and has no italic, so nothing here asks
          for weight 400/500 or italic — the browser would synthesise both.
          It also sets much heavier than Cormorant at the same size, which is
          why the display sizes are smaller than the serif ones were.

          Structure is unchanged: generous leading, warm cream, sparing
          accent, drop cap on the first paragraph, roman-numeral kickers on
          section headings, em-dash bullets, section-break fleurons. */}
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
          background: #dc2626;
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
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
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
        .vdt-article__crumbs a:hover { color: #dc2626; }
        .vdt-article__crumbs .sep { opacity: 0.35; }
        .vdt-article__crumbs .here {
          color: #1a1a1a;
          font-weight: 600;
        }

        /* The eyebrow category above the title. */
        .vdt-article__kicker {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #dc2626;
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
          background: #dc2626;
        }

        /* The title — the site's display face, same as every other h1. */
        .vdt-article__title {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.9rem, 4.4vw, 3rem);
          line-height: 1.02;
          letter-spacing: -0.015em;
          color: #1a1a1a;
          margin: 0 0 28px;
          max-width: 18ch;
        }

        /* Deck under the title (uses post.description). Body face, not the
           display one — it's a sentence to read, and the site sets its hero
           paragraphs in Inter too. */
        .vdt-article__lede {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 400;
          font-size: clamp(1.15rem, 1.7vw, 1.35rem);
          line-height: 1.55;
          color: #4d4a44;
          max-width: 46ch;
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
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1rem;
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
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6f6a60;
          margin-top: 2px;
          display: block;
        }

        /* ── TOC marginalia ────────────────────────────────────── */
        .vdt-toc__label {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 600;
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
          font-family: 'Syne', 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
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
        /* Italic used to mark the active entry; Syne has no italic, so it
           steps up a weight instead. */
        .vdt-toc__item.is-active a {
          color: #1a1a1a;
          border-left-color: #dc2626;
          font-weight: 800;
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
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 3.1em;
          float: left;
          line-height: 0.82;
          padding: 0.04em 0.1em 0 0;
          margin: 0.05em 0.04em 0 -0.04em;
          color: #dc2626;
        }

        /* Section heading (h2) — display face, with a small tracked roman
           numeral kicker and a sectional ornament above. */
        .vdt-prose h2 {
          margin-top: 3em;
          margin-bottom: 0.5em;
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.35rem, 2.5vw, 1.7rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          scroll-margin-top: 120px;
          position: relative;
        }
        .vdt-prose h2::before {
          content: attr(data-num);
          display: block;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.32em;
          color: #dc2626;
          margin-bottom: 14px;
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
          color: #dc2626;
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
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1;
          letter-spacing: 0.1em;
        }

        /* Subsection (h3). */
        .vdt-prose h3 {
          margin-top: 2em;
          margin-bottom: 0.4em;
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.05rem, 1.4vw, 1.2rem);
          line-height: 1.3;
          color: #1a1a1a;
          scroll-margin-top: 120px;
        }

        /* Bulleted list — em-dash bullets, hanging indent. */
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
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1.2em;
          color: #dc2626;
          line-height: 1;
        }

        /* Inline links — slow underline that grows from left. */
        .vdt-prose a {
          color: #1a1a1a;
          text-decoration: none;
          background-image: linear-gradient(#dc2626, #dc2626);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
          transition: color 0.25s ease;
        }
        .vdt-prose a:hover { color: #dc2626; }

        /* Inline strong — slightly heavier, ink color. */
        .vdt-prose strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ============================================================
         *  FAQ block — sits at the end of the post, above the coda.
         *  Mirrors the FAQPage schema exactly; both halves ship together.
         * ============================================================ */
        .vdt-faq {
          margin-top: 72px;
          padding-top: 40px;
          border-top: 1px solid rgba(26, 26, 26, 0.12);
        }
        .vdt-faq__heading {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.35rem, 2.5vw, 1.7rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          margin: 0 0 28px;
        }
        .vdt-faq__list { margin: 0; padding: 0; }
        .vdt-faq__item { margin-bottom: 28px; }
        .vdt-faq__item:last-child { margin-bottom: 0; }
        .vdt-faq__q {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1.35;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .vdt-faq__a {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 17px;
          line-height: 1.7;
          color: #2a2823;
          margin: 0;
        }

        /* Inline links inside body copy and FAQ answers. Underlined rather
           than colour-only, so they are distinguishable without relying on
           hue. */
        .vdt-prose__link {
          color: #b3341f;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
          text-decoration-color: rgba(179, 52, 31, 0.4);
          transition: text-decoration-color 0.15s ease;
        }
        .vdt-prose__link:hover { text-decoration-color: #b3341f; }

        /* ============================================================
         *  Author bio. Visible half of the Person schema.
         * ============================================================ */
        .vdt-author {
          margin-top: 64px;
          padding-top: 36px;
          border-top: 1px solid rgba(26, 26, 26, 0.12);
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .vdt-author__avatar {
          flex: 0 0 auto;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #1a1a1a;
          color: #f4efe6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.02em;
        }
        .vdt-author__name {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #1a1a1a;
          margin: 0;
        }
        .vdt-author__role {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6f6a60;
          margin: 4px 0 0;
        }
        .vdt-author__bio {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15.5px;
          line-height: 1.65;
          color: #2a2823;
          margin: 12px 0 0;
        }
        .vdt-author__link {
          display: inline-block;
          margin-top: 10px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #dc2626;
          text-decoration: none;
          border-bottom: 1px solid rgba(220, 38, 38, 0.3);
        }
        .vdt-author__link:hover { border-bottom-color: #dc2626; }
        @media (max-width: 520px) {
          .vdt-author { gap: 14px; }
          .vdt-author__avatar { width: 44px; height: 44px; font-size: 15px; }
        }

        /* ============================================================
         *  Keep reading — related posts.
         *  Same rule-above-heading rhythm as the FAQ block so the coda
         *  reads as one stack. Cards are the index page's CARD_BG.
         * ============================================================ */
        .vdt-related {
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(26, 26, 26, 0.12);
        }
        .vdt-related__heading {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(1.35rem, 2.5vw, 1.7rem);
          line-height: 1.12;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          margin: 0 0 28px;
        }
        .vdt-related__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        .vdt-related__link {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 10px;
          padding: 26px 24px;
          background: #fbf7ee;
          border: 1px solid rgba(26, 26, 26, 0.10);
          border-radius: 16px;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .vdt-related__link:hover {
          border-color: rgba(26, 26, 26, 0.28);
          transform: translateY(-2px);
        }
        .vdt-related__kicker {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #dc2626;
        }
        .vdt-related__title {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1.3;
          color: #1a1a1a;
        }
        .vdt-related__excerpt {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #6f6a60;
        }
        .vdt-related__more {
          margin-top: auto;
          padding-top: 6px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1a1a;
        }
        @media (max-width: 720px) {
          .vdt-related__list { grid-template-columns: minmax(0, 1fr); }
        }

        /* ============================================================
         *  Coda — signature, CTA, back link.
         * ============================================================ */
        .vdt-coda__sig {
          font-family: 'Syne', 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
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
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
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
          font-family: 'Syne', 'Inter', sans-serif;
          font-size: clamp(1.2rem, 1.9vw, 1.5rem);
          line-height: 1.15;
          color: #1a1a1a;
          font-weight: 700;
          margin: 0;
          max-width: 28ch;
        }
        .vdt-coda__cta-btn {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
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
          background: #dc2626;
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
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #6f6a60;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s ease, gap 0.2s ease;
        }
        .vdt-coda__back:hover { color: #dc2626; gap: 14px; }
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
            {/* No "Home" link: the brand mark to the left already goes home,
                and the row needs that width for Services. */}
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/reviews" data-nav="reviews">Reviews</Link>
            <Link href="/about" data-nav="about">About</Link>
            <Link href="/blog" data-nav="blog">Blog</Link>
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
              /* Wraps: the row gained a Work link and ran past the
                 viewport on ≤340px phones. */
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
              style={{
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span>&copy; {new Date().getFullYear()} VDT Sites</span>
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/work" className="hover:underline">
                Work
              </a>
              <a href="/services" className="hover:underline">
                Services
              </a>
              <a href="/about" className="hover:underline">
                About
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
