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

      {/* Blog-only hover styles (inline styles in the page can't do :hover). */}
      <style>{`
        .vdt-blog-card {
          will-change: transform, background;
        }
        .vdt-blog-card:hover {
          background: #fbf7ee;
          transform: translateY(-2px);
        }
        .vdt-blog-card--featured:hover {
          box-shadow: 0 22px 50px -28px rgba(26, 26, 26, 0.22);
        }
        .vdt-blog-card:hover .vdt-blog-arrow {
          transform: translateX(4px);
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .vdt-blog-arrow {
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
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
          <Link className="dest-brand" href="/">
            <svg
              className="dest-mark"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path
                d="M6,18 L84,18 L45,91 Z
                   M16,24 L84,24 L80,30 L19,30 Z
                   M48,30 L48,90 L45,94 L42,89 L42,30 Z
                   M54,36 L68,36 L60,50 L60,65 L54,76 Z
                   M36,63 L36,36 L14,36 L17,42 L25,42 Z"
              />
            </svg>
            <span>VDT&nbsp;SITES</span>
          </Link>
          <nav className="dest-nav">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#portfolio">Portfolio</Link>
            <Link href="/#contact" className="dest-cta">
              Contact&nbsp;Us
            </Link>
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
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <Link href="/#contact" className="hover:underline">
                Contact
              </Link>
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
