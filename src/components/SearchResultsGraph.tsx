"use client";

import { useEffect, useMemo, useRef } from "react";
import type { SearchGraph } from "@/lib/searchGraphs";

/**
 * "Hand-marked" search results graph for a case study (Sem's pick,
 * 2026-10-12): three grey-to-ink lines against the old site's average, a
 * dashed launch line, and red marker notes in Caveat.
 *
 * The stat row and copy render on the server; the SVG is drawn on the client
 * because it is laid out to the container's width (short labels on phones).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const INK = "#0d0d0d";
const PEN = "#dc2626";
const PAPER = "#f4efe6";
const DAY = 864e5;

const SERIES = [
  { key: "clk", name: "Clicks", note: "clicks!", color: "#141a26", w: 2.75 },
  { key: "rank", name: "Google ranking", note: "ranking", color: "#77736b", w: 2.25 },
  { key: "imp", name: "Times shown", note: "shown", color: "#b5afa4", w: 2.25 },
] as const;
type Key = (typeof SERIES)[number]["key"];
type Point = Record<Key, number> & { d: number; pos: number; imp14: number; clk14: number };

const utc = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
const fmtDay = (t: number) =>
  new Date(t).toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });
const fx = (v: number) => v.toFixed(1) + "x";

/** Weekly points counted back from `last`, each the 14 days up to that date. */
function points(g: SearchGraph) {
  const start = utc(g.start);
  const idx = (s: string) => (utc(s) - start) / DAY;
  const raw = g.all.map(([pos, imp, clk], i) => {
    const [npos, nimp, nclk] = g.name[i];
    return { imp: imp - nimp, clk: clk - nclk, pw: pos * imp - npos * nimp };
  });
  const sum = (a: typeof raw, k: "imp" | "clk" | "pw") => a.reduce((s, x) => s + x[k], 0);
  const launch = idx(g.launch);
  const pre = raw.slice(launch - 28, launch);
  const base = { pos: sum(pre, "pw") / sum(pre, "imp"), imp: sum(pre, "imp") / 28, clk: sum(pre, "clk") / 28 };
  const pts: Point[] = [];
  for (let i = idx(g.last); i >= idx(g.first); i -= 7) {
    const win = raw.slice(i - 13, i + 1);
    const pos = sum(win, "pw") / sum(win, "imp");
    pts.unshift({
      d: start + i * DAY, pos, imp14: sum(win, "imp"), clk14: sum(win, "clk"),
      rank: base.pos / pos, imp: sum(win, "imp") / 14 / base.imp, clk: sum(win, "clk") / 14 / base.clk,
    });
  }
  return { pts, launch: utc(g.launch) };
}

export default function SearchResultsGraph({ data }: { data: SearchGraph }) {
  const { pts, launch } = useMemo(() => points(data), [data]);
  const end = pts[pts.length - 1];
  const host = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = host.current, tipEl = tip.current;
    if (!box || !tipEl) return;
    const NS = "http://www.w3.org/2000/svg";
    const el = (name: string, attrs: Record<string, string | number> = {}, parent?: Element) => {
      const e = document.createElementNS(NS, name);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
      parent?.appendChild(e);
      return e;
    };
    const txt = (p: Element, x: number, y: number, s: string, attrs: Record<string, string | number> = {}) => {
      const t = el("text", { x, y, ...attrs }, p);
      t.textContent = s;
      return t;
    };
    const hand = (size: number) => `font-family: Caveat, 'Segoe Print', cursive; font-weight: 600; font-size: ${size}px; fill: ${PEN}`;
    // A marker arrow: a slightly bowed stroke with an open head at (x2, y2).
    const arrow = (g: Element, x1: number, y1: number, x2: number, y2: number, bow: number) => {
      const mx = (x1 + x2) / 2 + bow, my = (y1 + y2) / 2;
      el("path", { d: `M${x1},${y1} Q${mx},${my} ${x2},${y2}`, fill: "none", stroke: PEN, "stroke-width": 2, "stroke-linecap": "round" }, g);
      const a = Math.atan2(y2 - my, x2 - mx);
      for (const s of [-0.5, 0.5]) {
        el("path", { d: `M${x2},${y2} L${x2 - 10 * Math.cos(a + s)},${y2 - 10 * Math.sin(a + s)}`, stroke: PEN, "stroke-width": 2, "stroke-linecap": "round" }, g);
      }
    };

    const draw = () => {
      box.querySelector("svg")?.remove();
      const W = Math.max(300, box.clientWidth), narrow = W < 620;
      const H = narrow ? 360 : 440;
      const m = { t: narrow ? 64 : 78, r: narrow ? 74 : 150, b: 34, l: narrow ? 36 : 50 };
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true", style: "display:block;width:100%;height:auto;overflow:visible" });
      box.insertBefore(svg, tipEl);
      const x0 = pts[0].d, x1 = end.d;
      const X = (t: number) => m.l + ((t - x0) / (x1 - x0)) * (W - m.l - m.r);
      const YMIN = 0.5, YMAX = 2;
      const Y = (v: number) => m.t + (1 - (v - YMIN) / (YMAX - YMIN)) * (H - m.t - m.b);
      const axis = `font-family: Inter, system-ui, sans-serif; font-size: ${narrow ? 12 : 14}px; fill: #4a4a4a`;

      for (let v = YMIN; v <= YMAX + 1e-9; v += 0.5) {
        if (v > YMIN) el("line", { x1: m.l, x2: W - m.r + 8, y1: Y(v), y2: Y(v), stroke: "#e2dccf", "stroke-width": 1 }, svg);
        txt(svg, m.l - 12, Y(v) + 5, (v === 1 ? "1" : v) + "x", { "text-anchor": "end", style: axis });
      }
      el("path", { d: `M${m.l},${m.t - 4} V${Y(YMIN)} H${W - m.r + 12}`, fill: "none", stroke: INK, "stroke-width": 1.25 }, svg);
      el("line", { x1: X(launch), x2: X(launch), y1: m.t - 4, y2: Y(YMIN), stroke: "#6e6a62", "stroke-width": 1.25, "stroke-dasharray": "4 5" }, svg);

      // Every second week counted back from the end, plus the launch date
      // (which takes the place of any week within a week of it).
      const near = (t: number) => Math.abs(t - launch) < 7 * DAY;
      const labels: [number, string][] = narrow
        ? [[pts[0].d, fmtDay(pts[0].d)], [launch, fmtDay(launch)], [end.d, fmtDay(end.d)]]
        : [
            ...pts.filter((p, i) => (pts.length - 1 - i) % 2 === 0 && !near(p.d)).map((p): [number, string] => [p.d, fmtDay(p.d)]),
            [launch, fmtDay(launch)],
          ];
      for (const [t, s] of labels) {
        txt(svg, X(t), H - 6, s, { "text-anchor": t === pts[0].d ? "start" : t === end.d ? "end" : "middle", style: axis });
      }

      const paths = {} as Record<Key, [number, number][]>;
      [...SERIES].reverse().forEach((s) => {
        paths[s.key] = pts.map((p) => [X(p.d), Y(p[s.key])]);
        el("path", { d: "M" + paths[s.key].map((q) => q.join(",")).join(" L"), fill: "none", stroke: s.color, "stroke-width": s.w, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
        const [ex, ey] = paths[s.key][paths[s.key].length - 1];
        el("circle", { cx: ex, cy: ey, r: 5, fill: s.color }, svg);
      });

      // Marker notes.
      const pen = el("g", {}, svg);
      const hs = narrow ? 19 : 27;
      const [cx, cy] = paths.clk[paths.clk.length - 1];
      el("path", {
        d: `M${cx - 4},${cy - 17} C${cx + 22},${cy - 19} ${cx + 25},${cy + 13} ${cx + 2},${cy + 16} C${cx - 22},${cy + 18} ${cx - 25},${cy - 10} ${cx - 8},${cy - 16}`,
        fill: "none", stroke: PEN, "stroke-width": 2, "stroke-linecap": "round",
      }, pen);
      if (narrow) {
        txt(pen, cx + 2, cy - 44, `${fx(end.clk)} clicks!`, { "text-anchor": "end", style: hand(hs) });
        arrow(pen, cx - 6, cy - 38, cx - 4, cy - 20, 6);
      } else {
        txt(pen, cx - 6, cy - 66, `${fx(end.clk)} clicks!`, { style: hand(hs), transform: `rotate(-8 ${cx} ${cy - 66})` });
        arrow(pen, cx + 50, cy - 56, cx + 16, cy - 20, 14);
      }
      (["rank", "imp"] as const).forEach((k) => {
        const [ex, ey] = paths[k][paths[k].length - 1];
        const s = SERIES.find((x) => x.key === k)!;
        txt(pen, ex + 12, ey + 7, narrow ? `← ${fx(end[k])}` : `← ${fx(end[k])} ${s.note}`, { style: hand(hs), transform: `rotate(-6 ${ex + 12} ${ey})` });
      });
      // "new site goes live", up and left of the launch, pointing at where clicks took off.
      const after = pts.findIndex((p) => p.d >= launch);
      const a = pts[after - 1], b = pts[after], f = (launch - a.d) / (b.d - a.d);
      const lx = X(launch), ly = Y(a.clk + (b.clk - a.clk) * f);
      const ty = Y(narrow ? 1.75 : 1.7);
      txt(pen, lx - (narrow ? 8 : 18), ty, "new site goes live", { "text-anchor": "end", style: hand(hs), transform: `rotate(-6 ${lx} ${ty})` });
      arrow(pen, lx - (narrow ? 40 : 70), ty + 12, lx - 3, ly - 12, narrow ? -10 : -24);

      // Hover: crosshair on the nearest week with one tooltip.
      const cross = el("line", { y1: m.t - 4, y2: Y(YMIN), stroke: INK, "stroke-width": 1, opacity: 0 }, svg);
      const dots = SERIES.map((s) => el("circle", { r: 5, fill: s.color, stroke: PAPER, "stroke-width": 2, opacity: 0 }, svg));
      const hit = el("rect", { x: m.l, y: 0, width: W - m.l - m.r, height: Y(YMIN), fill: "transparent" }, svg);
      const move = (clientX: number) => {
        const r = svg.getBoundingClientRect(), sc = r.width / W, px = (clientX - r.left) / sc;
        let i = 0, best = Infinity;
        pts.forEach((p, k) => { const dd = Math.abs(X(p.d) - px); if (dd < best) { best = dd; i = k; } });
        const p = pts[i], x = X(p.d);
        cross.setAttribute("x1", String(x)); cross.setAttribute("x2", String(x)); cross.setAttribute("opacity", "0.35");
        SERIES.forEach((s, k) => { dots[k].setAttribute("cx", String(x)); dots[k].setAttribute("cy", String(Y(p[s.key]))); dots[k].setAttribute("opacity", "1"); });
        tipEl.innerHTML = `<div>Two weeks to <b>${fmtDay(p.d)}</b></div>` +
          SERIES.map((s) => `<div style="display:flex;align-items:center;gap:7px"><i style="width:14px;height:2.5px;border-radius:2px;display:inline-block;background:${s.color}"></i>${s.name}<b style="margin-left:auto;padding-left:12px">${fx(p[s.key])}</b></div>`).join("");
        const topY = Math.min(...SERIES.map((s) => Y(p[s.key]))) * sc;
        const hw = box.clientWidth, tw = tipEl.offsetWidth;
        tipEl.style.left = Math.min(Math.max(x * sc, tw / 2 + 4), hw - tw / 2 - 4) + "px";
        tipEl.style.top = Math.max(topY - 14, tipEl.offsetHeight + 4) + "px";
        tipEl.style.opacity = "1";
      };
      const hide = () => { cross.setAttribute("opacity", "0"); dots.forEach((d) => d.setAttribute("opacity", "0")); tipEl.style.opacity = "0"; };
      hit.addEventListener("pointermove", (e) => move((e as PointerEvent).clientX));
      hit.addEventListener("pointerdown", (e) => move((e as PointerEvent).clientX));
      hit.addEventListener("pointerleave", hide);
    };

    draw();
    // Redraw once Caveat is in, so the notes measure right.
    document.fonts?.ready.then(draw);
    // Width only: redrawing changes the height, which would re-trigger.
    let lastW = box.clientWidth;
    const ro = new ResizeObserver(() => {
      if (box.clientWidth !== lastW) { lastW = box.clientWidth; draw(); }
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [pts, end, launch]);

  // Milestones are calendar months (Aug 21 to Sep 21 is 31 days, to Nov 18
  // is 89), so snap to the nearest 30 when within a couple of days of it.
  const raw = Math.round((end.d - launch) / DAY), snap = Math.round(raw / 30) * 30;
  const days = Math.abs(raw - snap) <= 2 ? snap : raw;
  const stats = [
    // Ratios only: raw counts undersell the change and publish the client's
    // traffic. The timeframe is the selling point, so every caption says it.
    { k: "Clicks", v: fx(end.clk), s: `the old site's clicks from Google, ${days} days after launch` },
    { k: "Google ranking", v: fx(end.rank), s: `the old site's Google ranking, ${days} days after launch` },
    { k: "Times shown", v: fx(end.imp), s: `the old site's appearances in Google results, ${days} days after launch` },
  ];

  return (
    <div>
      {/* React 19 hoists this into <head>; only pages with the graph load it. */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" precedence="default" />
      <div className="h-[3px] w-11 rounded bg-[#dc2626]" />
      <h2 className="mt-4 max-w-2xl text-[24px] font-bold leading-[1.2] md:text-[30px]" style={{ fontFamily: SYNE }}>
        More visibility. More clicks. <span className="whitespace-nowrap">In just {days} days.</span>
      </h2>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <p className="max-w-xl text-[15px] leading-[1.75] text-[#0d0d0d]/70">
          The new site&rsquo;s first {days} days in Google, against the old Wix site (1x is its average over the four
          weeks before launch). Searches for the company&rsquo;s own name are left out.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#0d0d0d]/75">
          {SERIES.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-2.5">
              <i className="inline-block h-[2.5px] w-[26px] rounded" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>
      <div
        ref={host}
        className="relative mt-4"
        role="img"
        aria-label={`Line chart from ${fmtDay(pts[0].d)} to ${fmtDay(end.d)} of clicks, Google ranking and times shown against the old site's average. All three sit near 1x before the new site went live on ${fmtDay(launch)}, then climb. By ${fmtDay(end.d)}, clicks are ${fx(end.clk)}, ranking ${fx(end.rank)} and times shown ${fx(end.imp)}.`}
      >
        <div
          ref={tip}
          className="pointer-events-none absolute z-[2] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-[#0d0d0d] px-2.5 py-2 text-[12.5px] leading-[1.5] text-[#f4efe6] opacity-0 transition-opacity duration-100 motion-reduce:transition-none"
        />
      </div>
      <div className="mt-8 grid sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.k}
            className={`min-w-0 py-4 sm:py-1 ${i ? "border-t border-black/15 sm:border-l sm:border-t-0 sm:pl-7" : "sm:pr-7"}`}
          >
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#0d0d0d]/55">{s.k}</p>
            <p className="mt-1.5 text-[40px] font-medium leading-[1.1] tracking-[-0.02em]">{s.v}</p>
            <p className="mt-2 text-[14.5px] leading-[1.5] text-[#0d0d0d]/60">{s.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
