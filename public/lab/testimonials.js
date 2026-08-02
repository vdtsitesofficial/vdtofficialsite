// ============================================================
// VDT Testimonials Marquee — drop-in JS module.
//
// Usage in host page:
//
//   <link rel="stylesheet" href="./testimonials.css">
//   <!-- paste testimonials-fragment.html where you want it -->
//   <script type="module">
//     import { initVdtTestimonials } from './testimonials.js';
//     initVdtTestimonials({ root: document.querySelector('[data-vdt-testimonials]') });
//   </script>
//
// API:
//   initVdtTestimonials({
//     root,         // HTMLElement, the .vdt-testimonials section (required)
//     testimonials, // optional: override data. Defaults to the 6 real VDT
//                   //   reviews shipped with this package.
//     repeat,       // optional: how many copies per column. Default 4.
//                   //   More = smoother loop. Less = lighter DOM.
//   })
//
// Returns: cleanup() function (no listeners are attached here, but
//   reserved for future use).
// ============================================================

// ── Real Google reviews for VDT Sites (FALLBACK content only) ──
//
// ⚠️ On vdtsites.com this array is NOT what renders. src/app/page.tsx
// passes the full set in via `initVdtTestimonials({ testimonials })`,
// sourced from src/lib/testimonials.ts, which is the single source of
// truth for review text across the site (/reviews, /about, this marquee).
// Edit that file, not this one. This copy exists so the module still
// renders something when used standalone, and it had already drifted to
// 6 of 18 reviews before the injection was wired up.
//
// `avatar` is an optional path to a self-hosted JPG. When omitted, the
// component renders a red letter-initial fallback.
export const DEFAULT_TESTIMONIALS = [
  {
    name: "Peter S.",
    rating: 5,
    quote:
      "Really happy with the overall experience. Everything was smooth, communication was great, and the final result looked very professional.",
    avatar: "/avatars/peter.svg",
  },
  {
    name: "Brady Kozubal",
    rating: 5,
    quote: "Super professional support, and very customer friendly website.",
    avatar: "/avatars/brady.svg",
  },
  {
    name: "Yoko Ho",
    rating: 5,
    quote:
      "Super happy with my experience! Super friendly, knowledgeable, and paid attention to all wants and needs! The whole process felt smooth and stress-free. Highly recommend to anyone looking for quality work and great service :)",
    avatar: "/avatars/yoko.svg",
  },
  {
    name: "Jay Cool",
    rating: 5,
    quote:
      "We're really happy with the service & product they made us. The team was easy to work with, responsive, and delivered exactly what we wanted. Highly recommend!",
    avatar: "/avatars/jay.svg",
  },
  {
    name: "Heinz R",
    rating: 5,
    quote: "Excellent service and highly recommended ⭐⭐⭐⭐⭐",
    avatar: "/avatars/heinz.svg",
  },
  {
    name: "Enrico Del Mundo",
    rating: 5,
    quote:
      "Definitely recommend these two amazing guys. Great delivery time and performance!!",
    avatar: "/avatars/enrico.svg",
  },
];

function initials(name) {
  const parts = (name || "").trim().split(/\s+/);
  return (parts[0]?.[0] || "?").toUpperCase();
}
function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function offsetList(arr, n) {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

function avatarHTML(t) {
  if (t.avatar) {
    const fallback = initials(t.name);
    // If the file 404s, swap to the letter fallback so the page never breaks.
    return `
      <div class="vdt-testimonials__card-avatar vdt-testimonials__card-avatar--photo">
        <img src="${escapeHTML(t.avatar)}" alt="" loading="lazy" decoding="async"
             onerror="this.parentNode.classList.remove('vdt-testimonials__card-avatar--photo');this.replaceWith(document.createTextNode('${fallback}'));">
      </div>
    `;
  }
  return `<div class="vdt-testimonials__card-avatar" aria-hidden="true">${initials(t.name)}</div>`;
}

function cardHTML(t) {
  const r = Math.max(0, Math.min(5, t.rating ?? 5));
  const stars = "★".repeat(r) + "☆".repeat(5 - r);
  return `
    <article class="vdt-testimonials__card">
      <header class="vdt-testimonials__card-head">
        ${avatarHTML(t)}
        <div class="vdt-testimonials__card-author">
          <p class="vdt-testimonials__card-name">${escapeHTML(t.name)}</p>
          <p class="vdt-testimonials__card-meta">
            <span class="vdt-testimonials__card-stars" aria-label="${r} out of 5 stars">${stars}</span>
          </p>
        </div>
      </header>
      <p class="vdt-testimonials__card-quote">${escapeHTML(t.quote)}</p>
      <p class="vdt-testimonials__card-source">
        <svg class="vdt-testimonials__card-source-g" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Posted on Google
      </p>
    </article>
  `;
}

export function initVdtTestimonials(opts = {}) {
  const root = opts.root || document.querySelector('[data-vdt-testimonials]');
  if (!root) throw new Error('initVdtTestimonials: missing root');

  const data   = (opts.testimonials && opts.testimonials.length) ? opts.testimonials : DEFAULT_TESTIMONIALS;
  const repeat = opts.repeat ?? 4;

  const cols = Array.from(root.querySelectorAll('[data-vdt-testimonials-col]'));
  if (cols.length === 0) throw new Error('initVdtTestimonials: no columns found inside root');

  cols.forEach((col, idx) => {
    const list      = offsetList(data, idx * 2);
    const blockHTML = `<div class="vdt-testimonials__block">${list.map(cardHTML).join('')}</div>`;
    col.innerHTML   = blockHTML.repeat(repeat);
  });

  // Stagger animation start across columns so they don't phase-sync.
  cols.forEach((col, idx) => {
    const delay = -(idx * 6);
    col.querySelectorAll('.vdt-testimonials__block').forEach((block) => {
      block.style.animationDelay = `${delay}s`;
    });
  });

  // Pause the marquee when the section is off-screen. There are 6 columns x 4
  // repeats = 24 blocks, each running an infinite transform animation with
  // will-change:transform. Left running, all 24 composite every frame even
  // while the user is scrolling the hero/process far above — a major source of
  // mobile scroll jank. The IntersectionObserver toggles a class that sets
  // animation-play-state:paused (see testimonials.css), so they only animate
  // when actually on screen. Default (no class) = running, so if IO is
  // unavailable the marquee still works.
  let io;
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((entries) => {
      root.classList.toggle('vdt-testimonials--offscreen', !entries[0].isIntersecting);
    }, { rootMargin: '120px' });
    io.observe(root);
  }

  return function cleanup() {
    if (io) io.disconnect();
    // no listeners to remove right now; keeps the API symmetric with the
    // other VDT drop-in modules so callers can always `const tear = init(...)`
  };
}
