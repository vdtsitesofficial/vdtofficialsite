"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one mobile drawer for the whole site.
 *
 * Rendered once from layout.tsx, so every route gets it: the homepage's two
 * headers (#zoom-header / #site-chrome in page.tsx) and the cream pages'
 * <PageHeader>. Those three headers each render a `[data-vdt-burger]` button;
 * this component finds them all and wires them to one drawer, which is why the
 * burger markup can stay a plain <button> in three different places.
 *
 * Everything it needs — drawer styles AND burger styles — is in the scoped
 * <style> below rather than /lab/style.css. The cream Tailwind pages
 * deliberately don't load the lab stylesheet (see PageHeader's note: it would
 * restyle the pages themselves), so anything living there would leave those
 * routes with an unstyled burger.
 *
 * The collapse query is width OR touch-primary. The width half is the real
 * breakpoint; the touch half exists because iOS Safari's "Request Desktop
 * Website" reports a viewport far wider than 960px, which would otherwise hand
 * a phone the desktop row with no burger to open. Keep it in sync with the
 * `.zh-nav` / `.dest-nav` trim rules in public/lab/style.css and the
 * `.vdt-ph__*` rules in PageHeader.tsx.
 */

const COLLAPSE = "(max-width: 960px), (hover: none) and (pointer: coarse)";

/** All six destinations. The row keeps Work + Contact; the rest live here. */
const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Wire every burger in the document, wherever its header rendered it. */
  useEffect(() => {
    const burgers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-vdt-burger]")
    );
    const toggle = () => setOpen((o) => !o);
    burgers.forEach((b) => b.addEventListener("click", toggle));
    return () => burgers.forEach((b) => b.removeEventListener("click", toggle));
  }, []);

  /* `opacity: 0 / visibility: hidden` does not remove a closed drawer from the
     tab order — only `inert` does. Mirrored onto aria-hidden for older AT. */
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    if (open) {
      el.removeAttribute("inert");
      el.removeAttribute("aria-hidden");
    } else {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }

    document.body.classList.toggle("vdt-menu-open", open);
    document
      .querySelectorAll("[data-vdt-burger]")
      .forEach((b) => b.setAttribute("aria-expanded", open ? "true" : "false"));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    /* Widening past the breakpoint hides the burger, so a drawer left open
       would trap the page behind an invisible overlay. Uses the same query as
       the CSS rather than a raw innerWidth check, or the two disagree on a
       touch device reporting a desktop-width viewport. */
    const mq = window.matchMedia(COLLAPSE);
    const onChange = () => {
      if (!mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      <style>{`
        /* --- burger ------------------------------------------------------ */
        /* currentColor, so the same button reads white on the dark
           #zoom-header and ink on the cream #site-chrome / .vdt-ph. */
        .vdt-burger {
          display: none;
          width: 44px;
          height: 44px;
          margin-right: -10px;
          padding: 0;
          border: 0;
          background: none;
          color: inherit;
          cursor: pointer;
          position: relative;
          flex: 0 0 auto;
          place-items: center;
        }
        .vdt-burger span {
          position: absolute;
          left: 11px;
          width: 22px;
          height: 1.5px;
          background: currentColor;
          transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1),
                      opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .vdt-burger span:nth-child(1) { top: 16px; }
        .vdt-burger span:nth-child(2) { top: 21.5px; }
        .vdt-burger span:nth-child(3) { top: 27px; }
        body.vdt-menu-open .vdt-burger span:nth-child(1) {
          transform: translateY(5.5px) rotate(45deg);
        }
        body.vdt-menu-open .vdt-burger span:nth-child(2) { opacity: 0; }
        body.vdt-menu-open .vdt-burger span:nth-child(3) {
          transform: translateY(-5.5px) rotate(-45deg);
        }

        /* --- drawer ------------------------------------------------------ */
        .vdt-drawer {
          position: fixed;
          inset: 0;
          /* Above .site-chrome (60) and .vdt-ph (60). */
          z-index: 70;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          background: #f4efe6;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.28s cubic-bezier(0.22, 0.61, 0.36, 1),
                      visibility 0.28s;
        }
        body.vdt-menu-open .vdt-drawer { opacity: 1; visibility: visible; }
        body.vdt-menu-open { overflow: hidden; }

        .vdt-drawer a {
          color: #1a1a1a;
          text-decoration: none;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 12px;
        }
        .vdt-drawer a[aria-current="page"] { font-weight: 700; }
        .vdt-drawer .vdt-drawer__cta {
          margin-top: 6px;
          padding: 14px 30px;
          border-radius: 999px;
          background: #1a1a1a;
          color: #f4efe6;
          font-weight: 600;
          letter-spacing: 0.1em;
          font-size: 13px;
        }

        .vdt-burger:focus-visible,
        .vdt-drawer a:focus-visible {
          outline: 2px solid #dc2626;
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .vdt-burger span, .vdt-drawer { transition: none; }
        }

        @media ${COLLAPSE} {
          .vdt-burger { display: grid; }
        }
      `}</style>

      <div
        ref={drawerRef}
        id="vdt-drawer"
        className="vdt-drawer"
        aria-label="Menu"
        role="navigation"
        inert={!open}
        aria-hidden={!open ? "true" : undefined}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href="/contact" className="vdt-drawer__cta">
          Contact&nbsp;Us
        </a>
      </div>
    </>
  );
}
