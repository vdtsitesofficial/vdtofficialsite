import type { ReactNode } from "react";

const SYNE = "'Syne', 'Inter', sans-serif";

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

/**
 * Shared header for the cream Tailwind pages (/about, /work, /services,
 * /reviews, /web-design-nanaimo and the case studies).
 *
 * Those pages used to render brand mark + "Get a quote" and nothing else,
 * so landing on one from the homepage was a dead end — every other page
 * became unreachable without the back button. This keeps the chrome they
 * already had and adds the homepage's nav row to it.
 *
 * Layout: brand | links | CTA on tablet and up. On phones the links wrap
 * onto their own second row (order-3 + w-full) instead of competing with
 * the CTA for the first row — squeezing all three into 375px wrapped the
 * "Get a quote" pill onto two lines. The second row also means phones keep
 * all four links rather than dropping Services and About.
 *
 * Plain <a> rather than next/link: the homepage boots the laptop-zoom lab
 * modules, and next/script dedupes by src, so a soft navigation back to /
 * would leave them un-executed.
 */
export default function PageHeader({
  activeHref,
  cta,
  noSnippet = false,
}: {
  /** Href of the page being rendered — marks its own link in the row. */
  activeHref?: string;
  /** Right-hand call to action. Defaults to the red "Get a quote" pill. */
  cta?: ReactNode;
  /** Wrap in data-nosnippet (pages where chrome text pollutes snippets). */
  noSnippet?: boolean;
}) {
  const inner = (
    <>
      <a href="/" className="order-1 inline-flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vdt-glass-logo.png"
          alt="VDT Sites"
          className="h-8 w-8 md:h-[34px] md:w-[34px]"
        />
        <span
          className="text-[12px] font-extrabold tracking-[0.10em] md:text-[13px]"
          style={{ fontFamily: SYNE }}
        >
          VDT&nbsp;SITES
        </span>
      </a>

      {/* No "Home" link: the brand mark to the left already goes home. */}
      <nav
        aria-label="Main"
        className="order-3 flex w-full items-center gap-6 text-[13px] font-medium md:order-2 md:w-auto md:gap-8 md:text-[14px]"
      >
        {LINKS.map((link) => {
          const isActive = activeHref === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap transition-opacity hover:opacity-100 ${
                isActive ? "font-semibold text-[#dc2626]" : "opacity-75"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <div className="order-2 shrink-0 md:order-3">
        {cta ?? (
          <a
            href="/contact"
            className="whitespace-nowrap rounded-full bg-[#dc2626] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#b91c1c] md:px-6 md:py-2.5 md:text-[14px]"
          >
            Get a quote
          </a>
        )}
      </div>
    </>
  );

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 md:px-14 md:py-6">
      {noSnippet ? (
        <div data-nosnippet className="contents">
          {inner}
        </div>
      ) : (
        inner
      )}
    </header>
  );
}
