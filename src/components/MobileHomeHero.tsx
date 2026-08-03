"use client";

/* -----------------------------------------------------------------------
 * Mobile homepage hero (≤720px) — replaces the laptop-zoom intro on
 * phones (2026-08-03). Started life as a standalone /v2 concept route,
 * which was deleted once this shipped; see git history for it.
 *
 * Cream editorial hero: Anton headline, Space Mono labels, one red
 * accent. A single red connector line draws itself on load, threading
 * from the dot above the eyebrow, around the headline, down behind the
 * service cards and on to the scroll cue — which anchors to #portfolio,
 * so the story hands off into "Some of our projects."
 *
 * Sized to land the whole story in one phone screen, so it carries no
 * header of its own (the site's #site-chrome sits above it) and no stat
 * card — a 100% client-satisfaction ring lived after the cards until
 * 2026-08-03, removed to buy back the vertical space.
 *
 * The line's waypoints are measured from the live DOM (after fonts
 * load, re-measured on resize) so it always hugs the content. Desktop
 * (>720px) hides this section entirely and keeps the laptop zoom.
 * --------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Monitor, PenTool, TrendingUp, Plus } from "lucide-react";

const C = {
  bg: "#F4EFE6",
  card: "#FCFAF4",
  iconWell: "#EFE8DB",
  ink: "#141310",
  body: "#55514a",
  muted: "#7a756c",
  red: "#E0301F",
  redSoft: "rgba(224, 48, 31, 0.22)",
};

const F = {
  headline: "'Anton', 'Arial Narrow', sans-serif",
  mono: "'Space Mono', 'Courier New', monospace",
  body: "'Inter', system-ui, sans-serif",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* Total draw time of the red route; dot/cue reveals key off it. */
const DRAW_DELAY = 0.4;
const DRAW_DURATION = 4.2;
const DRAW_EASE: [number, number, number, number] = [0.45, 0, 0.25, 1];

/* Time fraction at which an eased draw has covered `p` of the path.
 * The route is drawn on an eased curve, so distance covered and time
 * elapsed are not the same number — without inverting the easing, the
 * node circle beside card 3 pops before the line actually arrives. */
function easeTimeForProgress(p: number): number {
  const [x1, y1, x2, y2] = DRAW_EASE;
  const at = (a: number, b: number, t: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (at(y1, y2, mid) < p) lo = mid;
    else hi = mid;
  }
  return at(x1, x2, (lo + hi) / 2);
}

const SERVICES = [
  {
    icon: Monitor,
    title: "WEB DESIGN",
    desc: "Conversion-focused websites built for performance.",
    className: "ml-10 mr-12",
  },
  {
    icon: PenTool,
    title: "BRANDING",
    desc: "Distinct identities that connect and leave a lasting impression.",
    className: "ml-14 mr-8 -mt-3",
  },
  {
    icon: TrendingUp,
    title: "DIGITAL STRATEGY",
    desc: "Smart strategies that turn goals into measurable growth.",
    className: "ml-[72px] mr-6 -mt-3",
  },
];

/* Axis-aligned polyline -> ONE subpath with rounded corners.
 *
 * Must stay a single subpath: the draw-on animation is a pathLength
 * tween, and browsers restart the stroke-dash pattern at every `M`, so
 * a second subpath would draw at the same time as the first instead of
 * after it. `radii` may be a single value or one entry per corner. */
function roundedPath(pts: [number, number][], radii: number | number[]): string {
  if (pts.length < 2) return "";
  const radiusAt = (i: number) =>
    typeof radii === "number" ? radii : (radii[i] ?? 0);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radiusAt(i), inLen / 2, outLen / 2);
    if (inLen === 0 || outLen === 0) continue;
    const inX = cx - ((cx - px) / inLen) * r;
    const inY = cy - ((cy - py) / inLen) * r;
    const outX = cx + ((nx - cx) / outLen) * r;
    const outY = cy + ((ny - cy) / outLen) * r;
    d += ` L ${inX} ${inY} Q ${cx} ${cy} ${outX} ${outY}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L ${lx} ${ly}`;
}

type Route = {
  d: string;
  w: number;
  h: number;
  midDot: { x: number; y: number };
  /* Where the node sits along the route, 0-1, so its reveal fires as the
   * line actually reaches it rather than at a guessed timestamp. */
  midDotAt: number;
};

export default function MobileHomeHero() {
  const reduced = useReducedMotion();
  const [route, setRoute] = useState<Route | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startDotRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const scrollDotRef = useRef<HTMLSpanElement | null>(null);

  const measure = useCallback(() => {
    const c = containerRef.current;
    const els = [
      startDotRef.current,
      ctaRef.current,
      card1Ref.current,
      card3Ref.current,
      scrollDotRef.current,
    ];
    if (!c || els.some((el) => !el)) return;
    const W = c.offsetWidth;
    const H = c.offsetHeight;
    // Hidden at >720px (display:none) — sizes are 0, nothing to draw.
    if (W < 50) return;
    /* Layout-box measurement, deliberately NOT getBoundingClientRect().
     * The cards and CTA animate in from translateY(30px)/(22px), and a
     * client rect includes that transform — measuring mid-animation put
     * card 3's bottom ~30px below where it settles, which dragged the
     * shelf below the scroll cue and made the line double back upward.
     * offsetTop/offsetHeight are transform-independent, so the route is
     * the same whether or not the reveal has played. */
    const box = (el: HTMLElement) => {
      let top = 0;
      let left = 0;
      let node: HTMLElement | null = el;
      while (node && node !== c) {
        top += node.offsetTop;
        left += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
      }
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      return {
        top,
        bottom: top + h,
        left,
        right: left + w,
        cx: left + w / 2,
        cy: top + h / 2,
      };
    };
    const dot = box(startDotRef.current!);
    const cta = box(ctaRef.current!);
    const card1 = box(card1Ref.current!);
    const card3 = box(card3Ref.current!);
    const cue = box(scrollDotRef.current!);

    const xRail = cue.cx; // left rail lines up with the scroll-cue circle
    const xEdge = W - 14;
    // Crossings self-center in whatever gap the layout leaves. Clamped so
    // a tight layout can never put the shelf below the cue it feeds into,
    // which would double the line back on itself.
    const yCross = (cta.bottom + card1.top) / 2;
    const yShelf = Math.min((card3.bottom + cue.top) / 2, cue.top - 16);
    const midDot = { x: Math.min(W - 12, card3.right + 9), y: card3.cy };

    /* ONE continuous top-to-bottom route: out to the right edge (the
     * headline gets the full column width), down, back across under the
     * CTA, down the left rail, out to the node beside card 3, then down
     * and back to the rail, finishing exactly on top of the scroll-cue
     * circle. The corner at the node uses a tight radius so the node
     * circle — painted after the path, filled with the page colour —
     * covers it and reads as the line passing through a station. */
    const pts: [number, number][] = [
      [dot.cx, dot.cy],
      [xEdge, dot.cy],
      [xEdge, yCross],
      [xRail, yCross],
      [xRail, card3.cy],
      [midDot.x, card3.cy],
      [midDot.x, yShelf],
      [xRail, yShelf],
      [xRail, cue.top],
    ];
    const radii = [0, 24, 24, 24, 24, 8, 24, 24, 0];

    // Polyline length up to the node / total. Corner rounding shaves a few
    // px off each turn, far too little to be visible in the timing.
    const NODE_INDEX = 5;
    let toNode = 0;
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      total += seg;
      if (i <= NODE_INDEX) toNode += seg;
    }

    setRoute({
      d: roundedPath(pts, radii),
      w: W,
      h: H,
      midDot,
      midDotAt: total > 0 ? toNode / total : 0.62,
    });
  }, []);

  useEffect(() => {
    measure();
    // Fonts shift every measured rect — re-run once they're in.
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [measure]);

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <section
      aria-label="VDT Sites — design that drives growth"
      className="vdt-mobile-hero relative min-[721px]:hidden"
      style={{ background: C.bg, color: C.ink, fontFamily: F.body }}
    >
      <div ref={containerRef} className="relative mx-auto max-w-[480px]">
        {/* ── The red route ─────────────────────────────────────── */}
        {route && (
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            width="100%"
            height="100%"
            viewBox={`0 0 ${route.w} ${route.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d={route.d}
              fill="none"
              stroke={C.red}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: DRAW_DURATION, delay: DRAW_DELAY, ease: DRAW_EASE }
              }
            />
            {/* Open dot beside the Digital Strategy card */}
            <motion.circle
              cx={route.midDot.x}
              cy={route.midDot.y}
              r={5.5}
              fill={C.bg}
              stroke={C.red}
              strokeWidth={2}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: reduced
                  ? 0
                  : DRAW_DELAY + DRAW_DURATION * easeTimeForProgress(route.midDotAt),
              }}
              style={{ transformOrigin: `${route.midDot.x}px ${route.midDot.y}px` }}
            />
          </svg>
        )}

        {/* ── Hero ──────────────────────────────────────────────────
            No header of its own: the site's real #site-chrome header
            (brand + nav + Contact CTA) is fixed above this and forced
            visible on mobile in page.tsx. pt clears its ~56px height. */}
        <div className="relative z-10 px-6 pt-[68px]">
          {/* Route origin: red dot with halo */}
          <span ref={startDotRef} className="relative block h-7 w-7">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: C.redSoft }}
              {...(reduced
                ? {}
                : {
                    initial: { scale: 0 },
                    animate: { scale: 1 },
                    transition: { duration: 0.5, delay: 0.15, ease },
                  })}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: C.red }}
              {...(reduced
                ? {}
                : {
                    initial: { scale: 0 },
                    animate: { scale: 1 },
                    transition: { duration: 0.4, delay: 0.25, ease },
                  })}
            />
          </span>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-7 text-[12px] font-bold"
            style={{ fontFamily: F.mono, color: C.red, letterSpacing: "0.42em" }}
          >
            DIGITAL STUDIO
          </motion.p>

          {/* Styled display heading — the page's single <h1> stays inside
              the (desktop) zoom hero, so this is an <h2>. */}
          <motion.h2
            {...fadeUp(0.3)}
            className="mt-3 uppercase"
            style={{
              fontFamily: F.headline,
              fontSize: "clamp(2.7rem, 13.2vw, 3.9rem)",
              lineHeight: 1.02,
              letterSpacing: "0.005em",
            }}
          >
            Design That
            <br />
            Drives Growth
            <span
              aria-hidden="true"
              className="inline-block rounded-full"
              style={{
                width: "0.15em",
                height: "0.15em",
                background: C.red,
                marginLeft: "0.06em",
              }}
            />
          </motion.h2>

          <motion.p
            {...fadeUp(0.42)}
            className="mt-4 max-w-[30ch] text-[16px] leading-[1.55]"
            style={{ color: C.body }}
          >
            Websites, branding, and digital experiences crafted to elevate your
            brand and deliver real results.
          </motion.p>

          <motion.div {...fadeUp(0.54)} ref={ctaRef} className="mt-5">
            {/* Full page navigation to /contact, not a scroll to the
                in-page card (Sem, 2026-08-03). */}
            <a href="/contact" className="group inline-flex items-center gap-4">
              <svg
                width="46"
                height="16"
                viewBox="0 0 46 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                <path
                  d="M1 8h42M37 2l7 6-7 6"
                  stroke={C.red}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="border-b-2 pb-1.5 text-[13px] font-bold"
                style={{
                  fontFamily: F.mono,
                  color: C.red,
                  borderColor: C.red,
                  letterSpacing: "0.26em",
                }}
              >
                START YOUR PROJECT
              </span>
            </a>
          </motion.div>
        </div>

        {/* ── Service cards ─────────────────────────────────────── */}
        <div className="relative z-10 mt-8">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                ref={i === 0 ? card1Ref : i === 2 ? card3Ref : undefined}
                className={`relative flex items-center gap-3.5 rounded-2xl p-4 pb-5 pr-5 ${svc.className}`}
                style={{
                  background: C.card,
                  zIndex: 10 + i,
                  boxShadow:
                    "0 24px 48px -20px rgba(40, 28, 12, 0.28), 0 6px 16px -8px rgba(40, 28, 12, 0.12)",
                }}
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-40px" },
                      transition: { duration: 0.65, delay: i * 0.12, ease },
                    })}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ background: C.iconWell }}
                >
                  <Icon size={19} strokeWidth={1.8} color={C.ink} />
                </span>
                <span className="min-w-0">
                  <span
                    className="block text-[13px] font-bold"
                    style={{ fontFamily: F.mono, letterSpacing: "0.18em" }}
                  >
                    {svc.title}
                  </span>
                  <span
                    className="mt-1.5 block text-[12.5px] leading-snug"
                    style={{ color: C.muted }}
                  >
                    {svc.desc}
                  </span>
                </span>
                <Plus
                  size={19}
                  strokeWidth={2.4}
                  color={C.red}
                  className="ml-auto shrink-0"
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Scroll cue → portfolio ────────────────────────────── */}
        <div className="relative z-10 mt-6 px-6 pb-4">
          <a
            href="#portfolio"
            className="flex items-end gap-7"
            aria-label="Scroll to our projects"
          >
            <span className="flex flex-col items-center">
              <motion.span
                ref={scrollDotRef}
                className="block h-5 w-5 rounded-full"
                style={{ border: `2px solid ${C.red}` }}
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: reduced ? 0 : DRAW_DELAY + DRAW_DURATION }}
              />
              <motion.svg
                width="16"
                height="30"
                viewBox="0 0 16 30"
                fill="none"
                className="mt-2"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, 5, 0] }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.4, delay: DRAW_DELAY + DRAW_DURATION + 0.15 },
                        y: {
                          duration: 1.6,
                          delay: DRAW_DELAY + DRAW_DURATION + 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
              >
                <path
                  d="M8 1v21M2 17l6 7 6-7"
                  stroke={C.red}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </span>
            <motion.span
              className="mb-1 text-[12px] font-bold"
              style={{ fontFamily: F.mono, color: C.red, letterSpacing: "0.32em" }}
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : DRAW_DELAY + DRAW_DURATION + 0.2 }}
            >
              SCROLL TO EXPLORE
            </motion.span>
          </a>
        </div>
      </div>

    </section>
  );
}
