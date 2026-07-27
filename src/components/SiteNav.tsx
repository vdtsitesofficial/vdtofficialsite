"use client";

import Link from "next/link";
import { useThemeOptional } from "@/components/ThemeProvider";
import { accentForDark } from "@/lib/utils";

type NavVariant = "overlay" | "solid";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Site header.
 *
 * - "overlay"  — transparent, white text, absolutely positioned over
 *   the dark hero carousel (used on the home page).
 * - "solid"    — opaque white bar with dark text + bottom hairline,
 *   used on content pages like the blog where there's no dark hero.
 *
 * Layout is a 3-column grid so the nav links sit dead-centre
 * regardless of how wide the brand mark is.
 */
export default function SiteNav({
  variant = "overlay",
  activeHref,
}: {
  variant?: NavVariant;
  activeHref?: string;
}) {
  const solid = variant === "solid";
  const ink = solid ? "#15110B" : "#FFFFFF";
  const muted = solid ? "rgba(21,17,11,0.62)" : "rgba(255,255,255,0.85)";

  // Active-link underline tints to the live theme on the home page.
  // On un-themed pages (the blog) there's no provider, so it falls
  // back to amber. accentForDark keeps a near-black accent visible.
  const theme = useThemeOptional();
  const underline = theme ? accentForDark(theme.active.accent) : "#FBBF24";

  return (
    <nav
      className={
        solid
          ? "sticky top-0 z-40 w-full"
          : "absolute top-0 left-0 right-0 z-30"
      }
      style={
        solid
          ? {
              background: "#FFFFFF",
              borderBottom: "1px solid rgba(21,17,11,0.10)",
            }
          : undefined
      }
    >
      <div className="grid grid-cols-3 items-center px-6 sm:px-10 py-5">
        {/* Left — brand. Inline SVG VDT mark uses currentColor so the
            outline picks up the nav's text colour automatically (white
            on the dark overlay, near-black on the solid blog nav). */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[11px] tracking-[0.32em] uppercase"
            style={{ color: ink }}
            aria-label="VDT Sites — home"
          >
            <svg
              viewBox="0 0 100 100"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeLinecap="round"
              aria-hidden
              className="shrink-0"
            >
              <polygon points="8,18 92,18 50,90" strokeWidth="3.6" />
              <polygon
                points="22,30 78,30 50,76"
                strokeWidth="2.1"
                opacity="0.55"
              />
              <path d="M50 18 L50 76" strokeWidth="2.1" opacity="0.65" />
            </svg>
            VDT Sites
          </Link>
        </div>

        {/* Centre — nav links */}
        <ul className="flex justify-center items-center gap-7 sm:gap-10 text-[11px] tracking-[0.28em] uppercase">
          {LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className="transition-opacity hover:opacity-100"
                  style={{ color: isActive ? ink : muted, opacity: isActive ? 1 : 0.95 }}
                >
                  {link.label}
                </Link>
                {isActive && (
                  <span
                    className="absolute left-0 right-0 -bottom-1.5 h-px"
                    style={{
                      background: underline,
                      transition: "background-color 600ms ease",
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right — spacer keeps the centre column truly centred */}
        <div aria-hidden />
      </div>
    </nav>
  );
}
