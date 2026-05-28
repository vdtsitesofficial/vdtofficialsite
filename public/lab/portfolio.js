// ============================================================
// VDT Portfolio Carousel — drop-in JS module.
//
// Usage in host page:
//
//   <link rel="stylesheet" href="./portfolio.css">
//   <!-- paste portfolio-fragment.html where you want it -->
//   <script type="module">
//     import { initVdtPortfolio } from './portfolio.js';
//     initVdtPortfolio({ root: document.querySelector('[data-vdt-portfolio]') });
//   </script>
//
// API:
//   initVdtPortfolio({
//     root,                  // HTMLElement, the .vdt-portfolio section (required)
//     enableKeyboard,        // bool, default true. Listens for ArrowLeft/ArrowRight on window.
//     enableDrag,            // bool, default true. Mouse+touch drag to slide.
//     slideMs,               // number, default 900. Slide animation duration.
//   })
//
// Returns: cleanup() function to detach listeners.
// ============================================================

export function initVdtPortfolio(opts = {}) {
  const root = opts.root || document.querySelector('[data-vdt-portfolio]');
  if (!root) throw new Error('initVdtPortfolio: missing root');

  const enableKeyboard = opts.enableKeyboard !== false;
  const enableDrag     = opts.enableDrag     !== false;
  const slideMs        = opts.slideMs        || 900;

  const carousel       = root.querySelector('[data-vdt-carousel]');
  const cards          = Array.from(root.querySelectorAll('.vdt-portfolio__card'));
  const counterCurrent = root.querySelector('[data-vdt-counter-current]');
  const counterTotal   = root.querySelector('[data-vdt-counter-total]');
  const metaName       = root.querySelector('[data-vdt-meta-name]');
  const metaTags       = root.querySelector('[data-vdt-meta-tags]');
  const meta           = root.querySelector('.vdt-portfolio__meta');
  const prevBtn        = root.querySelector('[data-vdt-dir="prev"]');
  const nextBtn        = root.querySelector('[data-vdt-dir="next"]');

  if (!carousel || cards.length === 0) throw new Error('initVdtPortfolio: no carousel/cards');

  const total = cards.length;
  let current = 0;
  let isAnimating = false;

  if (counterTotal) counterTotal.textContent = String(total).padStart(2, '0');

  // Optional override: read slide duration from a CSS variable if present
  if (slideMs !== 900) root.style.setProperty('--vdt-pf-t-slide', slideMs + 'ms');

  // Layout knobs — tuned to match the reference mockup feel.
  const LAYOUT = {
    prevTx:    82,   // % of card width — horizontal slide for prev/next
    prevTz:   -260,  // px — push back into the depth
    prevRot:   30,   // deg — yaw rotation
    prevScale: 0.7,
    farTx:    105,
    farTz:   -500,
    farRot:   38,
    farScale: 0.55,
  };

  // Circular signed offset so the carousel always animates the shortest way.
  function relativeOffset(i, curr, n) {
    let d = i - curr;
    if (d >  n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  }

  function applyLayout() {
    cards.forEach((card, i) => {
      const off = relativeOffset(i, current, total);
      card.classList.remove('is-current', 'is-prev', 'is-next', 'is-far', 'is-hidden');

      if (off === 0) {
        card.style.setProperty('--tx', '0');
        card.style.setProperty('--tz', '0');
        card.style.setProperty('--rot', '0deg');
        card.style.setProperty('--scale', '1');
        card.style.setProperty('--opacity', '1');
        card.classList.add('is-current');
      } else if (off === -1) {
        card.style.setProperty('--tx', `-${LAYOUT.prevTx}%`);
        card.style.setProperty('--tz', `${LAYOUT.prevTz}px`);
        card.style.setProperty('--rot', `${LAYOUT.prevRot}deg`);
        card.style.setProperty('--scale', LAYOUT.prevScale);
        card.style.setProperty('--opacity', '1');
        card.classList.add('is-prev');
      } else if (off === 1) {
        card.style.setProperty('--tx', `${LAYOUT.prevTx}%`);
        card.style.setProperty('--tz', `${LAYOUT.prevTz}px`);
        card.style.setProperty('--rot', `-${LAYOUT.prevRot}deg`);
        card.style.setProperty('--scale', LAYOUT.prevScale);
        card.style.setProperty('--opacity', '1');
        card.classList.add('is-next');
      } else if (off === -2 || off === 2) {
        const sign = off < 0 ? -1 : 1;
        card.style.setProperty('--tx', `${sign * LAYOUT.farTx}%`);
        card.style.setProperty('--tz', `${LAYOUT.farTz}px`);
        card.style.setProperty('--rot', `${-sign * LAYOUT.farRot}deg`);
        card.style.setProperty('--scale', LAYOUT.farScale);
        card.style.setProperty('--opacity', '0.4');
        card.classList.add('is-far');
      } else {
        card.style.setProperty('--opacity', '0');
        card.classList.add('is-hidden');
      }
    });
  }

  function updateMeta() {
    const card = cards[current];
    if (!card) return;
    if (meta) meta.classList.add('is-changing');
    setTimeout(() => {
      if (metaName)       metaName.textContent       = card.dataset.name || '';
      if (metaTags)       metaTags.textContent       = card.dataset.tags || '';
      if (counterCurrent) counterCurrent.textContent = String(current + 1).padStart(2, '0');
      if (meta) meta.classList.remove('is-changing');
    }, 180);
  }

  function go(direction) {
    if (isAnimating) return;
    isAnimating = true;
    current = (current + direction + total) % total;
    applyLayout();
    updateMeta();
    setTimeout(() => { isAnimating = false; }, 350);
  }
  function goTo(target) {
    if (isAnimating || target === current) return;
    isAnimating = true;
    current = (target + total) % total;
    applyLayout();
    updateMeta();
    setTimeout(() => { isAnimating = false; }, 350);
  }

  // ── initial render ──
  applyLayout();
  updateMeta();

  // ── controls ──
  function onPrev() { go(-1); }
  function onNext() { go(+1); }
  if (prevBtn) prevBtn.addEventListener('click', onPrev);
  if (nextBtn) nextBtn.addEventListener('click', onNext);

  // ── click side cards to bring to center; centered card navigates ──
  const cardClickHandlers = cards.map((card, i) => {
    const handler = (e) => {
      const off = relativeOffset(i, current, total);
      if (off === 0) return; // centered — let the <a> navigate
      e.preventDefault();
      goTo(i);
    };
    card.addEventListener('click', handler);
    return handler;
  });

  // ── keyboard ──
  function onKey(e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
  }
  if (enableKeyboard) window.addEventListener('keydown', onKey);

  // ── drag / swipe ──
  let dragStartX = null;
  let dragLockX  = null;
  const DRAG_THRESHOLD = 60;

  function onDragStart(e) {
    const pt = e.touches ? e.touches[0] : e;
    dragStartX = pt.clientX;
    dragLockX = null;
  }
  function onDragMove(e) {
    if (dragStartX == null) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - dragStartX;
    if (Math.abs(dx) > DRAG_THRESHOLD && dragLockX == null) {
      dragLockX = Math.sign(dx);
      go(-dragLockX);
      dragStartX = null;
    }
  }
  function onDragEnd() {
    dragStartX = null;
    dragLockX = null;
  }
  if (enableDrag && carousel) {
    carousel.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    carousel.addEventListener('touchstart', onDragStart, { passive: true });
    carousel.addEventListener('touchmove',  onDragMove,  { passive: true });
    carousel.addEventListener('touchend',   onDragEnd);
  }

  // ── cleanup ──
  return function cleanup() {
    if (prevBtn) prevBtn.removeEventListener('click', onPrev);
    if (nextBtn) nextBtn.removeEventListener('click', onNext);
    cards.forEach((card, i) => card.removeEventListener('click', cardClickHandlers[i]));
    if (enableKeyboard) window.removeEventListener('keydown', onKey);
    if (enableDrag && carousel) {
      carousel.removeEventListener('mousedown', onDragStart);
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      carousel.removeEventListener('touchstart', onDragStart);
      carousel.removeEventListener('touchmove',  onDragMove);
      carousel.removeEventListener('touchend',   onDragEnd);
    }
  };
}
