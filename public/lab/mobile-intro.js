// =============================================================
// VDT — Mobile premium "Tap anywhere to enter" intro (production)
//
// Drops on top of the existing mobile intro and UPGRADES it from a
// basic scale+fade to the premium cream-screen takeover. It is
// purely additive: it reuses production's proven enter flow.
//
//   - Production's main.js (setupMobileEnter) already locks scroll on
//     load and exposes window.__vdtEnterMobile(), which snaps the
//     hero to its locked full-screen state and unlocks scrolling.
//   - This overlay just plays the premium animation on top, calls
//     __vdtEnterMobile() on tap so the real hero reveals underneath,
//     then fades itself out.
//
// Runs ONLY on mobile (≤720px). No-op on desktop.
// =============================================================
(function () {
  if (!window.matchMedia("(max-width: 720px)").matches) return;
  const intro = document.getElementById("m-intro");
  if (!intro) return;

  const laptop   = intro.querySelector(".m-laptop");
  const bloom    = intro.querySelector(".m-bloom");
  const taplayer = intro.querySelector(".m-taplayer");
  if (!laptop || !taplayer) return;

  // Session memory. The intro is a first-impression piece, not a
  // turnstile — a visitor who taps through, opens a case study and hits
  // the logo to come home should not be gated a second time.
  const SEEN_KEY = "vdtIntroSeen";
  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch (e) { /* private mode */ }
  }
  function hasSeen() {
    try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch (e) { return false; }
  }

  // Read the exit timings straight off the element so they can never
  // drift from the CSS durations. See the "exit choreography" block in
  // mobile-intro.css.
  // 0 is a legitimate value (the reduced-motion block sets these), so only
  // a missing/unparseable/negative property falls back.
  function cssMs(name, fallback) {
    const raw = getComputedStyle(intro).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    if (!isFinite(n) || n < 0) return fallback;
    return raw.endsWith("ms") ? n : n * 1000;
  }

  // main.js only assigns window.__vdtEnterMobile inside setupMobileEnter(),
  // which runs after BOTH hero images have loaded — so on the skip path it
  // usually does not exist yet. Poll on rAF (not a 50ms interval) so the
  // "Click to Enter" button main.js un-hides never gets a chance to paint.
  function callEnterMobile() {
    try {
      if (typeof window.__vdtEnterMobile === "function") {
        window.__vdtEnterMobile();
        return true;
      }
    } catch (e) { /* non-fatal — overlay still reveals the page below */ }
    return false;
  }
  // Calls done() once the handoff has actually happened, or once we give
  // up. done() MUST still run on the give-up path: if main.js never came
  // up we would otherwise leave the visitor staring at a frozen intro.
  function callEnterMobileWhenReady(done) {
    function finish() { if (typeof done === "function") done(); }
    if (callEnterMobile()) { finish(); return; }
    // Budget in FRAMES, not wall-clock: rAF is paused while the tab is
    // hidden, so a wall-clock deadline would quietly expire in a
    // background tab and hand off to nothing. ~600 frames is roughly 10s
    // of visible time, comfortably past main.js's own 8s failsafe.
    let framesLeft = 600;
    (function poll() {
      if (callEnterMobile()) { finish(); return; }
      if (--framesLeft > 0) { requestAnimationFrame(poll); return; }
      finish();
    })();
  }

  // Same screen calibration as the desktop zoom + the prototype.
  const SCREEN_INSET = { left: 0.335, right: 0.335, top: 0.401, bottom: 0.288 };

  function measureScreen() {
    const iRect = intro.getBoundingClientRect();
    const lRect = laptop.getBoundingClientRect();
    if (!iRect.width || !lRect.width || !lRect.height) return false;

    const sLeft   = (lRect.left - iRect.left) + lRect.width  * SCREEN_INSET.left;
    const sTop    = (lRect.top  - iRect.top)  + lRect.height * SCREEN_INSET.top;
    const sRight  = iRect.width  - ((lRect.left - iRect.left) + lRect.width  * (1 - SCREEN_INSET.right));
    const sBottom = iRect.height - ((lRect.top  - iRect.top)  + lRect.height * (1 - SCREEN_INSET.bottom));

    if (sLeft + sRight >= iRect.width - 4)  return false;
    if (sTop + sBottom >= iRect.height - 4) return false;
    if (sTop < -2 || sLeft < -2)            return false;

    intro.style.setProperty("--clip-top",    sTop.toFixed(1) + "px");
    intro.style.setProperty("--clip-right",  sRight.toFixed(1) + "px");
    intro.style.setProperty("--clip-bottom", sBottom.toFixed(1) + "px");
    intro.style.setProperty("--clip-left",   sLeft.toFixed(1) + "px");
    intro.style.setProperty("--screen-w",    (iRect.width - sLeft - sRight).toFixed(1) + "px");
    intro.style.setProperty("--clip-radius", (iRect.width * 0.022).toFixed(1) + "px");
    return true;
  }

  function measureUntilValid(tries) {
    if (measureScreen() || tries <= 0) return;
    requestAnimationFrame(function () { measureUntilValid(tries - 1); });
  }

  function placeBloom(x, y) {
    const r = intro.getBoundingClientRect();
    bloom.style.left = (typeof x === "number" ? x - r.left : r.width / 2) + "px";
    bloom.style.top  = (typeof y === "number" ? y - r.top  : r.height / 2) + "px";
  }

  let entered = false;
  let exitScheduled = false;

  // Fade the overlay out and drop it from the layout. Only ever called
  // AFTER the handoff to main.js has happened (or been given up on).
  function scheduleExit() {
    if (exitScheduled) return;
    exitScheduled = true;
    setTimeout(function () { intro.dataset.state = "done"; }, cssMs("--t-done-at", 460));
    setTimeout(function () { intro.style.display = "none"; }, cssMs("--t-remove-at", 720));
  }

  function enter(x, y) {
    if (entered) return;
    entered = true;
    // Tell main.js the visitor is through, BEFORE anything async. If
    // setupMobileEnter() has not run yet it will see this and skip
    // installing the scroll lock entirely, which is what makes the
    // give-up path below safe: no lock can arrive after we are gone.
    window.__vdtIntroPassed = true;
    markSeen();
    measureScreen();
    placeBloom(x, y);

    // Start the takeover immediately so the tap/swipe feels instant.
    intro.dataset.state = "entering";

    // Kick production's real enter flow underneath the overlay: it snaps
    // the hero to its locked full-screen state and unlocks the page scroll.
    //
    // This MUST wait for __vdtEnterMobile rather than firing once and
    // hoping. main.js only defines it inside setupMobileEnter(), which runs
    // after both hero images load, so on a slow connection a visitor can
    // easily tap or swipe before it exists. If we dropped the overlay
    // anyway, setupMobileEnter() would then re-lock scrolling and expose
    // only #mobile-enter, which is display:none on mobile — a page with no
    // way in. So the exit is scheduled off the handoff, not off the tap.
    callEnterMobileWhenReady(scheduleExit);
  }

  // Already seen this session: never show the overlay at all. Hide it
  // before the first paint and hand straight off to the real hero.
  if (hasSeen()) {
    entered = true;
    window.__vdtIntroPassed = true;
    intro.style.transition = "none";
    intro.style.display = "none";
    intro.dataset.state = "done";
    callEnterMobileWhenReady();
    return;
  }

  taplayer.addEventListener("pointerdown", function (e) { enter(e.clientX, e.clientY); }, { passive: true });
  taplayer.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
  });

  // ── Swipe / scroll also dismisses ──────────────────────────────────
  // Swiping is what people actually do on a page like this, and until now
  // it did nothing: main.js's non-passive touchmove blocker swallows the
  // gesture while the intro lock class is on, so the page did not move and
  // the overlay did not respond. That dead end reads as a broken page.
  // preventDefault on the blocker does not stop propagation, so these
  // listeners still see the gesture.
  let startX = 0, startY = 0, tracking = false;
  const SWIPE_PX = 10;

  intro.addEventListener("touchstart", function (e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    startX = t.clientX;
    startY = t.clientY;
    tracking = true;
  }, { passive: true });

  intro.addEventListener("touchmove", function (e) {
    if (!tracking) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    // Either direction: an upward swipe (scroll down) and a downward one
    // both mean "I want to move past this".
    if (Math.abs(t.clientY - startY) > SWIPE_PX) {
      tracking = false;
      enter(startX, startY);
    }
  }, { passive: true });

  intro.addEventListener("touchend", function () { tracking = false; }, { passive: true });

  // Trackpad / mouse wheel, for a narrow desktop window sitting under the
  // 720px breakpoint.
  intro.addEventListener("wheel", function () { enter(); }, { passive: true });

  window.addEventListener("resize", function () { if (!entered) measureUntilValid(20); }, { passive: true });
  if (window.ResizeObserver) {
    new ResizeObserver(function () { if (!entered) measureUntilValid(10); }).observe(intro);
  }

  const img = laptop.querySelector("img");
  if (img && img.complete) measureUntilValid(30);
  else if (img) img.addEventListener("load", function () { measureUntilValid(30); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measureUntilValid(30); });
  measureUntilValid(30);
})();
