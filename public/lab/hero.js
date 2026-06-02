// =============================================================
// VDT Zoomed Hero — drop-in JS module.
//
// Usage in host page (laptop-zoom or wherever):
//
//   <script type="importmap">{
//     "imports": {
//       "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
//       "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
//       "polygon-clipping": "https://esm.sh/polygon-clipping@0.15.3"
//     }
//   }</script>
//   <link rel="stylesheet" href="./hero.css">
//   ... drop the hero-fragment.html markup inside your zoom target ...
//   <script type="module">
//     import { initVdtHero } from './hero.js';
//     initVdtHero({ root: document.querySelector('.vdt-hero') });
//   </script>
//
// API:
//   initVdtHero({
//     root,                     // HTMLElement, the .vdt-hero container (required)
//     canvas,                   // optional override; defaults to root.querySelector('.vdt-hero__canvas')
//     cursor,                   // optional override; defaults to root.querySelector('.vdt-hero__cursor')
//     particleHost,             // optional override; defaults to root
//     enableCursor,             // bool, default true. Set false when nested in a
//                               // smaller container so the cursor doesn't drift outside
//     enableAmbientParticles,   // bool, default true
//     enableClickParticles,     // bool, default true
//     particleSpawnIntervalMs,  // number, default 420
//   })
//
// Returns: cleanup() function — call to dispose listeners and Three.js resources.
// =============================================================

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import polygonClipping from "polygon-clipping";

export function initVdtHero(opts = {}) {
  const root = opts.root || document.querySelector('.vdt-hero');
  if (!root) throw new Error('initVdtHero: missing root element (.vdt-hero)');

  const canvas       = opts.canvas       || root.querySelector('.vdt-hero__canvas');
  const cursor       = opts.cursor       || root.querySelector('.vdt-hero__cursor');
  const particleHost = opts.particleHost || root;
  const enableCursor            = opts.enableCursor !== false;
  const enableAmbientParticles  = opts.enableAmbientParticles !== false;
  const enableClickParticles    = opts.enableClickParticles !== false;
  const particleSpawnIntervalMs = opts.particleSpawnIntervalMs ?? 420;

  if (!canvas) throw new Error('initVdtHero: missing canvas (.vdt-hero__canvas)');

  // ── h1 click → select text ──────────────────────────────────────
  const title = root.querySelector('.vdt-hero__title');
  function onTitleClick() {
    if (!title) return;
    const range = document.createRange();
    range.selectNodeContents(title);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  if (title) title.addEventListener('click', onTitleClick);

  // ── site header: transparent on hero, solid on scroll ─────────
  const header = root.querySelector('.vdt-hero__header');
  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  }
  if (header) {
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  // ── cursor tracking (scoped to root) ────────────────────────────
  function onMove(e) {
    if (!cursor) return;
    const r = root.getBoundingClientRect();
    cursor.style.left = (e.clientX - r.left) + 'px';
    cursor.style.top  = (e.clientY - r.top)  + 'px';
  }
  if (enableCursor && cursor) {
    root.addEventListener('mousemove', onMove);
  } else if (cursor) {
    cursor.style.display = 'none';
    root.style.cursor = 'auto';
  }

  // =============================================================
  // 3D VDT LOGO
  // =============================================================
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(canvas.clientWidth || canvas.width, canvas.clientHeight || canvas.height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.10;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    26,
    (canvas.clientWidth || canvas.width) / (canvas.clientHeight || canvas.height),
    0.1, 100,
  );
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const lights = [];
  const key  = new THREE.DirectionalLight(0xffffff, 1.7);  key.position.set(-3, 4, 5);   scene.add(key);   lights.push(key);
  const kick = new THREE.DirectionalLight(0xffffff, 0.7);  kick.position.set(4, -3, 4);  scene.add(kick);  lights.push(kick);
  const rim  = new THREE.DirectionalLight(0xffcccc, 0.6);  rim.position.set(0, 0, -5);   scene.add(rim);   lights.push(rim);
  const amb  = new THREE.AmbientLight(0xffffff, 0.20);                                   scene.add(amb);   lights.push(amb);

  // ===========================================================
  // GEOMETRY — designed in the polygon editor.
  // SVG-style coords (centered 50,50, scaled by 30) → world.
  // ===========================================================
  function v(x, y) { return [(x - 50) / 30, -(y - 50) / 30]; }

  const OUTER = [
    v(6.00,  18.00),
    v(84.00, 18.00),
    v(45.00, 91.00),
  ];
  const LEFT_VOID = [
    v(16.00, 24.00),
    v(84.00, 24.00),
    v(80.00, 30.00),
    v(19.00, 30.00),
  ];
  const RIGHT_VOID = [
    v(48.00, 30.00),
    v(48.00, 90.00),
    v(45.00, 94.00),
    v(42.00, 89.00),
    v(42.00, 30.00),
  ];
  const HOLE_3 = [
    v(54.00, 36.00),
    v(68.00, 36.00),
    v(60.00, 50.00),
    v(60.00, 65.00),
    v(54.00, 76.00),
  ];
  const HOLE_5 = [
    v(36.00, 63.00),
    v(36.00, 36.00),
    v(14.00, 36.00),
    v(17.00, 42.00),
    v(25.00, 42.00),
  ];

  // Boolean subtraction: final red shape = OUTER - (all voids unioned).
  // Voids that extend past the outer edge eat notches OUT of the outline.
  const toPC = (ring) => [[ring.map(([x, y]) => [x, y])]];
  const resultMulti = polygonClipping.difference(
    toPC(OUTER),
    toPC(LEFT_VOID),
    toPC(RIGHT_VOID),
    toPC(HOLE_3),
    toPC(HOLE_5),
  );

  function ringToPts(ring) {
    const last = ring[ring.length - 1], first = ring[0];
    return last[0] === first[0] && last[1] === first[1] ? ring.slice(0, -1) : ring;
  }

  const shapes = [];
  for (const polygon of resultMulti) {
    const rings = polygon.map(ringToPts);
    if (rings.length === 0 || rings[0].length < 3) continue;
    const [outerRing, ...holeRings] = rings;
    const s = new THREE.Shape();
    s.moveTo(outerRing[0][0], outerRing[0][1]);
    for (let i = 1; i < outerRing.length; i++) s.lineTo(outerRing[i][0], outerRing[i][1]);
    s.closePath();
    for (const hole of holeRings) {
      if (hole.length < 3) continue;
      const p = new THREE.Path();
      p.moveTo(hole[0][0], hole[0][1]);
      for (let i = 1; i < hole.length; i++) p.lineTo(hole[i][0], hole[i][1]);
      p.closePath();
      s.holes.push(p);
    }
    shapes.push(s);
  }

  // Every perimeter edge of the extruded shape (front + back faces, including
  // the interior hole borders) gets the same bevel treatment automatically —
  // ExtrudeGeometry walks the whole outline. Knobs:
  //   bevelThickness — depth-axis offset (how far the bevel pulls IN from the
  //                    flat front/back faces along z). 0.025 = ~6% of depth.
  //   bevelSize      — shape-plane offset (how far the bevel insets from the
  //                    outline in x/y). Match thickness for a clean 45°.
  //   bevelSegments  — 1-2 for a sharp chamfer (one specular highlight per
  //                    edge), 4-6 for a rounded fillet. With >2 segments you
  //                    should also call geo.computeVertexNormals() after
  //                    construction to smooth the highlight across the curve.
  const EXTRUDE_OPTS = {
    depth: 0.42,
    bevelEnabled:   true,
    bevelThickness: 0.022,   /* slightly under previous chamfer so the rounded */
    bevelSize:      0.022,   /* edge doesn't look like a bigger overall bevel  */
    bevelSegments:  5,       /* enough subdivisions to read as a smooth curve  */
    curveSegments:  1,
  };
  const SMOOTH_BEVEL_NORMALS = true;   /* compute averaged normals so the      */
                                       /* highlight sweeps across the fillet   */
                                       /* instead of stepping per facet        */

  const redMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    metalness: 0.20,
    roughness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.15,
    reflectivity: 0.6,
  });

  const logo = new THREE.Group();
  const geometries = [];
  for (const s of shapes) {
    const geo = new THREE.ExtrudeGeometry(s, EXTRUDE_OPTS);
    // Smooth the bevel rings into a rounded fillet when there are enough
    // segments to make it worth it. Skip when bevel is a sharp chamfer —
    // we WANT the hard normal break there to keep the edge crisp.
    if (SMOOTH_BEVEL_NORMALS) geo.computeVertexNormals();
    geometries.push(geo);
    logo.add(new THREE.Mesh(geo, redMat));
  }

  // center on combined centroid
  const bbox = new THREE.Box3().setFromObject(logo);
  const groupCenter = new THREE.Vector3();
  bbox.getCenter(groupCenter);
  for (const m of logo.children) {
    m.geometry.translate(-groupCenter.x, -groupCenter.y, -groupCenter.z);
  }
  scene.add(logo);

  // ── resize: prefer ResizeObserver on the canvas, fallback to window ──
  function applyResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  let ro;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(applyResize);
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', applyResize, { passive: true });
  }

  // ── render loop ──
  const clock = new THREE.Clock();
  let rafId;
  let running = true;
  function tick() {
    if (!running) return;
    // The logo spins on every platform now. window.__vdtPauseHeroCanvas
    // gates the WebGL render so the spin never competes with heavy work:
    // the laptop-zoom scroll loop sets it during mobile page scrolling, and
    // the mobile tap-to-enter flow (main.js) sets it for the duration of
    // the enter zoom. The RAF stays alive and the clock keeps advancing so
    // the spin resumes from the right angle. (Previously the logo was held
    // static on phones to fight the old scroll-zoom jank; the click-to-enter
    // model removed that jank, so it can spin again.)
    if (!window.__vdtPauseHeroCanvas) {
      const t = clock.getElapsedTime();
      logo.rotation.y = t * 0.5;
      logo.rotation.x = Math.sin(t * 0.6) * 0.05;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    } else {
      // Paused (page scrolling, or hero scrolled out of view): don't wake the
      // main thread every ~16ms just to no-op the render. Poll back ~6x/sec
      // instead. The clock keeps real time, so the spin resumes from the
      // correct angle when unpaused.
      rafId = setTimeout(tick, 160);
    }
  }
  rafId = requestAnimationFrame(tick);

  // =============================================================
  // particles (drift + click bursts), positioned inside particleHost
  // =============================================================
  const COLS = ["#dc2626", "#ef4444", "#fca5a5", "#fb923c", "#fbbf24"];
  // ensure host is a positioning context so absolute-positioned particles land inside
  if (getComputedStyle(particleHost).position === 'static') {
    particleHost.style.position = 'relative';
  }

  function spawnPt(x, y, size = 1) {
    const el = document.createElement("div");
    el.className = "vdt-hero__pt";
    el.textContent = Math.random() < 0.7 ? "▲" : "✦";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.color = COLS[Math.floor(Math.random() * COLS.length)];
    el.style.fontSize = size + "rem";
    const d = 0.8 + Math.random() * 1.2;
    el.style.setProperty("--d", d + "s");
    particleHost.appendChild(el);
    setTimeout(() => el.remove(), (d + 0.2) * 1000);
  }

  let ambientInterval;
  // Skip the continuously-spawning drifting particles on phones (each is an
  // animated DOM node compositing every frame → mobile zoom stutter) and for
  // reduced-motion users. On desktop, also stop spawning once the hero has
  // scrolled off screen so we don't keep creating/removing compositing nodes
  // behind the fold. (Click bursts are still allowed; they're one-off.)
  const heroReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let heroOnScreen = true;
  if (enableAmbientParticles && window.innerWidth > 720 && !heroReducedMotion) {
    if ("IntersectionObserver" in window) {
      const heroIO = new IntersectionObserver(
        (entries) => { heroOnScreen = entries.some((e) => e.isIntersecting); },
        { threshold: 0 },
      );
      heroIO.observe(particleHost);
    }
    ambientInterval = setInterval(() => {
      if (!heroOnScreen || window.__vdtPauseHeroCanvas) return;
      const w = particleHost.clientWidth;
      const h = particleHost.clientHeight;
      if (!w || !h) return;
      spawnPt(
        w * (0.1 + Math.random() * 0.8),
        h * (0.4 + Math.random() * 0.45),
        0.6 + Math.random() * 0.5,
      );
    }, particleSpawnIntervalMs);
  }

  function onClick(e) {
    const r = particleHost.getBoundingClientRect();
    const x0 = e.clientX - r.left;
    const y0 = e.clientY - r.top;
    if (x0 < 0 || y0 < 0 || x0 > r.width || y0 > r.height) return;
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const rad = 20 + Math.random() * 50;
      spawnPt(
        x0 + Math.cos(ang) * rad,
        y0 + Math.sin(ang) * rad,
        0.5 + Math.random() * 0.7,
      );
    }
  }
  if (enableClickParticles) root.addEventListener('click', onClick);

  // ── teardown ──
  return function cleanup() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (ro) ro.disconnect(); else window.removeEventListener('resize', applyResize);
    if (ambientInterval) clearInterval(ambientInterval);
    if (enableCursor && cursor) root.removeEventListener('mousemove', onMove);
    if (enableClickParticles) root.removeEventListener('click', onClick);
    if (title) title.removeEventListener('click', onTitleClick);
    if (header) window.removeEventListener('scroll', updateHeaderState);
    for (const g of geometries) g.dispose();
    redMat.dispose();
    pmrem.dispose();
    envTex.dispose();
    renderer.dispose();
    for (const pt of particleHost.querySelectorAll('.vdt-hero__pt')) pt.remove();
  };
}
