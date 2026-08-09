// Matches the homepage chrome exactly: below the collapse breakpoint the row
// trims to Contact Us + the burger and every link moves into <MobileDrawer>.
// The links still render at every width — `vdt-ph__drop` only hides them from
// the row, and the drawer carries its own copy. See public/lab/style.css.
const LINKS = [
  { label: "Work", href: "/work", drop: "vdt-ph__drop" },
  { label: "Services", href: "/services", drop: "vdt-ph__drop" },
  { label: "Reviews", href: "/reviews", drop: "vdt-ph__drop" },
  { label: "About", href: "/about", drop: "vdt-ph__drop" },
  { label: "Blog", href: "/blog", drop: "vdt-ph__drop" },
];

/**
 * The one site header, for the cream Tailwind pages (/about, /work,
 * /services, /reviews, /web-design-nanaimo and the case studies).
 *
 * Those pages used to render brand mark + a red "Get a quote" pill and no
 * links at all, so arriving on one from the homepage was a dead end. This
 * is a faithful copy of the homepage/blog `#site-chrome` header — same
 * geometry, type, colours and responsive drop order — so the chrome is
 * identical on every route at every width.
 *
 * It's a scoped stylesheet rather than the real .site-chrome classes
 * because those live in /lab/style.css, and loading the whole lab
 * stylesheet on these pages would restyle the pages themselves. The
 * values below are copied from it; if that header changes, change both.
 *
 * Sticky rather than the lab's `fixed` so it stays in flow — these pages
 * have no hero to sit over, and fixed would need a spacer on each one.
 *
 * Plain <a>: the homepage boots the laptop-zoom lab modules, and
 * next/script dedupes by src, so a soft navigation back to / would leave
 * them un-executed.
 */
export default function PageHeader({
  activeHref,
  noSnippet = false,
}: {
  /** Href of the page being rendered — marks its own link in the row. */
  activeHref?: string;
  /** Wrap in data-nosnippet (pages where chrome text pollutes snippets). */
  noSnippet?: boolean;
}) {
  const inner = (
    <>
      <a className="vdt-ph__brand" href="/" aria-label="VDT Sites, home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="vdt-ph__mark" src="/vdt-glass-logo.png" alt="" />
        <span>VDT&nbsp;SITES</span>
      </a>
      <nav className="vdt-ph__nav" aria-label="Main">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={link.drop}
            aria-current={activeHref === link.href ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
        <a href="/contact" className="vdt-ph__cta">
          Contact&nbsp;Us
        </a>
        {/* Styled by MobileDrawer's scoped sheet, which layout.tsx renders on
            every route — these pages don't load /lab/style.css. */}
        <button
          className="vdt-burger"
          type="button"
          data-vdt-burger
          aria-label="Menu"
          aria-expanded="false"
          aria-controls="vdt-drawer"
        >
          <span /><span /><span />
        </button>
      </nav>
    </>
  );

  return (
    <>
      <style>{`
        /* Values copied from .site-chrome / .dest-* in /lab/style.css. */
        .vdt-ph {
          position: sticky;
          top: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 56px;
          background: #f4efe6;
          border-bottom: 1px solid transparent;
        }
        .vdt-ph__brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #1a1a1a;
          text-decoration: none;
          /* Stops the wordmark colliding with the nav when room runs out. */
          flex: 0 0 auto;
          white-space: nowrap;
        }
        .vdt-ph__mark { width: 34px; height: 34px; }
        .vdt-ph__brand span {
          font-family: 'Syne', 'Inter', sans-serif;
          font-weight: 800;
          letter-spacing: 0.08em;
          font-size: 13px;
        }
        .vdt-ph__nav { display: flex; align-items: center; gap: 32px; }
        .vdt-ph__nav a {
          color: #1a1a1a;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          opacity: 0.78;
          white-space: nowrap;
          transition: opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .vdt-ph__nav a:hover { opacity: 1; }
        .vdt-ph__nav a[aria-current="page"] { opacity: 1; font-weight: 600; }
        .vdt-ph__cta {
          padding: 10px 18px;
          border-radius: 999px;
          background: #1a1a1a;
          color: #f4efe6 !important;
          opacity: 1 !important;
          font-weight: 600 !important;
        }

        /* Keep this query identical to COLLAPSE in MobileDrawer.tsx and the
           trim block in public/lab/style.css. The touch half catches iOS
           "Request Desktop Website", which reports a viewport wider than
           960px and would otherwise hand a phone the full row. */
        @media (max-width: 960px), (hover: none) and (pointer: coarse) {
          .vdt-ph__drop { display: none; }
        }
        @media (max-width: 720px) {
          .vdt-ph { padding: 14px 16px; }
          .vdt-ph__mark { width: 28px; height: 28px; }
          .vdt-ph__brand span { font-size: 12px; letter-spacing: 0.04em; }
          /* Was 10px when this row had to seat five items. */
          .vdt-ph__nav { gap: 18px; }
          .vdt-ph__nav a { font-size: 11px; letter-spacing: 0.04em; }
          .vdt-ph__cta {
            padding: 8px 12px;
            font-size: 10px !important;
            letter-spacing: 0.08em !important;
          }
        }
        @media (max-width: 380px) {
          .vdt-ph__nav { gap: 14px; }
          .vdt-ph__nav a { font-size: 10px; }
        }
        @media (max-width: 339px) {
          .vdt-ph__brand span { display: none; }
        }
      `}</style>
      <header className="vdt-ph">
        {noSnippet ? (
          <div data-nosnippet style={{ display: "contents" }}>
            {inner}
          </div>
        ) : (
          inner
        )}
      </header>
    </>
  );
}
