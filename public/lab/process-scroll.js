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
  const rivers  = document.querySelectorAll(".vdt-process-shell .process__river");
  const stages  = document.querySelectorAll(".vdt-process-shell .slide--stage");
  const pips    = document.querySelectorAll(".vdt-process-shell .process__pip");

  if (!section || !track || !rivers.length || !stages.length) return;

  const SW_START = 9;
  const SW_END   = 22;
  let initialDrawnFrac = 0.08;

  function measure() {
    rivers.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray  = String(len);
      p.style.strokeDashoffset = String(len);
      p._len = len;
    });

    const stroke = rivers[rivers.length - 1];
    if (stroke && stroke._len) {
      let lo = 0, hi = stroke._len;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (stroke.getPointAtLength(mid).x < 920) lo = mid;
        else hi = mid;
      }
      initialDrawnFrac = ((lo + hi) / 2) / stroke._len;
    }
  }
  measure();
  window.addEventListener("resize", measure, { passive: true });

  const MILESTONES = [0.10, 0.40, 0.65, 0.90];
  // DWELL was 0.12 (= ~48vh of "scroll but title doesn't move"
  // before the journey began). 0.02 cuts it to ~8vh — about one
  // wheel-tick before the track starts translating.
  const DWELL = 0.02;

  // On narrow viewports the section reflows to a vertical stack (see
  // the @media (max-width: 720px) block in process-scroll.css) and the
  // horizontal-scroll mechanism doesn't apply. Bail out of every frame
  // so we don't fight the CSS by writing transform: translate3d(...) on
  // a track that's been flattened. Also resets any leftover transform
  // from a desktop view that the user resized to mobile.
  const MOBILE_BP = 720;

  function update() {
    if (window.innerWidth <= MOBILE_BP) {
      if (track.style.transform) track.style.transform = '';
      rivers.forEach((p) => { p.style.strokeDashoffset = '0'; });
      return;
    }
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;
    const total = section.offsetHeight - vh;
    let progress = -rect.top / total;
    progress = Math.max(0, Math.min(1, progress));

    const journeyProgress = Math.max(0, Math.min(1,
      (progress - DWELL) / (1 - DWELL)));

    // END_FRAC: how far through the full track we scroll. The track is
    // 500vw wide (1 title + 4 stages); scrolling to 1.0 ends with stage 4
    // (Launch) flush against the right edge of the viewport. 0.75 ends
    // at -300vw, where stage 3 (Build) fills the viewport and Launch is
    // just about to come in from the right — so the section closes right
    // at "the start of Launch" without ever showing Launch in full.
    const END_FRAC = 0.75;
    const travel = (track.scrollWidth - window.innerWidth) * END_FRAC;
    track.style.transform = `translate3d(${-journeyProgress * travel}px, 0, 0)`;

    const drawnEase = Math.pow(journeyProgress, 1.15);
    const drawn = initialDrawnFrac + drawnEase * (1 - initialDrawnFrac);
    rivers.forEach((p) => {
      p.style.strokeDashoffset = String(p._len * (1 - drawn));
    });

    const sw = SW_START + journeyProgress * (SW_END - SW_START);
    rivers.forEach((p) => {
      const isGlow = p.classList.contains("process__river--glow");
      p.style.strokeWidth = String(isGlow ? sw + 12 : sw);
    });

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
