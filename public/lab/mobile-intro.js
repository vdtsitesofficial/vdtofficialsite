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
  function enter(x, y) {
    if (entered) return;
    entered = true;
    measureScreen();
    placeBloom(x, y);

    // Kick production's real enter flow underneath the overlay: it
    // snaps the hero to its locked full-screen state and unlocks the
    // page scroll. We then play our premium takeover on top and fade.
    try {
      if (typeof window.__vdtEnterMobile === "function") window.__vdtEnterMobile();
    } catch (e) { /* non-fatal — overlay still reveals the page below */ }

    intro.dataset.state = "entering";

    // Once the cream takeover has covered the viewport (~900ms) start
    // fading the overlay out to reveal the now-locked hero beneath.
    setTimeout(function () { intro.dataset.state = "done"; }, 900);
    // Take it out of the layout after the fade completes.
    setTimeout(function () { intro.style.display = "none"; }, 1600);
  }

  taplayer.addEventListener("pointerdown", function (e) { enter(e.clientX, e.clientY); }, { passive: true });
  taplayer.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
  });

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
