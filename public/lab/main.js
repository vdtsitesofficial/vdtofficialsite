// =============================================================
// laptop-zoom v2 — 2D image-layer hero (geometry rewrite)
//
// All positioning is driven from one block of numeric constants,
// computed in pixels each frame. We DO NOT read back the laptop's
// rendered bounding box — that was unreliable after percentage-
// based transforms (and was the cause of the overlay floating
// above the laptop in the previous build). The screen rectangle
// is derived directly from:
//
//   1. The laptop image's natural aspect (1536×1024)
//   2. The known position of the dark screen rectangle WITHIN
//      the laptop image (SCREEN_FRAC_* below — measured from the
//      transparent PNG)
//   3. The desired viewport position of the screen centre
//      (LAPTOP_ANCHOR_X_FRAC, LAPTOP_ANCHOR_Y_FRAC)
//   4. The current zoom scale
//
// Everything else (overlay tracking, mask fade, chrome fade-in)
// is the same as before, just sourcing the screen rect from the
// new helper instead of getBoundingClientRect.
// =============================================================

// ---------- DOM ----------
const stage         = document.querySelector(".zoom-stage");
const bgImage       = document.querySelector(".bg-image");
const heroText      = document.querySelector(".hero-text");
const laptopWrap    = document.querySelector(".laptop-wrap");
const laptopImage   = document.querySelector(".laptop-image");
const overlay       = document.getElementById("screen-overlay");
// Guard against a null #screen-overlay. Codex traced the "infinite
// loading overlay" bug to THIS line throwing when overlay was null:
// `overlay.querySelector(...)` is a hard crash that aborts the whole
// script before it ever reaches the image-load gate that clears
// .zoom-loading. The `?.` makes it a no-op instead of a throw.
const overlayInner  = overlay ? overlay.querySelector(".screen-inner") : null;
const zoomMask      = document.getElementById("zoom-mask");
const hero          = document.querySelector(".zoom-hero");
const siteChrome    = document.getElementById("site-chrome");
const zoomHeader    = document.getElementById("zoom-header");
const screenGlare   = document.getElementById("screen-glare");

// If any element the zoom engine depends on is missing, bail out
// gracefully — clear the loading overlay so the page is still usable
// rather than stuck behind a dark screen. This is the belt to the
// inline-script suspenders in page.tsx.
if (!stage || !bgImage || !laptopWrap || !laptopImage || !overlay || !hero) {
  const loadingEl = document.querySelector(".zoom-loading");
  if (loadingEl) loadingEl.classList.add("is-ready");
  throw new Error("[vdt-hero] required DOM nodes missing — aborted, overlay cleared");
}

// ---------- viewport ----------
// view.h reads .zoom-stage's rendered height (which is 100lvh in CSS).
// On mobile, Chrome's bottom navigation bar (and iOS Safari's URL
// bar) collapse during scroll. Even though the bar collapses, the
// VISIBLE viewport grows — but 100lvh is fixed at the largest
// possible viewport size and doesn't change. Even so, some browsers
// fire resize events during the toolbar transition with intermediate
// heights, which would otherwise re-anchor the laptop mid-scroll and
// make it look like the hero is "filling in" the space left by the
// toolbar (the bug the user noticed).
//
// Fix: cache the measurement and only refresh it on a WIDTH change
// (orientation flip, browser window resize). Height-only changes
// during scroll are ignored. Desktop resize (which usually changes
// width) still works as expected because width-changes pass the
// guard.
function measureStageHeight() {
  const r = stage ? stage.getBoundingClientRect() : null;
  return r && r.height > 0 ? r.height : window.innerHeight;
}
const view = { w: window.innerWidth, h: measureStageHeight() };

// Phones get a completely different interaction model: instead of the
// scroll-driven zoom (which is too heavy per-frame on mobile and ties the
// animation to janky scroll/toolbar events), the hero loads frozen on the
// intro with a CLICK TO ENTER button. A tap plays a cheap GPU scale+fade
// and then snaps to the locked full-screen hero. See the mobile-enter
// block lower down. Desktop keeps the scroll-driven zoom.
const IS_MOBILE = view.w <= 720;

// ── Mode-boundary resize guard ──
// The interaction model (scroll-zoom vs tap-to-enter) is chosen ONCE at load
// from IS_MOBILE, and process-scroll.js likewise freezes its pacing consts at
// its own 840px gate. If the window later crosses one of those boundaries
// (e.g. a half-width window loaded, then maximized on a Mac), every per-mode
// assumption breaks at once — most visibly, mobile mode runs no rAF loop, so
// on a widened window the "BUILT FOR YOU" hero text keeps its uncentered
// left:50% anchor and overflows the right edge of the screen. Hot-swapping
// modes at runtime isn't safe (scroll locks, intro overlay, tuned T values),
// so reload once after the resize settles — the page re-initialises cleanly
// in the correct mode. Height-only reflows (iOS toolbar) never trigger this.
const _modeBucket = function (w) { return w <= 720 ? 0 : w <= 840 ? 1 : 2; };
const _loadModeBucket = _modeBucket(view.w);
let _modeReloadTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(_modeReloadTimer);
  _modeReloadTimer = setTimeout(function () {
    if (_modeBucket(window.innerWidth) !== _loadModeBucket) window.location.reload();
  }, 300);
}, { passive: true });

// =============================================================
// GEOMETRY — driven by the live tuning panel (see #cp in the HTML)
//
// Defaults below act as the reset baseline. Sliders mutate the T
// object; every helper that needs a value reads from T fresh, so
// changes apply on the next frame without restarting anything.
// =============================================================

// laptop image natural proportions
const LAPTOP_IMAGE_ASPECT = 1024 / 1536;  // h/w of the laptop PNG

// ── Calibration baseline ──
// These values are the saved snapshot from the live tuning panel that
// the user dialed in for the dark-room hero. To recalibrate: drag the
// sliders, hit "Copy values", paste the new block here, save.
const DEFAULTS = {
  bgY:       80.0,    // image %
  laptopX:   49.4,    // viewport %
  laptopY:   61.8,    // viewport %
  laptopW:   81.3,    // viewport %
  textY:     27.9,    // viewport %
  screenL:   33.5,    // image %
  screenR:   33.5,    // image %
  screenT:   40.1,    // image %
  screenB:   28.8,    // image %
  screenY:   0,       // image % — vertical NUDGE of the cream on the laptop.
                      // +up / -down. Shifts screenT/screenB oppositely so the
                      // cream slides without changing size. Lets you seat the
                      // screen on the laptop without touching laptop position.
  homeX:     0,       // px
  homeY:     40,      // px
  homeS:     1.0,     // multiplier
  bevel:     2.0,     // %
  bezel:     1.5,     // %
  bezelX:    0.0,     // px
  tiltX:     4.9,     // deg
  tiltY:     0.0,     // deg
  rotZ:      0.0,     // deg
};

const T = { ...DEFAULTS };       // live tuning values (mutated by sliders)

// =============================================================
// Mobile geometry overrides
//
// The DEFAULTS are calibrated for desktop landscape. On portrait
// phones the laptop ends up too small and sitting too high in the
// scene. Apply per-viewport overrides at init and on resize so the
// laptop visually dominates the home screen.
//
// Tuning (per user direction):
//   - laptopY: +30 pp (61.8 → 91.8) — moves the laptop down 30%
//   - laptopW: ×1.4   (81.3 → ~113.8) — scales it up 40%
//   - laptopX: forced to 50 — perfectly centered horizontally
//
// Re-runs on resize so a landscape rotation flips back to desktop
// numbers. Tick loop reads T fresh every frame so the change takes
// effect on the next paint.
// =============================================================
function applyViewportTuning() {
  const isMobile = window.innerWidth <= 720;
  if (isMobile) {
    // Mobile values dialed in via the live tuner.
    // laptopY history: 74.5 → 54.5 → 24.5 (raised), then 24.5 → 54.5
    // (dropped 30pp back down, +10pp more → 64.5, then -5pp → 59.5 per
    // user requests). Higher anchor = cream destination nearer viewport
    // center = lower computeTargetScale, so the zoom needs less scale and
    // images stay under the GPU texture limit longer (helps scroll
    // smoothness).
    T.laptopY = 59.5;
    T.laptopW = 180.0;
    T.laptopX = 50.5;
    // Text drops 10pp lower than the desktop default so "BUILT FOR YOU"
    // clears the laptop's top edge on a phone.
    T.textY   = DEFAULTS.textY + 10;
    // With "cover" fit on mobile (see updateOverlay), the inner hero
    // overflows the screen vertically. Top-align it (homeY = 0) so the
    // site fills the laptop screen from the very top — the desktop
    // default of 40px would leave a cream band above the homepage.
    T.homeY   = 0;
  } else {
    T.laptopY = DEFAULTS.laptopY;
    T.laptopW = DEFAULTS.laptopW;
    T.laptopX = DEFAULTS.laptopX;
    // Raised 5pp above the default so the "STUDENT PRICING, AGENCY QUALITY"
    // tagline (the bottom of the BUILT FOR YOU block) clears the laptop's
    // top edge on desktop instead of tucking under it.
    T.textY   = DEFAULTS.textY - 5;
    T.homeY   = DEFAULTS.homeY;
  }
}
// Establish the correct per-viewport baseline ONCE at init — this must run
// regardless of the tuner so that opening ?tune on a phone starts from the
// MOBILE geometry (not the desktop defaults). Previously this bailed when
// __vdtTunerActive was set, so a phone tuning session silently calibrated
// the desktop layout.
applyViewportTuning();
// On resize, re-apply the baseline — but NOT while the tuner is active, so
// a manual drag (or iOS Safari's URL-bar collapse firing a resize) doesn't
// wipe the user's values back to the baseline.
window.addEventListener(
  "resize",
  function () {
    if (typeof window !== "undefined" && window.__vdtTunerActive) return;
    applyViewportTuning();
  },
  { passive: true }
);

// Expose T globally so the mobile tuner panel (in page.tsx) can mutate
// the live values directly from <input> change events. The tick loop
// reads T fresh every frame so writes here take effect on the next
// paint. Only used when ?tune is set in the URL — there's no leak in
// normal production usage.
if (typeof window !== "undefined") {
  window.__vdtT = T;
}

// FIXED reference point for the LAPTOP's anchor + transform-origin.
// These are where the dark screen actually SITS on the laptop PNG
// — measured directly from the asset. Used by:
//   1. positionLaptop() — for the laptop's transform-origin (so the
//      laptop scales AROUND its own depicted screen centre).
//   2. screenRect() — to compute the offset between this fixed
//      anchor and the user-calibrated cream-overlay rect.
//
// CRITICAL: these MUST match the actual screen position on the
// CURRENT laptop PNG. If they're stale, the laptop's transform-
// origin will be in the wrong spot and the laptop will visibly
// drift relative to the cream destination during the zoom.
//
// Updated 2026-05-27 to match laptop transparent.png (where the
// depicted screen sits at insets 33.5/33.5/40.1/28.8 — same as
// the user's calibrated DEFAULTS.screenL/R/T/B). Earlier value
// 0.31/0.31/0.32/0.42 was from the OLD laptop image and caused
// the "laptop moves down" drift during scroll-in.
const FIXED = {
  L: 0.335, R: 0.335, T: 0.401, B: 0.288,
  get cx() { return (this.L + (1 - this.R)) / 2; },
  get cy() { return (this.T + (1 - this.B)) / 2; },
};

// =============================================================
// LAYOUT HELPERS
// =============================================================

// fraction helpers — read live from T so sliders take effect on
// the next frame without any rewiring
function fracs() {
  const sL = T.screenL / 100;
  const sR = T.screenR / 100;
  // screenY nudges the cream vertically on the laptop: +up / -down.
  // Applied as equal-and-opposite shifts to the top/bottom insets so the
  // cream's HEIGHT is unchanged (1 - sT - sB stays constant) — only its
  // centre moves. Both screenRect() and computeTargetScale() read fracs(),
  // so the zoom pivot follows the nudge automatically and stays aligned.
  const yOff = (T.screenY || 0) / 100;
  const sT = T.screenT / 100 - yOff;
  const sB = T.screenB / 100 + yOff;
  return {
    laptopWFrac: T.laptopW / 100,
    laptopXFrac: T.laptopX / 100,
    laptopYFrac: T.laptopY / 100,
    textYFrac:   T.textY   / 100,
    sL, sR, sT, sB,
    sWFrac:  1 - sL - sR,
    sHFrac:  1 - sT - sB,
    sCxFrac: (sL + (1 - sR)) / 2,
    sCyFrac: (sT + (1 - sB)) / 2,
  };
}

// Desktop laptop sizing. The laptop is centred, so narrowing the window
// shouldn't shrink it. We keep the tuned width-based size on WIDE windows
// (so the full-width look the user already likes is preserved exactly), but
// add a viewport-HEIGHT floor so that as the window narrows the laptop stops
// shrinking with width and holds a consistent size — only capped down once
// the window is genuinely too narrow to hold it (W_CAP). (Mobile keeps the
// pure width-based size since the tap-to-enter intro is calibrated to it.)
const DESKTOP_LAPTOP_H_FLOOR = 1.35; // min laptop width as a multiple of vh
const DESKTOP_LAPTOP_W_CAP   = 0.95; // never wider than 95% of the viewport
function laptopDims() {
  let w;
  if (IS_MOBILE) {
    w = view.w * (T.laptopW / 100);
  } else {
    const widthBased = view.w * (T.laptopW / 100);
    w = Math.min(
      Math.max(widthBased, view.h * DESKTOP_LAPTOP_H_FLOOR),
      view.w * DESKTOP_LAPTOP_W_CAP
    );
  }
  const h = w * LAPTOP_IMAGE_ASPECT;
  return { w, h };
}

// Viewport coordinates of the cream-overlay screen rectangle. Uses
// LIVE screen insets so the user can drag the overlay around on
// the laptop. The OFFSET (live − fixed) is what makes the cream
// overlay shift relative to the laptop without moving the laptop.
function screenRect(scale) {
  const f = fracs();
  const { w: lw, h: lh } = laptopDims();
  const sw = lw * f.sWFrac * scale;
  const sh = lh * f.sHFrac * scale;
  const cx = view.w * f.laptopXFrac;
  const cy = view.h * f.laptopYFrac;
  // Screen centre is FIXED at its calibrated viewport position.
  // The bg, the cream, and the headline all use this same point as
  // their zoom pivot, so the whole composition zooms INTO the
  // screen rather than around the (off-screen) laptop anchor.
  const offsetX = lw * (f.sCxFrac - FIXED.cx);
  const offsetY = lh * (f.sCyFrac - FIXED.cy);
  const screenCx = cx + offsetX;
  const screenCy = cy + offsetY;
  return {
    left:   screenCx - sw / 2,
    right:  screenCx + sw / 2,
    top:    screenCy - sh / 2,
    bottom: screenCy + sh / 2,
    width:  sw,
    height: sh,
    cx:     screenCx,
    cy:     screenCy,
  };
}

// Write the laptop wrap's position + scale every frame. Uses the
// FIXED screen centre — NOT the live one — so the laptop stays
// put when the user drags the Screen on laptop sliders.
function positionLaptop(scale) {
  const { w: lw, h: lh } = laptopDims();
  const originX = lw * FIXED.cx;
  const originY = lh * FIXED.cy;
  const cx = view.w * (T.laptopX / 100);
  const cy = view.h * (T.laptopY / 100);

  laptopWrap.style.width  = `${lw.toFixed(1)}px`;
  laptopWrap.style.left   = `${(cx - originX).toFixed(1)}px`;
  laptopWrap.style.top    = `${(cy - originY).toFixed(1)}px`;
  laptopWrap.style.transformOrigin = `${originX.toFixed(1)}px ${originY.toFixed(1)}px`;
  laptopWrap.style.transform = `scale(${scale.toFixed(4)})`;
}

// =============================================================
// TARGET SCALE (recomputed every frame from live tuning values)
// =============================================================
function computeTargetScale() {
  const f = fracs();
  const { w: lw, h: lh } = laptopDims();
  const sw = lw * f.sWFrac;
  const sh = lh * f.sHFrac;

  // Where the cream screen rect's CENTER lands in viewport coords at
  // scale 1. Crucially this is NOT viewport center — when laptopY is
  // far from 50% (e.g. 74.5% on mobile), the cream sits well below
  // viewport center, so it needs more scale on the FAR side (the top
  // edge) than on the near side to reach the viewport border.
  const cx = view.w * f.laptopXFrac + lw * (f.sCxFrac - FIXED.cx);
  const cy = view.h * f.laptopYFrac + lh * (f.sCyFrac - FIXED.cy);

  // For the cream to span from its center out to each viewport edge,
  // the cream's half-dimension at full scale must be ≥ the distance
  // from cream-center to that edge. So:
  //   scaleLeft  = 2 * cx        / sw   (so cream's left  reaches x=0)
  //   scaleRight = 2 * (vw - cx) / sw   (so cream's right reaches x=vw)
  //   scaleTop   = 2 * cy        / sh   (so cream's top   reaches y=0)
  //   scaleBot   = 2 * (vh - cy) / sh   (so cream's bot   reaches y=vh)
  // The biggest of these is the scale at which the cream just reaches
  // every viewport edge; the ×1.18 buffer makes sure the rect is
  // SLIGHTLY larger than viewport at lock-complete so there's never a
  // sub-pixel sliver of background visible during the clamp.
  const scaleLeft  = (2 * cx)            / sw;
  const scaleRight = (2 * (view.w - cx)) / sw;
  const scaleTop   = (2 * cy)            / sh;
  const scaleBot   = (2 * (view.h - cy)) / sh;
  return Math.max(scaleLeft, scaleRight, scaleTop, scaleBot) * 1.18;
}
let targetScale = computeTargetScale();

// =============================================================
// scroll progress
// =============================================================
let progress = 0;
let smooth   = 0;
// Set true once the mobile fixed perspective has been written, so the
// tick loop only writes it a single time (see the perspective block).
let perspectivePinned = false;

// Pause the in-laptop Three.js canvas (hero.js checks
// window.__vdtPauseHeroCanvas) while the user is actively scrolling on
// mobile, freeing the GPU for the zoom transform. Resume ~150ms after
// scroll stops. Re-checks innerWidth per event so a desktop user (or
// post-rotation) keeps the canvas live.
let _heroCanvasIdleTimer = null;
window.addEventListener("scroll", function () {
  if (window.innerWidth > 720) {
    // Desktop: re-arm the zoom loop (it parks itself once settled — see
    // the idle gate above tick). The loop's own fast path maintains the
    // WebGL pause flag from fresh geometry, so nothing else is needed here.
    wakeZoomLoop();
    return;
  }
  window.__vdtPauseHeroCanvas = true;
  if (_heroCanvasIdleTimer) clearTimeout(_heroCanvasIdleTimer);
  _heroCanvasIdleTimer = setTimeout(function () {
    // Only resume the WebGL logo spin if the hero is actually on screen. Once
    // the user has scrolled down to Process / Portfolio / Contact, the hero
    // (and its canvas) are off screen — keeping the GPU loop running there was
    // pure waste and added to the scroll jank. Resume only when it's visible.
    var r = hero.getBoundingClientRect();
    var inView = r.bottom > 0 && r.top < view.h;
    window.__vdtPauseHeroCanvas = !inView;
  }, 150);
}, { passive: true });

// Cached at init and refreshed on real resize. Reading rect.height
// LIVE every frame meant Chrome Android's toolbar collapse — which
// changes `vh` mid-scroll — would drift the `total` denominator and
// make `progress` jump even when scroll position barely moved. The
// outer .zoom-hero is now in lvh too, but caching is the belt-and-
// suspenders that ensures the math is fully isolated from per-frame
// viewport jitter.
let heroHeight = hero.getBoundingClientRect().height;
// Cache the hero's top each frame (read ONCE, at the start of the frame in
// computeProgress) so the tick loop can derive heroBottom without a second
// getBoundingClientRect() call AFTER it has written styles — that second
// read was forcing a synchronous reflow every frame (layout thrash), a
// real contributor to the mobile zoom stutter.
let heroTop = 0;

// ── Safe-band fit for "BUILT FOR YOU" ──
// The poster is centred at T.textY% of the viewport height with a 16vw
// font, so its box only fits "naturally" on tall-enough windows. It must
// live in the BAND between the fixed .zoom-header's bottom edge and the
// laptop's visible lid top (a pure header clamp just traded "under the
// nav" for "tagline behind the laptop" on 1900x900 desktops). Within the
// band the block slides to its tuned anchor; when the band is smaller
// than the block, the block additionally scales down to fit (tick()
// multiplies textFitScale into the zoom transform). All inputs are
// resize-stable, so everything is cached here — measured on resize /
// reveal / font-load only, never per frame. offsetHeight is transform-
// independent, so the fit scale never feeds back into the measurement.
const LAPTOP_LID_TOP_FRAC = 0.3926; // first opaque row of laptop.png (lid top)
let heroTextHalf = 0;
let headerSafePx = 76;
let textCenterPx = 0;
let textFitScale = 1;
function measureHeroTextSafety() {
  if (!heroText) return;
  const blockH = heroText.offsetHeight;
  heroTextHalf = blockH / 2;
  const zh = document.getElementById("zoom-header");
  if (zh) {
    const r = zh.getBoundingClientRect();
    // +10px breathing room under the nav links
    if (r.height > 0) headerSafePx = r.bottom + 10;
  }
  // Laptop lid top at rest (scale 1): positionLaptop() puts the image's
  // top edge at laptopCy - lh*FIXED.cy; the lid starts LID_FRAC down it.
  const lh = laptopDims().h;
  const laptopCy = view.h * (T.laptopY / 100);
  const lidTopPx = laptopCy - lh * FIXED.cy + lh * LAPTOP_LID_TOP_FRAC;
  const bandTop = headerSafePx;
  const bandBottom = lidTopPx - 6; // small air above the lid
  const bandH = Math.max(40, bandBottom - bandTop);
  textFitScale = Math.min(1, bandH / Math.max(1, blockH));
  const half = heroTextHalf * textFitScale;
  const lo = bandTop + half;
  const hi = bandBottom - half;
  const desired = view.h * (T.textY / 100);
  textCenterPx = hi >= lo
    ? Math.min(Math.max(desired, lo), hi)
    : (bandTop + bandBottom) / 2;
}
measureHeroTextSafety();
// Web fonts (Anton) change the block's height when they swap in.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(measureHeroTextSafety);
}

function computeProgress() {
  // On mobile the zoom is NOT scroll-driven — `progress` is set explicitly
  // by the tap-to-enter flow (enterMobile). Skip the scroll read entirely.
  if (IS_MOBILE) return;
  const rect = hero.getBoundingClientRect();
  heroTop = rect.top;
  const total = heroHeight - view.h;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  progress = total > 0 ? scrolled / total : 0;
}

// =============================================================
// resize
// =============================================================
function onResize() {
  const newW = window.innerWidth;

  // Gate height refreshes behind width changes — but only on mobile.
  // On Chrome Android and iOS Safari the browser toolbar collapses
  // during scroll and fires resize events with intermediate heights
  // mid-gesture, which would otherwise re-anchor the laptop and make
  // it look like the hero is "filling in" the space the toolbar left
  // (the bug the user spotted). Width stays the same during those,
  // so on ≤720px viewports we only react to width changes (orientation
  // flip, split-screen toggle). Desktop is unconditional: if the user
  // drags the browser's bottom edge on a Mac and changes height only,
  // we DO want the laptop to re-anchor — that's a real layout change.
  if (newW <= 720 && newW === view.w) return;

  view.w = newW;
  view.h = measureStageHeight();
  // Refresh the cached hero height alongside view dimensions. Both
  // are now in lvh / stable units so this only updates when there's
  // a genuine layout change (orientation, browser window resize),
  // not on toolbar transitions.
  heroHeight = hero.getBoundingClientRect().height;
  targetScale = computeTargetScale();
  measureHeroTextSafety();
  // Mobile runs no continuous rAF loop (see tick), so re-render once after a
  // real layout change (orientation flip / split-screen) to re-fit the hero.
  // Desktop's loop may be parked (idle gate), so force one full repaint pass
  // with the freshly measured geometry.
  if (IS_MOBILE) tick();
  else wakeZoomLoop(true);
}
window.addEventListener("resize", onResize, { passive: true });

// =============================================================
// overlay tracking — uses the geometry-derived screenRect()
// =============================================================
function updateOverlay(currentScale) {
  const r = screenRect(currentScale);
  const minX = r.left, minY = r.top;
  const projW = r.width, projH = r.height;

  const topClamp        = Math.max(0, minY);
  const heightAfterClamp = projH - (topClamp - minY);

  // Lock transition — destination grows from screen rect to viewport.
  // Compressed from 0.60-0.92 to 0.55-0.78 so the cream destination
  // fully arrives BEFORE the user perceives "I'm done" — eliminates
  // the late-zoom wobble that came from chrome and bg still settling
  // after the destination already looked locked.
  const lock = smoothstep(0.55, 0.78, smooth);

  const ox = minX     + (0       - minX)             * lock;
  const oy = topClamp + (0       - topClamp)         * lock;
  const ow = projW    + (view.w  - projW)            * lock;
  const oh = heightAfterClamp + (view.h - heightAfterClamp) * lock;

  // INNER SCALE — "contain" mode, multiplied by the live homepage
  // size slider (T.homeS). The homepage offset sliders (T.homeX/Y)
  // shift the inner content around inside the overlay so you can
  // fine-tune where the destination sits within the laptop screen.
  const fitW = projW / view.w;
  const fitH = projH / view.h;
  // Desktop: the hero is landscape and so is the laptop screen, so
  // "contain" (min) fits it edge-to-edge with no letterboxing.
  //
  // Mobile: the hero is PORTRAIT (e.g. 375×812) but the laptop's depicted
  // screen is LANDSCAPE (~223×140). To show the ENTIRE brand composition
  // on the laptop screen — the full "WEBSITES WORTH OWNING" poster words
  // (~19–80% down), the logo and the "Website Design" headline (and the
  // CTAs) — we CONTAIN by height. A tall portrait band can't also fill a
  // wide landscape screen, so this leaves cream margins on the sides; in
  // return nothing is cropped. We fit a tight content band (BAND_TOP..
  // BAND_BOT) rather than the full hero so the empty top/bottom padding
  // isn't wasted and the content renders as large as possible.
  const isMobile = view.w <= 720;
  // Mobile content band (frac of hero). The compact mobile hero (see the
  // @media block in hero.css) centres its whole composition — ghost
  // wordmark + logo + headline + CTAs — between ~25% and ~75%. Framing
  // that tight band (rather than the full hero) lets the contain fit scale
  // the composition up enough that "WEBSITES WORTH OWNING" spans the
  // laptop screen edge-to-edge while everything stays visible. Keep these
  // in sync with hero.css's compact block.
  const BAND_TOP = 0.25, BAND_BOT = 0.75;
  const naturalScale = isMobile
    ? Math.max(0.001, projH / ((BAND_BOT - BAND_TOP) * view.h))
    : Math.max(0.001, Math.min(fitW, fitH));
  const baseScale  = naturalScale + (1 - naturalScale) * lock;
  const innerScale = baseScale * T.homeS;

  const innerOffsetX = (ow - innerScale * view.w) / 2 + T.homeX;
  // Vertical framing of the inner hero inside the cream window.
  //
  // Mobile: centre the content band in the window at rest, then ease that
  // shift back to 0 as the zoom locks so the inner ends perfectly aligned
  // (full hero, top-anchored) at lock-complete — a seamless handoff to
  // .real-landing.
  let innerOffsetY;
  if (isMobile) {
    const BAND_MID = (BAND_TOP + BAND_BOT) / 2;
    const restCenter = projH / 2 - BAND_MID * naturalScale * view.h;
    innerOffsetY = restCenter * (1 - lock);
  } else {
    innerOffsetY = 0 + T.homeY;
  }

  // BEVEL — corner radius of the cream overlay.
  // Sized as a fraction of the CURRENT screen rect width so it
  // matches the laptop's real screen radius at any zoom level.
  // Fades to 0 as the overlay locks to viewport (so the destination
  // doesn't end up with huge rounded corners at full-screen size).
  const bevelPx = (T.bevel / 100) * projW * (1 - lock);

  // TILT — 3D rotation to match the laptop screen's photographed
  // perspective.
  //
  // tiltX is held CONSTANT through the entire lock window (smooth
  // 0 → 0.78) so the cream overlay's perspective matches the
  // laptop's photographed perspective at every scale — the user
  // previously asked us not to change tilt during the zoom because
  // it "messes with the look of the laptop". Past the lock-complete
  // point, the laptop is gone and only the cream destination remains.
  // We then fade tiltX over the short slack window (0.78 → 0.92) so
  // the stage's hero is FLAT by the time it starts sliding up to
  // make room for the .real-landing instance below. Without this
  // fade, the slide-up shows a tilted stage hero next to a flat
  // real-landing hero — they read as two different copies of the
  // homepage.
  //
  // tiltY and rotZ still fade with `lock` — they're typically 0 in
  // practice so the fade is invisible either way.
  const fade     = 1 - lock;
  const tiltFade = 1 - smoothstep(0.78, 0.92, smooth);
  // No 3D tilt on phones: rotateX forces the browser to maintain a 3D
  // rendering context for the stage every frame (an extra render pass and
  // a real source of mobile zoom stutter). Flat on mobile, tilted on
  // desktop where there's GPU headroom.
  const tiltX    = view.w <= 720 ? 0 : T.tiltX * tiltFade;
  const tiltY    = T.tiltY * fade;
  const rotZ     = T.rotZ  * fade;

  // Pin the rotation pivot to the NATURAL screen-rect centre in
  // viewport pixels. As the overlay's box grows during the lock
  // transition (ow → view.w, oh → view.h), the geometric centre
  // of the box moves — but `r.cx, r.cy` stays put on the laptop's
  // screen point in viewport space. Without this, the rotation
  // swings sideways as it fades because the pivot (box centre)
  // was drifting underneath it.
  const originX = r.cx - ox;
  const originY = r.cy - oy;
  overlay.style.transformOrigin = `${originX.toFixed(1)}px ${originY.toFixed(1)}px`;

  // BEZEL — outer black ring around the cream, drawn via box-shadow.
  // Follows the overlay's border-radius automatically, so it stays
  // rounded with the bevel. Scales with the screen rect's current
  // width (so the bezel looks the same physical thickness at any
  // zoom level) and fades to 0 as the overlay locks to viewport.
  //
  // A small blur radius softens the OUTER edge of the bezel — the
  // photographed laptop's screen frame doesn't have a hard pixel
  // edge against the cream, so a few pixels of falloff make the
  // composite read as one continuous surface instead of "sticker
  // pasted on top".
  const bezelPx     = (T.bezel / 100) * projW * (1 - lock);
  // The blurred drop-shadow bezel is repainted every frame; the BLUR is the
  // expensive part on phones. Drop the blur on mobile (sharp bezel, near-
  // identical look at small size) so the per-frame paint is cheap.
  const bezelBlurPx = view.w <= 720 ? 0 : bezelPx * 0.5;

  // Round the overlay's box geometry to whole pixels so both left
  // and right edges fall on identical pixel boundaries. Without
  // this rounding, ox/ow at fractional values cause the browser
  // to anti-alias one side's bezel differently from the other —
  // the visible thickness looks uneven at mid-zoom even though
  // the box-shadow's `spread` is identical on every side.
  const oxR = Math.round(ox);
  const oyR = Math.round(oy);
  const owR = Math.round(ow);
  const ohR = Math.round(oh);

  overlay.style.transform =
    `translate3d(${oxR}px, ${oyR}px, 0) ` +
    `rotateX(${tiltX.toFixed(2)}deg) ` +
    `rotateY(${tiltY.toFixed(2)}deg) ` +
    `rotateZ(${rotZ .toFixed(2)}deg)`;
  overlay.style.width  = `${owR}px`;
  overlay.style.height = `${ohR}px`;
  overlay.style.borderRadius = `${bevelPx.toFixed(1)}px`;
  // Apply T.bezelX as a horizontal box-shadow offset so the user
  // can fine-tune any remaining left/right asymmetry (e.g. from
  // the photo's own perspective bias). Positive X = bezel shifts
  // right, so the LEFT bezel appears THINNER and the right thicker.
  overlay.style.boxShadow =
    `${T.bezelX.toFixed(1)}px 0 ${bezelBlurPx.toFixed(1)}px ${bezelPx.toFixed(1)}px #000`;
  overlayInner.style.transform =
    `translate(${innerOffsetX.toFixed(1)}px, ${innerOffsetY.toFixed(1)}px) ` +
    `scale(${innerScale.toFixed(4)})`;

  // GLARE fades out alongside the overlay reaching viewport. By the
  // time the destination is full-size, the glass-reflection layer is
  // gone — so the page reads as a clean website, not a screenshot.
  screenGlare.style.opacity = fade.toFixed(3);
}

// =============================================================
// per-frame loop
// =============================================================
// ── Desktop idle gate ──
// The loop used to rAF forever on desktop: ~30 inline style writes per
// frame (width/height = layout, box-shadow = paint, perspective = 3D
// context recompute) for the entire session, even parked at the bottom
// of the page — a top contributor to sitewide scroll jank. Now the loop
// PARKS once the smoothing has converged; the passive scroll/resize
// listeners and the tuner sliders re-arm it via wakeZoomLoop(). The
// converged end state is always written before parking, so stopping is
// visually lossless. `needsPaint` forces one full style pass for wakes
// where progress hasn't moved but the output depends on new inputs
// (resize re-measure, tuner slider drag, initial reveal).
let tickRunning = false;
let needsPaint  = true;
function wakeZoomLoop(force) {
  if (force) needsPaint = true;
  if (IS_MOBILE || tickRunning) return;
  tickRunning = true;
  requestAnimationFrame(tick);
}
window.__vdtWakeZoomLoop = wakeZoomLoop;

function tick() {
  tickRunning = true;
  computeProgress();

  // Fast path (desktop, parked): smoothing already converged and nothing
  // requested a repaint — every style below would be rewritten with the
  // exact same value. Keep the two genuinely scroll-dependent cheap bits
  // live (fixed-chrome stuck state, WebGL pause flag), skip the ~30 style
  // writes, and park until the next wake.
  if (!IS_MOBILE && !needsPaint && smooth === progress) {
    const heroBottomFast = heroTop + heroHeight;
    siteChrome.classList.toggle("is-stuck", heroBottomFast < view.h * 0.5);
    window.__vdtPauseHeroCanvas = heroBottomFast <= 0;
    tickRunning = false;
    return;
  }

  // Exponential smoothing on EVERY platform. The previous mobile
  // special-case (smooth = progress) applied each discrete scroll
  // event directly, which on a phone's coarse momentum-scroll events
  // produced visible stutter — the zoom jumped between scroll
  // positions instead of gliding. With the longer mobile runway
  // (200lvh → ~844px of scrub room) the smoothing lag is
  // proportionally tiny, so the "scroll, then catch up" feeling the
  // special-case was trying to avoid no longer applies — that
  // perceived lag was actually the toolbar-re-anchor bug, now fixed
  // by the width-gated resize handler.
  smooth += (progress - smooth) * 0.20;
  if (Math.abs(progress - smooth) < 0.0015) smooth = progress;

  // Clamp the eased visual smoothing at the new lock-complete point
  // (0.78). Beyond that, the bg's scale, the dynamic perspective,
  // and the text drift would have kept growing toward 1 — but since
  // every other late-zoom transition (lock, mask, chrome) now also
  // completes at 0.78, freezing the eased value here keeps the
  // whole composition genuinely fixed. The remaining 22% of scroll
  // is pure slack room before the page transitions to the post-zoom
  // real-landing section.
  const visualSmooth = Math.min(smooth, 0.78);
  // easeInOutCubic on every platform. The mobile ease-out-quad was
  // too aggressive at the start (20% scroll → 36% zoom): combined
  // with the old short runway it made the first flick jump the zoom
  // most of the way instantly, which read as glitchy. The cubic's
  // gentle start + the longer runway give a smooth, scrubbable zoom.
  const e = easeInOutCubic(visualSmooth);

  // keep targetScale in sync with whatever the sliders currently say
  targetScale = computeTargetScale();

  // ── ZOOM PIVOT — the cream screen's viewport position ──
  // Everything below uses this as its scale origin so the scene
  // zooms INTO the laptop's screen, not the laptop's outer anchor
  // (which usually sits above the screen and made the previous
  // zoom feel "too high" centred).
  const _f  = fracs();
  const _ld = laptopDims();
  const _zx = view.w * _f.laptopXFrac + _ld.w * (_f.sCxFrac - FIXED.cx);
  const _zy = view.h * _f.laptopYFrac + _ld.h * (_f.sCyFrac - FIXED.cy);
  const zxFrac = _zx / view.w;
  const zyFrac = _zy / view.h;

  // ── BACKGROUND ── pivots at the screen centre.
  //
  // Was: bgScale = 1 + 2.4 * e. The hardcoded 2.4 was tuned for an
  // older calibration where the laptop only needed ~3.4× scale to
  // have its depicted screen fill the viewport at lock-complete.
  // After re-calibrating laptopW + screen-inset values, the
  // required scale changed but the 2.4 didn't — so the cream
  // overlay was growing to viewport size while the laptop frame
  // around it still hadn't grown enough to contain it.
  //
  // computeTargetScale() ALREADY returns exactly the scale needed
  // (with a small 1.18 buffer so the laptop's depicted screen is
  // slightly bigger than the cream at lock-complete). Use it.
  const bgScale = 1 + (targetScale - 1) * e;
  // bg-image vertical positioning from the tuning panel.
  // Higher T.bgY anchors LOWER in the source photo (shows more bottom).
  // Lower T.bgY anchors HIGHER in the source (shows more top — image content drifts down visually).
  bgImage.style.objectPosition = `center ${T.bgY.toFixed(1)}%`;
  bgImage.style.transformOrigin =
    `${(zxFrac * 100).toFixed(2)}% ${(zyFrac * 100).toFixed(2)}%`;
  bgImage.style.transform = `scale(${bgScale.toFixed(4)})`;

  // ── HERO TEXT ── drifts outward from the SCREEN centre (not the
  // laptop anchor) so the headline travels along the same radial
  // vector the rest of the scene is expanding along.
  const textScale  = bgScale;
  // Resting centre + fit scale come from measureHeroTextSafety(): the
  // block is slid (and if needed shrunk) into the band between the fixed
  // header and the laptop's lid. The effective fraction feeds the drift
  // math so the zoom vector stays anchored to where the text actually sits.
  const dxFraction = 0.5                     - zxFrac;   // text's natural x = 50%
  const dyFraction = (textCenterPx / view.h) - zyFrac;
  const textDxPx   = (textScale - 1) * dxFraction * view.w;
  const textDyPx   = (textScale - 1) * dyFraction * view.h;
  // 0.75 = 75% opacity at rest
  const HERO_TEXT_REST_OPACITY = 0.75;
  const textOpacity = HERO_TEXT_REST_OPACITY * (1 - smoothstep(0.05, 0.45, smooth));
  heroText.style.top       = `${textCenterPx.toFixed(1)}px`;
  heroText.style.opacity   = String(textOpacity);
  heroText.style.transform =
    `translate(calc(-50% + ${textDxPx.toFixed(1)}px), ` +
              `calc(-50% + ${textDyPx.toFixed(1)}px)) ` +
    `scale(${(textScale * textFitScale).toFixed(3)})`;

  // ── LAPTOP / CREAM OVERLAY ──
  // Locked to bgScale so the cream destination grows at exactly
  // the same pace as the baked laptop in the background photo.
  // Without this, the cream and the baked laptop scale at
  // slightly different rates (targetScale vs bgScale) and the
  // cream visually drifts outside the laptop screen as the user
  // zooms in.
  const laptopScale = bgScale;

  // Dynamic perspective — see note. CSS perspective is a FIXED
  // distance from the viewer to the rotation plane; as the cream
  // overlay's rotateX(tiltX) element grows to fill the viewport,
  // its size approaches that fixed perspective distance, causing
  // the foreshortening to compress non-linearly relative to its
  // size. The bg laptop, being a 2D photograph, scales linearly
  // — so the two perspectives drift apart as zoom progresses.
  //
  // Fix: scale the perspective distance proportionally to the
  // laptop scale. The cream's foreshortening then scales linearly
  // with size (matching the photo's behaviour) and the cream's
  // edges keep aligning with the laptop screen at every scale.
  //
  // PERF: rewriting `perspective` every frame forces the browser to
  // recompute the entire 3D rendering context for .zoom-stage and all
  // its descendants — one of the heavier per-frame costs and a real
  // contributor to the mid-zoom frame drops on phones. On mobile we
  // set a single large fixed perspective once. At 4000px the tilt is
  // nearly flat (barely perceptible on a small screen) but the
  // per-frame 3D recompute is eliminated. Desktop keeps the dynamic
  // perspective for the precise cream/laptop foreshortening match.
  if (view.w > 720) {
    stage.style.perspective = `${(1500 * laptopScale).toFixed(0)}px`;
  } else if (!perspectivePinned) {
    stage.style.perspective = "4000px";
    perspectivePinned = true;
  }

  positionLaptop(laptopScale);
  updateOverlay(laptopScale);

  // ── CROSS-FADE ── image stack fades as the cream overlay locks
  // Mask + canvas fade — synced with the lock window above so the
  // bg image / laptop overlay cross-fade out at exactly the rate the
  // cream destination grows in.
  const maskAmt = smoothstep(0.55, 0.78, smooth);
  zoomMask.style.opacity   = String(maskAmt);
  bgImage.style.opacity    = String(1 - maskAmt * 0.7);
  laptopWrap.style.opacity = String(1 - maskAmt);
  heroText.style.opacity   = String(textOpacity * (1 - maskAmt));

  // ── TRANSPARENT PRE-ZOOM HEADER ──
  // Fades out over the FIRST half of the cross-fade window so it's
  // entirely gone by the time the fixed site chrome starts coming
  // in. Sequential, not simultaneous, per the user's "fades before
  // the new header comes in" request.
  const zhFade = 1 - smoothstep(0.50, 0.68, smooth);
  zoomHeader.style.opacity = String(zhFade);
  zoomHeader.classList.toggle("is-gone", zhFade <= 0.001);

  // ── FIXED SITE CHROME ──
  // Chrome fade-in — moved earlier (was 0.72-0.90) so the header is
  // FULLY VISIBLE before the lock completes, not after. With the old
  // timing, the destination already looked arrived around smooth=0.78
  // but the chrome was still inching in until 0.90 — that lingering
  // chrome fade was the "extra zoom in and out" the user perceived.
  // Now chrome is done by smooth=0.74, while the lock is still
  // finalising until 0.78, so the chrome lands AS the cream arrives
  // rather than after it.
  const chromeAmt = smoothstep(0.58, 0.74, smooth);
  siteChrome.style.opacity = String(chromeAmt);
  siteChrome.classList.toggle("is-visible", chromeAmt > 0.5);

  // Derive heroBottom from the cached top (set in computeProgress at the
  // start of this frame) + cached height — NO new getBoundingClientRect()
  // here, so we don't force a reflow after the frame's style writes.
  const heroBottom = heroTop + heroHeight;
  siteChrome.classList.toggle("is-stuck", heroBottom < view.h * 0.5);

  // PREVIEW vs FULL-SCREEN state. While the hero is still the small in-laptop
  // preview (not yet locked to the viewport) it's "is-preview"; once locked
  // it's the real full-screen hero. CSS uses this (mobile only) to let the
  // ghost wordmark bleed in the preview but FIT the viewport at full screen
  // so nothing gets cut off sideways.
  overlay.classList.toggle("is-preview", smooth < 0.85);

  // Scheduling. Mobile: no loop at all — tick() is called explicitly at the
  // few moments it matters (revealHero, enterMobile phase 2, onResize).
  // Desktop: keep looping only while the smoothing is still converging;
  // once settled, park (see the idle-gate note above tick) and let
  // wakeZoomLoop re-arm on the next scroll/resize/tuner input. Also pause
  // the WebGL logo spin whenever the hero scene is fully above the
  // viewport — it used to render at 60fps for the whole session even at
  // the bottom of the page (the pause flag was only ever driven by the
  // mobile scroll handler).
  if (!IS_MOBILE) {
    window.__vdtPauseHeroCanvas = heroBottom <= 0;
    needsPaint = false;
    if (smooth === progress) {
      tickRunning = false;
    } else {
      requestAnimationFrame(tick);
    }
  }
}

// ---------- easing ----------
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

// Wait for BOTH the background photo and the laptop PNG to finish
// downloading before we kick off the RAF loop and fade out the
// loading overlay. The old gate only awaited the laptop image, so on
// slow mobile networks the loop could start while the bg-image was
// still pending — the user saw a transparent zoom-stage over the
// body-cream with a laptop floating in nothing. Now the loading
// overlay (#zoom-loading in page.tsx, styled in style.css) covers
// the area in dark photo-matching color until both are ready.
function loadImage(img) {
  return new Promise(function (resolve) {
    if (!img) { resolve(); return; }
    // Always attach the listeners FIRST so we never miss an event due
    // to picture/source weirdness on iOS or a race between script
    // execution and a cached image. Then check complete — if it's
    // already done we resolve immediately, otherwise the listeners
    // will catch the eventual load/error.
    img.addEventListener("load",  function () { resolve(); }, { once: true });
    img.addEventListener("error", function () { resolve(); }, { once: true });
    if (img.complete && img.naturalWidth > 0) { resolve(); return; }
    // Safety net: if the image somehow neither completes nor fires an
    // event in 5 seconds, force-resolve so the loading overlay can't
    // hang forever. Better to show a partially-painted hero than a
    // dark overlay with a pulsing logo indefinitely.
    setTimeout(resolve, 5000);
  });
}

function revealHero() {
  const loadingEl = document.querySelector(".zoom-loading");
  if (loadingEl) loadingEl.classList.add("is-ready");
  // Re-cache geometry now that the bg-image's intrinsic size is known
  // (its natural dimensions can affect object-fit cover layout).
  heroHeight = hero.getBoundingClientRect().height;
  targetScale = computeTargetScale();
  measureHeroTextSafety();
  tick();
  if (IS_MOBILE) setupMobileEnter();
}

// ============================================================
// MOBILE: tap-to-enter (replaces the scroll-driven zoom)
//
// The page loads frozen on the intro (progress 0) with scrolling locked,
// so the user can't scroll past before entering. Tapping CLICK TO ENTER
// runs a cheap GPU scale+fade of the whole laptop scene, then snaps the
// engine straight to its locked full-screen-hero end state (no heavy
// per-frame morph frames) and unlocks scrolling for the rest of the page.
// ============================================================
let mobileEntered = false;
function enterMobile() {
  if (mobileEntered) return;
  mobileEntered = true;

  const btn = document.getElementById("mobile-enter");
  if (btn) btn.classList.add("is-gone");

  // Pause the WebGL logo spin for the duration of the enter zoom so it
  // doesn't compete with the (cheap, composited) scale+fade. It resumes in
  // phase 2 once we're in the full-screen hero.
  window.__vdtPauseHeroCanvas = true;

  // Phase 1 — cheap composited zoom + fade of the laptop scene. The class
  // sets a scale()+opacity transition (see style.css). The engine keeps
  // rendering its children inside, but the whole stage is one GPU layer.
  stage.classList.add("is-entering");

  // Phase 2 — once the fade-out finishes, jump the engine straight to the
  // locked end state while the stage is invisible, reset its transform,
  // then fade the full-screen hero back in. Snapping (not easing) avoids
  // the expensive morph frames entirely.
  window.setTimeout(function () {
    progress = 1;
    smooth = 1;
    stage.classList.remove("is-entering");
    stage.style.transition = "none";
    stage.style.transform = "none";
    stage.style.opacity = "0";
    // Force a reflow so the "none" transition + opacity:0 commit before we
    // start the fade-in (otherwise the browser batches them and skips it).
    void stage.offsetWidth;
    stage.style.transition = "opacity 0.45s ease";
    stage.style.opacity = "1";
    // Unlock scrolling so portfolio / testimonials / contact are reachable,
    // and remove the non-passive touch blocker so it doesn't slow scrolling.
    document.documentElement.classList.remove("vdt-mobile-intro");
    document.removeEventListener("touchmove", blockIntroScroll, { passive: false });
    // Resume the logo spin now that the enter zoom is done.
    window.__vdtPauseHeroCanvas = false;
    // The mobile rAF loop is off (see tick), so render the locked full-screen
    // hero exactly once here. smooth was set to 1 above, so this single frame
    // writes the final state; nothing changes after, so no loop is needed.
    tick();
  }, 820);
}

// Non-passive touchmove blocker — the most reliable cross-browser scroll
// lock (CSS alone is flaky on iOS). Swallows the gesture while the intro
// lock class is present. Stored so we can REMOVE it after entering: a
// lingering non-passive touchmove listener would otherwise slow down the
// post-enter scrolling.
function blockIntroScroll(e) {
  if (document.documentElement.classList.contains("vdt-mobile-intro")) {
    e.preventDefault();
  }
}

function setupMobileEnter() {
  // Lock scrolling and freeze on the intro.
  document.documentElement.classList.add("vdt-mobile-intro");
  document.addEventListener("touchmove", blockIntroScroll, { passive: false });
  progress = 0;
  smooth = 0;
  window.__vdtEnterMobile = enterMobile;
  const btn = document.getElementById("mobile-enter");
  if (btn) {
    btn.classList.remove("is-gone");
    btn.addEventListener("click", enterMobile);
  }
}

Promise.all([loadImage(bgImage), loadImage(laptopImage)])
  .then(revealHero)
  .catch(function () {
    // Defensive — even on an unexpected rejection, get the hero on
    // screen rather than leaving the loading overlay stuck.
    revealHero();
  });

// Extra belt-and-suspenders for iOS — if the overlay is somehow still
// visible 8s after script start, force it away. This bypasses anything
// upstream that might have silently failed.
setTimeout(function () {
  const loadingEl = document.querySelector(".zoom-loading");
  if (loadingEl && !loadingEl.classList.contains("is-ready")) {
    revealHero();
  }
}, 8000);

// =============================================================
// LIVE TUNING PANEL WIRING
// Each row of the panel binds one slider to one T.* value. The
// render loop reads from T every frame, so any drag is reflected
// immediately. "Copy values" puts the current snapshot on the
// clipboard formatted as JS constants ready to paste back into
// DEFAULTS to lock them in.
// =============================================================
(function bindTuningPanel() {
  // Production guard — when the dev-only tuning panel <aside id="cp">
  // isn't in the DOM (i.e. the homepage), skip the entire panel wiring.
  // Every getElementById below would otherwise return null and throw.
  if (!document.getElementById("cp")) return;

  // `dec` = decimal places shown in the number-input box, also the
  // implicit step precision when the user types. `step` controls the
  // slider's snap when dragged or arrowed.
  const bindings = [
    { id: "by",  key: "bgY",     dec: 1, step: 0.5  },
    { id: "lx",  key: "laptopX", dec: 1, step: 0.1  },
    { id: "ly",  key: "laptopY", dec: 1, step: 0.1  },
    { id: "lw",  key: "laptopW", dec: 1, step: 0.1  },
    { id: "ty",  key: "textY",   dec: 1, step: 0.1  },
    { id: "sl",  key: "screenL", dec: 1, step: 0.1  },
    { id: "sr",  key: "screenR", dec: 1, step: 0.1  },
    { id: "st",  key: "screenT", dec: 1, step: 0.1  },
    { id: "sb",  key: "screenB", dec: 1, step: 0.1  },
    { id: "bv",  key: "bevel",   dec: 1, step: 0.1  },
    { id: "bz",  key: "bezel",   dec: 1, step: 0.1  },
    { id: "bzx", key: "bezelX",  dec: 1, step: 0.1  },
    { id: "tx",  key: "tiltX",   dec: 1, step: 0.1  },
    { id: "ty2", key: "tiltY",   dec: 1, step: 0.1  },
    { id: "rz",  key: "rotZ",    dec: 2, step: 0.05 },
    { id: "hx",  key: "homeX",   dec: 0, step: 1    },
    { id: "hy",  key: "homeY",   dec: 0, step: 1    },
    { id: "hs",  key: "homeS",   dec: 2, step: 0.01 },
  ];

  const out = document.getElementById("cp-out");

  function refreshOutput() {
    out.textContent =
      "bgY:      " + T.bgY    .toFixed(1) + "  // %\n" +
      "laptopX:  " + T.laptopX.toFixed(1) + "  // %\n" +
      "laptopY:  " + T.laptopY.toFixed(1) + "  // %\n" +
      "laptopW:  " + T.laptopW.toFixed(1) + "  // %\n" +
      "textY:    " + T.textY  .toFixed(1) + "  // %\n" +
      "screenL:  " + T.screenL.toFixed(1) + "  // %\n" +
      "screenR:  " + T.screenR.toFixed(1) + "  // %\n" +
      "screenT:  " + T.screenT.toFixed(1) + "  // %\n" +
      "screenB:  " + T.screenB.toFixed(1) + "  // %\n" +
      "bevel:    " + T.bevel  .toFixed(1) + "  // %\n" +
      "bezel:    " + T.bezel  .toFixed(1) + "  // %\n" +
      "bezelX:   " + T.bezelX .toFixed(1) + "  // px\n" +
      "tiltX:    " + T.tiltX  .toFixed(1) + "  // °\n" +
      "tiltY:    " + T.tiltY  .toFixed(1) + "  // °\n" +
      "rotZ:     " + T.rotZ   .toFixed(2) + "  // °\n" +
      "homeX:    " + T.homeX  .toFixed(0) + "    // px\n" +
      "homeY:    " + T.homeY  .toFixed(0) + "    // px\n" +
      "homeS:    " + T.homeS  .toFixed(2);
  }

  bindings.forEach(({ id, key, dec }) => {
    const slider = document.getElementById("t-" + id);
    const num    = document.getElementById("t-" + id + "-v");
    slider.value = T[key];
    num.value    = T[key].toFixed(dec);

    // slider → state + number. wakeZoomLoop(true) forces a repaint pass —
    // the desktop loop parks when idle, so T changes wouldn't render live
    // otherwise.
    slider.addEventListener("input", () => {
      T[key] = parseFloat(slider.value);
      num.value = T[key].toFixed(dec);
      refreshOutput();
      wakeZoomLoop(true);
    });

    // number → state + slider. Listen on `input` so each keystroke
    // updates live; `change` would only fire on blur/Enter.
    num.addEventListener("input", () => {
      const v = parseFloat(num.value);
      if (!Number.isNaN(v)) {
        T[key] = v;
        slider.value = v;
        refreshOutput();
        wakeZoomLoop(true);
      }
    });
  });

  refreshOutput();

  // collapse / expand
  document.getElementById("cp-collapse").addEventListener("click", () => {
    const cp = document.getElementById("cp");
    cp.classList.toggle("is-collapsed");
    document.getElementById("cp-collapse").textContent =
      cp.classList.contains("is-collapsed") ? "+" : "−";
  });

  // reset
  document.getElementById("cp-reset").addEventListener("click", () => {
    Object.assign(T, DEFAULTS);
    bindings.forEach(({ id, key, dec }) => {
      const slider = document.getElementById("t-" + id);
      const num    = document.getElementById("t-" + id + "-v");
      slider.value = T[key];
      num.value    = T[key].toFixed(dec);
    });
    refreshOutput();
  });

  // copy to clipboard
  document.getElementById("cp-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(out.textContent);
      const btn = document.getElementById("cp-copy");
      const orig = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(() => { btn.textContent = orig; }, 1200);
    } catch {
      // clipboard blocked — leave the textarea as the manual fallback
    }
  });
})();
