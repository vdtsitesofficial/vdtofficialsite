"use client";

/* -----------------------------------------------------------------------
 * /v2 — "ROUTE" mobile homepage concept
 *
 * Cream editorial studio page. Heavy grotesque headline (Archivo Black),
 * Space Mono labels, one red accent. The signature move is a single red
 * connector line that draws itself on load: it starts at the dot above
 * the eyebrow, snakes right past the headline, down the right edge,
 * back across under the CTA, down the left rail behind the service
 * cards, pings the dot beside the third card, then runs down to the
 * scroll cue. Waypoints are measured from the live DOM (after fonts
 * load, re-measured on resize) so the line always hugs the content.
 * --------------------------------------------------------------------- */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Monitor, PenTool, TrendingUp, Plus, X } from "lucide-react";

const C = {
  bg: "#F4EFE6",
  card: "#FCFAF4",
  iconWell: "#EFE8DB",
  ink: "#141310",
  body: "#55514a",
  muted: "#7a756c",
  red: "#E0301F",
  redSoft: "rgba(224, 48, 31, 0.22)",
  hair: "rgba(20, 19, 16, 0.18)",
};

const F = {
  display: "'Archivo Black', 'Arial Black', sans-serif",
  headline: "'Anton', 'Arial Narrow', sans-serif",
  mono: "'Space Mono', 'Courier New', monospace",
  body: "'Inter', system-ui, sans-serif",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* Total draw time of the red route; dot/cue reveals key off it. */
const DRAW_DELAY = 0.4;
const DRAW_DURATION = 4.2;

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

/* Axis-aligned polyline -> path string with rounded corners. */
function roundedPath(pts: [number, number][], radius: number): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLen / 2, outLen / 2);
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
};

export default function V2ConceptPage() {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState<Route | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startDotRef = useRef<HTMLSpanElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const statRef = useRef<HTMLDivElement | null>(null);
  const scrollDotRef = useRef<HTMLSpanElement | null>(null);

  const measure = useCallback(() => {
    const c = containerRef.current;
    const els = [
      startDotRef.current,
      headlineRef.current,
      ctaRef.current,
      card3Ref.current,
      statRef.current,
      scrollDotRef.current,
    ];
    if (!c || els.some((el) => !el)) return;
    const cr = c.getBoundingClientRect();
    const box = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
        left: r.left - cr.left,
        right: r.right - cr.left,
        cx: r.left - cr.left + r.width / 2,
        cy: r.top - cr.top + r.height / 2,
      };
    };
    const W = cr.width;
    const H = cr.height;
    const dot = box(startDotRef.current!);
    const head = box(headlineRef.current!);
    const cta = box(ctaRef.current!);
    const card3 = box(card3Ref.current!);
    const stat = box(statRef.current!);
    const cue = box(scrollDotRef.current!);

    const xRail = cue.cx; // left rail lines up with the scroll-cue circle
    const xEdge = W - 14;
    const xDrop = Math.min(W * 0.7, W - 56);
    const yHead = head.top + (head.bottom - head.top) * 0.55;
    const yCross = cta.bottom + 34;
    const yShelf = stat.top - 36;
    const midDot = { x: Math.min(W - 12, card3.right + 9), y: card3.cy };

    const seg1: [number, number][] = [
      [dot.cx, dot.cy],
      [xDrop, dot.cy],
      [xDrop, yHead],
      [xEdge, yHead],
      [xEdge, yCross],
      [xRail, yCross],
      [xRail, card3.cy],
      [midDot.x - 8, card3.cy],
    ];
    const seg2: [number, number][] = [
      [midDot.x, midDot.y + 8],
      [midDot.x, yShelf],
      [xRail, yShelf],
      [xRail, cue.top - 4],
    ];

    setRoute({
      d: `${roundedPath(seg1, 30)} ${roundedPath(seg2, 30)}`,
      w: W,
      h: H,
      midDot,
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <main
      className="min-h-screen overflow-x-hidden antialiased"
      style={{ background: C.bg, color: C.ink, fontFamily: F.body }}
    >
      {/* Page-specific fonts (root layout only ships Anton + Inter). */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

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
                  : { duration: DRAW_DURATION, delay: DRAW_DELAY, ease: [0.45, 0, 0.25, 1] }
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
              transition={{ duration: 0.4, delay: reduced ? 0 : DRAW_DELAY + DRAW_DURATION * 0.62 }}
              style={{ transformOrigin: `${route.midDot.x}px ${route.midDot.y}px` }}
            />
          </svg>
        )}

        {/* ── Header ────────────────────────────────────────────── */}
        <header className="relative z-10 flex items-center justify-between px-6 pb-4 pt-6">
          <span
            className="text-[21px] leading-none"
            style={{ fontFamily: F.display, letterSpacing: "0.01em" }}
          >
            VDT SITES
          </span>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="-mr-1 p-1"
          >
            <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
              <path d="M2 5.5h32" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M10 12.5h24" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 pt-8">
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
            className="mt-14 text-[12px] font-bold"
            style={{ fontFamily: F.mono, color: C.red, letterSpacing: "0.42em" }}
          >
            DIGITAL STUDIO
          </motion.p>

          <motion.h1
            {...fadeUp(0.3)}
            ref={headlineRef}
            className="mt-5 uppercase"
            style={{
              fontFamily: F.headline,
              fontSize: "clamp(3.5rem, 17vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "0.005em",
            }}
          >
            Design
            <br />
            That
            <br />
            Drives
            <br />
            Growth
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
          </motion.h1>

          <motion.p
            {...fadeUp(0.42)}
            className="mt-7 max-w-[30ch] text-[17px] leading-[1.6]"
            style={{ color: C.body }}
          >
            Websites, branding, and digital experiences crafted to elevate your
            brand and deliver real results.
          </motion.p>

          <motion.div {...fadeUp(0.54)} ref={ctaRef} className="mt-9">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-4"
            >
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
            </Link>
          </motion.div>
        </section>

        {/* ── Service cards ─────────────────────────────────────── */}
        <section className="relative z-10 mt-24">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                ref={i === 2 ? card3Ref : undefined}
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
        </section>

        {/* ── Stat card ─────────────────────────────────────────── */}
        <section className="relative z-10 mt-24 px-6">
          <motion.div
            ref={statRef}
            className="flex items-center gap-6 rounded-[28px] p-6"
            style={{ border: `1.5px solid ${C.hair}` }}
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 26 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-40px" },
                  transition: { duration: 0.7, ease },
                })}
          >
            <StatRing reduced={!!reduced} />
            <div className="min-w-0">
              <p
                className="text-[11px] font-bold"
                style={{ fontFamily: F.mono, color: C.red, letterSpacing: "0.3em" }}
              >
                CLIENT SATISFACTION
              </p>
              <p
                className="mt-2.5 text-[14.5px] leading-relaxed"
                style={{ color: C.body }}
              >
                Trusted by ambitious brands to design, build, and grow with
                confidence.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── Scroll cue ────────────────────────────────────────── */}
        <section className="relative z-10 mt-16 flex items-end gap-7 px-6 pb-20">
          <div className="flex flex-col items-center">
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
              height="42"
              viewBox="0 0 16 42"
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
                d="M8 1v33M2 29l6 7 6-7"
                stroke={C.red}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
          <motion.p
            className="mb-1 text-[12px] font-bold"
            style={{ fontFamily: F.mono, color: C.red, letterSpacing: "0.32em" }}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : DRAW_DELAY + DRAW_DURATION + 0.2 }}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </section>
      </div>

      {/* ── Menu overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col px-6 pb-10 pt-6"
            style={{ background: C.ink, color: C.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[21px] leading-none"
                style={{ fontFamily: F.display }}
              >
                VDT SITES
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="-mr-1 p-1"
              >
                <X size={26} />
              </button>
            </div>
            <nav className="mt-20 flex flex-col gap-8">
              {[
                { label: "HOME", href: "/v2" },
                { label: "WORK", href: "/work" },
                { label: "SERVICES", href: "/services" },
                { label: "CONTACT", href: "/contact" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4"
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{ fontFamily: F.mono, color: C.red }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-[40px] uppercase leading-none"
                      style={{ fontFamily: F.display }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p
              className="mt-auto text-[11px]"
              style={{ fontFamily: F.mono, color: "rgba(244,239,230,0.5)", letterSpacing: "0.3em" }}
            >
              VDTSITES.COM
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── 98% satisfaction ring ───────────────────────────────────────── */
function StatRing({ reduced }: { reduced: boolean }) {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const FRACTION = 0.98;
  // Arc starts at 12 o'clock (rotated -90) and sweeps clockwise; the end
  // dot sits at the arc's terminus, just shy of a full lap.
  const endAngle = ((-90 + FRACTION * 360) * Math.PI) / 180;
  const endX = 60 + R * Math.cos(endAngle);
  const endY = 60 + R * Math.sin(endAngle);

  return (
    <div className="relative h-[120px] w-[120px] shrink-0">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="#E5DCCA" strokeWidth="2" />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={C.red}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          transform="rotate(-90 60 60)"
          initial={{ strokeDashoffset: reduced ? CIRC * (1 - FRACTION) : CIRC }}
          whileInView={{ strokeDashoffset: CIRC * (1 - FRACTION) }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduced ? { duration: 0 } : { duration: 1.7, delay: 0.25, ease }}
        />
        <motion.circle
          cx={endX}
          cy={endY}
          r="4.5"
          fill={C.red}
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: reduced ? 0 : 1.85 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontFamily: F.headline, fontSize: "36px" }}>
          98<span style={{ fontSize: "22px" }}>%</span>
        </span>
      </div>
    </div>
  );
}
