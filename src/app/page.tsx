"use client";

/* ───────────────────────────────────────────────────────────────
 * Homepage — mounts the laptop-zoom-v2 lab as a static experience.
 *
 * The lab's body markup is rendered here as JSX. The lab's CSS,
 * fonts, GSAP, importmap, and JS modules are loaded from /lab/*
 * (mirrored from C:/Websites/VDT/laptop-zoom-v2/ by an xcopy on
 * disk into public/lab/). Lab JS expects all of its DOM nodes to
 * exist before it runs, so we mount the scripts with
 * strategy="afterInteractive".
 *
 * The dev-only #cp tuning panel from the lab is intentionally
 * omitted from this JSX; main.js's bindTuningPanel() bails out
 * cleanly when #cp isn't present (guarded in /lab/main.js).
 * ─────────────────────────────────────────────────────────────── */

import Script from "next/script";

// Three.js / polygon-clipping importmap — shared by hero.js and main.js.
const IMPORTMAP = JSON.stringify({
  imports: {
    three: "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
    "polygon-clipping": "https://esm.sh/polygon-clipping@0.15.3",
  },
});

// Module-script body for the post-DOM lab init. Keeping this as a
// template string (rather than scattered <script> tags) ensures the
// imports resolve in a single module graph and the order is fixed.
const LAB_MODULES = `
  import { initVdtTestimonials } from '/lab/testimonials.js';
  import { initVdtHero }         from '/lab/hero.js';
  import { initVdtPortfolio }    from '/lab/portfolio.js';
  import { initFluidFooter }     from '/lab/footer.js';

  const tRoot = document.querySelector('[data-vdt-testimonials]');
  if (tRoot) initVdtTestimonials({ root: tRoot });

  document.querySelectorAll('.vdt-hero').forEach((el) => {
    initVdtHero({ root: el, enableCursor: !el.closest('#screen-overlay') });
  });

  document.querySelectorAll('[data-vdt-portfolio]').forEach((el) => {
    initVdtPortfolio({ root: el, enableKeyboard: true, enableDrag: true });
  });

  // Skip the GPU-heavy Navier-Stokes wordmark sim on phones — the
  // cursor-driven effect never gets used on touch devices, the canvas
  // burns battery, and the @media (max-width: 720px) rule in
  // footer.css promotes the static fallback wordmark in its place.
  const flBand     = document.querySelector('[data-vdt-fl-band]');
  const flCanvas   = document.querySelector('[data-vdt-fl-canvas]');
  const flFallback = document.querySelector('[data-vdt-fl-fallback]');
  if (flBand && flCanvas && window.innerWidth > 720) {
    initFluidFooter({ wrap: flBand, canvas: flCanvas, fallback: flFallback, word: 'VDTSITES' });
  }

  const yearEl = document.querySelector('[data-vdt-fl-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Signal to the anchor-link interceptor below that every lab module
  // has finished its first applyLayout()/render(). Header nav clicks
  // that fire before this flag will queue and wait for it.
  window.__vdtLabReady = true;
  window.dispatchEvent(new Event('vdt-lab-ready'));
`;

// Anchor-link interceptor. Catches clicks on [href^="#"] and waits for
// window.__vdtLabReady (set at the end of LAB_MODULES above) before
// scrolling. Without this, clicking Portfolio in the header during the
// first ~300ms after page load lands on a carousel whose JS hasn't
// applied its 3D-transform CSS variables yet — the cards appear stacked
// instead of unfolded.
const ANCHOR_DEFER = `
  (function () {
    const MAX_WAIT_MS = 2000;
    const POLL_MS = 50;

    function smoothScrollTo(hash) {
      const id = hash.replace(/^#/, '');
      if (!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.hash = hash;
    }

    function awaitReady(then) {
      if (window.__vdtLabReady) { then(); return; }
      let waited = 0;
      const iv = setInterval(() => {
        waited += POLL_MS;
        if (window.__vdtLabReady || waited >= MAX_WAIT_MS) {
          clearInterval(iv);
          then();
        }
      }, POLL_MS);
    }

    document.addEventListener('click', (e) => {
      // Only handle plain left-clicks on anchor links pointing at this
      // page's sections. Let cmd/ctrl-click, middle-click, etc. through
      // (so "open in new tab" still works).
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      // Same-page anchors: '#xxx' or '/#xxx' (this page is /)
      let hash = '';
      if (href.startsWith('#')) hash = href;
      else if (href === '/' || href === '') hash = '';
      else if (href.startsWith('/#')) hash = href.slice(1);
      else return; // external/other-route, let browser handle it

      e.preventDefault();
      awaitReady(() => smoothScrollTo(hash));
    });

    // Initial-load hash handling: when the homepage is hit with a hash
    // already in the URL (e.g., user followed /#portfolio from /blog),
    // the browser instantly jumps to the anchor before lab JS has had
    // a chance to render the destination. We reset scroll to top right
    // away, then smooth-scroll to the hash once __vdtLabReady is set.
    if (window.location.hash) {
      const initialHash = window.location.hash;
      window.scrollTo(0, 0);
      // Suppress any further default browser scroll-restoration to the hash.
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      awaitReady(() => smoothScrollTo(initialHash));
    }
  })();
`;

export default function Home() {
  return (
    <>
      {/* Lab head deps — Next hoists <link>/<script> elements into <head>. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=JetBrains+Mono:wght@700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/lab/style.css" />
      <link rel="stylesheet" href="/lab/hero.css" />
      <link rel="stylesheet" href="/lab/portfolio.css" />
      <link rel="stylesheet" href="/lab/footer.css" />
      <link rel="stylesheet" href="/lab/testimonials.css" />
      <link rel="stylesheet" href="/lab/contact-card.css" />
      <link rel="stylesheet" href="/lab/process-scroll.css" />

      {/* GSAP CDN. App Router only allows beforeInteractive in the
          root layout, so we use afterInteractive here. contact-card.js
          (also afterInteractive) loads after GSAP regardless of strategy
          order because Next inlines them on the page in DOM order. */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />

      {/* importmap MUST appear before any module script that uses
          its bare specifiers. next/script with type="importmap"
          doesn't work; render as raw JSX so it lands in <head>. */}
      <script
        type="importmap"
        dangerouslySetInnerHTML={{ __html: IMPORTMAP }}
      />

      {/* Pre-zoom transparent header */}
      <header id="zoom-header" className="zoom-header">
        <a className="zh-brand" href="#">
          <svg
            className="zh-mark"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6,18 L84,18 L45,91 Z M16,24 L84,24 L80,30 L19,30 Z M48,30 L48,90 L45,94 L42,89 L42,30 Z M54,36 L68,36 L60,50 L60,65 L54,76 Z M36,63 L36,36 L14,36 L17,42 L25,42 Z" />
          </svg>
          <span>VDT&nbsp;SITES</span>
        </a>
        <nav className="zh-nav">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact&nbsp;Us</a>
        </nav>
      </header>

      {/* Fixed post-zoom site chrome */}
      <header id="site-chrome" className="site-chrome">
        <a className="dest-brand" href="/">
          <svg
            className="dest-mark"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6,18 L84,18 L45,91 Z M16,24 L84,24 L80,30 L19,30 Z M48,30 L48,90 L45,94 L42,89 L42,30 Z M54,36 L68,36 L60,50 L60,65 L54,76 Z M36,63 L36,36 L14,36 L17,42 L25,42 Z" />
          </svg>
          <span>VDT&nbsp;SITES</span>
        </a>
        <nav className="dest-nav">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact" className="dest-cta">Contact&nbsp;Us</a>
        </nav>
      </header>

      {/* Section 1: ZOOM HERO */}
      <section className="zoom-hero">
        <div className="zoom-stage">
          {/* Background plate. Browser picks the right asset by media query;
              the fallback <img.bg-image> stays in the DOM either way so
              main.js's document.querySelector('.bg-image') keeps working
              (it sets transform/objectPosition/opacity each frame). */}
          <picture>
            <source
              media="(max-width: 720px)"
              srcSet="/lab/assets/background-mobile.png"
            />
            <img
              className="bg-image"
              src="/lab/assets/background.png"
              alt=""
            />
          </picture>
          <h1 className="hero-text">BUILT&nbsp;FOR&nbsp;YOU</h1>

          <div className="laptop-wrap">
            <img className="laptop-image" src="/lab/assets/laptop.png" alt="" />
          </div>

          <div id="screen-overlay" className="screen-overlay" aria-hidden="false">
            <div className="screen-inner">
              <div className="vdt-hero" data-vdt-hero>
                <svg className="vdt-hero__cursor" viewBox="0 0 20 28" fill="none" aria-hidden="true">
                  <polygon points="10,1 19,11 10,14 1,11" fill="#ef4444" opacity=".9" />
                  <polygon points="10,14 19,11 10,27" fill="#dc2626" opacity=".85" />
                  <polygon points="10,14 1,11 10,27" fill="#7f1d1d" opacity=".8" />
                  <polygon points="10,1 19,11 10,14 1,11" fill="white" opacity=".18" />
                </svg>

                <div className="vdt-hero__ghost" aria-hidden="true">
                  <span>WEBSITES</span>
                  <span>WORTH</span>
                  <span>OWNING</span>
                </div>

                <main className="vdt-hero__stage">
                  <div className="vdt-hero__gem">
                    <div className="vdt-hero__halo vdt-hero__halo--lg" aria-hidden="true"></div>
                    <div className="vdt-hero__halo vdt-hero__halo--xl" aria-hidden="true"></div>
                    <canvas
                      className="vdt-hero__canvas"
                      width={520}
                      height={480}
                      aria-label="VDT logo"
                    ></canvas>
                  </div>

                  <div className="vdt-hero__text">
                    <h1 className="vdt-hero__title">
                      <span className="vdt-hero__w1">Website</span>
                      <span className="vdt-hero__w2">Design</span>
                    </h1>

                    <p className="vdt-hero__pitch">
                      Custom Websites. <em>Built to Convert.</em>
                    </p>
                    <p className="vdt-hero__locale">
                      <svg className="vdt-hero__locale-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>
                        Based in <strong>Nanaimo, BC</strong> · Working with businesses across Canada
                      </span>
                    </p>
                  </div>

                  <div className="vdt-hero__ctas">
                    <a
                      className="vdt-hero__btn vdt-hero__btn--primary"
                      href="https://vdtsites.com/#contact"
                      target="_blank"
                      rel="noopener"
                    >
                      <svg className="vdt-hero__btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M7 17 17 7M9 7h8v8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Start Your Project
                    </a>
                    <a className="vdt-hero__btn" href="https://vdtsites.com/#work" target="_blank" rel="noopener">
                      <svg className="vdt-hero__btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      View Our Work
                    </a>
                  </div>
                </main>
              </div>
            </div>

            <div id="screen-glare" className="screen-glare" aria-hidden="true"></div>
          </div>

          <div id="zoom-mask" className="zoom-mask"></div>

          <div className="scroll-cue">
            <span>scroll to enter</span>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 5 L12 19 M6 13 L12 19 L18 13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: REAL LANDING (portfolio) */}
      <section className="real-landing">
        <section id="portfolio" className="vdt-portfolio" data-vdt-portfolio>
          <div className="vdt-portfolio__intro">
            <p className="vdt-portfolio__eyebrow">Selected Portfolio</p>
            <h2 className="vdt-portfolio__title">
              Sites we&rsquo;ve <em>shipped.</em>
            </h2>
          </div>

          <div className="vdt-portfolio__stage">
            <div className="vdt-portfolio__carousel" data-vdt-carousel role="list">
              <a
                className="vdt-portfolio__card"
                role="listitem"
                href="https://mocoffee.ca"
                target="_blank"
                rel="noopener"
                data-name="MO Coffee"
                data-tags="Hospitality · E-Commerce"
              >
                <div className="vdt-portfolio__card-frame">
                  <div className="vdt-portfolio__card-bezel">
                    <span className="vdt-portfolio__card-cam"></span>
                  </div>
                  <div className="vdt-portfolio__card-screen">
                    <img
                      className="vdt-portfolio__card-shot"
                      src="/lab/shots/mocoffee.png"
                      alt="MO Coffee landing page"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </a>

              <a
                className="vdt-portfolio__card"
                role="listitem"
                href="https://morkyautoimports.ca"
                target="_blank"
                rel="noopener"
                data-name="Morky Auto Imports"
                data-tags="Automotive · Inventory"
              >
                <div className="vdt-portfolio__card-frame">
                  <div className="vdt-portfolio__card-bezel">
                    <span className="vdt-portfolio__card-cam"></span>
                  </div>
                  <div className="vdt-portfolio__card-screen">
                    <img
                      className="vdt-portfolio__card-shot"
                      src="/lab/shots/morky.png"
                      alt="Morky Auto Imports landing page"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </a>

              <a
                className="vdt-portfolio__card"
                role="listitem"
                href="https://therapeuticvalue.ca"
                target="_blank"
                rel="noopener"
                data-name="Therapeutic Value"
                data-tags="Wellness · Bookings"
              >
                <div className="vdt-portfolio__card-frame">
                  <div className="vdt-portfolio__card-bezel">
                    <span className="vdt-portfolio__card-cam"></span>
                  </div>
                  <div className="vdt-portfolio__card-screen">
                    <img
                      className="vdt-portfolio__card-shot"
                      src="/lab/shots/therapeuticvalue.png"
                      alt="Therapeutic Value landing page"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </a>

              <a
                className="vdt-portfolio__card"
                role="listitem"
                href="https://cevavolleyball.ca"
                target="_blank"
                rel="noopener"
                data-name="CEVA Volleyball"
                data-tags="Athletics · Programs"
              >
                <div className="vdt-portfolio__card-frame">
                  <div className="vdt-portfolio__card-bezel">
                    <span className="vdt-portfolio__card-cam"></span>
                  </div>
                  <div className="vdt-portfolio__card-screen">
                    <img
                      className="vdt-portfolio__card-shot"
                      src="/lab/shots/ceva.png"
                      alt="CEVA Volleyball landing page"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </a>
            </div>
            <div className="vdt-portfolio__reflection" aria-hidden="true"></div>
          </div>

          <div className="vdt-portfolio__controls" aria-label="Carousel controls">
            <button className="vdt-portfolio__nav-btn" data-vdt-dir="prev" aria-label="Previous project">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 5 L8 12 L15 19" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="vdt-portfolio__counter" aria-live="polite">
              <span className="vdt-portfolio__counter-current" data-vdt-counter-current>01</span>
              <span className="vdt-portfolio__counter-sep">/</span>
              <span className="vdt-portfolio__counter-total" data-vdt-counter-total>04</span>
            </div>

            <button className="vdt-portfolio__nav-btn" data-vdt-dir="next" aria-label="Next project">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5 L16 12 L9 19" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="vdt-portfolio__meta" aria-live="polite">
            <p className="vdt-portfolio__meta-tags" data-vdt-meta-tags>
              Hospitality · E-Commerce
            </p>
            <h3 className="vdt-portfolio__meta-name" data-vdt-meta-name>
              MO Coffee
            </h3>
            <p className="vdt-portfolio__meta-hint">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 17 L17 7 M9 7 L17 7 L17 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Click to visit live site
            </p>
          </div>
        </section>
      </section>

      {/* VDT Our Process · horizontal scroll-story */}
      <div className="vdt-process-shell">
        <section className="process" id="process" aria-label="Our process journey">
          <div className="process__pin">
            <div className="process__track" id="process-track">

              {/* SLIDE 0 · TITLE */}
              <div className="slide slide--title">
                <aside className="title-guide" aria-hidden="true">
                  <p className="title-guide__eyebrow">The line is your guide.</p>
                  <p className="title-guide__text">
                    Scroll to follow the path
                    <br />
                    through each stage.
                  </p>
                  <span className="title-guide__arrow">
                    <svg viewBox="0 0 28 12" width="34" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M1 6 L26 6 M20 1 L26 6 L20 11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </aside>
                <div className="title-card">
                  <p className="title-card__eyebrow">A four-stage journey</p>
                  <h2 className="title-card__heading">OUR PROCESS</h2>
                </div>
              </div>

              {/* SLIDE 1 · DISCOVER */}
              <article className="slide slide--stage slide--1" data-stage="1" data-line="top">
                <div className="slide__text">
                  <div className="stage__title-row">
                    <div className="stage__num">01</div>
                    <h3 className="stage__title">Discover</h3>
                  </div>
                  <p className="stage__subtitle">We learn what makes your business different.</p>
                  <p className="stage__desc">
                    Before a single page is designed, we take the time to understand your goals, customers,
                    and vision. Every website we build starts with a conversation, not a template.
                  </p>
                  <ul className="stage__points">
                    <li>Learn about your business</li>
                    <li>Understand your customers</li>
                    <li>Identify your goals</li>
                    <li>Plan the project roadmap</li>
                  </ul>
                </div>
                <div className="slide__visual">
                  <div className="mock mock--brief" aria-hidden="true">
                    <div className="mock-brief__head">
                      <span className="mock-brief__tag">DISCOVERY BRIEF</span>
                      <span className="mock-brief__date">DAY 1</span>
                    </div>
                    <div className="mock-brief__title-row">
                      <h4 className="mock-brief__title">
                        Project
                        <br />
                        Vision
                      </h4>
                      <svg
                        className="mock-brief__underline"
                        viewBox="0 0 120 8"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 2 5 Q 30 1 60 4 T 118 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <section className="mock-brief__section">
                      <div className="mock-brief__label">BUSINESS</div>
                      <ul className="mock-brief__list">
                        <li>Brand story</li>
                        <li>Core offering</li>
                      </ul>
                    </section>
                    <section className="mock-brief__section">
                      <div className="mock-brief__label">AUDIENCE</div>
                      <ul className="mock-brief__list">
                        <li>Who you serve</li>
                        <li>What they value</li>
                      </ul>
                    </section>
                    <section className="mock-brief__section">
                      <div className="mock-brief__label">GOALS</div>
                      <ul className="mock-brief__list">
                        <li>Success defined</li>
                        <li>What&rsquo;s next</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </article>

              {/* SLIDE 2 · DESIGN */}
              <article className="slide slide--stage slide--2" data-stage="2" data-line="bottom">
                <div className="slide__text">
                  <div className="stage__title-row">
                    <div className="stage__num">02</div>
                    <h3 className="stage__title">Design</h3>
                  </div>
                  <p className="stage__subtitle">Designed around your business, not a template.</p>
                  <p className="stage__desc">
                    Once we understand your business, we create a custom design built around your brand. Every
                    layout, colour, and detail is crafted to help you stand out and earn trust.
                  </p>
                  <ul className="stage__points">
                    <li>Custom layouts</li>
                    <li>Modern visual design</li>
                    <li>Mobile-first experience</li>
                    <li>Built around your brand</li>
                  </ul>
                </div>
                <div className="slide__visual">
                  <div className="mock mock--browser" aria-hidden="true">
                    <div className="mock-browser__chrome">
                      <span></span>
                      <span></span>
                      <span></span>
                      <div className="mock-browser__address">vdtsites.ca</div>
                    </div>
                    <div className="mock-browser__body">
                      <div className="mock-browser__topbar">
                        <div className="mock-browser__brand">VDT&nbsp;SITES</div>
                        <div className="mock-browser__nav">
                          <span>HOME</span>
                          <span>SERVICES</span>
                          <span>ABOUT</span>
                          <span>CONTACT</span>
                        </div>
                      </div>
                      <div className="mock-browser__hero">
                        <div className="mock-browser__copy">
                          <div className="mock-browser__h1">
                            Modern&nbsp;websites that help your business&nbsp;grow.
                          </div>
                          <div className="mock-browser__sub"></div>
                          <div className="mock-browser__sub mock-browser__sub--short"></div>
                          <div className="mock-browser__cta">GET STARTED</div>
                        </div>
                        <div className="mock-browser__art">
                          <div className="mock-browser__art-lamp"></div>
                          <div className="mock-browser__art-plant"></div>
                          <div className="mock-browser__art-floor"></div>
                        </div>
                      </div>
                      <div className="mock-browser__strip">
                        <span>
                          <i></i>Fast
                        </span>
                        <span>
                          <i></i>Responsive
                        </span>
                        <span>
                          <i></i>SEO Friendly
                        </span>
                        <span>
                          <i></i>Modern
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mock mock--phone" aria-hidden="true">
                    <div className="mock-phone__screen">
                      <div className="mock-phone__brand">VDT SITES</div>
                      <div className="mock-phone__h1">Modern websites that help your business grow.</div>
                      <div className="mock-phone__sub"></div>
                      <div className="mock-phone__sub mock-phone__sub--short"></div>
                      <div className="mock-phone__cta">GET STARTED</div>
                      <div className="mock-phone__art"></div>
                    </div>
                  </div>
                  <div className="mock mock--palette" aria-hidden="true">
                    <div className="mock-card__label">COLOUR PALETTE</div>
                    <div className="mock-palette__row">
                      <span style={{ background: "#dc2626" }}></span>
                      <span style={{ background: "#0d0d0d" }}></span>
                      <span style={{ background: "#c8a96a" }}></span>
                      <span style={{ background: "#e8e1cf" }}></span>
                      <span style={{ background: "#6b6660" }}></span>
                    </div>
                    <div className="mock-card__caption">Strong. Modern. Timeless.</div>
                  </div>
                  <div className="mock mock--type" aria-hidden="true">
                    <div className="mock-card__label">TYPOGRAPHY</div>
                    <div className="mock-type__sample">Aa</div>
                    <div className="mock-type__name">Unbounded</div>
                    <div className="mock-card__caption">
                      Bold headlines.
                      <br />
                      Clean and confident.
                    </div>
                  </div>
                </div>
              </article>

              {/* SLIDE 3 · BUILD */}
              <article className="slide slide--stage slide--3" data-stage="3" data-line="top">
                <div className="slide__text">
                  <div className="stage__title-row">
                    <div className="stage__num">03</div>
                    <h3 className="stage__title">Build</h3>
                  </div>
                  <p className="stage__subtitle">Fast. Modern. Built to perform.</p>
                  <p className="stage__desc">
                    We transform the approved design into a fast, responsive website that works seamlessly
                    across desktop, tablet, and mobile devices.
                  </p>
                  <ul className="stage__points">
                    <li>Fast loading speeds</li>
                    <li>Responsive on all devices</li>
                    <li>SEO-friendly structure</li>
                    <li>Modern build practices</li>
                  </ul>
                </div>
                <div className="slide__visual">
                  <div className="mock mock--code" aria-hidden="true">
                    <div className="mock-code__bar">
                      <span></span>
                      <span></span>
                      <span></span>
                      <em>index.html</em>
                    </div>
                    <div className="mock-code__body">
                      <pre
                        dangerouslySetInnerHTML={{
                          __html:
                            '<span class="cm">&lt;<span class="ct">section</span> <span class="ca">class</span>=<span class="cs">"hero"</span>&gt;</span>\n  <span class="cm">&lt;<span class="ct">h1</span>&gt;</span><span class="cv">Built for speed.</span>\n   <span class="cv">Designed to grow.</span><span class="cm">&lt;/<span class="ct">h1</span>&gt;</span>\n  <span class="cm">&lt;<span class="ct">a</span> <span class="ca">class</span>=<span class="cs">"cta"</span>&gt;</span>\n<span class="cv">    Get started</span>\n  <span class="cm">&lt;/<span class="ct">a</span>&gt;</span>\n<span class="cm">&lt;/<span class="ct">section</span>&gt;</span>',
                        }}
                      />
                    </div>
                  </div>
                  <div className="mock mock--qa" aria-hidden="true">
                    <div className="mock-card__label">PRE-FLIGHT</div>
                    <ul className="mock-qa__list">
                      <li>Responsive verified</li>
                      <li>Lighthouse 95+</li>
                      <li>SEO meta complete</li>
                      <li>Forms tested</li>
                      <li>Cross-browser QA</li>
                    </ul>
                    <div className="mock-qa__ship">
                      <span className="mock-qa__ship-dot"></span>
                      READY TO SHIP
                    </div>
                  </div>
                  <div className="mock mock--build-phone" aria-hidden="true">
                    <div className="mock-build-phone__screen">
                      <div className="mock-build-phone__hero"></div>
                      <div className="mock-build-phone__row"></div>
                      <div className="mock-build-phone__row mock-build-phone__row--short"></div>
                    </div>
                  </div>
                  <div className="mock mock--speed" aria-hidden="true">
                    <div className="mock-speed__big">
                      0.4<small>s</small>
                    </div>
                    <div className="mock-card__label">PAGE LOAD</div>
                    <div className="mock-card__caption">Global edge · mobile-first</div>
                  </div>
                </div>
              </article>

              {/* SLIDE 4 · LAUNCH */}
              <article className="slide slide--stage slide--4" data-stage="4" data-line="bottom">
                <div className="slide__text">
                  <div className="stage__title-row">
                    <div className="stage__num">04</div>
                    <h3 className="stage__title">Launch</h3>
                  </div>
                  <p className="stage__subtitle">Ready for customers from day one.</p>
                  <p className="stage__desc">
                    After final review, we launch your website and make sure everything is running smoothly.
                    We&rsquo;re available to support updates, hosting, and future growth.
                  </p>
                  <ul className="stage__points">
                    <li>Stress-free launch</li>
                    <li>Secure hosting options</li>
                    <li>Ongoing support</li>
                    <li>Ready for growth</li>
                  </ul>
                </div>
                <div className="slide__visual">
                  <div className="mock mock--live" aria-hidden="true">
                    <span className="mock-live__dot"></span>
                    <span className="mock-live__label">LIVE · vdtsites.ca</span>
                    <span className="mock-live__ms">Online</span>
                  </div>
                  <div className="mock mock--analytics" aria-hidden="true">
                    <div className="mock-card__label">CONVERSIONS · 30 DAYS</div>
                    <div className="mock-analytics__big">↑ 67%</div>
                    <div className="mock-analytics__chart">
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "36%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "52%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "48%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "67%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "58%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "80%" }}></div>
                      <div className="mock-analytics__bar" style={{ ["--h" as never]: "92%" }}></div>
                    </div>
                    <div className="mock-analytics__legend">
                      <span>
                        <b>1,248</b>
                        <i>visitors</i>
                      </span>
                      <span>
                        <b>184</b>
                        <i>leads</i>
                      </span>
                      <span>
                        <b>14.7%</b>
                        <i>rate</i>
                      </span>
                    </div>
                  </div>
                  <div className="mock mock--launch-devices" aria-hidden="true">
                    <div className="mock-launch__laptop">
                      <div className="mock-launch__laptop-screen"></div>
                      <div className="mock-launch__laptop-base"></div>
                    </div>
                    <div className="mock-launch__phone">
                      <div className="mock-launch__phone-notch"></div>
                      <div className="mock-launch__phone-screen"></div>
                    </div>
                  </div>
                </div>
              </article>

              {/* The river path */}
              <svg className="process__river-svg" viewBox="0 0 5000 1000" preserveAspectRatio="none" aria-hidden="true">
                <path
                  className="process__river process__river--glow"
                  d="M 100 540 L 920 540 C 1220 495, 1405 249, 1669 304 C 1947 361, 2051 830, 2309 826 C 2606 822, 2817 256, 3091 282 C 3340 305, 3429 690, 3646 951"
                />
                <path
                  className="process__river process__river--stroke"
                  d="M 100 540 L 920 540 C 1220 495, 1405 249, 1669 304 C 1947 361, 2051 830, 2309 826 C 2606 822, 2817 256, 3091 282 C 3340 305, 3429 690, 3646 951"
                />
              </svg>
            </div>

            <ol className="process__pips" aria-hidden="true">
              <li className="process__pip" data-pip="0"></li>
              <li className="process__pip" data-pip="1"></li>
              <li className="process__pip" data-pip="2"></li>
              <li className="process__pip" data-pip="3"></li>
              <li className="process__pip" data-pip="4"></li>
            </ol>
          </div>
        </section>
      </div>

      {/* VDT Testimonials marquee */}
      <section className="vdt-testimonials" data-vdt-testimonials>
        <div className="vdt-testimonials__intro">
          <p className="vdt-testimonials__eyebrow">
            <svg
              className="vdt-testimonials__google-g"
              viewBox="0 0 48 48"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            5.0 ★★★★★ on Google · 8 reviews
          </p>
          <h2 className="vdt-testimonials__title">
            Don&rsquo;t take <em>our</em> word for it.
          </h2>
        </div>

        <div className="vdt-testimonials__stage" aria-label="Customer reviews">
          <div className="vdt-testimonials__perspective">
            <div className="vdt-testimonials__rotor">
              <div className="vdt-testimonials__columns">
                <div className="vdt-testimonials__column" data-direction="up" data-vdt-testimonials-col></div>
                <div className="vdt-testimonials__column" data-direction="down" data-vdt-testimonials-col></div>
                <div className="vdt-testimonials__column" data-direction="up" data-vdt-testimonials-col></div>
                <div className="vdt-testimonials__column" data-direction="down" data-vdt-testimonials-col></div>
                <div className="vdt-testimonials__column" data-direction="up" data-vdt-testimonials-col></div>
                <div className="vdt-testimonials__column" data-direction="down" data-vdt-testimonials-col></div>
              </div>
            </div>
          </div>
          <div className="vdt-testimonials__fade vdt-testimonials__fade--top" aria-hidden="true"></div>
          <div className="vdt-testimonials__fade vdt-testimonials__fade--bottom" aria-hidden="true"></div>
          <div className="vdt-testimonials__fade vdt-testimonials__fade--left" aria-hidden="true"></div>
          <div className="vdt-testimonials__fade vdt-testimonials__fade--right" aria-hidden="true"></div>
        </div>
      </section>

      {/* VDT Contact Card */}
      <section id="contact" className="vdt-contact-card">
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="cc-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>

        <div className="cc-bg"></div>

        <div className="cards-row">
          <div className="cc-card">
            <div className="cc-color-splash"></div>
            <div className="cc-name">
              <span>VDT</span>
              <span>SITES</span>
            </div>
            <div className="cc-role">Website Designer</div>
            <div className="cc-divider"></div>

            <div className="cc-info">
              <div className="cc-item">
                <svg className="cc-icon" viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" />
                </svg>
                <span>vdtsites@gmail.com</span>
              </div>
              <div className="cc-item">
                <svg className="cc-icon" viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                <span>250-616-2087</span>
              </div>
              <div className="cc-item">
                <svg className="cc-icon" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg>
                <span>@vdtsites</span>
              </div>
            </div>

            <div className="cc-watermark cc-watermark--sites">SITES</div>
          </div>

          <div className="cc-card cc-form-card">
            <div className="cc-color-splash"></div>
            <div className="cc-name">
              <span>Contact</span>
              <span>Us</span>
            </div>
            <div className="cc-role">Start a conversation</div>
            <div className="cc-divider"></div>

            <form className="cc-form" noValidate>
              <div className="cc-field">
                <label htmlFor="cc-name-input">Name</label>
                <input id="cc-name-input" name="name" type="text" required autoComplete="name" />
              </div>
              <div className="cc-field">
                <label htmlFor="cc-email-input">Email</label>
                <input id="cc-email-input" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="cc-field">
                <label htmlFor="cc-msg-input">Message</label>
                <textarea id="cc-msg-input" name="message" rows={3} required></textarea>
              </div>

              {/* honeypot */}
              <input
                type="text"
                name="website"
                className="cc-hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <button type="submit" className="cc-send-btn">
                <span className="cc-send-label">Send message</span>
                <svg className="cc-send-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path
                    d="M5 12 L19 12 M13 6 L19 12 L13 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            <div className="cc-watermark">VDT</div>
          </div>
        </div>
      </section>

      {/* Fluid Footer */}
      <footer className="vdt-fl" id="vdt-footer">
        <div className="vdt-fl__top">
          <div className="vdt-fl__brand">
            <span className="vdt-fl__brand-name">VDT&nbsp;Sites</span>
            <span className="vdt-fl__brand-blurb">
              Modern websites for small businesses. The place to build.
            </span>
          </div>
          <ul className="vdt-fl__nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#portfolio">Work</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="mailto:vdtsites@gmail.com">Email</a>
            </li>
          </ul>
        </div>

        <div className="vdt-fl__band" data-vdt-fl-band>
          <canvas className="vdt-fl__canvas" data-vdt-fl-canvas></canvas>
          <div className="vdt-fl__fallback" data-vdt-fl-fallback aria-hidden="true">
            <span className="vdt-fl__fallback-text">VDTSITES</span>
          </div>
          <div className="vdt-fl__band-fade" aria-hidden="true"></div>
        </div>

        <div className="vdt-fl__bottom">
          <span id="vdt-fl-copy">
            © <span data-vdt-fl-year></span> VDT Sites · Built in BC, Canada
          </span>
          <a className="vdt-fl__credit" href="https://vdtsites.com" target="_blank" rel="noreferrer">
            Site by VDTSITES.COM
          </a>
        </div>
      </footer>

      {/* Lab JS — order matters: main.js + IIFEs first, modules last.
          afterInteractive guarantees execution post-hydration so the
          DOM nodes above are all in place when the lab JS queries
          for them. */}
      <Script src="/lab/main.js" strategy="afterInteractive" />
      <Script src="/lab/contact-card.js" strategy="afterInteractive" />
      <Script src="/lab/process-scroll.js" strategy="afterInteractive" />
      <Script id="lab-modules" type="module" strategy="afterInteractive">
        {LAB_MODULES}
      </Script>

      {/* Defer anchor-link scrolls until lab JS has finished initial
          layout. Prevents Portfolio/Contact clicks landing on a
          pre-init carousel or pre-render Three.js logo. */}
      <Script id="anchor-defer" strategy="afterInteractive">
        {ANCHOR_DEFER}
      </Script>
    </>
  );
}
