// =============================================================
// VDT — Our Process · horizontal scroll-story driver (drop-in)
//
// Wrapped in an IIFE so no variables / functions leak to the
// global window scope — keeps it completely isolated from the
// host laptop-zoom-v2 page's own scroll handlers.
// =============================================================

(function() {
  const section = document.getElementById("process");
  const track   = document.getElementById("process-track");
  const pin     = document.querySelector(".vdt-process-shell .process__pin");
  const rivers  = document.querySelectorAll(".vdt-process-shell .process__river");
  const stages  = document.querySelectorAll(".vdt-process-shell .slide--stage");
  const pips    = document.querySelectorAll(".vdt-process-shell .process__pip");

  if (!section || !track || !rivers.length || !stages.length) return;

  const SW_START = 9;
  const SW_END   = 22;
  let initialDrawnFrac = 0.08;

  // Portrait-tuned river path (5000x1000 viewBox, same as desktop). The raw
  // desktop path rendered into a portrait phone with preserveAspectRatio="none"
  // stretches vertically (~2x), turning its gentle waves into steep zig-zags
  // that cut through the stacked text, and it stopped at ~x3646 (never reaching
  // Launch). This path keeps the desktop line's CHARACTER (a straight underline
  // lead-in, then four organic swings) but widens each swing into a BROAD
  // crest/trough that holds high (~y323, 32%) or low (~y677, 68%) across the
  // FULL width of its stage. The amplitude is deliberately GENTLE (~32%-68%,
  // not 21%-79%) so the slopes between stages are gradual like desktop rather
  // than spiking; the steep travel is confined to the hand-offs
  // BETWEEN stages (the "shoulder" control points at y500). Result: within each
  // screen the line is a clean near-flat arc with no sudden turns, and the
  // content (parked just inside the opposite lobe by the CSS) never touches it
  // — verified to ~25-40px clearance across the full content width on a live
  // 408px-wide render. Layout:
  //   • x0→880  : straight underline (spans the whole word). initialDrawnFrac
  //                below leaves ONLY this straight run drawn at rest, so the
  //                line "starts straight" and the wave reveals as you scroll.
  //   • stage 1 (≈x1100-1870, HIGH) Discover sits UNDER this crest.
  //   • stage 2 (≈x2130-2870, LOW)  Design sits ABOVE this trough.
  //   • stage 3 (≈x3130-3870, HIGH) Build sits UNDER this crest.
  //   • stage 4 (≈x4130-4870, LOW)  Launch sits ABOVE this trough.
  // Draw mechanics (offset by journeyProgress) are unchanged → reveal timing
  // matches desktop. Tuned live against the real mobile render; if you nudge
  // a crest, re-check clearance on a phone-width viewport.
  // Mobile path: a true flowing SINE (Option B, amplitude 215 around the
  // y=500 midline → crest 285, trough 715) in the 5200-wide viewBox (set on
  // the SVG in applyRiverPath). Each half-period is one cosine cubic with
  // HORIZONTAL tangents at every crest/trough, so there are no kinks, no flat
  // tops, and no vertical drops. Stage centres (with the 20vw gap): Discover
  // 1700 (crest), Design 2700 (trough), Build 3700 (crest), Launch 4700
  // (trough). The flat underline runs through the title + gap to x1200, then
  // a smooth lead-in rises into Discover. The line is CUT at the Launch
  // trough (4700 = halfway through the Launch slide) — no tail — so Launch's
  // text can sit in the now-empty top-right of that slide.
  // NOTE: the flat lead-in sits at y=540 (54%), NOT the sine midline (500).
  // The title-card CSS seats "OUR PROCESS" just above the 54% mark (see the
  // .title-card comment in process-scroll.css) — when this segment was at 500
  // the line cut THROUGH the heading on phones instead of underlining it.
  const MOBILE_RIVER_D =
    "M 0 540 L 1200 540 " +                       // flat underline (title + gap) at y540
    "C 1400 540, 1500 285, 1700 285 " +           // smooth lead-in → Discover crest
    "C 2100 285, 2300 715, 2700 715 " +           // Discover crest → Design trough
    "C 3100 715, 3300 285, 3700 285 " +           // Design trough → Build crest
    "C 4100 285, 4300 715, 4700 715";             // Build crest → Launch trough  (CUT — line ends here)

  // Capture each river's authored (desktop) path once, so we can restore it
  // when the viewport crosses back above the mobile breakpoint.
  rivers.forEach((p) => { p._desktopD = p.getAttribute("d"); });

  function applyRiverPath() {
    const mobile = window.innerWidth <= 840;
    // Mobile widens the track to 520vw (20vw blank gap before Discover), so
    // the SVG viewBox must widen to 5200 to keep 10 units = 1vw (same mapping
    // the path crests are designed against). Desktop keeps the authored 5000.
    const svg = rivers[0] && rivers[0].closest("svg");
    if (svg) svg.setAttribute("viewBox", mobile ? "0 0 5200 1000" : "0 0 5000 1000");
    rivers.forEach((p) => {
      const want = mobile ? MOBILE_RIVER_D : p._desktopD;
      if (want && p.getAttribute("d") !== want) p.setAttribute("d", want);
      // On mobile, fix the stroke width ONCE here instead of re-writing it
      // every scroll frame in update() — changing strokeWidth re-rasterizes
      // the whole path each frame, a real scroll cost. Desktop keeps the taper.
      if (mobile) p.style.strokeWidth = p.classList.contains("process__river--glow") ? "26" : "14";
    });
    measure();
    measureGeom();
    // PERF (mobile): draw the line FULLY once and never rewrite strokeDashoffset
    // again per scroll frame. Re-writing strokeDashoffset every frame
    // re-rasterizes the large stretched SVG path — that was THE cause of the
    // horizontal-scroll frame drops (it's the only per-frame cost unique to
    // this section). The track already translates as you scroll, so the
    // fully-drawn line simply scrolls into view with each stage (a natural
    // spatial reveal) at zero per-frame cost. Desktop keeps the scroll-driven
    // progressive draw (no lag there).
    if (mobile) {
      rivers.forEach((p) => { p.style.strokeDashoffset = "0"; });
    }
  }

  // Cached geometry — read ONLY on resize, never per scroll frame. update()
  // fires on EVERY page scroll (even while the section is far off-screen), so
  // reading offsetHeight / pin height / scrollWidth on each scroll forced a
  // synchronous layout on every scroll anywhere on the page. Cache them.
  let geomVh = 0, geomTotal = 1, geomTravel = 0, geomMeasuredW = 0;
  function measureGeom() {
    geomVh = (pin && pin.getBoundingClientRect().height) || window.innerHeight;
    geomTotal = Math.max(1, section.offsetHeight - geomVh);
    const endFrac = window.innerWidth <= 840 ? 1.0 : 0.75;
    geomTravel = (track.scrollWidth - window.innerWidth) * endFrac;
    geomMeasuredW = window.innerWidth;
  }

  function measure() {
    rivers.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray  = String(len);
      p.style.strokeDashoffset = String(len);
      p._len = len;
    });

    const stroke = rivers[rivers.length - 1];
    if (stroke && stroke._len) {
      // x where the flat underline ends (start of the first rise). Desktop is
      // unchanged (original 880); mobile's flat now runs to 1170 (through the
      // title + the 20vw gap) in its 5200 viewBox.
      const flatEndX = window.innerWidth <= 840 ? 1200 : 880;
      let lo = 0, hi = stroke._len;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (stroke.getPointAtLength(mid).x < flatEndX) lo = mid;
        else hi = mid;
      }
      initialDrawnFrac = ((lo + hi) / 2) / stroke._len;
    }
  }
  applyRiverPath();
  window.addEventListener("resize", applyRiverPath, { passive: true });

  // Stage-activation points (journeyProgress where each stage's text fades
  // in). Mobile's 20vw gap pushes every stage centre later in the scroll, so
  // mobile uses shifted milestones; desktop keeps the authored values.
  // Mobile milestones are scaled by TRACK_END (the track finishes early to
  // give Launch a hold — see update()), so each stage still fades in at the
  // same TRACK position as before.
  const MILESTONES = (window.innerWidth <= 840)
    ? [0.12, 0.35, 0.54, 0.74]
    : [0.10, 0.40, 0.65, 0.90];
  // Mobile: the horizontal track completes at 82% of the pinned journey and
  // then HOLDS for the final 18% — without this, Launch only became fully
  // visible at the exact moment the section unpinned, so it scrolled away
  // instantly ("04 barely visible"). Desktop pacing is unchanged.
  const TRACK_END = window.innerWidth <= 840 ? 0.82 : 1.0;
  // DWELL is the "scroll but title doesn't move" runway before the track
  // starts translating. Desktop keeps a tiny 0.02 (~one wheel-tick). Mobile
  // sets 0 so the horizontal journey engages the instant the section pins —
  // on a phone the dwell read as "scrolling down too far before anything
  // moves sideways".
  const DWELL = window.innerWidth <= 840 ? 0 : 0.02;

  function update() {
    const rect = section.getBoundingClientRect();
    // Bail out entirely when the section isn't near the viewport. This handler
    // fires on EVERY page scroll, so without this guard the track transform +
    // SVG draw were being written while scrolling the hero, portfolio,
    // testimonials, etc. too — wasted per-frame work all over the page.
    if (rect.bottom <= 0 || rect.top >= geomVh) return;

    // Self-heal a stale measurement (missed resize / rotation, or geometry
    // captured before the stylesheet applied): if the viewport width changed
    // since measureGeom ran, or the cached travel is degenerate, re-measure.
    // innerWidth is cheap to read (no forced layout) — costs nothing per frame.
    if (window.innerWidth !== geomMeasuredW || geomTravel <= 0) measureGeom();

    let progress = -rect.top / geomTotal;
    progress = Math.max(0, Math.min(1, progress));

    const journeyProgress = Math.max(0, Math.min(1,
      (progress - DWELL) / (1 - DWELL)));

    const trackProgress = Math.min(1, journeyProgress / TRACK_END);
    track.style.transform = `translate3d(${-trackProgress * geomTravel}px, 0, 0)`;

    // Desktop only: scroll-driven progressive draw. Mobile drew the line fully
    // once in applyRiverPath() and skips this per-frame SVG rewrite entirely
    // (it was the horizontal-scroll jank) — the track translation reveals the
    // line spatially instead.
    if (window.innerWidth > 840) {
      const drawnEase = Math.pow(journeyProgress, 1.15);
      const drawn = initialDrawnFrac + drawnEase * (1 - initialDrawnFrac);
      rivers.forEach((p) => {
        p.style.strokeDashoffset = String(p._len * (1 - drawn));
      });
    }

    // Animated stroke-width taper is DESKTOP-only — re-writing strokeWidth each
    // frame re-rasterizes the path (a mobile scroll cost). On mobile the width
    // is fixed once in applyRiverPath().
    if (window.innerWidth > 840) {
      const sw = SW_START + journeyProgress * (SW_END - SW_START);
      rivers.forEach((p) => {
        const isGlow = p.classList.contains("process__river--glow");
        p.style.strokeWidth = String(isGlow ? sw + 12 : sw);
      });
    }

    section.classList.toggle("is-flowing", journeyProgress > 0.02);

    let currentIdx = -1;
    for (let i = 0; i < stages.length; i++) {
      if (journeyProgress >= MILESTONES[i] - 0.005) currentIdx = i;
    }
    stages.forEach((stage, i) => {
      const isOn  = i <= currentIdx;
      const isOld = isOn && i < currentIdx;
      stage.classList.toggle("is-active", isOn);
      stage.classList.toggle("is-passed", isOld);
      if (pips[i + 1]) pips[i + 1].classList.toggle("is-active", isOn);
    });
    if (pips[0]) {
      pips[0].classList.toggle("is-active", currentIdx < 0);
    }
  }

  let pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      update();
      pending = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  update();
})();
