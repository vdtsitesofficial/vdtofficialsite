"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal client-work carousel for the ads landing page.
 *
 * Built on native CSS scroll-snap rather than a carousel library: touch
 * swipe and momentum come free from the browser, it costs no extra JS on a
 * page whose whole job is loading fast, and it degrades to a plain scroller
 * if scripting fails. The buttons are progressive enhancement on top.
 *
 * The whole block is centred to match the rest of the page (hero, reasons
 * and areas-served are all centred). The track is constrained to the same
 * max-w-6xl column rather than bleeding to the viewport edge, so it reads as
 * one centred section instead of a left-aligned outlier.
 *
 * NOTE on `justify-content: center` — do NOT add it to the track. On an
 * overflowing flex container it makes the left-hand overflow unreachable in
 * several browsers (you can't scroll back past the start). Centring is done
 * by centring the CONTAINER, not the flex items.
 *
 * Cards are sized so a slice of the next one peeks in — that's the
 * affordance telling people there's more. Without it a snap carousel reads
 * as a static image on mobile.
 */

export type WorkItem = { img: string; name: string; line: string; href: string };

export default function WorkCarousel({ items }: { items: WorkItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * dir, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "hidden md:grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white/85 text-[#0d0d0d] transition disabled:opacity-30 disabled:cursor-default hover:border-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]";

  return (
    <div role="region" aria-label="Recent client websites" aria-roledescription="carousel">
      {/* centred heading, with the arrows tucked under it */}
      <div className="px-6 text-center">
        <h2
          className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d0d0d]/45"
          style={{ fontFamily: "'Syne','Inter',sans-serif" }}
        >
          Recent work
        </h2>
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" className={btn} onClick={() => nudge(-1)} disabled={atStart} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className={btn} onClick={() => nudge(1)} disabled={atEnd} aria-label="Next">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* scroll-padding MUST match the px-6 gutter. Without it the browser
          treats the snap port as starting at the border edge, scrolls past
          the 24px padding to align the first card, and parks scrollLeft at
          24 — collapsing the left gutter and making the track look shunted. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        style={{ scrollPaddingLeft: "1.5rem", scrollPaddingRight: "1.5rem" }}
        className="vdt-work-track mx-auto mt-6 flex max-w-6xl snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dc2626]"
      >
        {items.map((w, i) => (
          <li key={w.name} className="w-[min(82vw,360px)] shrink-0 snap-start">
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit the ${w.name} website (opens in a new tab)`}
              className="group block h-full overflow-hidden rounded-2xl bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(0,0,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.img}
                alt={`${w.name} website designed by VDT Sites`}
                width={900}
                height={675}
                /* first two are likely in view on load — don't defer those */
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="block w-full"
              />
              <div className="flex items-end justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-[15px] font-semibold" style={{ fontFamily: "'Syne','Inter',sans-serif" }}>
                    {w.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#0d0d0d]/55">{w.line}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[#dc2626] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100">
                  Visit
                  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                    <path
                      d="M7 17 17 7M9 7h8v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Scrollbar hidden for looks; the peeking next card is what signals
          that the track scrolls, so the affordance isn't lost with it. */}
      <style>{`
        .vdt-work-track { scrollbar-width: none; -ms-overflow-style: none; }
        .vdt-work-track::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .vdt-work-track { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
}
