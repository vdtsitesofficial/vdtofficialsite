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
const overlayInner  = overlay.querySelector(".screen-inner");
const zoomMask      = document.getElementById("zoom-mask");
const hero          = document.querySelector(".zoom-hero");
const siteChrome    = document.getElementById("site-chrome");
const zoomHeader    = document.getElementById("zoom-header");
const screenGlare   = document.getElementById("screen-glare");

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
  // When the mobile tuner panel is active (?tune in URL), the user is
  // manually dragging T.laptopY / W / X via sliders. Any resize event
  // (e.g. iOS Safari's URL bar collapsing on scroll) would otherwise
  // wipe their values back to the defaults — bail out so manual tuning
  // sticks.
  if (typeof window !== "undefined" && window.__vdtTunerActive) return;
  const isMobile = window.innerWidth <= 720;
  if (isMobile) {
    // Mobile values dialed in via the live tuner.
    T.laptopY = 74.5;
    T.laptopW = 180.0;
    T.laptopX = 50.5;
    // Text drops 10pp lower than the desktop default so "BUILT FOR YOU"
    // clears the laptop's top edge on a phone.
    T.textY   = DEFAULTS.textY + 10;
  } else {
    T.laptopY = DEFAULTS.laptopY;
    T.laptopW = DEFAULTS.laptopW;
    T.laptopX = DEFAULTS.laptopX;
    T.textY   = DEFAULTS.textY;
  }
}
applyViewportTuning();
window.addEventListener("resize", applyViewportTuning, { passive: true });

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
  const sT = T.screenT / 100;
  const sB = T.screenB / 100;
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

function laptopDims() {
  const w = view.w * (T.laptopW / 100);
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

// Cached at init and refreshed on real resize. Reading rect.height
// LIVE every frame meant Chrome Android's toolbar collapse — which
// changes `vh` mid-scroll — would drift the `total` denominator and
// make `progress` jump even when scroll position barely moved. The
// outer .zoom-hero is now in lvh too, but caching is the belt-and-
// suspenders that ensures the math is fully isolated from per-frame
// viewport jitter.
let heroHeight = hero.getBoundingClientRect().height;

function computeProgress() {
  const rect = hero.getBoundingClientRect();
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
  const naturalScale = Math.max(0.001, Math.min(fitW, fitH));
  const baseScale  = naturalScale + (1 - naturalScale) * lock;
  const innerScale = baseScale * T.homeS;

  const innerOffsetX = (ow - innerScale * view.w) / 2 + T.homeX;
  const innerOffsetY = 0                              + T.homeY;

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
  const tiltX    = T.tiltX * tiltFade;
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
  const bezelBlurPx = bezelPx * 0.5;

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
function tick() {
  computeProgress();

  // Mobile: snap smooth straight to progress so there's no catch-up
  // lag. Touch scrolling already has natural momentum from iOS — the
  // exponential easing on top of that made every scroll feel like
  // "scroll happens, then zoom plays catch-up 80ms later." Desktop
  // wheel scrolling is jittery enough that the smoothing still helps
  // there, so keep the original behavior above 720px.
  if (window.innerWidth <= 720) {
    smooth = progress;
  } else {
    smooth += (progress - smooth) * 0.20;
    // Snap to target when within a barely-perceptible threshold so
    // the exponential smoothing doesn't asymptote forever after the
    // user has stopped scrolling.
    if (Math.abs(progress - smooth) < 0.0015) smooth = progress;
  }

  // Clamp the eased visual smoothing at the new lock-complete point
  // (0.78). Beyond that, the bg's scale, the dynamic perspective,
  // and the text drift would have kept growing toward 1 — but since
  // every other late-zoom transition (lock, mask, chrome) now also
  // completes at 0.78, freezing the eased value here keeps the
  // whole composition genuinely fixed. The remaining 22% of scroll
  // is pure slack room before the page transitions to the post-zoom
  // real-landing section.
  const visualSmooth = Math.min(smooth, 0.78);
  // Mobile uses ease-out-quad (strong start, gentle finish) so the
  // zoom takes off the moment the user starts scrolling — at 20%
  // scroll, visual is at 36% (vs 6.4% with cubic). Desktop keeps
  // easeInOutCubic (slow start, slow end) — it reads more
  // "cinematic" with a wheel and there's no perceived lag at the
  // start because wheel deltas tend to be larger per tick.
  const e = window.innerWidth <= 720
    ? (1 - (1 - visualSmooth) * (1 - visualSmooth))  // ease-out-quad
    : easeInOutCubic(visualSmooth);

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
  const dxFraction = 0.5            - zxFrac;     // text's natural x = 50%
  const dyFraction = (T.textY / 100) - zyFrac;
  const textDxPx   = (textScale - 1) * dxFraction * view.w;
  const textDyPx   = (textScale - 1) * dyFraction * view.h;
  // 0.75 = 75% opacity at rest
  const HERO_TEXT_REST_OPACITY = 0.75;
  const textOpacity = HERO_TEXT_REST_OPACITY * (1 - smoothstep(0.05, 0.45, smooth));
  heroText.style.top       = `${T.textY.toFixed(1)}%`;
  heroText.style.opacity   = String(textOpacity);
  heroText.style.transform =
    `translate(calc(-50% + ${textDxPx.toFixed(1)}px), ` +
              `calc(-50% + ${textDyPx.toFixed(1)}px)) ` +
    `scale(${textScale.toFixed(3)})`;

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
  stage.style.perspective = `${(1500 * laptopScale).toFixed(0)}px`;

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

  const heroBottom = hero.getBoundingClientRect().bottom;
  siteChrome.classList.toggle("is-stuck", heroBottom < view.h * 0.5);

  requestAnimationFrame(tick);
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
    if (img.complete && img.naturalWidth > 0) { resolve(); return; }
    img.addEventListener("load",  resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

Promise.all([loadImage(bgImage), loadImage(laptopImage)]).then(function () {
  // Reveal the hero.
  const loadingEl = document.querySelector(".zoom-loading");
  if (loadingEl) loadingEl.classList.add("is-ready");
  // Re-cache geometry now that the bg-image's intrinsic size is known
  // (its natural dimensions can affect object-fit cover layout).
  heroHeight = hero.getBoundingClientRect().height;
  targetScale = computeTargetScale();
  tick();
});

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

    // slider → state + number
    slider.addEventListener("input", () => {
      T[key] = parseFloat(slider.value);
      num.value = T[key].toFixed(dec);
      refreshOutput();
    });

    // number → state + slider. Listen on `input` so each keystroke
    // updates live; `change` would only fire on blur/Enter.
    num.addEventListener("input", () => {
      const v = parseFloat(num.value);
      if (!Number.isNaN(v)) {
        T[key] = v;
        slider.value = v;
        refreshOutput();
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
