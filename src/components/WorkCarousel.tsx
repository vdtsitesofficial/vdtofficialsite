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
 * Cards are sized so a slice of the next one always peeks in — that's the
 * affordance telling people there's more to see. Without it a snap carousel
 * reads as a static image on mobile.
 */

export type WorkItem = { img: string; name: string; line: string };

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <h2
          className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d0d0d]/45"
          style={{ fontFamily: "'Syne','Inter',sans-serif" }}
        >
          Recent work
        </h2>
        <div className="flex gap-2">
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

      {/* The track is full-bleed so cards run off the right edge — that's the
          cue that there's more. But its LEFT edge must line up with the
          heading above, which sits in a max-w-6xl (72rem) centred container.
          Hence the calc: match the container inset on wide screens, fall back
          to the plain 1.5rem gutter on narrow ones. scroll-padding keeps snap
          positions aligned to the same line. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        style={{
          paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
          scrollPaddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
        }}
        className="vdt-work-track mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 pr-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dc2626]"
      >
        {items.map((w, i) => (
          <li
            key={w.name}
            className="w-[min(82vw,360px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
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
            <div className="px-5 py-4">
              <p className="text-[15px] font-semibold" style={{ fontFamily: "'Syne','Inter',sans-serif" }}>
                {w.name}
              </p>
              <p className="mt-0.5 text-[13px] text-[#0d0d0d]/55">{w.line}</p>
            </div>
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
